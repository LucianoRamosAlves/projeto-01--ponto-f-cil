from flask import Flask
from app.extensions import db, csrf

def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = "your_secret_key"
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///ponto_facil.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # rotas
    from app.routes import bp_publico
    app.register_blueprint(bp_publico)

    from app.routes import bp_auth
    app.register_blueprint(bp_auth)

    # ferramentas
    db.init_app(app)
    csrf.init_app(app)

    return app
