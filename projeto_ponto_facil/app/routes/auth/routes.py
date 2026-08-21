from flask import Blueprint, render_template, redirect, url_for, flash
from app.forms import FormularioRegistro
from app.extensions import db
from app.models import Empresa, Usuario, TokenAtivacao
from werkzeug.security import generate_password_hash


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