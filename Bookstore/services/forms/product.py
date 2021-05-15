import wtforms
from flask_wtf import FlaskForm
from flask_wtf.file  import FileField, FileRequired, FileAllowed


class ProductForm(FlaskForm):
    name  = wtforms.StringField(label="Product Name")
    price = wtforms.IntegerField(label="Price")

