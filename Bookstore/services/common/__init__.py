from flask import Blueprint, render_template, current_app, wrappers, redirect
from services.forms.feedback import FeedbackForm
from data import Database


endpoint = Blueprint("common", __name__)

@endpoint.route("/")
def home():
    return render_template("home.html")


@endpoint.route("/about")
def about():
    return render_template("about.html")


@endpoint.route("/faq")
def faq():
    return render_template("faq.html")


@endpoint.route("/feedback", methods=["GET"])
def feedback():
    form = FeedbackForm()
    return render_template("feedback.html", form=form)


@endpoint.route("/feedbacksent", methods=["POST"])
def feedback_create():
    from data.feedbacks import Feedback, TableFeedback
    import pyautogui
    form = FeedbackForm()
    if form.validate_on_submit():
        try:
            with Database() as db:
                table = db.table(TableFeedback)
                table.insert(Feedback(None, form.email.data, form.message.data, reply=""))
                table.commit()
        except Exception as exception:
            current_app.logger.error(f"Failed to insert new feedback")
            current_app.logger.error(f"Exception: {exception}")
        pyautogui.alert(text='Feedback successfully sent.', title='', button='OK')
        return redirect("/feedback")
    else:
        pyautogui.alert(text='Invalid input. Please check and try again.', title='', button='OK')
        return redirect("/feedback")


@endpoint.route("/privacy-policy")
def privacypolicy():
    return render_template("privacy-policy.html")


@endpoint.route("/product-single")
def productsingle():
    return render_template("product-single.html")


@endpoint.route("/products")
def products():
    return render_template("products.html")


@endpoint.route("/shipping")
def shipping():
    return render_template("shipping.html")


@endpoint.route("/shop")
def shop():
    return render_template("shop.html")


@endpoint.route("/terms-conditions")
def termsconditions():
    return render_template("terms-conditions.html")
