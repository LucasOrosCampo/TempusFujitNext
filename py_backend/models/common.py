from sqlalchemy.orm import DeclarativeBase, MappedAsDataclass, Mapped, mapped_column


class Base(MappedAsDataclass, DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "User"
    username: Mapped[str] = mapped_column(primary_key=True)
    hashed_password: Mapped[str]
    some_new_property: Mapped[str]
