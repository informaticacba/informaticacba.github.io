var tycController = {
	    
	init: function() {
		$('#aceptartyc').click(function(){			
			tycController.aceptartyc();
		});
		
		$('#cancelartyc').click(function(){			
			tycController.cancelartyc();
		});		
	},
	mostrartyc: function() {
	 	modalController.showModal("#tycModal", true);
	 	if($.browser.msie && $.browser.version >= "7.0"){
	 		$('.jqmOverlay').remove();
	 	}
	 	$('.jqmOverlay').unbind('click');
	 	$(document).unbind('keypress');
	},
	aceptartyc: function() {
		$("#AceptacionTyCForm").submit();
	},
	handleAceptarTyC: function() {
		modalController.hideModal("#tycModal");
		$('#RedirectHomeForm').submit();
	},
	cancelartyc: function() {
		linkController.postHTML(urlLogout, null, tycController.handleCancelarTyc);
	},
	handleCancelarTyc: function(html) {
		window.location = urlLogin;		
	}
}

$(function(){
	tycController.init();
});