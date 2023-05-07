const mappings = [{
    "id": "Wireless Controller (STANDARD GAMEPAD Vendor: 054c Product: 05c4)",
    "friendlyName": "PS4",
    "browser": "Chrome",
    "os": "Windows",
    "buttons": {
        "button_1": 0,
        "button_2": 1,
        "button_3": 2,
        "button_4": 3,
        "shoulder_top_left": 4,
        "shoulder_top_right": 5,
        "shoulder_bottom_left": 6,
        "shoulder_bottom_right": 7,
        "select": 8,
        "start": 9,
        "stick_button_left": 10,
        "stick_button_right": 11,
        "d_pad_up": 12,
        "d_pad_down": 13,
        "d_pad_left": 14,
        "d_pad_right": 15,
        "vendor": 16
    }
}, {
    "id": "Generic   USB  Joystick   (Vendor: 0079 Product: 0006)",
    "friendlyName": "Generic",
    "browser": "Chrome",
    "os": "Windows",
    "buttons": {
        "button_1": 2,
        "button_2": 1,
        "button_3": 0,
        "button_4": 3,
        "shoulder_top_left": 4,
        "shoulder_top_right": 5,
        "shoulder_bottom_left": 6,
        "shoulder_bottom_right": 7,
        "select": 8,
        "start": 9,
        "stick_button_left": 10,
        "stick_button_right": 11,
        "d_pad_up": 12,
        "d_pad_down": 13,
        "d_pad_left": 14,
        "d_pad_right": 15,
        "vendor": 16
    }
}];

function longestCommonSubsequence(a, b) {
    const matrix = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
    for (let i = 1; i < a.length + 1; i++) {
        for (let j = 1; j < b.length + 1; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = 1 + matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }
    return matrix[a.length][b.length];
}

const _requestAnimation = new Set('_requestAnimation');
const _previousGamepadsState = new Set('_previousGamepadsState');

const AXES_THRESHOLD = 0.3;

class Gamepad {
    [_requestAnimation] = null;

    [_previousGamepadsState] = null;

    listeners = [];

    boolAxesMode = false;

    constructor(enableBoolAxes = false) {
        this.boolAxesMode = enableBoolAxes;
    }

    start = () => {
        this._requestAnimation = window.requestAnimationFrame(this.tick);
    };

    stop = () => {
        window.cancelAnimationFrame(this._requestAnimation);
    };

    on = (type, id, callback) => {
        this.listeners[this.listeners.length] = { type, id, callback };
    };

    off = (type, id) => {
        this.listeners[this.listeners.length].splice(
            this.listeners.findIndex(
                listener => listener.type === type && listener.id === id
            ),
            1
        );
    };

    tick = () => {
        const gamepads = [].slice
            .call(window.navigator.getGamepads())
            .filter(gamepad => gamepad)
            .map(({ id, index, buttons, axes }) => {

                let mapp = mappings.filter(o => longestCommonSubsequence(o.id, id) > 50)
                const mapping = mapp.length ? mapp[0] : mappings[0]

                if (!mapping) {
                    throw new Error(`${id} not supported by gamepad.js`);
                }

                return {
                    id,
                    index,
                    buttons: Object.keys(mapping.buttons).reduce((all, key) => {
                        return {
                            ...all,
                            [key]: buttons[mapping.buttons[key]]
                        };
                    }, {}),
                    axes,
                    mapping,
                    bool_axes: (this.boolAxesMode) ? axes.map(o => Math.round(o)) : null
                };
            });

        gamepads.map(gamepad => {
            const previousGamepadState = this._previousGamepadsState.find(
                ({ index }) => gamepad.index === index
            );

            this.listeners
                .filter(({ id }) => gamepad.buttons[id])
                .filter(({ type, id }) => {
                    switch (type) {
                        case 'pressed':
                            return (
                                gamepad.buttons[id].pressed &&
                                (!previousGamepadState ||
                                    !previousGamepadState.buttons[id].pressed)
                            );
                        case 'held':
                            return gamepad.buttons[id].pressed;
                        case 'released':
                            return (!gamepad.buttons[id].pressed &&
                                previousGamepadState &&
                                previousGamepadState.buttons[id].pressed
                            );

                        default:
                            return false;
                    }
                })
                .map(({ callback, id }) =>
                    callback({
                        id,
                        gamepadIndex: gamepad.index,
                        value: gamepad.buttons[id].value
                    })
                );


            if (this.boolAxesMode) {

                this.listeners
                    .filter(({ type, id }) => {
                        if (!(id % 2 == 0)) {
                            return false
                        }
                        switch (type) {

                            case '8way-axes-changed':
                                return (
                                    (!gamepad.bool_axes[id] && previousGamepadState && previousGamepadState.bool_axes[id]) ||
                                    (gamepad.bool_axes[id] && (!previousGamepadState || !previousGamepadState.bool_axes[id]))
                                ) || (
                                        (!gamepad.bool_axes[id + 1] && previousGamepadState && previousGamepadState.bool_axes[id + 1]) ||
                                        (gamepad.bool_axes[id + 1] && (!previousGamepadState || !previousGamepadState.bool_axes[id + 1]))
                                    );
                            case '8way-axes-held':
                                return (
                                    gamepad.bool_axes[id] &&
                                    (!previousGamepadState ||
                                        !previousGamepadState.bool_axes[id])
                                ) || (
                                        gamepad.bool_axes[id + 1] &&
                                        (!previousGamepadState ||
                                            !previousGamepadState.bool_axes[id + 1])
                                    );
                            case '8way-axes-released':
                                return (!gamepad.bool_axes[id] &&
                                    previousGamepadState &&
                                    previousGamepadState.bool_axes[id]
                                ) || (!gamepad.bool_axes[id + 1] &&
                                    previousGamepadState &&
                                    previousGamepadState.bool_axes[id + 1]
                                    );
                            default:
                                return false;
                        }
                    })
                    .map(({ callback, id }) =>
                        callback({
                            id,
                            gamepadIndex: gamepad.index,
                            value: gamepad.bool_axes[id],
                            next_value: (id % 2 == 0) ? gamepad.bool_axes[id + 1] : null
                        }));
            }
        });

        gamepads.map(gamepad => {
            this.listeners
                .filter(({ type }) => type === 'axes')
                .filter(({ id }) => Math.abs(gamepad.axes[id]) > AXES_THRESHOLD)
                .map(({ callback, id }) =>
                    callback({
                        id,
                        gamepadIndex: gamepad.index,
                        value: gamepad.axes[id]
                    }));
        });

        gamepads.map(gamepad => {
            const previousGamepadState = this._previousGamepadsState.find(
                ({ index }) => gamepad.index === index
            );

        });

        this._previousGamepadsState = gamepads;

        this._requestAnimation = window.requestAnimationFrame(this.tick);
    };
}