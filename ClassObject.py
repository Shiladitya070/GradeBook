class ClassObject:
    def __init__(self):
        self.classCode = ""
        self.name = ""
        self.owner = ""
        self.assignments = []

    def __str__(self):
        return str(self.__dict__)
