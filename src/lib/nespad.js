const gamepad = new Gamepad(true);

const nespad_mapping = {
    "button_1": "KEY_B",
    "button_2": "KEY_A",
    "button_3": "KEY_A",
    "button_4": "KEY_B",
    "select": "KEY_SELECT",
    "start": "KEY_START",
    "d_pad_up": "KEY_UP",
    "d_pad_down": "KEY_DOWN",
    "d_pad_left": "KEY_LEFT",
    "d_pad_right": "KEY_RIGHT",
};

function numap(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function nespad_handler({ id, gamepadIndex, value }) {
    let playerNo = gamepadIndex + 1;
    if (!parent.keybPrimaryPlayer.playersSwapped) {
        playerNo = playerNo ^ 3;
    }
    nes.keyboard[`state${playerNo}`][nes.keyboard.keys[nespad_mapping[id]]] = value + 0x40;
    console.log(`${id} was pressed by player ${playerNo} with a value of ${value}!`);
}

for (const [key, value] of Object.entries(nespad_mapping)) {
    gamepad.on('pressed', key, nespad_handler);
    gamepad.on('released', key, nespad_handler);
}

gamepad.on("pressed", "shoulder_top_left", ({ id, gamepadIndex, value }) => {
    $("#ppbutton").click();
});

gamepad.on("pressed", "shoulder_top_right", ({ id, gamepadIndex, value }) => {
    $("#powbutton").click();
});

gamepad.on("pressed", "shoulder_bottom_left", ({ id, gamepadIndex, value }) => {
    $("#mubutton").click();
});

gamepad.on("pressed", "shoulder_bottom_right", ({ id, gamepadIndex, value }) => {
    $('#go-button').click();

});

gamepad.on("pressed", "stick_button_left", ({ id, gamepadIndex, value }) => {
    let elem = parent.document.getElementById('previousGame')
    if (elem)
        elem.click();
});

gamepad.on("pressed", "stick_button_right", ({ id, gamepadIndex, value }) => {
    let elem = parent.document.getElementById('nextGame')
    if (elem)
        elem.click();
});

gamepad.on("pressed", "vendor", ({ id, gamepadIndex, value }) => {
    let elem = parent.document.getElementById('homeButton')
    if (elem)
        elem.click();
});

gamepad.on('8way-axes-changed', 0, ({ id, gamepadIndex, value, next_value }) => {
    let playerNo = gamepadIndex + 1;
    if (!parent.keybPrimaryPlayer.playersSwapped) {
        playerNo = playerNo ^ 3;
    }

    nes.keyboard[`state${playerNo}`][(value > 0) ? nes.keyboard.keys.KEY_RIGHT : nes.keyboard.keys.KEY_LEFT] = Math.abs(value) + 0x40;
    if (value == 0) {
        nes.keyboard[`state${playerNo}`][nes.keyboard.keys.KEY_RIGHT] = Math.abs(value) + 0x40;
    }

    nes.keyboard[`state${playerNo}`][(next_value > 0) ? nes.keyboard.keys.KEY_DOWN : nes.keyboard.keys.KEY_UP] = Math.abs(next_value) + 0x40;
    if (next_value == 0) {
        nes.keyboard[`state${playerNo}`][nes.keyboard.keys.KEY_DOWN] = Math.abs(next_value) + 0x40;
    }

    console.log(`${id} was changed by player ${playerNo} with a value of ${value},${next_value}!`);
});

gamepad.on('8way-axes-changed', 2, ({ id, gamepadIndex, value, next_value }) => {
    let playerNo = gamepadIndex + 1;
    if (!parent.keybPrimaryPlayer.playersSwapped) {
        playerNo = playerNo ^ 3;
    }
    nes.keyboard[`state${playerNo}`][nes.keyboard.keys.KEY_B] = Math.abs(next_value) + 0x40;
    nes.keyboard[`state${playerNo}`][nes.keyboard.keys.KEY_A] = Math.abs(value) + 0x40;

    console.log(`${id} was changed by player ${playerNo} with a value of ${value},${next_value}!`);
});

gamepad.start();