from flask import Flask, request, make_response, Response
from flask_cors import CORS
import mysql.connector
import json
import secrets
import AssignmentForm
import os
from pathlib import Path
from functools import wraps

with open("config.json", "r") as file:
    config = json.load(file)

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "A_SECRET_KEY"
TEACHER = "teacher"

mydb_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="pool", pool_size=25, host="localhost",
                                                        username=config["dbuser"],
                                                        password=config["dbpswd"], database="gradebook")


def genToken() -> str:
    return secrets.token_urlsafe(32)


def saveToken(user, token) -> None:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("INSERT INTO tokens (user,token) VALUES (%s,%s)", (user, token))
        mydb.commit()
        cur.close()


def getUserFromToken(token) -> str | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT user FROM tokens WHERE token = %s", (token,))
        row = cur.fetchone()

        if row is None:
            return False

        result = row[0]
        return result


def getRoleFromUser(user) -> str | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT role FROM userbase WHERE username=%s", (user,))
        row = cur.fetchone()

        if row is None:
            return False

        return row[0]


def getClassCodeFromUser(user) -> list | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT classCode FROM classownership WHERE teacher=%s", (user,))
        row = cur.fetchall()

        if row is None:
            return False

        return row


def verifyTeacherAuth(func):
    def wrapper(*args, **kwargs):
        user = getUserFromToken(request.cookies.get("auth"))
        role = getRoleFromUser(user)

        if not user or role != TEACHER:
            return Response('{"error":"Bad creds"}', status=401)

        func(user, *args, **kwargs)

    return wrapper


@app.route('/cred/verify', methods=["POST"])
def verifyLogin():
    data = json.loads(request.data.decode('utf-8'))
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT password FROM userbase WHERE username=%s and role=%s", (username, role))

        raw_data = cur.fetchone()

        if raw_data is None:
            return Response(status=401)

        current_password = raw_data[0]
        if current_password == password:
            token = genToken()
            saveToken(username, token)

            resp = make_response()
            resp.set_cookie("auth", token)
            return resp
        else:
            return Response(status=401)


@app.route('/register', methods=["POST"])
def registerUser():
    data = json.loads(request.data.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if username is None or password is None:
        return Response('{"error":"Username or password is required"}', status=400)

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT * FROM userbase WHERE username=%s", (username,))
        raw_data = cur.fetchone()

        if raw_data is not None:
            return Response('{"error":"Username is not unique."}', status=400)

        cur.execute("INSERT INTO userbase (username, password,role) VALUES (%s, %s, %s)", (username, password, role))
        mydb.commit()
        cur.close()

        token = genToken()
        saveToken(username, token)

        resp = make_response(token)
        resp.set_cookie("auth", token)
        return resp


@app.route('/teacher/assignment/create', methods=["POST"])
def saveAssignment(user):
    data = json.loads(request.data.decode("utf-8"))
    form_id = data.get("id")
    title = data.get("title")
    qna = data.get("qna")
    class_code = data.get("class_code")

    if form_id is None or title is None or class_code is None:
        return Response('{"error":"Empty ID or Title or Class Code."}', status=400)

    if not getClassCodeFromUser(user).__contains__(user):
        return Response('{"error":"Class does not exist"}', status=401)

    assignment_form = AssignmentForm.AssignmentForm()
    assignment_form.id = form_id
    assignment_form.title = title
    assignment_form.qna = qna

    to_save = Path(os.getcwd()).joinpath("assignment").joinpath("template").joinpath(form_id)

    with open(to_save, "w+") as f:
        f.write(str(assignment_form))
        f.close()

    return Response(status=200)


@app.route('/teacher/class/create', methods=["POST"])
@verifyTeacherAuth
def addClass(user):

    data = json.loads(request.data.decode("utf-8"))
    class_code = data.get("class_code")
    class_name = data.get("class_name")

    if class_code is None or class_name is None:
        return Response('{"error":"Empty class code OR class name"', status=400)

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("INSERT INTO classownership (teacher, classCode,className) VALUES (%s,%s,%s)",
                    (user, class_code, class_name))
        mydb.commit()
        cur.close()
        return Response(status=200)


@app.route('/teacher/class/delete', methods=["POST"])
@verifyTeacherAuth
def removeClass(user):
    data = json.loads(request.data.decode("utf-8"))
    class_code = data.get("class_code")

    if class_code is None:
        return Response('{"error":"Empty class code"', status=400)

    if not getClassCodeFromUser(user).__contains__(class_code):
        return Response('"error":"Class code not found"', status=404)

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("DELETE FROM classownership WHERE classCode=%s", (class_code,))
        mydb.commit()
        cur.close()
        return Response(status=200)


@app.route('/ping')
def ping():
    if request.method == "GET":
        return Response("Got a GET ping")
    elif request.method == "POST":
        return Response("Got a POST ping")
    else:
        return Response("Got a Unknown ping")


if __name__ == '__main__':
    app.run("0.0.0.0", port=5000)
