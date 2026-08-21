from app.extensions import db


class Plano(db.Model):

    __tablename__ = "planos"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(30), unique=True, nullable=False)

    preco = db.Column(db.Numeric(10, 2), nullable=False)
