from flask import Blueprint, render_template, url_for, request, redirect

bp_publico = Blueprint("public", __name__)

@bp_publico.route("/")
def home():
    return render_template("public/index.html")

@bp_publico.route("/pagamento")
def pagamento():
    nome_plano = request.args.get("plano")
    print(nome_plano)
    # tipo = request.args.get("tipo")

    # Tratamento caso o usuário acesse a URL diretamente sem ?plano=
    if not nome_plano:
        return redirect(url_for("public.home", _anchor="planos"))

    return render_template("public/pagamento.html")

@bp_publico.route("/token")
def token ():
    return render_template("public/token.html")
