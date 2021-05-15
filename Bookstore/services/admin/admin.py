from flask import Blueprint, current_app
from flask import render_template, wrappers   #session
from flask import redirect  #request

from data import Database
#from data.user import User, TableUsers
endpoint = Blueprint("admin", __name__)

# @endpoint.before_request
# def authorizer():
# 	#	Only allow logged in users
# 	if "user.uuid" not in session:
# 		return redirect("/login")
#
# 	if "user.refresh" in session:
# 		import  datetime
# 		dt_refreshed = datetime.datetime.utcfromtimestamp(session["user.refresh"])
# 		dt_now       = datetime.datetime.utcnow()
#
# 		if (dt_refreshed - dt_now).seconds > 60 * 15:
# 			return redirect("/expired")
#
# 	from data.user import User
#
# 	#	Check that the user in the session has the correct role
# 	current_user_uuid = session["user.uuid"]
# 	current_user_role = session["user.role"]
#
# 	if (current_user_role != 'admin'):
# 		return wrappers.Response(status = 403)


@endpoint.route("/dashboard")
def page_dashboard():
	import json
	import json
	from data.user import User, TableUsers
	from data.products import Product,TableProduct
	with Database() as db:
		table   = db.table(TableUsers)
		num=table.size()
		table.commit()
	with Database() as db:
		table   = db.table(TableProduct)
		Productnum=table.size()
		table.commit()

	data = {
		"books":[1,3,10,30,20,5,3,9,10],
		"sales":[39,20,11,35,26,27,30,40],
		"country":[40,20,10,10,10,10],
		"Busy days":[1,2,3,4,5,6,7]
	}

	return render_template("admin/dashboard.html", data=json.dumps(data),num=num,Productnum=Productnum)



@endpoint.route("/management-user")
def page_manage_users():
	return render_template("admin/manage-users/list.html")


@endpoint.route("/management-product")
def page_manage_products():
	return render_template("admin/manage-products/list.html")



@endpoint.route("/management-feedback")
def page_manage_feedbacks():
	return render_template("admin/manage-feedbacks/list.html")


@endpoint.route("/manage-users/<string:uuid>")
def page_manage_users_specific(uuid: str):
	from data.user import User, TableUsers

	with Database() as db:
		table   = db.table(TableUsers)
		results = table.select(query={
			"where" : {
				"uuid": uuid
			}
		})

		assert (len(results) == 1)
		user: User = results[0]

	from services.forms.user import FormUserProfile
	form               = FormUserProfile()
	form.username.data = user.username

	return render_template("admin/manage-users/detail.html", form=form, uuid=uuid)


@endpoint.route("/manage-users/list", methods=["GET"])
def api_manage_users_list():
	import json
	from data.user import User, TableUsers

	with Database() as db:
		table   = db.table(TableUsers)
		results = table.select(query = {

		})

		results = list(map(lambda x: x.to_json(), results))

		return wrappers.Response(
				status = 200,
				content_type = "application/json",
				response = json.dumps({
					"total": len(results),
					"rows":  results
				}))


@endpoint.route("/manage-users/<string:uuid>/update", methods=["POST"])
def api_manage_users_update(uuid: str):
	"""
	Updates existing user profile
	"""
	from services.forms.user import FormUserProfile
	from flask               import current_app
	import os

	form = FormUserProfile()

	profile_image = form.photo.data
	# Check if destination directory exists
	# Else create it
	target_path = os.path.join(current_app.instance_path, 'profile')
	if not os.path.exists(target_path):
		os.makedirs(target_path, exist_ok=True)

	# Save the file to /instance/profile/<uuid>
	profile_image.save(os.path.join(target_path, uuid))
	# Redirect back to original page
	return redirect(f"/admin/manage-users/{uuid}")


@endpoint.route("/manage-users/delete/<string:uuid>", methods=["GET", "POST"])
def api_manage_users_delete(uuid: str):
	from data.user import User, TableUsers
	from uuid import UUID
	with Database() as db:
		table   = db.table(TableUsers)
		table.delete(UUID(uuid))
		table.commit()
	return redirect("/admin/management-user")


#	-------	Display
#	List
#	Detail
#	------	API
#	Create	(After create OK, go to List)
#	Delete  (After delete OK, go to List)
#	Update	(After delete OK, go to Detail)

@endpoint.route("/manage-product", methods=["GET"])
def page_manage_product_list():
		return render_template("admin/manage-products/list.html")

#	Param Style
#	http://localhost:3000/manage-product/detail/<someid>
#	Query Style
#	http://localhost:3000/manage-product/detail?uuid=<someid>


@endpoint.route("/manage-product/detail/<string:uuid>", methods=["GET"])
def page_manage_product_detail(uuid: str):
	"""
	:param: uuid The uuid of the specific product that we want to see
	"""
	from data.products import Product, TableProduct
	from services.forms.product import ProductForm
	form = ProductForm()

	with Database() as db:
		table = db.table(TableProduct)
		target = table.select({
			"where": {
				"uuid": uuid
			}
		})
		#	Target Product found
		if len(target) == 1:
			target = target[0]
		else:
			raise KeyError(f"The specified product is not found {uuid}")

	form.name.data  = target.name
	form.price.data = target.centPrice

	return render_template("admin/manage-products/detail.html", form=form)


@endpoint.route("/manage-product/create", methods=["GET"])
def page_manage_product_create():
	"""
	Display page for creating new product
	"""
	from services.forms.product import ProductForm
	form = ProductForm()
	return render_template("admin/manage-products/create.html", form=form)


@endpoint.route("/manage-product/list", methods=["GET"])
def api_manage_product_list():
	from   data.products import Product, TableProduct
	import json

	with Database() as db:
		table = db.table(TableProduct)
		results = table.list()
		results = list(map(lambda x: x.to_json(), results))

		return wrappers.Response(
			status=200,
			content_type="application/json",
			response=json.dumps({
				"total": len(results),
				"rows": results
			}))


@endpoint.route("/manage-product/create", methods=["POST"])
def api_manage_product_create():
	"""
	Display page for creating new product
	Redirects to list page after finished
	"""
	from data.products import Product, TableProduct
	from services.forms.product import ProductForm
	from uuid import UUID
	from random import randint

	form = ProductForm()

	#	Test that the specified product exist
	#	TODO:	Make a FlaskForm to accept parameters to update the product
	try:
		with Database() as db:
			table = db.table(TableProduct)
			table.insert(Product(None, form.name.data, form.price.data))
			table.commit()

	except Exception as exception:
		current_app.logger.error(f"Failed to insert new product")
		current_app.logger.error(f"Exception: {exception}")
		# show error message whatever....

	# Redirecting by Absolute Path from domain
	return redirect("/admin/manage-product")


@endpoint.route("/manage-product/update/<string:uuid>", methods=["POST"])
def api_manage_product_update(uuid: str):
	"""
	Update a specified product
	Redirects to the same product page after finished
	:param: uuid The uuid of the specific product that we want to update
	"""
	from data.products import Product, TableProduct
	from uuid import UUID
	from services.forms.product import ProductForm
	form = ProductForm()

	#	Test that the specified product exist
	#	TODO:Make a FlaskForm to accept parameters to update the product

	try:
		with Database() as db:
			table  = db.table(TableProduct)
			target = table.select({
				"where": {
					"uuid": uuid
				}
			})
			#	Target Product found
			if len(target) == 1:
				target = target[0]
			else:
				raise KeyError(f"The specified product is not found {uuid}")

			#	TODO:	Update target with parameters from your form
			target.name=form.name.data
			target.price=form.price.data
<<<<<<< HEAD
			table.update(UUID(uuid), value=Product(name=target.name,centPrice=target.price))
=======
			table.update(UUID(uuid),value=Product(name=target.name,centPrice=target.price))
>>>>>>> 66618d3a595ecd00eb9cb4056bfc89c421dde917
			table.commit()

	except Exception as exception:
		current_app.logger.error(f"Failed to update: product of {uuid}")
		current_app.logger.error(f"Exception: {exception}")


	# Redirecting by Absolute Path from domain
<<<<<<< HEAD
	return redirect(f"/admin/manage-product")
=======
	return redirect("/admin/manage-product")
>>>>>>> 66618d3a595ecd00eb9cb4056bfc89c421dde917


@endpoint.route("/manage-product/delete/<string:uuid>", methods=["GET", "POST"])
def api_manage_product_delete(uuid: str):
	"""
	Delete a specified product
	Redirects to list page after finished
	:param: uuid The uuid of the specific product that we want to delete
	"""
	from data.products import Product, TableProduct
	from uuid import UUID

	try:
		with Database() as db:
			table = db.table(TableProduct)
			table.delete(UUID(uuid))
			table.commit()

	except Exception as exception:
		current_app.logger.error(f"Failed to delete: product of {uuid}")
		current_app.logger.error(f"Exception: {exception}")

	# Redirecting by Absolute Path from domain
	return redirect("/admin/manage-product")


""" Feedbacks """


@endpoint.route("/manage-feedback", methods=["GET"])
def page_manage_feedback_list():
	return render_template("admin/manage-feedbacks/list.html")


@endpoint.route("/manage-feedback/list", methods=["GET"])
def api_manage_feedback_list():
	from   data.feedbacks import Feedback, TableFeedback
	import json

	with Database() as db:
		table = db.table(TableFeedback)
		results = table.list()
		results = list(map(lambda x: x.to_json(), results))

		return wrappers.Response(
			status=200,
			content_type="application/json",
			response=json.dumps({
				"total": len(results),
				"rows": results
			}))


@endpoint.route("/manage-feedback/delete/<string:uuid>", methods=["GET", "POST"])
def api_manage_feedback_delete(uuid: str):
	from data.feedbacks import Feedback, TableFeedback
	from uuid import UUID

	try:
		with Database() as db:
			table = db.table(TableFeedback)
			table.delete(UUID(uuid))
			table.commit()

	except Exception as exception:
		current_app.logger.error(f"Failed to delete: product of {uuid}")
		current_app.logger.error(f"Exception: {exception}")

	return redirect("/admin/manage-feedback")


@endpoint.route("/manage-feedback/detail/<string:uuid>", methods=["GET"])
def page_manage_feedback_detail(uuid: str):
	from data.feedbacks import Feedback, TableFeedback
	from services.forms.reply import ReplyForm
	form = ReplyForm()

	with Database() as db:
		table = db.table(TableFeedback)
		target = table.select({
			"where": {
				"uuid": uuid
			}
		})
		#	Target Feedback found
		if len(target) == 1:
			target = target[0]
		else:
			raise KeyError(f"The specified product is not found {uuid}")

	form.reply.data = target.reply
	return render_template("admin/manage-feedbacks/reply.html", form=form, uuid=uuid, message=target.message, email=target.email)


@endpoint.route("/manage-feedback/update/<string:uuid>", methods=["POST"])
def api_manage_feedback_update(uuid: str):
	from data.feedbacks import Feedback, TableFeedback
	from uuid import UUID
	from services.forms.reply import ReplyForm
	form = ReplyForm()
	try:
		with Database() as db:
			table  = db.table(TableFeedback)
			target = table.select({
				"where": {
					"uuid": uuid
				}
			})
			if len(target) == 1:
				target = target[0]
				target.reply = form.reply.data
				table.update(UUID(uuid), value=Feedback(uid=uuid, email=target.email, message=target.message, reply=target.reply))
				table.commit()
			else:
				raise KeyError(f"The specified feedback is not found {uuid}")

			#	TODO:	Update target with parameters from your form
			# target.reply = form.reply.data
			# target.reply = "Reply Updated"
			# table.update(UUID(uuid))
			# table.commit()

	except Exception as exception:
		current_app.logger.error(f"Failed to update: feedback of {uuid}")
		current_app.logger.error(f"Exception: {exception}")

	return redirect(f"/admin/management-feedback")
