/**
 * @author Nico Pinto
 */
var estado = {
 	ver: 0.9,
 	seVeModal:false,
	tipo:{
		ERROR: "error",
		BIEN: "bien"
	},
	
	create:function(permiteCerrar,id) {
		var estilo = '';
		var idContenedor='';
		if(id!=null)idContenedor=id;
		//var contenedor = $('.contEstado');
		estado.remove();
		estado.seVeModal = $('.jqmWindow').is(':visible');
		if(idContenedor==""){
			$('<div class="contEstado ocultar"></div>').appendTo('body');
		}else{			
			$('<div id="'+idContenedor+'" class="contEstado ocultar"></div>').appendTo('body');
		}
		if(estado.seVeModal){
			$('.contEstado').appendTo('.jqmWindow');
		}else{			
			$('.contEstado').appendTo('body');
		}
		var contenedor = $('.contEstado');
		if (permiteCerrar) {
			contenedor.html('<div class="estado"'+estilo+' style="display:none;"><h4>TEXTO</h4><span>cerrar</span></div>');
		} else {
			contenedor.html('<div class="estado"'+estilo+' style="display:none;"><h4>TEXTO</h4></div>');
		}
	},
	
	/**
	 * Funcion para llamar al mensaje de estado
	 * @param msj Mensaje para mostrar en la caja
	 * @param tipo Tipo de mensaje. Opcional.
	 * 		Sin indicar el tipo, se refiere a una advertencia
	 * 		estado.tipo.ERROR es para mostrar errores
	 * 		estado.tipo.BIEN es para mostrar un mensaje de Ok
	 */
	show:function(msj, tipo, cierreAutomatico, id) {
        if ($("#posicionConsolidada").length > 0) {
            if (msj.indexOf("En este momento no se puede procesar esta operaci") != -1) {
                return;
            }
            if (msj.indexOf("No se encontr&oacute; informaci&oacute;n disponible para la consulta realizada") != -1) {
                return;
            }
            if (msj.indexOf("no se puede realizar la operaci") != -1) {
                return;
            }            
        }
        
		clearTimeout('estado.hide()');
		
		try{
			modalController.hideModal('#cargando', null, true);
		}catch(e){};
		
		if(id==null){
			// Siempre permite que se cierre
			estado.create(true);
		}else{
			estado.create(true,id);
		}
		
		//al aparecer el estado en ie6 scrollea para arriba asi se lee el estado
		if($.browser.msie && $.browser.version=='6.0'){
			window.scrollTo(0,0);
		}
		
		var clase = '';
		var hide = '';
		switch(tipo){
			case 'error':
				clase = estado.tipo.ERROR;
				// Para el caso de error no se oculta solo
				hide = false;
				break;
			case 'bien':
				clase = estado.tipo.BIEN;
				hide = true;
				break;
			default:
				clase = '';
				hide = true;
				break;
				
		}
		
		if (cierreAutomatico != null) {
			hide = cierreAutomatico;
		}
		
		$(".estado").attr('class','estado').find('h4').html(msj)
		.parent('div').addClass(clase).fadeIn()
			.find('span').click(function(){
				estado.hide();
			});
				
		if (hide) {
			setTimeout('estado.hide()', 5000);
		}
	
	},
	
	hide:function()
	{
		$('.estado').fadeOut('slow',function(){
			estado.remove();
		});
	},
	
	remove:function(){
		$('.contEstado').empty().remove();
	}
}