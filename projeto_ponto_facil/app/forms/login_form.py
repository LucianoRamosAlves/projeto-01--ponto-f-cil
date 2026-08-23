from flask_wtf import FlaskForm

from wtforms import (
    StringField,
    PasswordField,
    BooleanField,
)

from wtforms.validators import (
    DataRequired,
    Email,
)


class FormularioLogin(FlaskForm):

    email = StringField(
        validators=[
            DataRequired(message="Informe o e-mail."),
            Email(message="Informe um e-mail válido."),
        ]
    )

    senha = PasswordField(
        validators=[
            DataRequired(message="Informe a senha."),
        ]
    )

    lembrar = BooleanField()
