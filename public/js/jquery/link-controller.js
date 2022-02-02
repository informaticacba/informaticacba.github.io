// esto es para que todas las peticiones ajax de la aplicacion se envien con la codificacion UTF-8
// sin esta linea, no funcionan los caracteres como la ñ o caracteres con acentos en IE
jQuery.ajaxSetup({ contentType: "application/x-www-form-urlencoded;charset=utf-8" });

var linkController = {
	ver: 0.2,
	// Se toma desde backend
    maxPollCount: null,
    urlDescargar: null,
    formDescargar: null,
	pendingCorrelationIdExtractor: function(json, pollCount, transactionId) {
	    var result = linkController.correlationResult(null,"true");
	    if (json.response.correlationId) { // si esta pendiente
		     if (pollCount <= linkController.maxPollCount) {
		    	return linkController.correlationResult(json.response.correlationId, "true");
		     } else { // si se llego al maximo de polls permitidos
		    	 return linkController.handleMaxPermPoll(transactionId);
		     }
	    } else if (json.response.message == "sessionExpired") { // session expirada
	    	return linkController.handleSessionExpired();
	    } else if (json.response.message == "intentosExcedidos") {
	    	return linkController.handleIntentosExcedidos();
	    } else if (json.response.message) { // si se produjo un error en el servidor
	    	return linkController.handleError(json.response.message, transactionId);
	    } else if (json.response.messages) {
			return linkController.handleValidationError(json.response.messages, transactionId);
	    } else {
	        return result;
	    }   
	},
	
	handleError: function(message, transactionId) {
		if(transactionController.isValid(transactionId)) {
			estado.show(message, 'error'); 
			return linkController.correlationResult(null, "false");
		}
	},
	
	handleValidationError: function(messages, transactionId) {
		
		if(transactionController.isValid(transactionId)) {
			var msg = "";
			for(var i = 0;i < messages.length; i++) {
				var tupla = messages[i];
				msg = msg + tupla.field + ": " + tupla.message + "<br/>";
			}
			estado.show(msg, 'error');
			return linkController.correlationResult(null, "false");
		}
	},
	
	handleMaxPermPoll: function(transactionId) {
		if(transactionController.isValid(transactionId)) {
			estado.show('Por el momento no se puede realizar la transacci&oacute;n. Por favor, intente m&aacute;s tarde.', 'error'); 
			return linkController.correlationResult(null, "false");
		}
	},
	
	handleSessionExpired: function() {
		
		var loginPage = getLoginPageLC();
		var parametros = getParametrosAdicionalesLC(true);

		window.location = loginPage + '?sessionExpired=true' + parametros;
	},
	
	handleIntentosExcedidos: function() {
		window.location = getLoginPageLC();
	},
	 
	asyncCall: function(url, pollUrl, callback, inputDto, inputPollDto, callbackError, transactionId) {
		if(transactionId == undefined) {
			transactionId = transactionController.currentTransactionId;
		}
		this.postJSON(url, inputDto, function(json) {
		   	linkController.genericCallbackFunction(json, pollUrl, callback, 0, inputPollDto, callbackError, inputDto, transactionId);
		}, callbackError, inputDto, transactionId);
	},	 
	 
	genericCallbackFunction: function(json, pollUrl, callback, pollCount, inputPollDto, callbackError, inputDto, transactionId) {
	 	var result = linkController.pendingCorrelationIdExtractor(json, pollCount, transactionId);
		if (result.correlationId) {
			inputPollDto.correlationId = result.correlationId;
			pollCount =  pollCount + 1;
			linkController.waitAndPoll(pollUrl, inputPollDto, callback, pollCount, callbackError, inputDto, transactionId);
		} else if (result.success == "true") {
			callback.execute(json,result);
		} else if ((result.success == "false") && (callbackError != null)) {
			callbackError.execute(json, result, inputDto);
		}
	},	 

	waitAndPoll: function (pollUrl, inputPollDto, callback, pollCount, callbackError, inputDto, transactionId)
	{
 		setTimeout(function timerCallback() {linkController.pollFor(pollUrl, inputPollDto, callback, pollCount, callbackError, inputDto, transactionId);}, 3000);
	},	 
	 
	pollFor: function (pollUrl, inputPollDto, callback, pollCount, callbackError, inputDto, transactionId)	{ 
		this.postJSON(pollUrl, inputPollDto, function(json)	{
	 	    pollCount++;
	 		linkController.genericCallbackFunction(json, pollUrl, callback, pollCount, inputPollDto, callbackError, inputDto);
	 		
	 	}, callbackError, inputDto, transactionId);
	},
	 
	correlationResult: function(correlationId, success) {
	    var cr = new Object();
	    cr.correlationId = correlationId;
	    cr.success = success;
	    return cr;
	},
	
	// originalInputDTO es para el caso de que en data se envie un request de un poll
	postJSON: function(url, data, callback, callbackError, originalInputDTO, transactionId) {
		if(linkController.isPollDTO(data) ) {
			data = linkController.getPollDTO(data);
		}
		if(transactionId == undefined) {
			transactionId = transactionController.currentTransactionId;
		}		
		if(transactionController.isValid(transactionId)) {
			$.ajax({ "url": url, "type": "POST", "data": data, success: 
				function(result) {
				linkController.postCallback(result, callback, data, callbackError, originalInputDTO, transactionId);
			},
			error: function() {
				linkController.ajaxErrorHandler(data, callbackError, originalInputDTO, transactionId);
			}
			});			
		}
	},
	
	getPollDTO: function(data) {
		var pollDTO = new Object();
		pollDTO.correlationId = data.correlationId;
		return pollDTO;
	},
	
	isPollDTO: function(data) {
		return ( data != undefined && data != null && data.correlationId != undefined );
	},
	 
	postHTML: function(url, data, callback, callbackError) {
		
		transactionController.changeCurrentTransaction();	
		
		$.ajax({ "url": url, "type": "POST", "data": data, "dataType": "html", success:	callback,
			error: function() {
				linkController.ajaxErrorHandler(data, callbackError);
			}
		});
	},
	
	// Controla los errores que ocurren cuando no puede llegar al server
	ajaxErrorHandler: function(data, callbackError, originalInputDTO, transactionId) {
		if(transactionController.isValid(transactionId)) {
			var dto = (originalInputDTO != null) ? originalInputDTO : data;
			estado.show("Momentaneamente no se puede procesar la operacion. Por favor intente mas tarde.", estado.tipo.ERROR);
			if (callbackError != null) {
				callbackError.execute( {}, 
					linkController.correlationResult(null, "false"),
					dto);
			}
		}
	},
	
	// originalInputDTO es para el caso de que en data se envie un request de un poll
	// Solo para recibir JSON, si no recibe json te saca de la sesion
	postCallback: function(result, callback, data, callbackError, originalInputDTO, transactionId) {
		var json = linkController.getJSON(result);
		if (json == null) {
			return linkController.handleSessionExpired();
		} else if (json.response.message == "sessionExpired") { // session expirada
			linkController.handleCallbackError(callbackError, json, originalInputDTO);
			return linkController.handleSessionExpired();
		} else if (json.response.message == "intentosExcedidos") {
			linkController.handleCallbackError(callbackError, json, originalInputDTO);
	    	return linkController.handleIntentosExcedidos();
		} else if (json.response.message) { // si se produjo un error en el servidor
			linkController.handleCallbackError(callbackError, json, originalInputDTO);
	    	return linkController.handleError(json.response.message, transactionId);
		} else if (json.response.messages) {
			linkController.handleCallbackError(callbackError, json, originalInputDTO);
			return linkController.handleValidationError(json.response.messages, transactionId);
		} else if (callback != null) {
			callback(json);
		}
	},

	handleCallbackError: function(callbackError, json, originalInputDTO) {
		if (callbackError != null) {
			callbackError.execute(json, null, originalInputDTO);
		}
	},
	
	checkResponseStatus: function(json) {
		if (json.response.message == "sessionExpired") {
			linkController.handleSessionExpired();
			return false;
		}
		return true;
	},
	
	descargar: function(url) {
		ejecutarLogout = false;
		window.location = url;
	},
	
	
	descargarNewTab: function(url) {
		ejecutarLogout = false;
		
		var newWindow = window.open(url, '_blank');

		newWindow.onload = function() {
		    estado.show("Archivo no disponible.", 'error');
		    newWindow.close()
		};
 	},
	
	handleDescargar:function(htmlStr) {
		if (htmlStr.match("sessionExpired")) {
			linkController.handleSessionExpired();
		} else {
			window.location = linkController.urlDescargar;
			linkController.urlDescargar = '';
		}
	},
	
	checkSessionAndSubmit: function(form) {
		form.submit();
	},
	
	checkSession: function() {
		linkController.postHTML(urlCheckSession,null,linkController.checkSessionCallback);
	},
	
	checkSessionCallback:function(htmlStr) {
		if (htmlStr.match("sessionExpired")) {
			linkController.handleSessionExpired();
		}
	},
	
	handleDescargarForm:function(htmlStr) {
		if (htmlStr.match("sessionExpired")) {
			linkController.handleSessionExpired();
		} else {
			linkController.formDescargar.submit();
			linkController.formDescargar = null;
		}
	}, 
	
    sessionExpired: {
    	execute: function(json) {
    	   if (json.response !== undefined) {  
    		   if (json.response.message == "sessionExpired") {
    			   window.location = getLoginPageLC() + '?sessionExpired=true';
    		   }
    	   }
	    }
	}, 
	
	// Todos los resultados de tipo json comienzan con una llave.
	getJSON: function(result) {
		if (result.charAt(0) == "{") {
			// LINKI-4023
			if($.browser.msie && $.browser.version >= "7.0") {
				var pattern = /\r/g;
				result = result.replace(pattern, '\\r'); 
			}
			return eval("(" + result + ")");
		} else {
			return null;
		}
	},
	
	cloneObject : function(object) {
		if(typeof(object) != 'object') {
			return object;
		}
		if(object == null) {
			return object;
		}
	    var newObject = new Object();
	    for(var i in object) {
	    	newObject[i] = linkController.cloneObject(object[i]);
	    }
	    return newObject;
	}
	
}

// Muestra el contenido de un objeto javascript (solo Firefox)
// @author pdistefano 
function log(myObj) {
	if (myObj == null) alert("null");
	else alert(myObj.toSource());
}

//TODO REFACTORIZAR

//Esto se repite en los archivos:
//LinkTransactionController.js
//LinkLoader.js
//link-controller.js
//modificando solo el nombre de la funcion y del array asociativo.

//Se repite porque por el momento no puedo asumir el costo de buscar/generar un lugar comun
//Se cambian los nombres porque no se como pueden responder los diferentes interpretes de js al encontrar dos
//entidades con el mismo nombre (por mas que funcionalmente sean identicas) y dado que hay lugares donde se incluyen
//mas de uno de estos archivos
var productoToLoginPageLC = new Array(2);
productoToLoginPageLC["hb"] = "login.htm";
productoToLoginPageLC["gp"] = "loginGP.htm";

function getLoginPageLC(){
	var match = /https?:\/\/([^\.]*)/.exec(window.location);
	if(match != null && match.length == 2){
		if( productoToLoginPageLC[match[1]] != undefined && productoToLoginPageLC[match[1]] != null ){
			return productoToLoginPageLC[match[1]];
		}
		else{
			return "login.htm";
		}
	}
	else{
		return "login.htm";
	}
}

function getParametrosAdicionalesLC(yaTieneParametro){

	var ret = "";
	var match = /https?:\/\/([^\.]*)/.exec(window.location);
	if(match != null && match.length == 2){
		if(match[1] == "gp"){
			
			if( typeof(idSolicitudPago) != "undefined" && idSolicitudPago != null && idSolicitudPago != ""){
				
				if(yaTieneParametro){
					ret += "&";
				}
				ret += "id=";
				ret += idSolicitudPago;
				
				yaTieneParametro = true; //Por si se agregan otros abajo				
			}

		}
	}

	return ret;
}
