import os
import re
import ast
import json
import shutil
import slugify

OUTPUT_DIR = "dist/retrogamezone/"

global_replacements = [
    [
        'src="MaterialColorThief.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/MaterialColorThief.min.js"'
    ],
    [
        'src="lib/dynamicaudio-min.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/dynamicaudio-min.js"'
    ],
    [
        'src="source/ppu.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/ppu.min.js"'
    ],
    [
        'src="source/keyboard.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/keyboard.min.js"'
    ],
    [
        'src="assets/js/main.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/main.min.js"'
    ],
    [
        'src="source/utils.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/utils.min.js"'
    ],
    [
        'src="assets/js/jquery.min.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/jquery.min.js"'
    ],
    [
        'src="source/ui.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/ui.min.js"'
    ],
    [
        'src="lib/nespad.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/nespad.min.js"'
    ],
    [
        'src="lib/fshelper.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/fshelper.min.js"'
    ],
    [
        'src="lib/homepad.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/homepad.min.js"'
    ],
    # [
    #     'src="lib/gamelist.js"',
    #     'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/gamelist.min.js"'
    # ],
    [
        'src="source/mappers.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/mappers.min.js"'
    ],
    # [
    #     'src="source/nes.js"',
    #     'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/nes.min.js"'
    # ],
    [
        'src="source/cpu.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/cpu.min.js"'
    ],
    [
        'src="source/rom.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/rom.min.js"'
    ],
    [
        'src="lib/jquery-3.2.1.min.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/jquery-3.2.1.min.js"'
    ],
    [
        'src="lib/swapplayers.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/swapplayers.min.js"'
    ],
    [
        'src="lib/audioUI.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/audioUI.min.js"'
    ],
    # [
    #     'src="source/omssp.js"',
    #     'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/omssp.min.js"'
    # ],
    [
        'src="lib/cookie.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/cookie.min.js"'
    ],
    [
        'src="source/papu.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/papu.min.js"'
    ],
    [
        'src="assets/js/util.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/util.min.js"'
    ],
    [
        'src="lib/slugify.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/slugify.min.js"'
    ],
    [
        'src="assets/js/skel.min.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/js/skel.min.js"'
    ],
    [
        'src="emu/emu.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/emu.min.js"'
    ],
    [
        'src="emu/save.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/save.min.js"'
    ],
    [
        'src="lib/gamepad.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/gamepad.min.js"'
    ],
    [
        'src="fullS.png"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/fullS.png"'
    ],
    [
        'controls/mute.png',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/mute.png'
    ],
    [
        'controls/unmute.png',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/unmute.png'
    ],
    [
        'controls/power.png',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/power.png'
    ],
    [
        'controls/pause.png',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/pause.png'
    ],
    [
        'controls/play.png',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/play.png'
    ],
    [
        'controls/zoom-in.ico',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/zoom-in.ico'
    ],
    [
        'controls/zoom-out.ico',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/zoom-out.ico'
    ],
    [
        'controls/nespad.ico',
        'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/nespad.ico'
    ],
    [
        'href="assets/css/main.css"',
        'href="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/css/main.css"'
    ]
]

GBAGAMEPAD = """window.EJS_VirtualGamepadSettings=[{type:"button",text:"A",id:"a",location:"right",fontSize:40,left:45,top:70,bold:!0,input_value:8},{type:"button",text:"B",id:"b",location:"right",left:-25,top:140,fontSize:40,bold:!0,input_value:0},{type:"dpad",location:"left",left:"65%",top:"91%",joystickInput:!1,inputValues:[4,5,6,7]},{type:"button",text:"Start",id:"start",location:"right",left:0,top:5,fontSize:15,block:!0,input_value:3},{type:"button",text:"Select",id:"select",location:"left",left:80,top:0,fontSize:15,block:!0,input_value:2},{type:"button",text:"Save",id:"save",location:"left",fontSize:10,left:20,top:-70,block:!0,input_value:122,input_new_cores:122,on_touchstart:"window.save_state()"},{type:"button",text:"Load",id:"load",location:"right",left:60,top:-65,fontSize:10,block:!0,input_value:123,input_new_cores:123,on_touchstart:"window.load_state()"},{type:"button",text:"L",id:"l1",location:"left",fontSize:20,left:110,top:-70,block:!0,input_value:10,input_new_cores:10},{type:"button",text:"R",id:"r1",location:"right",left:-30,top:-65,fontSize:20,block:!0,input_value:11,input_new_cores:11}];"""

CHANGES = [
    {
        "file": "index.html",
        "replacements": global_replacements + [
            ["http://retrogamezone.droppages.com/",
             "https://cdn.jsdelivr.net/gh/omssp/nesscraper/"],
            ['gameid="${gameInfo[3]}"',
             'gameid="${gameInfo[4]}" game-slug="${gameInfo[3]}"'],
            ["game.html?${$(this).attr('gameid')}",
             "${$(this).attr('game-slug')}"],
        ]
    },
    {
        "file": "index2.html",
        "replacements": global_replacements
    },
    {
        "file": "source/omssp.js",
        "replacements": global_replacements
    },
    {
        "file": "source/nes.js",
        "replacements": global_replacements + [
            ["'lib/'", "'https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/'"]
        ]
    },
    {
        "file": "game.html",
        "replacements": global_replacements + [
            #     ['var para = 1;', """var para = "slug";
            # if (para == "slug") {
            #         let slug = document.location.pathname.replace("/", "");
            #         para = gameNameArray.findIndex(o => o[3] == slug);
            #     }"""],
            # ['"game.html?" + preG.toString()', 'gameNameArray[preG][3]'],
            # ['"game.html?" + nexG.toString()', 'gameNameArray[nexG][3]']
            ['var para = 1;\n', ''],
            ['var nexG = (para + 1) % gameNameArray.length;\n', ''],
            ['var preG = para - 1;\n', ''],
            ['if (preG < 0)\n', ''],
            ['preG = gameNameArray.length - 1;\n', ''],
            ['    <script src="lib/gamelist.js"></script>\n', ''],
            ['script.src = "emu/data/loader.js";',
             """script.src = "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/data/loader.min.js";
             window.EJS_pathtodata = "https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/emu/data/";"""],
        ],
    },
]

TOCPY = [change['file'] for change in CHANGES] + [
    'favicon.ico',
    'lib/gamelist.js'
]


shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
# shutil.copytree('src/', OUTPUT_DIR)
os.makedirs(os.path.dirname(f"{OUTPUT_DIR}lib/"), exist_ok=True)
os.makedirs(os.path.dirname(f"{OUTPUT_DIR}source/"), exist_ok=True)
for f in set(TOCPY):
    shutil.copy2(f"src/{f}", f"{OUTPUT_DIR}{f}")

games = []
slugs = []
with open(f"{OUTPUT_DIR}lib/gamelist.js", "r+") as list_js:
    data = list_js.read()
    obj = data[data.find('['): data.rfind(';')]
    obj = re.sub(r"\/\/\s.*", '', obj, re.MULTILINE)
    games = ast.literal_eval(obj)

    with open('src/gbac.json', 'r') as ff:
        gbac_list = json.load(ff)
        games.extend(gbac_list)

    for game in games:
        slug = slugify.slugify(game[0], replacements=[['&', 'and']])
        slug_file = f"{OUTPUT_DIR}{slug}.html"
        repeated = slugs.count(slug_file)
        if repeated > 0:
            slug += f'-{repeated}'
            slug_file = f"{OUTPUT_DIR}{slug}.html"
            print(
                f"WARNING!!! Duplicate found in gamelist.js : {slug} : {game}")
        slugs.append(slug_file)
        game.append(slug)

    # print(len(set(slugs)))
    # print(games)

    list_js.seek(0)
    list_js.truncate()
    list_js.write(
        f"const numSetLen=16; var gameNameArray={json.dumps(games, indent=4)}")

contents = ""
for change in CHANGES:
    with open(f"{OUTPUT_DIR}{change['file']}", "r+") as f:
        contents = f.read()

        for replacement in change['replacements']:
            contents = contents.replace(replacement[0], replacement[1])

        f.seek(0)
        f.truncate()
        f.write(contents)


for index, slug in enumerate(slugs):
    lent = len(games)
    nexG = (index + 1) % lent
    preG = index - 1
    if preG < 0:
        preG = lent - 1

    replacements = [
        ['"game.html?" + nexG.toString()', f'"{games[nexG][3]}"'],
        ['"game.html?" + preG.toString()', f'"{games[preG][3]}"'],
        ['<title>Game Loading...</title>',
            f'<title>{games[index][0]}</title>'],
        ["document.getElementById('gameName').innerHTML = window.EJS_gameUrl = gameNameArray[para][1]",
         f'window.EJS_gameUrl = "{games[index][1]}"'],
        ["document.getElementById('gameTitle').innerHTML = document.title = window.EJS_gameName = gameNameArray[para][0]",
         f'window.EJS_gameName = "{games[index][3]}"'],
        ['gameNameArray[para][2]', f'"{games[index][2]}"'],
        ['<h2 id="gameTitle">&nbsp;</h2>',
            f'<h2 id="gameTitle">{games[index][0]}</h2>'],
        ['<div id="gameName" style="display: none;">&nbsp;</div>',
            f'<div id="gameName" style="display: none;">{games[index][1]}</div>'],
        ['window.EJS_pathtodata',
            f"window.EJS_gameUrl = '{games[index][1]}';window.EJS_pathtodata"]
    ]
    slug_contents = '%s' % contents
    for pair in replacements:
        slug_contents = slug_contents.replace(pair[0], pair[1])

    isGBC = games[index][1].endswith('.gbc')
    isGBA = games[index][1].endswith('.gba')

    if isGBA or isGBC:
        slug_contents = slug_contents.replace(
            'isMobile && !initial_gamepads', 'true')
        slug_contents = slug_contents.replace(
            'window.EJS_pathtodata', 'window.EJS_core = "{}";{} window.EJS_pathtodata'.format('gb' if isGBC else 'gba', GBAGAMEPAD if isGBA else ''))

    with open(slug, 'w') as out:
        out.write(slug_contents)


for k, v in os.environ.items():
    print(f'{k}={v}')
