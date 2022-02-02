//***********************************************
//  Javascript Menu (c) 2006, by Deluxe-Menu.com
//  version 2.0
//  E-mail:  cs@deluxe-menu.com
//***********************************************


d_o.write('<div id="dmAD" style="position:absolute;cursor:default;width:60px;display:none;padding:2px;z-index:999999;border:solid 1px #AAAAAA;background-color:#FFFFFF;font:normal 12px Tahoma,Arial;color:#000000">Loading...</div>');var dlt=null,_dvA;function _dmds(parentID){if(dlt)return;var scr,sid='dmScr';menuItems=null;if(scr=_dmge(sid))dde.removeChild(scr);scr=d_o.createElement('SCRIPT');scr.id=sid;scr.src=_dmvi(parentID).daj;dde.appendChild(scr);_dvA=_dmge('dmAD');var its=_dmos(_dmoi(parentID+'tbl'));with(_dvA.style){left=its[0]+du;top=its[1]+its[3]+du;display='';};if(!menuItems)dlt=setInterval('_dmcn("'+parentID+'")',50);else _dmcn(parentID);};function _dmcn(parentID){window.status='Menu data loading...';if(!menuItems)return;clearInterval(dlt);dlt=null;window.status='';_dvA.style.display='none';var iv=_dmvi(parentID),dm=_dm[iv.mi],ce=dm.m[iv.ci];for(var i=0;(i<menuItems.ln()&&typeof(menuItems[i])!=_un);i++){if(!i)_dmsp(dm,ce,iv,menuItems[i][7]);dcm.iy=dcm.ce.i.ln();_dmip(dm,dcm.ce,dcm.iy,menuItems[i],statusString);};iv.dcd=dcm.ce.id;_dmzh(iv.dcd,parentID);};
