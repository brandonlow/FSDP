# class Admin:
#     def __init__(self, email, password):
#         self.__email = email
#         self.__password = password


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


class Admin:
    def __init__(self, username, email, password):
        self.__email = email
        self.__password = password
        self.__username = username

    @property
    def email(self):
        return self.__email

    @email.setter
    def email(self, email):
        self.__email = email

    @property
    def password(self):
        return self.__password

    @password.setter
    def password(self, password):
        self.__password = password

    @property
    def username(self):
        return self.__username

    @username.setter
    def username(self, username):
        self.__username = username



