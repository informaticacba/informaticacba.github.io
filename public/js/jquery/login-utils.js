
var isIE6 = ($.browser.msie && $.browser.version == "6.0");

  var estadoLogin = "usuario", bloqueaIngreso = false;

  function loginErrorHandler(result) {
  	var manejoEstandar = sfaObject.manejarError(result);
	  if(manejoEstandar){
		  estado.show(result.message, estado.tipo.ERROR);
		  showEstado("usuario");
	  }
  }

  function customValidation(){
      estado.show('Ingresando...', 'bien', false);
      return true;   
  }

  function onComplete(result) {
	  if (!result.response.data[0].nuevo) {
		  if(result.response.data[0].tyc.mostrar) {
			  tecladoVirtualController.hideTecladoVirtual();
			  tycController.mostrartyc();
		  } else {
			  $('#RedirectHomeForm').submit();
		  }		  
	  } else {
		  window.location = urlDatosPersonales;
	  }
  }
  
  function ingresar() {
	  if (bloqueaIngreso)
		  return;
	  if (estadoLogin == "usuario") {
		  verificarUsuario();
	  } else if (estadoLogin == "ingresando"){
		  return;
	  } else {
		  showEstado("ingresando");
		  login();
	  }
  }
  
  function restauracionUsuario(url) {
	  $("#RestauracionUsuarioForm").attr("action", url);
	  $('#RestauracionUsuarioForm').submit();
  }
  
  function enrolamiento(url) {
	  $("#EnrolamientoForm").attr("action", url);
	  $('#EnrolamientoForm').submit();
  }
  
 
  function login() {
  
  	  /*HB-37*/	    
	  if ($('#clave').val().length < 4 || $('#clave').val().length > 8) {
	      estado.show("Acceso incorrecto al Sistema", estado.tipo.ERROR);
		  showEstado("password");
		  return;
	  }
	 
	  if(false == sfaObject.validar()){
		  showEstado("sfaError");
		  return;
	  }	 
	  
	  $('#sfaInfo').val( sfaObject.generarSalida() );
	  
	  $('#username').val($('#usuario').val());
	  $('#pin').val($('#clave').val());
	  $('#usarTecladoVirtual').val($('#pcCompartida').attr('checked'));
	  $('#LoginForm').submit();
  }
  
  function verificarUsuario() {
	  if (!$('#usuario').valid()) {
		  estado.show("El nombre de usuario ingresado tiene un formato incorrecto, por favor ingr&eacute;selo nuevamente", estado.tipo.ERROR);
		  return;
	  }
	  estado.hide();
	  enviarFormVerificacion();
  }
  
  function enviarFormVerificacion() {
	  bloquearIngreso();
	  var ajaxSubmitOptions = { success: onCompleteVerification , error: desbloquearIngreso};
	  $('#UserNameVerificationForm').ajaxSubmit(ajaxSubmitOptions);
  }
  
  function onCompleteVerification(result) {
	  if (result.charAt(0) == "{") {
		  jsonResult = eval("result = " + result);
		  if (result.response.message) {
			  estado.show(result.response.message, estado.tipo.ERROR);
		  }
		  return;
	  }
	  $('#secondstep').html(result);
	  $('.avatar img').attr("src", avatarPath);
	  showEstado("password");
	  
 	  sfaObject.inicializar();
 	  desbloquearIngreso();
  }
  
  function bloquearIngreso(){
	  bloqueaIngreso = true;
	  $(".btn_ingresar").attr("disabled",true);
  }
  
  function desbloquearIngreso(){
	  bloqueaIngreso = false;
	  $(".btn_ingresar").attr("disabled",false);
  }
  
  function showEstado(estado) {
	$('div.textoClave').hide();
	estadoLogin = estado;
	if (estado == "usuario") {
		$('#campoUsuario').show();
		$('#campoPassword').hide();
		$('#usuario').focus();
		$('#usuario').select();
		$('#usuario').attr("value", "");
		if (usarTecladoVirtual) {
			$('.siEsPcPublica').hide();
			$('#osk').hide();
		}
		sfaObject.ocultar();

	} else if (estado == "password") {
		$('#campoUsuario').hide();
		$('#campoPassword').show();
		$('#clave').focus();
		$('#clave').select();
		$('#clave').attr("value", "");
		if (usarTecladoVirtual) {
			$('.siEsPcPublica').show();
			if ($('#pcCompartida').attr('checked')) {
				$('#osk').show();
			}
		}
	}
  }
  
function userNameOnKeyDown(event) {
	if (event.which || event.keyCode) {
		if ((event.which == 13) || (event.keyCode == 13))	
			verificarUsuario();
	}
}

function mostrarTecladoVirtual() {
	if (usarTecladoVirtual) {
		tecladoVirtualController.crearTecladoVirtual('#clave', 'body', '#contenedor', true);
		$('#pcCompartida').click(function() {
			if($(this).attr('checked')){
				ingresoConTecladoVirtual = true;
				tecladoVirtualController.showTecladoVirtual();
				$('#clave').attr('readonly','true');
			} else {
				tecladoVirtualController.hideTecladoVirtual();
				ingresoConTecladoVirtual = false;
				$('#clave').attr('readonly','');
			}
		});
		$('#clave').attr('readonly','');
	} else {
		$('.siEsPcPublica').hide();
	}
}

function addValidators() {
	var config = {"messages":{"username":{"required":"Debe completar este campo","rangelength":"El tama&ntilde;o debe ser entre 6 y 15"},"pin":{"required":"Debe completar este campo","regexp":"El valor ingresado no es v&aacute;lido","rangelength":"El tama&ntilde;o debe ser de 6 a 8"}},"rules":{"username":{"required":true,"rangelength":[6,15]},"pin":{"required":true,"regexp":"^[a-zA-Z0-9!\"#$%&/()=?¡¿\\-,;.:\\[\\]{}^]+$","rangelength":[6,8]}}, 
		"showErrors": function() {} };
	$('#UserNameVerificationForm').validate(config);
}

$(function() {
	 //LINKI-5932: Parametrizar bloqueo de IE 6
	 var sps = servicePackBloqueadosIE6.split('|');
	 for (i = 0; i < sps.length; i++) {
		 if(isIE6 && navigator.appMinorVersion.match('SP' + sps[i])) {
			 var isIE6SP1 = isIE6 && navigator.appMinorVersion.match('SP1');
			//LINKI-6300: Parametrizar lista de ips sin bloqueo para IE6 SP1
			 if(isIE6SP1) {
				 if(!ipSinRestriccionIE6SP1) {
					 window.location = urlBrowserError;
				 }
			 } else {
				 window.location = urlBrowserError;
			 }
		 }
	 }
	
	 mostrarTecladoVirtual();
	 showEstado("usuario");
	 $('div.textoClave').hide();
	 // Se comenta ya que se encuentra asociado en login.jsp el evento keydown
	 //$('#usuario').keydown(userNameOnKeyDown);
	 $('#clave').focus(function(){
		 var size = $(this).val().length;
	     $(this).caret(size);
	     $(this).keydown(function(e) {
         	if (e.which == 37 || e.which == 39) {
	            return false;
         	} 
         });
	 }).blur(function(){
		 $(this).keydown(function(e) {
         	if (e.which == 37 || e.which == 39) {
	            return true;
         	} 
         });
	 });
	 
	 $('a.cerrarAyuda').click(function(){
		 $('div#ayudaUsuario').hide();
	 })
	 
	 $('a.cerrarAyudaAvatar').click(function(){
		 $('div#ayudaAvatar').hide();
	 })
	 
	 $('#campoUsuario a.preg').click(function(e){
		 var posX = e.pageX;
		 var posY = e.pageY;
		 $('div#ayudaAvatar').hide();
		 if ($('div#ayudaUsuario').css('display')=='block'){
			$('div#ayudaUsuario').hide();
		 }else{
			$('div#ayudaUsuario').css('left',posX+20);
			$('div#ayudaUsuario').css('top',posY-50);
			$('div#ayudaUsuario').show();
		 }
	 });	 
	 
	 $('#campoPassword a.preg.ayuda2').click(function(e){
		 var posX = e.pageX;
		 var posY = e.pageY;
		 $('div#ayudaUsuario').hide();
		 if ($('div#ayudaAvatar').css('display')=='block'){
			$('div#ayudaAvatar').hide();
			
		 }else{
			$('div#ayudaAvatar').css('left',posX+20);
			$('div#ayudaAvatar').css('top',posY-50);
			$('div#ayudaAvatar').show();
		 }
	 });	 
});