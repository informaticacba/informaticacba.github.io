var ingresoConTecladoVirtual = false;

var tecladoAlfanum = false;

var tecladoVirtualController = {
	inputId: null,
	contenedorId: null,
	divLimiteId: null,
	holdPosition: false,
	position: {last_x: -1, last_y:-1},
	crearTecladoVirtual: function(inputId, contenedorId, divLimiteId, crearSiempre,varHoldPosition) {
		if ((ingresoConTecladoVirtual) || (crearSiempre)) {		    
			tecladoVirtualController.inputId = inputId;
			tecladoVirtualController.contenedorId = contenedorId;
			tecladoVirtualController.divLimiteId = divLimiteId;
			tecladoVirtualController.holdPosition = varHoldPosition != null ? varHoldPosition :  false;
			
			if (tecladoVirtualController.divLimiteId == null) {
				tecladoVirtualController.divLimiteId = '#contenedorPpal';
			}
			$('#osk').remove();
			$('body').append('<div id="osk" style="z-index:99999;"></div>');
			var nuevoTeclado = tecladoVirtualController.generarJson(tecladoAlfanum);
			
			if ( tecladoAlfanum )
				$('#osk').addClass('oskAlfaNum')
				
			$('#osk').loadLayoutNoAjax(nuevoTeclado, tecladoVirtualController.tecladoVirtualCallback);
			tecladoVirtualController.tecladoDragStart();
			$(inputId).attr('readonly','true');
			$('#osk').hide();
		}
	},
	
	showTecladoVirtual: function() {
		if (ingresoConTecladoVirtual) {
			$('#osk').show();
		}
	},
	
	hideTecladoVirtual: function() {
		if (ingresoConTecladoVirtual) {
			$('#osk').hide();
		}
	},
	
	//generador de json del teclado dinamico
	generarJson: function(tecladoAlfanum) {
		var tecs;
		
		if ( !tecladoAlfanum ){
			tecs = [
				{"id": "key_1", "label": "1", "sLabel": "!", "altLabel": "¡", "sAltLabel": "¹"},
				{"id": "key_2", "label": "2", "sLabel": "@", "altLabel": "²"},
				{"id": "key_3", "label": "3", "sLabel": "#", "altLabel": "³"},
				{"id": "key_4", "label": "4", "sLabel": "$", "altLabel": "¤", "sAltLabel": "£"},
				{"id": "key_5", "label": "5", "sLabel": "%", "altLabel": "€"},
				{"id": "key_6", "label": "6", "sLabel": "^", "altLabel": "¼", "sFunc": "deadcircumflex"},
				{"id": "key_7", "label": "7", "sLabel": "&", "altLabel": "½"},
				{"id": "key_8", "label": "8", "sLabel": "*", "altLabel": "¾"},
				{"id": "key_9", "label": "9", "sLabel": "(", "altLabel": "‘"},
				{"id": "key_0", "label": "0", "sLabel": ")", "altLabel": "’"}
		         ];

			var tecBackspace = {"id": "key_backspace", "label": "Borrar", "sLabel": "Borrar", "func": "backspace", "sFunc": "backspace", "altFunc": "backspace", "sAltFunc": "backspace"};
			var aleat = tecladoVirtualController.shuffle(tecs);
			var map = [];
				map.push([]);
				map.push([]);
				map.push([]);
				map.push([]);
			var c1 = 1;	var c2 = 1;	var c3 = 1;	var c4 = 1;
			for(var i=0;i<aleat.length;i++){
				if(c1<4){ map[0].push(aleat[i]); c1++; continue;}
				if(c2<4){ map[1].push(aleat[i]); c2++; continue;}
				if(c3<4){ map[2].push(aleat[i]); c3++; continue;}
				if(c4<2){ map[3].push(aleat[i]); c4++; continue;}
			};
			map[3].push(tecBackspace);
		}
		else
			map = [
		            [
		             {"id": "key_nada", "label": "~"},
		             {"id": "key_1", "label": "1", "sLabel": '!'},
		             {"id": "key_2", "label": "2", "sLabel": '@'},
		             {"id": "key_3", "label": "3", "sLabel": "#"},
		             {"id": "key_4", "label": "4", "sLabel": "$"},
		             {"id": "key_5", "label": "5"},
		             {"id": "key_6", "label": "6", "sLabel": "&"},
		             {"id": "key_7", "label": "7", "sLabel": "/"},
		             {"id": "key_8", "label": "8", "sLabel": "*"},
		             {"id": "key_9", "label": "9"},
		             {"id": "key_0", "label": "0", "sLabel": "="},
		             {"id": "key_minus", "label": "?"},
		             {"id": "key_equals", "label": "¿", "sLabel": "¡"},
		             {"id": "key_backspace", "label": "Borrar", "sLabel": "Borrar", "func": "backspace", "sFunc": "backspace"}
		            ],
		            [
		             {"id": "key_tab", "label": "Tab", "sLabel": "Tab", "func": "tab", "sFunc": "tab"},
		             {"id": "key_q", "label": "q"},
		             {"id": "key_w", "label": "w"},
		             {"id": "key_e", "label": "e"},
		             {"id": "key_r", "label": "r"},
		             {"id": "key_t", "label": "t"},
		             {"id": "key_y", "label": "y"},
		             {"id": "key_u", "label": "u"},
		             {"id": "key_i", "label": "i"},
		             {"id": "key_o", "label": "o"},
		             {"id": "key_p", "label": "p"},
		             {"id": "key_leftsquarebracket", "label": "+"}		            ],
		            [
		             {"id": "key_capslock", "label": "Caps", "sLabel": "Caps","func": "capslock", "sFunc": "capslock"},
		             {"id": "key_a", "label": "a"},
		             {"id": "key_s", "label": "s"},
		             {"id": "key_d", "label": "d"},
		             {"id": "key_f", "label": "f"},
		             {"id": "key_g", "label": "g"},
		             {"id": "key_h", "label": "h"},
		             {"id": "key_j", "label": "j"},
		             {"id": "key_k", "label": "k"},
		             {"id": "key_l", "label": "l"}
		            ],
		            [
		             {"id": "key_leftshift", "label": "Shift", "sLabel": "Shift", "func": "shift", "sFunc": "shift"},
		             {"id": "key_z", "label": "z"},
		             {"id": "key_x", "label": "x"},
		             {"id": "key_c", "label": "c"},
		             {"id": "key_v", "label": "v"},
		             {"id": "key_b", "label": "b"},
		             {"id": "key_n", "label": "n"},
		             {"id": "key_m", "label": "m"},
		             {"id": "key_period", "label": "."},
		             {"id": "key_dash", "label": "-", "sLabel": "_"}
		            ]
		         ];
		return map;
	},
	
	tecladoVirtualCallback: function(key) {
	      var box = $(tecladoVirtualController.inputId);
	      var text = box.val();
//	      var pos = box.caret();
//	      if($.browser.msie){
	      var  pos = text.length;
//	      }
	      switch (key) {
	          case '\b':
	              box.val(text.substring(0, pos-1) + text.substring(pos));
	              box.caret(pos-1);
	              break;
	          case '\003':
	        	  box.caret(pos-1);
	              break;
	          case '\004':
	              box.caret(pos+1);
	              break;
	          case '\n':
	          case '\t':
	          case '~':
	        	  break;
	          default:
	        	  box.val(text.substring(0, pos) + key + text.substring(pos));
	    		  box.caret(pos+1);
	      }
	},
	
	//funcion que hace drageable el teclado
	tecladoDragStart: function(){
		var tecladoVirtual = $('#osk');

		var divLimite = $(tecladoVirtualController.divLimiteId);
		var contenedor = $(tecladoVirtualController.contenedorId);
		var bordeContenedorX = contenedor.offset().left;
		var bordeContenedorY = contenedor.offset().top;
		var limiteSuperiorX = divLimite.width() + divLimite.offset().left - tecladoVirtual.width() - bordeContenedorX;
		var limiteSuperiorY = divLimite.height() + divLimite.offset().top - tecladoVirtual.height() - bordeContenedorY;
		var limiteInferiorX = divLimite.offset().left - bordeContenedorX;
		var limiteInferiorY = divLimite.offset().top - bordeContenedorY;
		
		var xValue, yValue;

		xValue = tecladoVirtualController.aleatorio(limiteInferiorX, limiteSuperiorX);
        yValue = tecladoVirtualController.aleatorio(limiteInferiorY, limiteSuperiorY);

        if ( tecladoVirtualController.holdPosition ){
                if ( tecladoVirtualController.position.last_x == -1 ){
                        tecladoVirtualController.position.last_x = xValue;
                        tecladoVirtualController.position.last_y = yValue;
                }
                xValue = tecladoVirtualController.position.last_x;
                yValue = tecladoVirtualController.position.last_y;
        }
		

		if (xValue < 0) {
            xValue = 0;         
        } else if (xValue > 400) {          
            xValue = 400; // esto es para que no se vaya fuera del area visible
        }		
		var posx = xValue + 'px';
		
		if (yValue < 0) {
			yValue = 0;			
		} else if (yValue > 300) {		    
			yValue = 300; // esto es para que no se vaya fuera del area visible
		}		
		var posy = yValue + 'px';
		tecladoVirtual.css({top:posy,left:posx})

		.bind('drag',function( event ) {
			//seteo de la posicion X para el tecleado
			posx = event.pageX - event.cursorOffsetX - bordeContenedorX;
			if (posx > limiteSuperiorX) {
				posx = limiteSuperiorX;
			} else if (posx < limiteInferiorX) {
				posx = limiteInferiorX;
			}
			//seteo de la posicion Y para el tecleado
			posy = event.pageY - event.cursorOffsetY; /* LINKI - 6128 */ 
			if (posy > limiteSuperiorY) {
				posy = limiteSuperiorY;
			} else if (posy < limiteInferiorY) {
				posy = limiteInferiorY;
			}
			$(this).css({top: posy, left: posx});
			tecladoVirtualController.position.last_x = posx;
			tecladoVirtualController.position.last_y = posy;

		});
	},
	
	//funcion que randomiza un array
	shuffle: function(o){ //v1.0
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	
	aleatorio: function(inferior,superior){
		var numPosibilidades = superior - inferior;
		var aleat = Math.random() * numPosibilidades;
		aleat = Math.round(aleat);
		return parseInt(inferior) + aleat; 
	}
}