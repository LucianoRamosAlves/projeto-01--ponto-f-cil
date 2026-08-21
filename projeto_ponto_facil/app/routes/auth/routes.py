from flask import Blueprint, render_template

bp_auth = Blueprint("auth", __name__)

@bp_auth.route("/registro")
def registro ():
    return render_template("auth/registro.html")