from flask import Flask, render_template, wrappers, session
from flask import send_from_directory
import os
import data
import data.user
import uuid

app = Flask(__name__,
            template_folder=f"{os.getcwd()}/templates",
            static_folder=f"{os.getcwd()}/public",
            static_url_path=f"/public")

app.config["SECRET_KEY"] = "momgay"

def serve_file(path: str):
    """
    Serve files from dynamic folder via http://<domain>/dynamic/YourPath
    :param path:
    :return:
    """
    #   TODO: Check that the target path is valid
    #   os.path.....
    return send_from_directory(f"{os.getcwd()}/dynamic", path)


#   Main Entry Point
if __name__ == '__main__':

    from services.common      import endpoint as EPCommon
    from services.auth.auth   import endpoint as EPAuth
    from services.admin.admin import endpoint as EPAdmin
    from services.user.user  import endpoint as EPUser

    app.register_blueprint(EPCommon, url_prefix="/")
    app.register_blueprint(EPAuth,   url_prefix="/auth")
    app.register_blueprint(EPAdmin, url_prefix="/admin")
    app.register_blueprint(EPUser)



    with data.Database() as db:
        table = db.table(data.user.TableUsers)
        table.clear()
        table.insert(data.user.User(email= "admin@gmail.com", password = "0000", uid = str(uuid.UUID('00000000-0000-0000-0000-000000000000'))))
        # for i in range(20):
        #     table.insert(data.users.User(username = f"user{i:02d}", password = "P@ssw0rd", role = "user"))
        table.commit()

    # app.register_blueprint(EPAdmin, url_prefix="/admin")

    app.run(host="localhost", port=3000, debug=True)