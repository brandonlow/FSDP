from flask_wtf import FlaskForm
from wtforms import TextAreaField
from wtforms.validators import InputRequired, regexp, Length
from wtforms.fields.html5 import EmailField


class FeedbackForm(FlaskForm):
    email = EmailField("Email: ", validators=[InputRequired(), regexp(regex="[^@]+@[^@]+\.[^@]+", message="exactly 1 '@', at least 1 '.'")])
    message = TextAreaField("Message: ", validators=[InputRequired(), Length(min=1, max=500, message="Maximum of 500 characters")])
