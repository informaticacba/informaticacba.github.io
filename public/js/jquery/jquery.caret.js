(function($) {
  $.fn.caret = function(pos) {
    var target = this[0];
    if (arguments.length == 0) { //get
      if (target.selectionStart) { //DOM
        var pos = target.selectionStart;
        return pos > 0 ? pos : 0;
      }
      else if (target.createTextRange) { //IE
		target.focus();
		
		var range = null;
		var isIE8 = window.getSelection;
		if(isIE8){ //Si es IE menor al 9
			range =  window.getSelection();
		}else{ if (document.selection) {
	           range = document.selection.createRange();
	           }
		}
		
		if (range == null)
			return '0';
		var re = target.createTextRange();
		var rc = re.duplicate();
		
		if (range.rangeCount) {
			if(isIE8){
				re.moveToBookmark(range.getBookmark());
			}else{
				re.moveToBookmark(range.getRangeAt(0));
			}
        }
		rc.setEndPoint('EndToStart', re);
		return rc.text.length;
      }
      else return 0;
    } //set
    if (target.setSelectionRange) //DOM
      target.setSelectionRange(pos, pos);
    else if (target.createTextRange) { //IE
      var range = target.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  }
})(jQuery)