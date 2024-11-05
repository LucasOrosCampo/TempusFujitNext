from config import db_path, forward_slash_path
from os.path import exists
from os import makedirs
from sqlalchemy import create_engine, Engine
from models.common import Base


def db_factory() -> Engine:
    return create_engine(f"sqlite:///{db_path.as_posix()}")


def initialize_db():
    directory = db_path.parent
    makedirs(directory, exist_ok=True)
    db_path.touch()


def sync_db_migrations():
    Base.metadata.create_all(db_factory(), checkfirst=True)
