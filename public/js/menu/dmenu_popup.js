//***********************************************
//  Javascript Menu (c) 2006, by Deluxe-Menu.com
//  version 2.0
//  E-mail:  cs@deluxe-menu.com
//***********************************************


function _dmie(event){var x=0,y=0;if(_e||_o){x=event.clientX+(_ec?dde.scrollLeft:0);y=event.clientY+(_ec?dde.scrollTop:0);}else{x=event.pageX;y=event.pageY;};return[x,y];};function dm_popup(mi,dhp,event,x,y){if(_e)event.returnValue=false;var dm=_dm[mi],ce=dm.m[1],xy=(x&&y)?[x,y]:_dmie(event);if(ce){var oo=_dmni(ce);if(oo.style.visibility=='visible'){clearTimeout(dm._dmnl);_dmmh(dm.m[0].sh);window.status='';};dm.m[0].sh=ce.id;_dmzh(ce.id);var dsd=_dmcs(dm),cc=_dmos(_dmoi(ce.id+'tbl'));with(ce.ct){var w=(smW?parseInt(smW):cc[2])+ce.shadowLen,h=(qhi?parseInt(qhi):cc[3])+ce.shadowLen;};xy[0]=_dmoz(xy[0],w,dsd[0],dsd[2],0);xy[1]=_dmoz(xy[1],h,dsd[1],dsd[3],0);with(oo.style){left=xy[0]+du;top=xy[1]+du;};if(dhp>0)dm._dmnl=setTimeout("_dmmh('"+dm.m[0].sh+"');window.status='';",dhp);};return false;};
