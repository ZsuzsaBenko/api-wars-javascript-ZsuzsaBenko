import os
from flask import Flask, render_template, request, redirect, session, url_for
import data_manager
import hashing


app = Flask(__name__)
app.secret_key = os.urandom(16)


@app.route('/', methods=['GET'])
def route_index():
    if "username" in session:
        status = "logged-in"
    else:
        status = "logged-out"
    return render_template("index.html", status=status)


@app.route('/registration', methods=['GET', 'POST'])
def route_registration():
    registration = True
    if request.method == "POST":
        username = request.form["username"]
        existing_username = data_manager.check_username(username)
        if existing_username:
            message = "Sorry, we already have a user by that username."
            return render_template("register-login.html", registration=registration, message=message)
        else:
            password = request.form["password"]
            hashed_password = hashing.hash_password(password)
            data_manager.insert_user(username, hashed_password)
            return redirect(url_for('route_login'))
    else:
        return render_template("register-login.html", registration=registration)


@app.route('/login', methods=['POST', 'GET'])
def route_login():
    if request.method == "POST":
        username = request.form["username"]
        user = data_manager.check_username(username)
        message = "Sorry, you entered an incorrect username or password."
        if user:
            password = request.form["password"]
            if hashing.verify_password(password, user["password"]):
                session["username"] = username
                session["user_id"] = user["id"]
                return redirect(url_for('route_index'))
            else:
                render_template("register-login.html", message=message)
        else:
            render_template("register-login.html", message=message)
    else:
        return render_template("register-login.html")


@app.route('/logout')
def route_logout():
    session.pop("username")
    return redirect(url_for('route_index'))


@app.route('/save-vote', methods=["POST"])
def route_save_vote():
    data = request.get_json()
    data_manager.insert_vote(data)
    return '', 204


if __name__ == "__main__":
    app.run(debug=True,
            host="0.0.0.0",
            port=8000)
