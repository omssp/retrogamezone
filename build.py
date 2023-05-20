import re
import ast
import json
import shutil
import slugify

OUTPUT_DIR = "dist/retrogamezone/"

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
        game.append(slug)
        slug = f"{OUTPUT_DIR}{slug}.html"
        slugs.append(slug)
        if slugs.count(slug) > 1:
            print(
                f"WARNING!!! Duplicate found in gamelist.js : {slug} : {game}")
            del game
            slugs.pop()

    # print(len(set(slugs)))
    # print(games)

    list_js.seek(0)
    list_js.truncate()
    list_js.write(f"var gameNameArray = {json.dumps(games, indent=4)};")

with open(f"{OUTPUT_DIR}index.html", "r+") as home:
    content = home.read()
    content = content.replace(
        "game.html?${$(this).attr('gameid')}", "/${$(this).attr('gameid')}/")

    home.seek(0)
    home.truncate()
    home.write(content)

for slug in slugs:
    shutil.copy("src/game.html", slug)
