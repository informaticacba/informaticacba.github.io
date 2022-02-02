var transactionController = {
	currentTransactionId: 0,
    cargarTransaccion: function(url, resultFunction, actualizarBreadcrumb, data) {
        if(!data)
            data = null;
        estado.hide(); // Se oculta el popup de estado
        tecladoVirtualController.hideTecladoVirtual();
        tecladoVirtualController.hideTecladoVirtual();
        
        // Si no es una URL del modal de Opciones Personales, se ocultan todos los modales
        if(!url.match("modificarDatosPersonales.htm") 
                && !url.match("servicioMensajesYAlertas.htm") 
                && !url.match("avisoViajeExterior.htm") 
				&& !url.match("cambiarClaveBasica.htm")
                && !url.match("aplicativoCelular.htm")
                && !url.match("bajaSegundoFactor.htm")
                && !url.match("consultaRecibosSueldo.htm")
                && !url.match("blanqueoClavePIL.htm")
                && !url.match("blanqueoClavePIN.htm")) {
            modalController.hideAllModal();
        }
        
        jQuery.datepick._hideDatepick(); // Se ocultan todos los calendarios
        
        // Por defecto se llama a cargarHtml que carga la transacción en un div de transaccion
        if (resultFunction == null) {
            resultFunction = transactionController.cargarHtml;
        }
        Contenido.getContenidosFor(url);
        
        var transactionCodeRegex = /\w+(?=\.htm)/g;
        var transactionCode = transactionCodeRegex.exec(url);
        
        var callback = new CargarTransaccionCallback(resultFunction, transactionCode);
        // Se agrego el texto "cargando..."
        callback.mostrarCargandoTransaccion();
        if ((actualizarBreadcrumb == null) || (actualizarBreadcrumb)) {
            transactionController.actualizarBreadcrumb(url);
        }
                
        linkController.postHTML(url, data, 
                function(html) { callback.callbackOnComplete(html); }, 
                { execute: function() { callback.ocultarCargandoTransaccion(); } });
    },
    
    actualizarMenu: function(transactionCode) {
    	if (menu.isTabsMenu()) {
    		var path = breadcrumbController.breadcrumbs[transactionCode];
    		menu.selectTabsMenuPath(path);
    	}
    },
    
    actualizarBreadcrumb: function (url) {
    	var transactionCode = url.split('/');
    	transactionCode = transactionCode[transactionCode.length - 1];
    	transactionCode = transactionCode.split('.htm')[0];
    	breadcrumbController.actualizarBreadCrumb(transactionCode);
    	transactionController.actualizarMenu(transactionCode);
    },
    
	changeCurrentTransaction: function () {
    	transactionController.currentTransactionId = transactionController.getTransactionId();
	},
	
    getTransactionId: function () {
    	return Math.floor(Math.random()*3000);
    },
    
    // La transaccion es valida si su identificador es igual al actual
    isValid: function(transactionId) {
		if(transactionId == undefined ) {
			return true;
		}
    	return ( transactionController.currentTransactionId == transactionId );
    },
	
    cargarHtml: function(html, transactionCode) {
    	// No se espera que retorne JSON un request de HTML. Te saca de la sesion.
    	var json = linkController.getJSON(html);
    	if (json != null) {
    		if (json.response.message == "sessionExpired") { // Session expirada
    			linkController.handleSessionExpired();
    	    } else if (json.response.message) { // Si se produjo un error en el servidor
    			estado.show(json.response.message, 'error'); 
    		}
    	} else {
    		if (html.match('<!-- LOGIN -->')) {
    			linkController.handleSessionExpired();
    		} else {
    			$("#transaccion").html(html);
    			var classArray = $("#contenedorPpal").attr("class").split(" ");
    			
    			var hayClaseTransaccion = false;
    			for(var i = 0; i < classArray.length - 1; i++) {
    				if(classArray[i].length > 3) {
    					$("#contenedorPpal").removeClass(String(classArray[i])).addClass(String(transactionCode));
    					hayClaseTransaccion = true;
    				}
    			}
    			if(!hayClaseTransaccion)
    				$("#contenedorPpal").addClass(String(transactionCode));
    		}
    	}
    },
    
    cargarTransaccionSinBreadcrumb: function(url, resultFunction, actualizarBreadcrumb, data) {
        if(!data)
            data = null;
        estado.hide(); // Se oculta el popup de estado
        tecladoVirtualController.hideTecladoVirtual();
        tecladoVirtualController.hideTecladoVirtual();
        
        // Si no es una URL del modal de Opciones Personales, se ocultan todos los modales
        if(!url.match("modificarDatosPersonales.htm") 
                && !url.match("servicioMensajesYAlertas.htm") 
                && !url.match("avisoViajeExterior.htm") 
				&& !url.match("cambiarClaveBasica.htm")
                && !url.match("aplicativoCelular.htm")
                && !url.match("bajaSegundoFactor.htm")
                && !url.match("consultaRecibosSueldo.htm")
                && !url.match("blanqueoClavePIL.htm")
                && !url.match("blanqueoClavePIN.htm")) {
            modalController.hideAllModal();
        }
        
        jQuery.datepick._hideDatepick(); // Se ocultan todos los calendarios
        
        // Por defecto se llama a cargarHtml que carga la transacción en un div de transaccion
        if (resultFunction == null) {
            resultFunction = transactionController.cargarHtml;
        }
        Contenido.getContenidosFor(url);
        
        var transactionCodeRegex = /\w+(?=\.htm)/g;
        var transactionCode = transactionCodeRegex.exec(url); 
        var callback = new CargarTransaccionCallback(resultFunction, transactionCode);

        // Se agrego el texto "cargando..."
        callback.mostrarCargandoTransaccion();
        linkController.postHTML(url, data, 
                function(html) { callback.callbackOnComplete(html); }, 
                { execute: function() { callback.ocultarCargandoTransaccion(); } });
    }
}

function CargarTransaccionCallback (resultFunction, transactionCode){
	this.resultFunction = resultFunction;
	this.transactionCode = transactionCode;
	this.callbackOnComplete = function(html, transactionCode){
		this.ocultarCargandoTransaccion();
		this.resultFunction(html, this.transactionCode);
	};
	
	this.mostrarCargandoTransaccion = function(){
		$('#divCargandoPeticionTransaccion').show();
	};
	
	this.ocultarCargandoTransaccion = function(){
		$('#divCargandoPeticionTransaccion').hide();
	};
}