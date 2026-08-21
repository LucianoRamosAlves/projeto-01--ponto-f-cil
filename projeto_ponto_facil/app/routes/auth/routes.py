from flask import Blueprint, render_template
from app.forms import FormularioRegistro

bp_auth = Blueprint("auth", __name__)

@bp_auth.route("/registro", methods=["GET", "POST"] )
def registro ():
    form = FormularioRegistro()

    if form.validate_on_submit():
        pass
    else:
        print(form.errors)

    return render_template("auth/registro.html", form=form)