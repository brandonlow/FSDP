# class User:
#     def __init__(self, username, email, password):
#         self.__email = email
#         self.__password = password
#         self.__username = username

#     @property
#     def email(self):
#         return self.__email
#     @email.setter
#     def email(self, email):
#         self.__email = email

#     @property
#     def password(self):
#         return self.__password
#     @password.setter
#     def password(self, password):
#         self.__password = password

#     @property
#     def username(self):
#         return self.__username
#     @username.setter
#     def username(self, username):
#         self.__username = username

import shelve
# from data import open_database
from data import TableRow, Table
from typing import List, Dict

import uuid
import hashlib


class User(TableRow):
    """
	This represents a single row in the user table
	"""

    # _private_key = object()
    def __init__(self, uid: str = None, username: str = "", password: str = "", email: str = ""):
        """
		:param key: private constructor blocker
		:param uid: universally unique identifier
		:param username: username
		:param password: password hashed
		"""
        # if key is not User._private_key:
        # 	raise PermissionError("This structure cannot be constructed publicly. Please use via parent Table")
        super().__init__(uid)
        try:
            self._username = username
            self._password = str(hashlib.sha256(password.encode()).hexdigest())
            self._email = email
        except Exception as exception:
            raise exception

    @property
    def username(self):
        """
		:return: The specified username
		"""
        return self._username

    @property
    def password(self):
        """
		:return: The hashed password
		"""
        return self._password

    @property
    def email(self):
        """
		:return: The role of the user account
		"""
        return self._email

    def password_change(self, password_old: str, password_new: str) -> bool:
        """
		Updates the password of this user. The old password must match in order to succeed.
		:param password_old: str The old password in plain string
		:param password_new: str The new password in plain string
		:return: success or failure
		"""
        password_old = str(hashlib.sha256(password_old.encode('utf-8')).hexdigest())

        if self._password == password_old:
            self._password = str(hashlib.sha256(password_new.encode('utf-8')).hexdigest())
            return True
        else:
            return False

    def password_reset(self, password_new: str):
        self._password = str(hashlib.sha256(password_new.encode('utf-8')).hexdigest())

    def to_json(self) -> dict:
        return {
            **(super().to_json()),
            "username": self._username,
            "email": self._email
        }


class TableUsers(Table[User]):
    def __init__(self, handle: shelve.Shelf):
        super().__init__(handle)

    @property
    def name(self) -> str:
        return "Users"

    def select(self, query: dict) -> List[User]:
        contents = self.list()

        if "where" in query:
            if "uuid" in query["where"]:
                contents = list(filter(lambda x: x.uuid == uuid.UUID(query["where"]["uuid"]), contents))
            if "username" in query["where"]:
                contents = list(filter(lambda x: x.username == query["where"]["username"], contents))
            if "password" in query["where"]:
                contents = list(filter(lambda x: x.password == query["where"]["password"], contents))
            if "email" in query["where"]:
                contents = list(filter(lambda x: x.email == query["where"]["email"], contents))

        if "order" in query:
            if "username" in query["order"]:
                contents = sorted(contents, key=lambda x: x.username)

        return contents
