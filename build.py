import os
import re
import ast
import json
import shutil
import slugify

OUTPUT_DIR = "dist/retrogamezone/"

CHANGES = [
    {
        "file": "game.html",
        "replacements": [
            ['var para = 1;', """var para = "slug";
        if (para == "slug") {
                let slug = document.location.pathname.replace("/", "");
                para = gameNameArray.findIndex(o => o[3] == slug);
            }"""],
            ['"href", "game.html?" + preG.toString()', '"href", gameNameArray[preG][3]'],
            ['"href", "game.html?" + nexG.toString()', '"href", gameNameArray[nexG][3]']
        ]
    },
    {
        "file": "index.html",
        "replacements": [
            ["http://retrogamezone.droppages.com/",
             "https://cdn.jsdelivr.net/gh/omssp/nesscraper/"],
            ['gameid="${gameInfo[3]}"',
             'gameid="${gameInfo[4]}" game-slug="${gameInfo[3]}"'],
            ["game.html?${$(this).attr('gameid')}",
             "${$(this).attr('game-slug')}"],
        ]
    },
]

DELETIONS = [
    "game.html",
    "gooder.json",
    "top100desc.json",
    "fullS.svg",
    "nesicon.png",
]


shutil.rmtree(OUTPUT_DIR, ignore_errors=True)
shutil.copytree('src/', OUTPUT_DIR)


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


for change in CHANGES:
    with open(f"{OUTPUT_DIR}{change['file']}", "r+") as f:
        contents = f.read()

        for replacement in change['replacements']:
            contents = contents.replace(replacement[0], replacement[1])

        f.seek(0)
        f.truncate()
        f.write(contents)


for slug in slugs:
    shutil.copy(f"{OUTPUT_DIR}game.html", slug)


for f in DELETIONS:
    os.remove(f"{OUTPUT_DIR}{f}")


for k, v in os.environ.items():
    print(f'{k}={v}')
