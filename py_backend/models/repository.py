from models.common import User
from sqlalchemy import insert
from db import db_factory


def create_user(user: User):
    cmd = insert(User.__table__).values([user]).compile()
    db = db_factory()
    with db.connect() as db_connexion:
        db_connexion.execute(cmd)
        db_connexion.commit()
