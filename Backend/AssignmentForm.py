import json


class AssignmentForm:
    def __init__(self):
        self.id = ""
        self.title = ""
        self.classCode = ""
        self.qna = {}

    def set_id(self, id):
        self.id = id

    def set_title(self, title):
        self.title = title

    def parse(self, string_obj):
        data = json.loads(string_obj)
        self.id = data["id"]
        self.title = data["title"]
        self.qna = data["qna"]

    def __str__(self):
        return json.dumps({"id": self.id, "title": self.title, "qna": self.qna})
