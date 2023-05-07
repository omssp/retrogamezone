

// Keyboard events are bound in the UI
JSNES.Keyboard = function () {
    var i;

    this.keys = {
        KEY_A: 0,
        KEY_B: 1,
        KEY_SELECT: 2,
        KEY_START: 3,
        KEY_UP: 4,
        KEY_DOWN: 5,
        KEY_LEFT: 6,
        KEY_RIGHT: 7
    };

    this.state1 = new Array(8);
    for (i = 0; i < this.state1.length; i++) {
        this.state1[i] = 0x40;
    }
    this.state2 = new Array(8);
    for (i = 0; i < this.state2.length; i++) {
        this.state2[i] = 0x40;
    }
};

JSNES.Keyboard.prototype = {
    setKey: function (key, value) {
        let pSwap = parent.keybPrimaryPlayer.playersSwapped;
        switch (key) {
            case 76: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_A] = value; break;      // L
            case 75: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_B] = value; break;      // K
            case 71: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_SELECT] = value; break; // G
            case 72: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_START] = value; break;  // H
            case 87: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_UP] = value; break;     // W
            case 83: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_DOWN] = value; break;   // S
            case 65: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_LEFT] = value; break;   // A
            case 68: this[`state${pSwap ? '2' : '1'}`][this.keys.KEY_RIGHT] = value; break;  // D

            case 17: this.state1[this.keys.KEY_SELECT] = value; break; // Right Ctrl
            case 13: this.state1[this.keys.KEY_START] = value; break;  // Enter

            case 110: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_A] = value; break;     // NUM - .
            case 96: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_B] = value; break;      // NUM - 0
            case 97: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_SELECT] = value; break; // NUM - 1
            case 98: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_START] = value; break;  // NUM - 2
            case 38: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_UP] = value; break;     // Up
            case 40: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_DOWN] = value; break;   // Down
            case 37: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_LEFT] = value; break;   // Left
            case 39: this[`state${pSwap ? '1' : '2'}`][this.keys.KEY_RIGHT] = value; break;  // Right
            default: return true;
        }
        return false; // preventDefault
    },

    keyDown: function (evt) {
        if (!this.setKey(evt.keyCode, 0x41) && evt.preventDefault) {
            evt.preventDefault();
        }
    },

    keyUp: function (evt) {
        if (!this.setKey(evt.keyCode, 0x40) && evt.preventDefault) {
            evt.preventDefault();
        }
    },

    keyPress: function (evt) {
        evt.preventDefault();
    }
};
