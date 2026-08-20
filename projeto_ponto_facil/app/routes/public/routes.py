from flask import Blueprint, render_template

bp_publico = Blueprint("public", __name__)

@bp_publico.route("/")
def home():
    return render_template("public/index.html")
