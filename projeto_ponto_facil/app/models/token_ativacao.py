from datetime import datetime, timezone
from app.extensions import db

class TokenAtivacao(db.Model):
    __tablename__ = "token_ativacao"
    
    id = db.Column(db.Integer, primary_key=True)

    codigo = db.Column(db.String(50), unique=True, nullable=False)

    usado = db.Column(db.Boolean, default=False, nullable=False)

    plano_id = db.Column(db.Integer, db.ForeignKey("planos.id"), nullable=False)

    plano = db.relationship("Plano", backref="tokens")

    criado_em = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    def __repr__(self):
        return f"<Token {self.codigo} - {self.plano}>"
