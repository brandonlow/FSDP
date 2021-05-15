import wtforms
from flask_wtf import FlaskForm
from flask_wtf.file  import FileField, FileRequired, FileAllowed


class FormUserProfile(FlaskForm):
    username  = wtforms.StringField(label="Username")
    photo     = FileField(label="Photo",
                          validators=[
                              FileRequired(),
                              FileAllowed(['jpg', 'png'], 'Only jpeg or png images supported!')
                          ])

