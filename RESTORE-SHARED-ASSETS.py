from pathlib import Path
import shutil
r=Path(__file__).resolve().parent
shutil.copytree(r.parent/"assets",r/"public/assets",dirs_exist_ok=True)
print("Source assets restored. Run npm ci, then npm run build.")
