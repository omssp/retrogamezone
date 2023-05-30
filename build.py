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
    [
        'src="source/nes.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/nes.min.js"'
    ],
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
    [
        'src="source/omssp.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/source/omssp.min.js"'
    ],
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
        'src="lib/gamepad.js"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/lib/gamepad.min.js"'
    ],
    [
        'src="fullS.png"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/fullS.png"'
    ],
    [
        'src="controls/mute.png"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/mute.png"'
    ],
    [
        'src="controls/power.png"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/power.png"'
    ],
    [
        'src="controls/pause.png"',
        'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/controls/pause.png"'
    ],
    [
        'href="assets/css/main.css"',
        'href="https://cdn.jsdelivr.net/gh/omssp/retrogamezone/src/assets/css/main.css"'
    ]
]

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
        ]
    },
]

DELETIONS = [
    "game.html",
    "gooder.json",
    "top100desc.json",
    "fullS.svg",
    "nesicon.png",
'MaterialColorThief.js',
'lib/swapplayers.js',
'lib/audioUI.js',
'emu/emu.js',
'assets/js/skel.min.js',
'assets/js/util.js',
'assets/js/main.js',
'assets/js/jquery.min.js',
'lib/cookie.js',
'lib/slugify.js',
'lib/gamepad.js',
'lib/fshelper.js',
'lib/homepad.js',
'lib/jquery-3.2.1.min.js',
'lib/dynamicaudio-min.js',
'source/nes.js',
'source/utils.js',
'source/cpu.js',
'source/keyboard.js',
'source/mappers.js',
'source/papu.js',
'source/ppu.js',
'source/rom.js',
'source/ui.js',
'source/omssp.js',
'lib/nespad.js',
'assets/css/main.css',
# 'fullS.png',
# 'controls/pause.png',
# 'controls/power.png',
# 'controls/mute.png',
]


shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
shutil.copytree('src/', OUTPUT_DIR)

games = []
slugs = []
with open(f"{OUTPUT_DIR}lib/gamelist.js", "r+") as list_js:
    data = list_js.read()
    obj = data[data.find('['): data.rfind(';')]
    obj = re.sub(r"\/\/\s.*", '', obj, re.MULTILINE)
    games = ast.literal_eval(obj)

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
        ['gameNameArray[para][1]', f'"{games[index][1]}"'],
        ['gameNameArray[para][0]', f'"{games[index][0]}"'],
        ['gameNameArray[para][2]', f'"{games[index][2]}"'],
        ['<h2 id="gameTitle">&nbsp;</h2>',
            f'<h2 id="gameTitle">{games[index][0]}</h2>'],
        ['<div id="gameName" style="display: none;">&nbsp;</div>',
            f'<div id="gameName" style="display: none;">{games[index][1]}</div>']
    ]
    slug_contents = '%s' % contents
    for pair in replacements:
        slug_contents = slug_contents.replace(pair[0], pair[1])

    with open(slug, 'w') as out:
        out.write(slug_contents)


for f in set(DELETIONS):
    os.remove(f"{OUTPUT_DIR}{f}")


for k, v in os.environ.items():
    print(f'{k}={v}')
