window.EJS_player = "#game"
window.EJS_gameName = "Super Mario Bros."
window.EJS_biosUrl = ""
// window.EJS_gameUrl = "https://cdn.jsdelivr.net/gh/omssp/nesscraper/local-roms/Mario.nes.txt"
window.EJS_core = "nes"
window.EJS_pathtodata = "emu/data/"
window.EJS_oldCores = true;
window.EJS_startOnLoaded = true;

window.EJS_Settings = {
    volume: 1.0,
}

window.mute_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.mute.click();
}


window.play_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.play[0].click();
}


window.reset_game = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.restart.click();
}


window.save_state = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.saveState.click();
}


window.load_state = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.loadState.click();
}


window.fulls_toggle = () => {
    if (navigator.vibrate) navigator.vibrate([50]);
    window.EJS_emulator.elements.buttons.fullscreen.click();
}

window.save_local = () => {
    window.EJS_emulator.config.onsavestate = () => { };
    window.EJS_emulator.elements.buttons.saveState.click();
    if (window.saver) {
        setCookie(window.saver.store_slug, Date.now());
        setTimeout(() => {
            window.EJS_emulator.config.onsavestate = (e) => window.saver.saveToOnline(e);
        }, 1);
    }
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
        fontSize: 10,
        left: 50,
        top: -70,
        block: true,
        input_value: 122,
        on_touchstart: "window.save_state()"
    },
    {
        type: "button",
        text: "Load",
        id: "load",
        location: "right",
        left: 30,
        top: -65,
        fontSize: 10,
        block: true,
        input_value: 25,
        input_new_cores: 123,
        on_touchstart: "window.load_state()"
    }
];
window.EJS_Buttons = {
    playPause: true,
    restart: true,
    mute: true,
    settings: false,
    fullscreen: true,
    saveState: true,
    loadState: true,
    screenRecord: true,
    gamepad: true,
    cheat: true,
    volume: true,
    quickSave: true,
    quickLoad: true,
    screenshot: true,
    cacheManager: false
}
window.EJS_defaultOptions = {
    'save-state-slot': 4,
    'save-state-location': 'keep in browser',
    'fceumm_sndquality': 'Very High'
}
window.EJS_Settings = {
    defaultControllers: {
        "0": {
            "0": {
                "value": "75",
                "value2": "1"
            },
            "1": {
                "value": "80",
                "value2": "3"
            },
            "2": {
                "value": "71",
                "value2": "8"
            },
            "3": {
                "value": "72",
                "value2": "9"
            },
            "4": {
                "value": "87",
                "value2": "12"
            },
            "5": {
                "value": "83",
                "value2": "13"
            },
            "6": {
                "value": "65",
                "value2": "14"
            },
            "7": {
                "value": "68",
                "value2": "15"
            },
            "8": {
                "value": "76",
                "value2": "0"
            },
            "9": {
                "value": "79",
                "value2": "2"
            },
            "10": {
                "value": "69",
                "value2": "4"
            },
            "11": {
                "value": "73",
                "value2": "5"
            },
            "12": {
                "value": "82",
                "value2": "6"
            },
            "13": {
                "value": "85",
                "value2": "7"
            },
            "14": {},
            "15": {},
            "16": {},
            "17": {},
            "18": {},
            "19": {},
            "20": {},
            "21": {},
            "22": {},
            "23": {},
            "24": {},
            "25": {},
            "26": {}
        },
        "1": {},
        "2": {},
        "3": {}
    }
}


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