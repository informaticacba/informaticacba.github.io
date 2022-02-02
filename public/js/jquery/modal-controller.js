var modalController = {
	showModal: function(modalId, toTop, mostrarTecladoVirtual) {
		//Se mueve el modal afuera de las areas para que se vea en IE
		//$('.jqmWindow').prependTo('body');
		$(modalId + ' .contEstado').remove();
		if (!toTop) {
			$(modalId).jqm();
		} else {
			$(modalId).jqm({toTop: true});
		}
		
		//al ser los modales con posicion absoluta, se genera un autoscroll
		window.scrollTo(0,0);
						
		$(modalId).jqmShow();
		
		//al aparecer el modal en ie6 scrollea para arriba asi se lee el estado
		if($.browser.msie && $.browser.version=='6.0'){
			window.scrollTo(0,0);
		}
		
		$(modalId).append('<div class="contEstado"></div>');

		$('.jqmOverlay').unbind('click').click(function(){
			modalController.hideModal(modalId);
		});
		
		if (mostrarTecladoVirtual) {
			tecladoVirtualController.showTecladoVirtual();
		}
	},
	showModalBloqueante: function(modalId, mostrarTecladoVirtual) {
		modalController.showModal(modalId, true, mostrarTecladoVirtual);
		$('.jqmOverlay').unbind('click');
	},
	hideModal: function(modalId, divContenedorId, noOcultarTecladoVirtual) {
		$(modalId).find('.contEstado').remove();
		$(modalId).jqmHide();
		if (divContenedorId != null) {
			$(divContenedorId).append('<div class="contEstado"></div>');
		} else {
			$('body').append('<div class="contEstado"></div>');
		}
		
		//fix select bug ie6
		if(isIE6){
			if($('.jqmWindow').is(':visible')){
				$('#transaccion select').css('visibility','hidden');
			}else{
				$('#transaccion select').css('visibility','visible');
			}
		}
		
		if (!noOcultarTecladoVirtual) {
			tecladoVirtualController.hideTecladoVirtual();
		}
	},
	
	hideAllModal: function() {
		$('.jqmWindow').jqm().jqmHide();
	},
	
	showCargandoModal:function(idCargandoDiv){
		if(idCargandoDiv==undefined)idCargandoDiv = '#cargando';
		$(idCargandoDiv + ' .contEstado').remove();
		$(idCargandoDiv).jqm({toTop: true});
		$(idCargandoDiv).jqmShow();
		$(idCargandoDiv).append('<div class="contEstado"></div>');
		$(idCargandoDiv).appendTo('body');
		 
		$('.jqmOverlay').unbind('click');
	},
	
	hideCargandoModal: function(idCargandoDiv) {
		if(idCargandoDiv==undefined)idCargandoDiv = '#cargando';
		$(idCargandoDiv).find('.contEstado').remove();
		$(idCargandoDiv).jqmHide();
		$('#cuerpo').append('<div class="contEstado"></div>');
	}
}