// urlFaqs, urlInformacion, urltyc, urlSeguridad definidas en login.jsp
var enlacesLoginController = {
	init: function(){
		$('#faqsLogin').click(function(){
			enlacesLoginController.mostrarFaqs();
		});

		$('#infoLogin').click(function(){
			enlacesLoginController.mostrarInformacion();
		});

		$('#tycLogin').click(function(){
			enlacesLoginController.mostrarTyC();
		});

		$('#seguridadLogin').click(function(){
			enlacesLoginController.mostrarSeguridadSistema();
		});
		
		$('#cerrarEnlacesModalLogin').click(function(){
			enlacesLoginController.ocultarOpcionSeleccionada();
		});
		$('#tyc2Login').click(function(){
            enlacesLoginController.mostrar2TyC();
        });
		
	},		
	ocultarOpcionSeleccionada: function() {
		modalController.hideModal("#enlacesModalLogin");
	},
	mostrarFaqs: function() {
		$("#enlacesModalLogin div.top h4").html("Preguntas Frecuentes");
		$("#print").attr("href", "javascript:enlacesLoginController.imprimir();");
		$("#download").attr("href", "javascript:enlacesLoginController.exportarFaqPDF();");
		linkController.postHTML(urlFaqs,null,enlacesLoginController.showModalEnlaces);
	},	
	mostrarInformacion: function() {
		$("#enlacesModalLogin div.top h4").html("Informaci&oacute;n de Home Banking");
		$("#print").attr("href", "javascript:enlacesLoginController.imprimir();");
        $("#download").attr("href", "javascript:enlacesLoginController.exportar('exportInfo.htm');");
		linkController.postHTML(urlInformacion,null,enlacesLoginController.showModalEnlaces);
	},	
	mostrarTyC: function() {    
		$("#enlacesModalLogin div.top h4").html("T&eacute;rminos y Condiciones");
		$("#print").attr("href", "javascript:enlacesLoginController.imprimir();");
        $("#download").attr("href", "javascript:enlacesLoginController.exportar('exportTyc.htm');");
		linkController.postHTML(urltyc,null,enlacesLoginController.showModalEnlaces);
	},
	mostrar2TyC: function() {    
        $("#print").attr("href", "javascript:enlacesLoginController.imprimir();");
        $("#download").attr("href", "javascript:enlacesLoginController.exportar('exportTyc.htm');");
        //linkController.postHTML(urltyc,null,enlacesLoginController.showModalEnlaces);
    },
	mostrarSeguridadSistema: function() {
		$("#enlacesModalLogin div.top h4").html("Seguridad del Sistema");
		$("#print").attr("href", "javascript:enlacesLoginController.imprimir();");
        $("#download").attr("href", "javascript:enlacesLoginController.exportar('exportSec.htm');");
		linkController.postHTML(urlSeguridad,null,enlacesLoginController.showModalEnlaces);
	},	
	showModalEnlaces: function(htmlStr) {
		if (htmlStr.match("sessionExpired")) {
    		linkController.handleSessionExpired();
    	} else {
    		$("#textoContenidoEnlaceLogin").empty().html(htmlStr);
    		
    	 	modalController.showModal("#enlacesModalLogin");
    	 	if($.browser.msie && $.browser.version <= "7.0"){
    	 		//$('.jqmOverlay').remove();
    	 	}
    	}
	},
	imprimir:function(){
        if($('.linkModal').hasClass('nomostrar')){
            $('.linkModal').removeClass('nomostrar');
        }
        $('.linkModal div.top').addClass('nomostrar');
        $('#contenedor').addClass('nomostrar');
        print();
    },
	exportar:function(url){
        $("#exporter").attr("action", url);
        linkController.checkSessionAndSubmit($("#exporter"));
    },
    exportarFaqPDF: function() {
    	newTab = window.open(pdfFaq, 'pdf');
    	newTab.focus();
    }
}

$(function(){
	enlacesLoginController.init();
})