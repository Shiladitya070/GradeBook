from flask import Flask, request, make_response, Response, jsonify
from flask_cors import CORS
import mysql.connector
import json
import secrets
import AssignmentForm
import os
from pathlib import Path
from functools import partial, wraps
import uuid
#from SimilarScore import SimilarScore
import threading
import sys
import pymongo

with open("config.json", "r") as file:
    config = json.load(file)

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "A_SECRET_KEY"
TEACHER = "teacher"
STUDENT = "student"

mydb_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="pool", pool_size=25, host="localhost",
                                                        username=config["dbuser"],
                                                        password=config["dbpswd"], database="gradebook")
try:
    client = pymongo.MongoClient(
        f"mongodb+srv://chetanMongoUser:{config['mongopswd']}@cluster0.6d6fbfi.mongodb.net/?retryWrites=true&w=majority")
except pymongo.errors.ConfigurationError:
    print("Could not connect")
    sys.exit(1)

mongo_db = client["gradebook"]
assignments_collection = mongo_db["assignments"]


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
        cur.close()

        if row is None:
            return False

        result = row[0]
        return result


def getRoleFromUser(user) -> str | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor(buffered=True)
        cur.execute("SELECT role FROM userbase WHERE username=%s", (user,))
        row = cur.fetchone()
        cur.close()

        if row is None:
            return False

        return row[0]


def getClassCodeFromTeacher(user) -> list | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT classCode FROM classownership WHERE teacher=%s", (user,))
        row = cur.fetchall()

        if row is None:
            return False

        return row


def getClassCodeFromStudent(user) -> list | bool:
    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("SELECT classCode FROM classjoined WHERE user=%s", (user,))
        row = cur.fetchall()

        if row is None:
            return False

        return row


def getAssignmentsFromClass(code) -> list:
    to_return = []

    for element in Path(os.getcwd()).joinpath("assignment").joinpath(code).iterdir():
        if element.is_file():
            to_return.append(element.name)

    return to_return


def getAssignmentsDoneByStudent(student) -> list:
    to_return = []

    for element in Path(os.getcwd()).joinpath("submission").joinpath(student).iterdir():
        if element.is_file():
            to_return.append(element.name)

    return to_return


def verifyRoleAuth(func, role_to_check):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = getUserFromToken(request.headers.get('Authorization'))
        role = getRoleFromUser(user)

        if not user or role != role_to_check:
            return Response('{"error":"Bad creds"}', status=401)

        return func(user, *args, **kwargs)

    return wrapper


verifyTeacherAuth = partial(verifyRoleAuth, role_to_check=TEACHER)
verifyStudentAuth = partial(verifyRoleAuth, role_to_check=STUDENT)


@app.route('/cred/verify', methods=["POST"])
def verifyLogin():
    data = json.loads(request.data.decode('utf-8'))
    username = data.get("username")
    password = data.get("password")
    role = getRoleFromUser(username)

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

            resp = make_response(token)
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
        return resp


@app.route('/profile')
def profile():
    username = getUserFromToken(request.headers.get("Authorization"))
    role = getRoleFromUser(username)

    return jsonify({"username": username, "role": role})


@app.route('/student/class/list', methods=["GET"])
@verifyStudentAuth
def listClassStudent(user):
    return getClassCodeFromStudent(user)


@app.route('/student/assignment/pending/all', methods=["GET"])
@verifyStudentAuth
def allPending(user):
    class_codes: list = getClassCodeFromStudent(user)
    done_assignments: list = getAssignmentsDoneByStudent(user)

    all_pending = []

    for class_code in class_codes:
        assignments = getAssignmentsFromClass(class_code)
        all_pending.append(list(set(assignments) - set(done_assignments)))

    return jsonify(all_pending)


@app.route('/student/assignment/pending/<int:class_code>', methods=["GET"])
@verifyStudentAuth
def specificPending(user, class_code):
    done_assignments: list = getAssignmentsDoneByStudent(user)

    all_pending = []
    assignments = getAssignmentsFromClass(class_code)
    all_pending.append(list(set(assignments) - set(done_assignments)))

    return jsonify(all_pending)


# TODO - remmeber to finish this
@app.route('/student/assignment/submit')
def submitAssignment():
    pass


# TODO - assign to that students
@app.route('/teacher/assignment/create', methods=["POST"])
@verifyTeacherAuth
def saveAssignment(user):
    data = json.loads(request.data.decode("utf-8"))
    title = data.get("title")
    class_code = data.get("class_code")

    if title is None or class_code is None:
        return Response('{"error":"Empty Title or Class Code."}', status=400)

    # FIXME - test this
    #if not getClassCodeFromTeacher(user).__contains__(user):
    #    return Response('{"error":"Class does not exist"}', status=401)

    assignment_form = AssignmentForm.AssignmentForm()
    assignment_form.id = uuid.uuid4().hex
    assignment_form.title = title

    global assignments_collection
    assignments_collection.insert_one({assignment_form.id: json.loads(str(assignment_form))})

    return Response(assignment_form.id, status=200)


# TODO - do add to check class
@app.route('/teacher/assignment/update', methods=["POST"])
@verifyTeacherAuth
def updateAssignment():
    data = json.loads(request.data.decode("utf-8"))
    qna = data.get("qna")
    class_code = data.get("class_code")
    assignment_id = data.get("assignment_id")

    to_update = Path(os.getcwd()).joinpath("assignment").joinpath(class_code).joinpath(assignment_id)

    with open(to_update, "w+") as f:
        assignment_form = AssignmentForm.AssignmentForm()
        assignment_form.parse(f.read())
        assignment_form.qna = json.loads(qna)
        f.write(str(assignment_form))
        f.close()

    return Response(status=200)


@app.route('/teacher/class/create', methods=["POST"])
@verifyTeacherAuth
def addClass(user):
    data = json.loads(request.data.decode("utf-8"))
    class_code = secrets.token_urlsafe(6)
    class_name = data.get("class_name")

    if class_name is None:
        return Response('{"error":"Empty class name"', status=400)

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("INSERT INTO classownership (teacher, classCode,className) VALUES (%s,%s,%s)",
                    (user, class_code, class_name))
        mydb.commit()
        cur.close()
        return Response(class_code, status=200)


@app.route('/teacher/class/delete', methods=["POST"])
@verifyTeacherAuth
def removeClass(user):
    data = json.loads(request.data.decode("utf-8"))
    class_code = data.get("class_code")

    if class_code is None:
        return Response('{"error":"Empty class code"', status=400)

    if not getClassCodeFromTeacher(user).__contains__(class_code):
        return Response('"error":"Class code not found"', status=404)

    with mydb_pool.get_connection() as mydb:
        cur = mydb.cursor()
        cur.execute("DELETE FROM classownership WHERE classCode=%s", (class_code,))
        mydb.commit()
        cur.close()
        return Response(status=200)


@app.route('/teacher/class/list', methods=["GET"])
@verifyTeacherAuth
def listClassTeacher(user):
    return getClassCodeFromTeacher(user)


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
