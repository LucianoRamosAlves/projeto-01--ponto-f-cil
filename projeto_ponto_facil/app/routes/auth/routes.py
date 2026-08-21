from flask import Blueprint, render_template
from app.forms import FormularioRegistro

bp_auth = Blueprint("auth", __name__)

@bp_auth.route("/registro")
def registro ():
    form = FormularioRegistro()

    return render_template("auth/registro.html", form=form)