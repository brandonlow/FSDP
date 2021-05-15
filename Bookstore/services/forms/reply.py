from flask_wtf import FlaskForm
from wtforms import TextAreaField
from wtforms.validators import InputRequired, Length


class ReplyForm(FlaskForm):
    reply = TextAreaField("Reply: ", validators=[InputRequired(), Length(min=1, max=500, message="Maximum of 500 characters")])