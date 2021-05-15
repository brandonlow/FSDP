import shelve
from data   import TableRow, Table
from typing import List


class Feedback(TableRow):
    def __init__(self, uid: str = None, email: str = "", message: str = "", reply: str = ""):
        super().__init__(uid=uid)
        self.email      = email
        self.message = message
        self.reply = reply

    def to_json(self) -> dict:
        return {
            **(super().to_json()),
            "email":      self.email,
            "message": self.message,
            "reply": self.reply
        }

class TableFeedback(Table[Feedback]):
    def __init__(self, handle: shelve.Shelf):
        super().__init__(handle)

    @property
    def name(self) -> str:
        return "Feedback"

    def select(self, query: dict) -> List[Feedback]:
        import uuid
        contents = self.list()
        #   query["where"]["uuid"]
        if "where" in query:
            if "uuid" in query["where"]:
                contents = list(filter(lambda x: x.uuid == uuid.UUID(query["where"]["uuid"]), contents))
        if "limit" in query:
            assert ("offset" in query["limit"])
            assert ("size"   in query["limit"])
            offset   = query["limit"]["offset"]
            cap      = offset + query["limit"]["size"]
            cap      = cap if cap < len(contents) else len(contents)
            contents = contents[offset:cap]

        #   TODO: Support sorting by parameter
        # if "sort" in query:
            # sorted(contents, key=....)

        return contents
