## user routes
from flask import Blueprint, render_template
import uuid
from flask import Blueprint, session, redirect, request, abort, render_template, url_for
import os
import shelve
from data import Database
from data.user import User, TableUsers
import hashlib

endpoint = Blueprint("user", __name__)

@endpoint.route("/userprofile")
def userprofile():
    return render_template("userprofile.html")

@endpoint.route('/user/update', methods=["POST"])
def post_update():
    with Database() as db:
        form = request.form
        table  = db.table(TableUsers)
        result = table.select(query={
            "where": {
                "name": form["name"],
            }
        })
        result[0].name = form["name"]
        table.update(uuid=result[0].uuid, value=result[0])
        table.commit()
        session["user"] = {
                "email":    session["user"]["email"],
                "username": result[0].name,
            }
        return redirect(url_for('user.userprofile'))