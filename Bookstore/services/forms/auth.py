import wtforms
import flask_wtf
import wtforms.validators


class FormLogin(flask_wtf.FlaskForm):
	username = wtforms.StringField(  label = "Username", validators = [
		wtforms.validators.required()])
	password = wtforms.PasswordField(label = "Password", validators = [
		wtforms.validators.required()])


class FormRegister(flask_wtf.FlaskForm):
	username = wtforms.StringField(  label = "Username", validators = [
		wtforms.validators.required(),
		wtforms.validators.regexp(regex = "^[a-zA-Z]+[a-zA-Z0-9]{3,}", message = "Must be alpha numeric")])
	password = wtforms.PasswordField(label = "Password", validators = [
		wtforms.validators.required(),
		wtforms.validators.regexp(regex   = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$",
								  message = "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character")])