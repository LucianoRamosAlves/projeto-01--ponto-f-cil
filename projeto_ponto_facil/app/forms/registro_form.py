from flask_wtf import FlaskForm

from wtforms import (
    StringField,
    PasswordField,
    BooleanField,
)

from wtforms.validators import (
    DataRequired,
    Length,
    EqualTo,
    Regexp,
    Email,
    ValidationError,
)


class FormularioRegistro(FlaskForm):

    nome = StringField(
        validators=[
            DataRequired(message="Informe o nome."),
            Length(min=2, message="O nome deve ter pelo menos duas letras."),
        ],
    )

    cnpj = StringField(
        validators=[
            DataRequired(message="Informe o CNPJ."),
            Regexp(r"^[0-9]+$", message="Digite apenas números."),
            Length(min=14, max=14, message="O CNPJ deve conter exato 14 números."),
        ],
    )

    email = StringField(
        validators=[
            DataRequired(message="Informe o e-mail."),
            Email(message="Informe um e-mail válido."),
        ]
    )

    senha = PasswordField(
        validators=[
            DataRequired(message="Informe a senha."),
            Length(min=8, message="A senha deve ter pelo menos 8 caracteres."),
        ],
    )

    confirmar_senha = PasswordField(
        validators=[
            DataRequired(message="Confirme a senha."),
            EqualTo("senha", message="As senhas não coincidem."),
        ],
    )

    token = StringField(
        validators=[
            DataRequired(message="Informe o token."),
        ],
    )

    termos = BooleanField(
        validators=[
            DataRequired(message="Você precisa aceitar os termos para continuar.")
        ],
    )

    def validate_nome(self, field):
        nome = field.data.strip()

        if nome.isdigit():
            raise ValidationError(
                "O nome da empresa não pode conter apenas números."
            )

    def validate_senha(self, field):
        senha = field.data

        if not any(c.isalpha() for c in senha):
            raise ValidationError("A senha deve conter pelo menos uma letra.")

        if not any(c.isdigit() for c in senha):
            raise ValidationError("A senha deve conter pelo menos um número.")

        if senha.isalnum():
            raise ValidationError(
                "A senha deve conter pelo menos um caractere especial."
            )