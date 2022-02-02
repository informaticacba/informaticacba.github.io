(function($) {

//keyboard
function Keyboard(board) {
  this.board = board;

  this.keyIDs = {};

  this.callback = function(key) {alert(key)};

  this.modifiers = {
    shift: false,
    altGr: false,
    capsLock: false
  };
  
  this.keys = [];
}

//keys
function Key(keyObj) {
  $.extend(this, keyObj);
  this.sLabel = this.sLabel || this.label.toUpperCase();
  this.altLabel = this.altLabel || this.label;
  this.sAltLabel = this.sAltLabel || this.altLabel.toUpperCase();
  this.func = this.func || "typelabel";
  this.sFunc = this.sFunc || this.func;
  this.isLetter = this.label.toUpperCase() != this.label.toLowerCase();
  this.altIsLetter = this.altLabel.toUpperCase() != this.altLabel.toLowerCase();
}

Key.prototype.draw = function(keyboard) {
	// INICIO Agregado Link
	var key = this.key = $("<button id='" + this.id + "'>" + this.label + "</button>");
	//var key = this.key = $("<input type='button' id='" + this.id + "' value='" + this.label + "'/>");
	// FIN Agregado Link
  this.key.click(function() {keyboard.keyIDs[this.id].activate(keyboard, key)});
  return this.key;
};

Key.prototype.modify = function(modifiers) {
  var modsVal = (modifiers.shift?1:0) + (modifiers.altGr?2:0) + (modifiers.capsLock?4:0);
  var text;
  switch (modsVal) {
  case 0:
    text = this.label;
    break;
  case 1:
    text = this.sLabel;
    break;
  case 2:
    text = this.altLabel;
    break;
  case 3:
    text = this.sAltLabel;
    break;
  case 4:
    text = this.isLetter ? this.sLabel : this.label;
    break;
  case 5:
    text = this.isLetter ? this.label : this.sLabel;
    break;
  case 6:
    text = this.isLetter ? this.sAltLabel : text = this.altLabel;
    break;
  case 7:
    text = this.isLetter ? this.altLabel : text = this.sAltLabel;
    break;
  }
  this.key.text(text);
};

Key.prototype.activate = function(keyboard, key) {
  if (keyboard.modifiers.shift)
    handlers[this.sFunc](keyboard, key);
  else
    handlers[this.func](keyboard, key);
};

//key handlers
function modify(keyboard) {
  for (var id in keyboard.keyIDs)
    keyboard.keyIDs[id].modify(keyboard.modifiers);
}

var handlers = {
  space: function(keyboard) {
    keyboard.callback(' ');
  },
  
  tab: function(keyboard) {
    keyboard.callback('\t');
  },

  backspace: function(keyboard) {
    keyboard.callback('\b');
  },
  
  left: function(keyboard) {
    keyboard.callback('\003');
  },

  right: function(keyboard) {
    keyboard.callback('\004');
  },

  enter: function(keyboard) {
    keyboard.callback('\n');
  },
  
  shift: function(keyboard) {
    keyboard.modifiers.shift = !keyboard.modifiers.shift;
    keyboard.board.toggleClass("shift");
    modify(keyboard);
    return keyboard.modifiers.shift;
  },

  altgr: function(keyboard) {
    keyboard.modifiers.altGr = !keyboard.modifiers.altGr;
    keyboard.board.toggleClass("altGr");
    modify(keyboard);
    return keyboard.modifiers.altGr;
  },

  capslock: function(keyboard) {
    keyboard.modifiers.capsLock = !keyboard.modifiers.capsLock;
    keyboard.board.toggleClass("capsLock");
    modify(keyboard);
    return keyboard.modifiers.capsLock;
  },

  typelabel: function(keyboard, key) {
	// INICIO Agregado Link
	keyboard.callback(key.text());
    //keyboard.callback(key.attr('value'));
    // FIN Agregado Link
    if (keyboard.modifiers.shift)
      this.shift(keyboard);
    if (keyboard.modifiers.altGr)
      this.altgr(keyboard);
  }
}

//create keyboard
$.fn.loadLayout = function(layoutURL, callback) {
  var keyboard = new Keyboard($(this[0]));
  callback = callback || false;
  $.getJSON(layoutURL, function(layout) {
    addKeys(layout, keyboard);
    draw(keyboard);
  });
  if (callback)
    keyboard.callback = callback;
  return this;
};

//create keyboard by json string (add to link)
$.fn.loadLayoutNoAjax = function(stringJson, callback) {
  var keyboard = new Keyboard($(this[0]));
  callback = callback || false;
  addKeys(stringJson, keyboard);
  draw(keyboard);
  if (callback)
    keyboard.callback = callback;
  return this;
};

function addKeys(layout, keyboard) {
  for (var i = 0; i < layout.length; i++) {
    var row = [];
    for (var j = 0; j < layout[i].length; j++) {
      row[j] = new Key(layout[i][j]);
      keyboard.keyIDs[row[j].id] = row[j];
    }
    keyboard.keys[i] = row;
  }
};

function draw(keyboard) {
  keyboard.board.empty();
  keyboard.board.removeClass("shift");
  keyboard.board.removeClass("altGr");
  keyboard.board.removeClass("capsLock");
  for (var i = 0; i < keyboard.keys.length; i++) {
    var row = $("<div></div>");
    for (var j = 0; j < keyboard.keys[i].length; j++)
      row.append(keyboard.keys[i][j].draw(keyboard));
    keyboard.board.append(row);
  }
};
})(jQuery)