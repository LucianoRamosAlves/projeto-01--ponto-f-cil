from datetime import datetime, timezone
from app.extensions import db


class Empresa(db.Model):
    __tablename__ = "empresas"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(150), nullable=False)

    cnpj = db.Column(db.String(18), unique=True, nullable=False, index=True)

    plano_id = db.Column(db.Integer, db.ForeignKey("planos.id"), nullable=False)

    plano = db.relationship("Plano", backref="empresas")

    ativa = db.Column(db.Boolean, nullable=False, default=True)

    data_criacao = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )


class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = db.Column(db.Integer, primary_key=True)

    nome = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False, index=True)

    senha = db.Column(db.String(255), nullable=False)

    tipo_usuario = db.Column(db.String(20), nullable=False, default="gerente")

    ativo = db.Column(db.Boolean, nullable=False, default=True)

    empresa_id = db.Column(db.Integer, db.ForeignKey("empresas.id"), nullable=True)

    empresa = db.relationship("Empresa", backref="usuarios")
