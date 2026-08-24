from flask import Blueprint, render_template

bp_private = Blueprint("private", __name__)

@bp_private.route("/dashboard")
def deshboard():
    return render_template("private/deshboard.html")