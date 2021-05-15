import uuid
from flask import Blueprint, session, redirect, request, abort, render_template, url_for
import os
import shelve
from data import Database
from data import user
from data.user import User, TableUsers
import hashlib
import pyautogui

endpoint = Blueprint("auth", __name__)


@endpoint.route('/login', methods=["GET"])
def get_login():
    return render_template('login.html')


@endpoint.route('/login', methods=["POST"])
def post_login():
    form = request.form
    with Database() as db:
        table = db.table(TableUsers)
        # table.list()# to get everything for user table
        result = table.select(query={
            "where": {
                "email": form["email"],
                "password": hashlib.sha256(form["password"].encode()).hexdigest()
            }
        })
        if len(result) == 0:
            pyautogui.alert("Account does not exist, please create one first.")
            return redirect('/auth/register')
        elif result[0].email.lower() == "admin@gmail.com":
            session["user"] = {
                "email": "admin@gmail.com",
                "username": "Admin",
            }
            return redirect('/')
        else:
            session["user"] = {
                "email": result[0].email,
                "username": result[0].username,
            }
            return redirect('/')


@endpoint.route('/register', methods=["GET"])
def get_register():
    return render_template('register.html')


@endpoint.route('/register', methods=["POST"])
def post_register():
    form = request.form
    with Database() as db:
        table = db.table(TableUsers)
        #        table.list() to get everything for user table
        result = table.select(query={
            "where": {
                "username": form["username"],
                "email": form["email"],
                "password": hashlib.sha256(form["password"].encode()).hexdigest()
            }
        })

        if len(result) > 0:
            pyautogui.alert("The current email is already registered.")
            return redirect(url_for('login.html'))
        else:
            table.insert(User(username=form["username"], email=form["email"], password=form["password"]))
            table.commit()
            session["user"] = {
                "email": form["email"],
                "username": form["username"],
            }
            return redirect('/')
    # with shelve.open('storage.db') as db:
    #     try:
    #         users = db["users"]
    #     except:
    #         users = []
    #     for x in users:
    #         if (x.username == user.username):
    #             abort(400)
    #
    #     users.append(user)
    #     db["users"] = users
    #     session["user"] = {
    #         "email": user.email,
    #         "username": user.username,
    #         "password": user.password
    #     }


@endpoint.route('/logout', methods=["GET", "POST"])
def logout():
    session["user"] = None
    return redirect(url_for('common.home'))


@endpoint.route("/loginforget")
def loginforget():
    return render_template("loginforget.html")


@endpoint.route('/forgot', methods=["POST"])
def forgot():
    import os
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    form = request.form

    if form["email"] != form["email2"]:
        pyautogui.alert("Please enter matching emails.")
        return render_template("loginforget.html", error="Email doesn't match")

    with Database() as db:
        table = db.table(TableUsers)
        #        table.list() to get everything for user table
        result = table.select(query={
            "where": {
                "email": form["email"],
            }
        })

        if len(result) == 0:
            pyautogui.alert("Email is not registered, please register ")
            return render_template("register.html")
        else:
            message = Mail(
                from_email='203768E@mymail.nyp.edu.sg',
                to_emails=form["email"],
                subject='Login password',
                html_content='Your password is "p@ssword"')
            result[0].password_reset("p@ssword")
            table.update(result[0].uuid, value=result[0])
            table.commit()
            try:
                sg = SendGridAPIClient("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")
                response = sg.send(message)
                print(response.status_code)
                print(response.body)
                print(response.headers)
            except Exception as e:
                print(e.message)

    return redirect("/auth/login")
# API KEY - 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
