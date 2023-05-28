const gamepad = new Gamepad(true);

const nespad_mapping = {
    "button_1": gridNav.go,
    "button_2": gridNav.unselect,
    "button_3": () => {
        $(".copyright > a")[0].click();
    },
    "button_4": () => {
        $("#footer > a").click();
    },
    "select": gridNav.unselect,
    "start": gridNav.go,
    "d_pad_up": gridNav.up,
    "d_pad_down": gridNav.down,
    "d_pad_left": gridNav.left,
    "d_pad_right": gridNav.right,
    "shoulder_top_left": gridNav.leftmost,
    "shoulder_top_right": gridNav.rightmost,
    "shoulder_bottom_left": () => {
        $('#search_bar').focus().select()[0].scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    },
    "shoulder_bottom_right": () => {
        if (IsFullScreenCurrently()) {
            GoOutFullscreen();
        } else {
            GoInFullscreen(document.documentElement);
        }
    }
};


for (const [key, value] of Object.entries(nespad_mapping)) {
    gamepad.on('pressed', key, value);
}

gamepad.on('8way-axes-changed', 0, ({ id, gamepadIndex, value, next_value }) => {
    let playerNo = gamepadIndex + 1;

    if (value < 0) {
        gridNav.left();
    } else if (value > 0) {
        gridNav.right();
    } else if (next_value < 0) {
        gridNav.up();
    } else if (next_value > 0) {
        gridNav.down();
    }

    // console.log(`${id} was changed by player ${playerNo} with a value of ${value},${next_value}!`);
});

gamepad.on('8way-axes-changed', 2, ({ id, gamepadIndex, value, next_value }) => {
    let playerNo = gamepadIndex + 1;

    if (value < 0) {
        $(".copyright > a")[0].click();
    } else if (value > 0) {
        gridNav.unselect();
    } else if (next_value < 0) {
        $("#footer > a").click();
    } else if (next_value > 0) {
        gridNav.go();
    }

    // console.log(`${id} was changed by player ${playerNo} with a value of ${value},${next_value}!`);
});

gamepad.start();