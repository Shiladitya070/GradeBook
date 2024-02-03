from flask import Flask, request, make_response, Response, jsonify
from flask_cors import CORS
import json
import secrets
import AssignmentForm
import os
from pathlib import Path
from functools import partial, wraps
import uuid
# from SimilarScore import SimilarScore
from ClassObject import ClassObject
from StudentModel import StudentModel
from UserModel import UserModel
import threading
import sys
import pymongo
import pymongo.errors

with open("config.json", "r") as file:
    config = json.load(file)

app = Flask(__name__)
cors = CORS(app)
app.secret_key = "A_SECRET_KEY"
TEACHER = "teacher"
STUDENT = "student"

try:
    client = pymongo.MongoClient(
        f"mongodb+srv://chetanMongoUser:{config['mongopswd']}@cluster0.6d6fbfi.mongodb.net/?retryWrites=true&w=majority")
except pymongo.errors.ConfigurationError:
    print("Could not connect")
    sys.exit(1)

mongo_db = client["gradebook"]
assignments_collection = mongo_db["assignments"]
submissions_collection = mongo_db["submissions"]
class_collection = mongo_db["class"]
students_collection = mongo_db["students"]
userbase_collection = mongo_db["userbase"]


def genToken() -> str:
    return secrets.token_urlsafe(32)


def saveToken(user, token) -> None:
    global userbase_collection
    userbase_collection.update_one(
        {"username": user},
        {"tokens": userbase_collection.find_one({"username": user}).get("tokens").append(token)})


def getUserFromToken(token) -> str | bool:
    global userbase_collection
    return userbase_collection.find_one({"tokens": token}).get("username")


def getRoleFromUser(user) -> str | bool:
    global userbase_collection
    return userbase_collection.find_one({"username": user}).get("role")


def getClassCodeFromTeacher(user) -> list | bool:
    if user is None:
        return False

    global class_collection
    class_list = []
    for classObj in class_collection.find({"owner": user}):
        class_list.append(classObj["classCode"])


def getClassCodeFromStudent(user) -> list | bool:
    if user is None:
        return False

    global students_collection
    return students_collection.find_one({"username": user}).get("classJoined")


def getAssignmentsFromClass(code) -> list:
    global class_collection
    return class_collection.find_one({"classCode": code}).get("assignments")


def getAssignmentsDoneByStudent(student) -> list:
    global students_collection
    return students_collection.find_one({"username": student}).get("assignmentsSubmitted")


def verifyRoleAuth(func, role_to_check):
    @wraps(func)
    def wrapper(*args, **kwargs):
        user = getUserFromToken(request.headers.get('Authorization'))
        if not user:
            return Response('{"error":"Bad creds"}', status=401)
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

    global userbase_collection
    if userbase_collection.find_one({"username": username, "password": password, "role": role}) is None:
        return Response('{"error":"Bad creds', status=401)
    else:
        token = genToken()
        saveToken(username, token)
        return make_response(token)


@app.route('/register', methods=["POST"])
def registerUser():
    data = json.loads(request.data.decode("utf-8"))
    username = data.get("username")
    password = data.get("password")
    role = data.get("role")

    if username is None or password is None:
        return Response('{"error":"Username or password is required"}', status=400)

    global userbase_collection
    if userbase_collection.find_one({"username": username}) is not None:
        return Response('{"error":"Username is taken"}', status=400)

    user_model = UserModel()
    token = genToken()
    user_model.username = username
    user_model.password = password
    user_model.role = role
    user_model.tokens = [token]
    userbase_collection.insert_one(user_model.__dict__)

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

    if not (class_code in getClassCodeFromTeacher(user)):
        return Response('{"error":"Class does not exist"}', status=401)

    assignment_form = AssignmentForm.AssignmentForm()
    assignment_form.id = uuid.uuid4().hex
    assignment_form.title = title

    global assignments_collection
    assignments_collection.insert_one({assignment_form.id: json.loads(str(assignment_form))})

    return Response(assignment_form.id, status=200)


# TODO - do add to check class
@app.route('/teacher/assignment/update', methods=["POST"])
@verifyTeacherAuth
def updateAssignment(user):
    data = json.loads(request.data.decode("utf-8"))
    qna = data.get("qna")
    assignment_id = data.get("assignment_id")
    global assignments_collection
    class_code = assignments_collection.find_one({"id": assignment_id}).get("classCode")

    if not (class_code in getClassCodeFromTeacher(user)):
        return Response('{"error":"Class does not exist"}', status=401)

    assignments_collection.update_one(
        {"id": assignment_id},
        {"$set": {"qna": qna}})

    return Response(status=200)


@app.route('/teacher/class/create', methods=["POST"])
@verifyTeacherAuth
def addClass(user):
    data = json.loads(request.data.decode("utf-8"))
    class_code = secrets.token_urlsafe(6)
    class_name = data.get("class_name")

    if class_name is None:
        return Response('{"error":"Empty class name"', status=400)

    global class_collection
    class_obj = ClassObject()
    class_obj.classCode = class_code
    class_obj.name = class_name
    class_obj.owner = user
    class_collection.insert_one(class_obj.__dict__)
    return Response(class_code, status=200)


@app.route('/teacher/class/delete', methods=["POST"])
@verifyTeacherAuth
def removeClass(user):
    data = json.loads(request.data.decode("utf-8"))
    class_code = data.get("class_code")

    if class_code is None:
        return Response('{"error":"Empty class code"', status=400)

    if not (class_code in getClassCodeFromTeacher(user)):
        return Response('"error":"Class code not found"', status=404)

    global class_collection
    class_collection.delete_one({"classCode": class_code})
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
