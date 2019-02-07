from flask import Flask, render_template, request


app = Flask(__name__)


@app.route('/', methods=['GET'])
def route_index():
    return render_template("index.html")


@app.route('/registration', methods=['GET', 'POST'])
def route_registration():
    registration = True
    if request.method == "POST":
        pass
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
