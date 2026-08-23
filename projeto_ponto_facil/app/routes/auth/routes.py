from flask import Blueprint, render_template, redirect, url_for, flash
from app.forms import FormularioRegistro, FormularioLogin
from app.extensions import db
from app.models import Empresa, Usuario, TokenAtivacao
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_required, login_user, logout_user



bp_auth = Blueprint("auth", __name__)

@bp_auth.route("/registro", methods=["GET", "POST"])
def registro():
    form = FormularioRegistro()

    if form.validate_on_submit():

        # 1. Buscar o token informado
        token = TokenAtivacao.query.filter_by(codigo=form.token.data).first()

        # 2. Verificar se o token existe
        if not token:
            form.token.errors.append("Token inválido.")
            return render_template("auth/registro.html", form=form)

        # 3. Verificar se o token já foi usado
        if token.usado:
            form.token.errors.append("Este token já foi utilizado.")
            return render_template("auth/registro.html", form=form)

        # NOVA VALIDAÇÃO: Evitar Crash de e-mail duplicado
        usuario_existente = Usuario.query.filter_by(email=form.email.data).first()

        if usuario_existente:
            form.email.errors.append("Este e-mail já está cadastrado no sistema.")
            return render_template("auth/registro.html", form=form)

        # 4. Criar a empresa
        empresa = Empresa(
            nome=form.nome.data,
            cnpj=form.cnpj.data,
            plano_id=token.plano_id,
            ativa=True,
        )
        
        db.session.add(empresa)

        # Faz o SQLAlchemy gerar o ID da empresa antes do commit
        db.session.flush()

        # 5. Criar o usuário administrativo
        usuario = Usuario(
            nome=form.nome.data,  # Assumindo que o Admin usa o nome da empresa inicialmente
            email=form.email.data,
            senha=generate_password_hash(form.senha.data),
            tipo_usuario="gerente",
            empresa_id=empresa.id,
        )
        db.session.add(usuario)

        # 6. Marcar o token como utilizado
        token.usado = True

        # 7. Salvar tudo de uma vez
        db.session.commit()
        
        # Mantive o flash de SUCESSO aqui porque você já tinha no seu código original
        flash("Conta criada com sucesso! Bem-vindo ao PontoFácil.", "sucesso")

        return redirect(url_for("private.dashboard"))

    return render_template("auth/registro.html", form=form)

@bp_auth.route("/login", methods=["GET", "POST"])
def login():
    form = FormularioLogin()

    if form.validate_on_submit():

        usuario = Usuario.query.filter_by(email=form.email.data).first()

        # Verificação de Senha: Erro injetado direto no campo
        if not usuario or not check_password_hash(usuario.senha, form.senha.data):
            form.email.errors.append("E-mail ou senha incorretos.")
            form.senha.errors.append("E-mail ou senha incorretos.")
            return render_template("auth/login.html", form=form)

        # Verifica se o próprio usuário está ativo
        if not usuario.ativo:
            form.email.errors.append("Sua conta está inativa. Entre em contato com o suporte.")
            return render_template("auth/login.html", form=form)

        # Admin geral não depende de empresa
        if usuario.tipo_usuario != "admin":
            empresa = Empresa.query.filter_by(id=usuario.empresa_id).first()

            if not empresa or not empresa.ativa:
                form.email.errors.append("A conta da sua empresa encontra-se inativa.")
                return render_template("auth/login.html", form=form)

        # INTEGRAÇÃO DO LEMBRAR DE MIM:
        # Pega o valor do checkbox (True/False)
        lembrar_usuario = form.lembrar.data

        login_user(usuario, remember=lembrar_usuario)



        if usuario.tipo_usuario == "admin":
            return redirect(url_for("admin.dashboard"))

        return redirect(url_for("private.dashboard"))

    return render_template("auth/login.html", form=form)

@bp_auth.route("/logout")
@login_required
def logout():
    logout_user()
    return redirect(url_for("public.home"))
