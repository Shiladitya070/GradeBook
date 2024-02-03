class StudentModel:
    def __init__(self):
        self.username = ""
        self.classJoined = []
        self.assignmentsSubmitted = []

    def __str__(self):
        return self.__dict__