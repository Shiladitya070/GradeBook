from flask import Flask, request, Response
from flask_cors import CORS
from SimilarScore import SimilarScore
import json

app = Flask(__name__)
CORS(app)


@app.route('/grade', methods=["GET", "POST"])
def evalGrade():
    rawdata = request.data.decode("utf-8")
    data = json.loads(rawdata)
    sentence1 = data.get("sentence1")
    sentence2 = data.get("sentence2")

    if sentence1 is None or sentence2 is None:
        return Response(status=400)

    return Response(SimilarScore([sentence1, sentence2]).similarity())


if __name__ == '__main__':
    app.run("0.0.0.0", port=8080)
