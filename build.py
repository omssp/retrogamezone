import os
import re
import ast
import json
import shutil
import slugify
from datetime import datetime
import xml.etree.ElementTree as ET

OUTPUT_DIR = "dist/retrogamezone/"

BASE_URL = 'https://retrogamezone.blynkomssp.eu.org/'

MODIFIED = datetime.today().strftime('%Y-%m-%d')
FREQ = "weekly"

GHBRANCH = os.environ['CF_PAGES_BRANCH']

MANIFEST = {
    "name": "Retro Game Zone",
    "short_name": "RGZ",
    "description": "A place for all nostalgic gamers to relive old memories. ReLived by Shardul Pakhale.",
    "icons": [
        {
            "src": f"https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/nesicon.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "start_url": BASE_URL,
    "display": "standalone",
    "theme_color": "#e74c3c",
    "background_color": "#efebe9"
}


global_replacements = [
    [
        "http://retrogamezone.droppages.com/",
        "https://cdn.jsdelivr.net/gh/omssp/nesscraper/"
    ],
    [
        'src="MaterialColorThief.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/MaterialColorThief.min.js"'
    ],
    [
        'src="lib/dynamicaudio-min.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/dynamicaudio-min.js"'
    ],
    [
        'src="source/ppu.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/ppu.min.js"'
    ],
    [
        'src="source/keyboard.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/keyboard.min.js"'
    ],
    [
        'src="assets/js/main.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/assets/js/main.min.js"'
    ],
    [
        'src="source/utils.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/utils.min.js"'
    ],
    [
        'src="assets/js/jquery.min.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/assets/js/jquery.min.js"'
    ],
    [
        'src="source/ui.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/ui.min.js"'
    ],
    [
        'src="lib/nespad.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/nespad.min.js"'
    ],
    [
        'src="lib/fshelper.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/fshelper.min.js"'
    ],
    [
        'src="lib/homepad.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/homepad.min.js"'
    ],
    # [
    #     'src="lib/gamelist.js"',
    #     f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/gamelist.min.js"'
    # ],
    [
        'src="source/mappers.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/mappers.min.js"'
    ],
    [
        'src="source/nes.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/nes.min.js"'
    ],
    [
        'src="source/cpu.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/cpu.min.js"'
    ],
    [
        'src="source/rom.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/rom.min.js"'
    ],
    [
        'src="lib/jquery-3.2.1.min.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/jquery-3.2.1.min.js"'
    ],
    [
        'src="lib/swapplayers.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/swapplayers.min.js"'
    ],
    [
        'src="lib/audioUI.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/audioUI.min.js"'
    ],
    # [
    #     'src="source/omssp.js"',
    #     f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/omssp.min.js"'
    # ],
    [
        'src="lib/cookie.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/cookie.min.js"'
    ],
    [
        'src="source/papu.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/source/papu.min.js"'
    ],
    [
        'src="assets/js/util.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/assets/js/util.min.js"'
    ],
    [
        'src="lib/slugify.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/slugify.min.js"'
    ],
    [
        'src="assets/js/skel.min.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/assets/js/skel.min.js"'
    ],
    [
        'src="emu/emu.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/emu/emu.min.js"'
    ],
    [
        'src="emu/pako.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/emu/pako.min.js"'
    ],
    [
        'src="emu/save.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/emu/save.min.js"'
    ],
    [
        'src="lib/gamepad.js"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/gamepad.min.js"'
    ],
    [
        'src="fullS.png"',
        f'src="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/fullS.png"'
    ],
    [
        'controls/mute.png',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/mute.png'
    ],
    [
        'controls/unmute.png',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/unmute.png'
    ],
    [
        'controls/power.png',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/power.png'
    ],
    [
        'controls/pause.png',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/pause.png'
    ],
    [
        'controls/play.png',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/play.png'
    ],
    [
        'controls/zoom-in.ico',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/zoom-in.ico'
    ],
    [
        'controls/zoom-out.ico',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/zoom-out.ico'
    ],
    [
        'controls/nespad.ico',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/controls/nespad.ico'
    ],
    [
        'href="assets/css/main.css"',
        f'href="https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/assets/css/main.css"'
    ],
    [
        'index.html',
        '/'
    ],
    [
        'preloader.gif',
        f'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/preloader.gif'
    ],
]

GBAGAMEPAD = """window.EJS_VirtualGamepadSettings=[{type:"button",text:"A",id:"a",location:"right",fontSize:40,left:45,top:70,bold:!0,input_value:8},{type:"button",text:"B",id:"b",location:"right",left:-25,top:140,fontSize:40,bold:!0,input_value:0},{type:"dpad",location:"left",left:"65%",top:"91%",joystickInput:!1,inputValues:[4,5,6,7]},{type:"button",text:"Start",id:"start",location:"right",left:0,top:5,fontSize:15,block:!0,input_value:3},{type:"button",text:"Select",id:"select",location:"left",left:80,top:0,fontSize:15,block:!0,input_value:2},{type:"button",text:"Save",id:"save",location:"left",fontSize:10,left:20,top:-70,block:!0,input_value:122,input_new_cores:122,on_touchstart:"window.save_state()"},{type:"button",text:"Load",id:"load",location:"right",left:60,top:-65,fontSize:10,block:!0,input_value:123,input_new_cores:123,on_touchstart:"window.load_state()"},{type:"button",text:"L",id:"l1",location:"left",fontSize:20,left:110,top:-70,block:!0,input_value:10,input_new_cores:10},{type:"button",text:"R",id:"r1",location:"right",left:-30,top:-65,fontSize:20,block:!0,input_value:11,input_new_cores:11}];"""

CHANGES = [
    {
        "file": "index.html",
        "replacements": global_replacements + [
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
        "file": "404.html",
        "replacements": global_replacements
    },
    {
        "file": "offline.html",
        "replacements": global_replacements
    },
    {
        "file": "source/omssp.js",
        "replacements": global_replacements
    },
    # {
    #     "file": "source/nes.js",
    #     "replacements": global_replacements + [
    #         ["'lib/'", f"'https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/lib/'"]
    #     ]
    # },
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
             f"""script.src = "https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/emu/data/loader.min.js";
             window.EJS_pathtodata = "https://cdn.jsdelivr.net/gh/omssp/retrogamezone@{GHBRANCH}/src/emu/data/";"""],
        ],
    },
]

TOCPY = [change['file'] for change in CHANGES] + [
    'favicon.ico',
    'lib/gamelist.js',
    'sw.js',
    'offlineImage.png',
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

    urlset = ET.Element(
        'urlset', {'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9'})

    url = ET.SubElement(urlset, 'url')
    ET.SubElement(url, 'loc').text = BASE_URL
    ET.SubElement(url, 'lastmod').text = MODIFIED
    ET.SubElement(url, 'changefreq').text = FREQ
    ET.SubElement(url, 'priority').text = '1.0'

    with open('src/gbac.json', 'r') as ff:
        gbac_list = json.load(ff)
        games.extend(gbac_list)

    for game in games:
        try:
            slug = game[3]
        except Exception as e:
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

        url = ET.SubElement(urlset, 'url')
        ET.SubElement(url, 'loc').text = f"{BASE_URL}{slug}"
        ET.SubElement(url, 'lastmod').text = MODIFIED
        ET.SubElement(url, 'changefreq').text = FREQ
        ET.SubElement(url, 'priority').text = '0.9'

    tree = ET.ElementTree(urlset)
    tree.write(f'{OUTPUT_DIR}sitemap.xml',
               xml_declaration=True, encoding='utf-8')

    # print(len(set(slugs)))
    # print(games)

    list_js.seek(0)
    list_js.truncate()
    list_js.write(
        f"const numSetLen=16; var gameNameArray={json.dumps(games, indent=4)}")


with open(f"{OUTPUT_DIR}manifest.json", 'w') as out:
    out.write(json.dumps(MANIFEST, indent=4))

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
         f'window.EJS_gameUrl = "https:{games[index][1]}.7z"'],
        ["document.getElementById('gameTitle').innerHTML = document.title = window.EJS_gameName = gameNameArray[para][0]",
         f'window.EJS_gameName = "{games[index][3]}"'],
        ['gameNameArray[para][2]', f'"{games[index][2]}"'],
        ['<h2 id="gameTitle">&nbsp;</h2>',
            f'<h2 id="gameTitle">{games[index][0]}</h2>'],
        ['<div id="gameName" style="display: none;">&nbsp;</div>',
            f'<div id="gameName" style="display: none;">{games[index][1]}</div>'],
        ['window.EJS_pathtodata',
            f"window.EJS_gameUrl = 'https:{games[index][1]}.7z';window.EJS_pathtodata"],
        ['Retro Game Zone - By Shardul Pakhale',
            f'{games[index][0]} - Retro Game Zone'],
        ['//cdn.jsdelivr.net/gh/omssp/nesscraper/nesicon.png', games[index][2]],
        ['./manifest.json', f'./{games[index][3]}.json'],
        ['src="index2.html"', 'src="index2"'],
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

    with open(f"{OUTPUT_DIR}{games[index][3]}.json", 'w') as out:
        temp_manifest = MANIFEST
        temp_manifest['name'] = f"{games[index][0]} - Retro Game Zone"
        temp_manifest['short_name'] = games[index][0]
        temp_manifest['icons'][0]['src'] = f"https:{games[index][2]}"
        temp_manifest['start_url'] = f"{BASE_URL}{games[index][3]}"
        out.write(json.dumps(temp_manifest, indent=4))

for k, v in os.environ.items():
    print(f'{k}={v}')