import json
import shutil

output_dir = "dist/retrogamezone/"

shutil.rmtree(output_dir, ignore_errors=True)
shutil.copytree('src/', output_dir, dirs_exist_ok=True)
