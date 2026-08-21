from flask import Blueprint, render_template, url_for, request, redirect, session
from app.models import Plano, TokenAtivacao
from app.extensions import db

import secrets

bp_publico = Blueprint("public", __name__)

@bp_publico.route("/")
def home():

    plano_normal = Plano.query.filter_by(nome="normal").first()
    plano_premium = Plano.query.filter_by(nome="premium").first()

    return render_template(
        "public/index.html",
        plano_normal=plano_normal,
        plano_premium=plano_premium,
    )

@bp_publico.route("/pagamento", methods=["GET", "POST"])
def pagamento():
    nome_plano = request.args.get("plano")
  

    # Tratamento caso o usuário acesse a URL diretamente sem ?plano=
    if not nome_plano:
        return redirect(url_for("public.home", _anchor="planos"))

    # Busca o plano no banco
    plano = Plano.query.filter_by(nome=nome_plano).first()

    if not plano:
        return redirect(url_for("public.home", _anchor="planos"))

    if request.method == "POST":
        # Lógica de Upgrade (Usuário já logado)
        # if tipo == "upgrade":
        #     if not current_user.is_authenticated:
        #         flash("Você precisa estar logado para atualizar o plano.", "aviso")
        #         return redirect(url_for("auth.login"))

        #     current_user.empresa.plano_id = plano.id
        #     db.session.commit()

        #     flash("Plano atualizado com sucesso!", "sucesso")
        #     return redirect(url_for("private.relatorios"))

        # Lógica de Novo Pagamento (Gera o Token)
        # Observação: movi a função gerar_token() para usar direto o secrets aqui, 
        # deixando a rota mais limpa e direta.

        codigo_token = secrets.token_urlsafe(48)
        
        token = TokenAtivacao(codigo=codigo_token, plano_id=plano.id)
        db.session.add(token)
        db.session.commit()

        # Guarda o código na sessão, invisível para o usuário
        session['token_recem_criado'] = token.codigo 
        
        # Redireciona para uma URL 100% limpa, sem variáveis
        return redirect(url_for("public.token"))

    # Removi a variável `preco=preco` do seu código original, pois você já está 
    # enviando o objeto `plano` inteiro. No HTML você pode usar `{{ plano.preco }}`.
    return render_template(
        "public/pagamento.html", 
        plano=plano, 
    )


@bp_publico.route("/token")
def token():
    codigo_token = session.pop('token_recem_criado', None)

    if not codigo_token:
        return redirect(url_for("public.home", _anchor="planos"))
    
    return render_template("public/token.html", codigo_token=codigo_token)
