from models.common import User
import models.repository as repo


def create_user():
    user = User(
        username="testuser", some_new_property="algo", hashed_password="qdsmlfk"
    )
    repo.create_user(user)
    return "user created!", 200
