from db import sync_db_migrations, initialize_db
from user import create_user
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


def main():
    setup()
    app.run()


def setup():
    initialize_db()
    sync_db_migrations()


if __name__ == "__main__":
    main()
