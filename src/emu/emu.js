window.EJS_player = "#game"
window.EJS_gameName = "Super Mario Bros."
window.EJS_biosUrl = ""
// window.EJS_gameUrl = "https://cdn.jsdelivr.net/gh/omssp/nesscraper/local-roms/Mario.nes.txt"
window.EJS_core = "nes"
window.EJS_pathtodata = "emu/data/"
window.EJS_oldCores = true;
window.EJS_startOnLoaded = true;
window.EJS_volume = 1;
// window.EJS_threads = true;
window.EJS_backgroundImage = 'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/nesicon.png'
// window.EJS_DEBUG_XX = true

const TOTAL_SLOTS = 5;
const ROLLI_SLOTS = 2;

$.Finger = {
    pressDuration: 1000,
    doubleTapInterval: 300,
    flickDuration: 150,
    motionThreshold: 5
};

window.EJS_onLoadSave = async () => {
    const file = await window.EJS_emulator.selectFile();
    const sav = new Uint8Array(await file.arrayBuffer());
    load_state(sav)
}

window.EJS_onSaveSave = async () => {
    const file = window.save_local();
    const blob = new Blob([file]);
    savUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = savUrl;
    a.download = window.EJS_gameName + `-${old_slot}.state`;
    a.click();
    a.remove();
}

window.mute_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);

    if(window.EJS_emulator.muted) {
        window.cloud_message('LOUD');
        window.EJS_emulator.setVolume(1);
        window.b_mute.html(`<span class="fa fa-volume-up"></span>`)
    } else {
        window.cloud_message('MUTE');
        window.EJS_emulator.setVolume(0);
        window.b_mute.html(`<span class="fa fa-volume-off"></span>`)
    }
}


window.play_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.togglePlaying();
    if (window.EJS_emulator.paused) {
        window.cloud_message('PAUSED');
        window.b_pp.html(`<span class="fa fa-play"></span>`)
    } else {
        window.cloud_message('PLAYING');
        window.b_pp.html(`<span class="fa fa-pause"></span>`)
    }
}


window.reset_game = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.gameManager.restart();
    window.cloud_message('RESET');
}


window.save_state = () => {
    if (navigator.vibrate) navigator.vibrate([50]);

    if (old_slot < ROLLI_SLOTS)
        window.change_slot(++old_slot % ROLLI_SLOTS)
    
    const state = window.save_local();
    if (window.saver) {
        window.saver.saveToOnline({ state });
    }
}

window.show_prompt = () => {
    if (old_input) window.save_name.val(old_input);
    window.myModalAlternative.show();
}

window.init_cloud = () => {
    // let new_input = prompt('Choose your cloud username', old_input)
    let new_input = window.save_name.val();

    if (new_input && !/^(?=[a-zA-Z0-9\-_]{1,70}$)(?![_\-])(?!.*[_\-]{2})([a-zA-Z0-9\-_]*[a-zA-Z0-9])/.test(new_input)) {
        window.save_name.effect("shake");
        return false;
        // new_input = prompt('Choose your cloud username\n*spaces or special characters are not allowed\n*only alphabets followed by numbers or hyphen(-) are allowed', new_input)
    } else {
        window.save_name.blur();
        window.myModalAlternative.hide();
    }

    if (new_input) {
        if (new_input != old_input) {
            old_input = new_input;
            setCookie('save_name', old_input, 365)
            window.saver = new SaveHandler(old_input);
            window.saver.set_slot(old_slot);
            setCookie(`${window.saver.game_slug}-save_slot`, old_slot, 365)
            window.cloud_message('CLOUD : User changed')
        }
    } else {
        window.saver = null;
        old_input = '';
        setCookie('save_name', old_input, 365)
        window.cloud_message('CLOUD : User removed')
    }
    return false;
}

window.load_cloud = () => {
    if (window.saver) {
        window.saver.fetchStateAndLoad();
    }
}

window.cloud_message = (message) => {
    message = `\n${message}\nSLOT : ${old_slot}`
    message += old_input ? `\nUSER : ${old_input}` : ''
    window.EJS_emulator.displayMessage(message)
}

window.change_slot = (num) => {
    if (Number.isInteger(num) && num >= 0 && num < TOTAL_SLOTS)
        old_slot = num;
    else
        old_slot = old_slot >= 0 ? ++old_slot % TOTAL_SLOTS : 0;
    if (window.saver) {
        window.saver.set_slot(old_slot);
        window.cloud_message('CLOUD : Slot changed')
        setCookie(`${window.saver.game_slug}-save_slot`, old_slot, 365)
    } else {
        window.cloud_message('LOCAL : Slot changed')
    }
}

window.load_state = (state_uint8arr) => {
    if (navigator.vibrate) navigator.vibrate([50]);

    if (state_uint8arr) {
        window.EJS_emulator.gameManager.loadState(state_uint8arr);
        window.cloud_message('FILE : Load successful')
    } else {
        window.EJS_emulator.storage.states.get(window.EJS_emulator.getBaseFileName() + `-${old_slot}.state`).then(e => {
            if (e) {
                window.EJS_emulator.gameManager.loadState(e);
                // window.cloud_message('LOCAL : Load successful')
            }
        })
    }
}


window.fulls_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.bottomBar.fullscreen[0].click();
}

window.save_local = () => {
    const state = window.EJS_emulator.gameManager.getState();
    window.EJS_emulator.storage.states.put(window.EJS_emulator.getBaseFileName() + `-${old_slot}.state`, state);
    if (window.saver)
        setCookie(window.saver.store_slug, Date.now());
    return state;
}

window.EJS_VirtualGamepadSettings = [
    {
        type: "button",
        text: "A",
        id: "a",
        location: "right",
        fontSize: 40,
        left: 45,
        top: 70,
        bold: true,
        input_value: 8
    },
    {
        type: "button",
        text: "B",
        id: "b",
        location: "right",
        left: -25,
        top: 140,
        fontSize: 40,
        bold: true,
        input_value: 0
    },
    {
        type: "dpad",
        location: "left",
        left: "65%",
        top: "91%",
        joystickInput: false,
        inputValues: [4, 5, 6, 7]
    },
    //Note- the dpad and the zone will overlap in this example, this is just to show what it should look like.
    // {
    //     type: "dpad",
    //     location: "left",
    //     left: "50%",
    //     right: "50%",
    //     joystickInput: false,
    //     inputValues: [4, 5, 6, 7]
    // },
    {
        type: "button",
        text: "Start",
        id: "start",
        location: "right",
        left: 0,
        top: 5,
        fontSize: 15,
        block: true,
        input_value: 3
    },
    {
        type: "button",
        text: "Select",
        id: "select",
        location: "left",
        left: 80,
        top: 0,
        fontSize: 15,
        block: true,
        input_value: 2
    },
    // {
    //     type: "button",
    //     text: "State",
    //     id: "state",
    //     location: "left",
    //     left: 50,
    //     top: -100,
    //     fontSize: 10,
    //     block: true,
    //     input_value: 26
    // },
    {
        type: "button",
        text: "Save",
        id: "save",
        location: "left",
        fontSize: 12,
        left: 50,
        top: -70,
        block: true,
        input_value: 122,
    },
    {
        type: "button",
        text: "Slot",
        id: "slot",
        location: "left",
        fontSize: 15,
        left: 20,
        top: -120,
        block: true,
        input_value: 124,
    },
    {
        type: "button",
        text: "Load",
        id: "load",
        location: "right",
        left: 30,
        top: -65,
        fontSize: 12,
        block: true,
        input_value: 123
    },
    {
        type: "button",
        text: "PP",
        id: "pp",
        location: "right",
        left: 60,
        top: -115,
        fontSize: 15,
        block: true,
        input_value: 125
    },
    {
        type: "button",
        text: "Mu",
        id: "mute",
        location: "right",
        left: 0,
        top: -115,
        fontSize: 15,
        block: true,
        input_value: 125
    },
    {
        type: "button",
        text: "Re",
        id: "rewi",
        location: "left",
        fontSize: 15,
        left: 80,
        top: -120,
        block: true,
        input_value: 28,
    },
];

//TODO fix export import save state & add cloud sync on import
window.EJS_Buttons = {
    playPause: true,
    restart: true,
    mute: true,
    settings: false,
    fullscreen: true,
    saveState: false,
    loadState: false,
    screenRecord: true,
    gamepad: true,
    cheat: true,
    saveSavFiles: true,
    loadSavFiles: true,
    volume: true,
    quickSave: false,
    quickLoad: false,
    screenshot: true,
    cacheManager: false
}
window.EJS_defaultOptions = {
    'save-state-slot': 1,
    'save-state-location': 'browser',
    'fceumm_sndquality': 'Very High',
    'fceumm_aspect': "4:3",
    'rewindEnabled': "enabled",
}

EJS_defaultControls = {
    0: {
        0: {
            'value': 'k',
            'value2': 'BUTTON_2'
        },
        1: {
            'value': 's',
            'value2': 'BUTTON_4'
        },
        2: {
            'value': 'g',
            'value2': 'SELECT'
        },
        3: {
            'value': 'h',
            'value2': 'START'
        },
        4: {
            'value': 'w',
            'value2': 'DPAD_UP'
        },
        5: {
            'value': 's',
            'value2': 'DPAD_DOWN'
        },
        6: {
            'value': 'a',
            'value2': 'DPAD_LEFT'
        },
        7: {
            'value': 'd',
            'value2': 'DPAD_RIGHT'
        },
        8: {
            'value': 'l',
            'value2': 'BUTTON_1'
        },
        9: {
            'value': '',
            'value2': 'BUTTON_3'
        },
        10: {
            'value': 'i',
            'value2': 'LEFT_TOP_SHOULDER'
        },
        11: {
            'value': 'p',
            'value2': 'RIGHT_TOP_SHOULDER'
        },
        12: {
            'value': '',
            'value2': 'LEFT_BOTTOM_SHOULDER'
        },
        13: {
            'value': '',
            'value2': 'RIGHT_BOTTOM_SHOULDER'
        },
        14: {
            'value': '',
            'value2': 'LEFT_STICK',
        },
        15: {
            'value': '',
            'value2': 'RIGHT_STICK',
        },
        16: {
            'value': '',
            'value2': 'LEFT_STICK_X:+1'
        },
        17: {
            'value': '',
            'value2': 'LEFT_STICK_X:-1'
        },
        18: {
            'value': '',
            'value2': 'LEFT_STICK_Y:+1'
        },
        19: {
            'value': '',
            'value2': 'LEFT_STICK_Y:-1'
        },
        20: {
            'value': '',
            'value2': 'RIGHT_STICK_X:+1'
        },
        21: {
            'value': '',
            'value2': 'RIGHT_STICK_X:-1'
        },
        22: {
            'value': '',
            'value2': 'RIGHT_STICK_Y:+1'
        },
        23: {
            'value': '',
            'value2': 'RIGHT_STICK_Y:-1'
        },
        24: {
            'value': '1'
        },
        25: {
            'value': '2'
        },
        26: {
            'value': '3'
        },
        27: {
            'value': 'add'
        },
        28: {
            'value': 't'
        },
        29: {
            'value': 'subtract'
        },
    },
    1: {},
    2: {},
    3: {}
}

// window.EJS_Settings = {
//     defaultControllers: {
//         "0": {
//             "0": {
//                 "value": "75",
//                 "value2": "1"
//             },
//             "1": {
//                 "value": "80",
//                 "value2": "3"
//             },
//             "2": {
//                 "value": "71",
//                 "value2": "8"
//             },
//             "3": {
//                 "value": "72",
//                 "value2": "9"
//             },
//             "4": {
//                 "value": "87",
//                 "value2": "12"
//             },
//             "5": {
//                 "value": "83",
//                 "value2": "13"
//             },
//             "6": {
//                 "value": "65",
//                 "value2": "14"
//             },
//             "7": {
//                 "value": "68",
//                 "value2": "15"
//             },
//             "8": {
//                 "value": "76",
//                 "value2": "0"
//             },
//             "9": {
//                 "value": "79",
//                 "value2": "2"
//             },
//             "10": {
//                 "value": "69",
//                 "value2": "4"
//             },
//             "11": {
//                 "value": "73",
//                 "value2": "5"
//             },
//             "12": {
//                 "value": "82",
//                 "value2": "6"
//             },
//             "13": {
//                 "value": "85",
//                 "value2": "7"
//             },
//             "14": {},
//             "15": {},
//             "16": {},
//             "17": {},
//             "18": {},
//             "19": {},
//             "20": {},
//             "21": {},
//             "22": {},
//             "23": {},
//             "24": {},
//             "25": {},
//             "26": {}
//         },
//         "1": {},
//         "2": {},
//         "3": {}
//     }
// }


// const script = document.createElement("script")
// script.src = "data/loader.js"
// document.body.appendChild(script)

// {
//     0: 'B',
//     1: 'Y',
//     2: 'SELECT',
//     3: 'START',
//     4: 'UP',
//     5: 'DOWN',
//     6: 'LEFT',
//     7: 'RIGHT',
//     8: 'A',
//     9: 'X',
//     10: 'L',
//     11: 'R',
//     12: 'L2',
//     13: 'R2',
//     14: 'L3',
//     15: 'R3',
//     19: 'L STICK UP',
//     18: 'L STICK DOWN',
//     17: 'L STICK LEFT',
//     16: 'L STICK RIGHT',
//     23: 'R STICK UP',
//     22: 'R STICK DOWN',
//     21: 'R STICK LEFT',
//     20: 'R STICK RIGHT',
//     24: 'QUICK SAVE STATE',
//     25: 'QUICK LOAD STATE',
//     26: 'CHANGE STATE SLOT'
// }