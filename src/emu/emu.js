window.EJS_player = "#game"
window.EJS_gameName = "Super Mario Bros."
window.EJS_biosUrl = ""
window.EJS_gameUrl = "https://cdn.jsdelivr.net/gh/omssp/nesscraper/local-roms/Mario.nes.txt"
window.EJS_core = "nes"
window.EJS_pathtodata = "emu/data/"
// window.EJS_startOnLoaded = true;

window.EJS_VirtualGamepadSettings = [
    {
        type: "button",
        text: "A",
        id: "a",
        location: "right",
        fontSize: 50,
        left: 40,
        top: 40,
        bold: true,
        input_value: 8
    },
    {
        type: "button",
        text: "B",
        id: "b",
        location: "right",
        left: 0,
        top: 80,
        fontSize: 50,
        bold: true,
        input_value: 0
    },
    {
        type: "zone",
        location: "left",
        left: "65%",
        top: "70%",
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
    }
];
window.EJS_Buttons = {
    playPause: true,
    restart: true,
    mute: false,
    settings: true,
    fullscreen: true,
    saveState: false,
    loadState: false,
    screenRecord: false,
    gamepad: true,
    cheat: false,
    volume: true,
    quickSave: true,
    quickLoad: true,
    screenshot: false,
    cacheManager: false
}
window.EJS_defaultOptions = {
    'save-state-slot': 4,
    'save-state-location': 'keep in browser',
    'fceumm_sndquality': 'Very High'
}


// const script = document.createElement("script")
// script.src = "data/loader.js"
// document.body.appendChild(script)