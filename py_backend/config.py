from os import path
from pathlib import Path

config_path = path.join(path.expanduser("~"), ".tempusfujit")
db_path = Path(path.join(config_path, "tempusfujit.db"))


def forward_slash_path(some_path):
    print(some_path)
    print(some_path.replace("\\", "/"))
    return path.replace("\\", "/")
