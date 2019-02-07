from flask import Flask, render_template, request, redirect
import data_manager
import hashing


app = Flask(__name__)


@app.route('/', methods=['GET'])
def route_index():
    return render_template("index.html")


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
            return redirect('/login')
    else:
        return render_template("register-login.html", registration=registration)


@app.route('/login', methods=['POST', 'GET'])
def route_login():
    if request.method == "POST":
        pass
    else:
        return render_template("register-login.html")


@app.route('/logout')
def route_logout():
    pass


if __name__ == "__main__":
    app.run(debug=True,
            host="0.0.0.0",
            port=8000)
