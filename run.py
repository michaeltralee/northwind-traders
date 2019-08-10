#import vars
import os
import json
from flask import Flask, render_template, request, flash, jsonify, json
from mysql_blacknight_test import BlackNight

USER = os.environ.get('USER')
PASSWORD = os.environ.get('PASSWORD')
HOST = os.environ.get('HOST')
DATABASE = os.environ.get('DATABASE')

# BNight is a global variable and is instantiated here only.
BNight = BlackNight(USER, PASSWORD, HOST, DATABASE)

app = Flask(__name__)
app.secret_key = 'some_secret'

#----------------------------------------------------------
# Not implemented
@app.route('/')
def root():
    return render_template("index.html")
# Not implemented

@app.route('/index')
def index():
    return render_template("index.html")

# Not implemented
@app.route('/about')
def about():
    return render_template("about.html")

# Not implemented
@app.route('/addaneworder')
def addaneworder():
    return render_template("addaneworder.html")

# Not implemented
@app.route('/deleteanorder')
def deleteanorder():
    return render_template("deleteanorder.html")

# Not implemented
@app.route('/viewcustomers')
def viewcustomers():
    return render_template("viewcustomers.html")

# Not implemented
@app.route('/editacustomer')
def editacustomer():
    return render_template("editacustomer.html")

# Not implemented
@app.route('/addanewcustomer')
def addanewcustomer():
    return render_template("addanewcustomer.html")

# Not implemented
@app.route('/deleteacustomer')
def deleteacustomer():
    return render_template("deleteacustomer.html")
#----------------------------------------------------------

# Display all of the orders in a scrolling table 
# with a view button and an edit button per row.
# When the user clicks on the view button a modal
# box pops up to show the details of that order.
@app.route('/vieworders')
def vieworders():   
	return render_template("vieworders.html")

# Returning orders data via ajax
# called via ajax by vieworders.html
@app.route('/ajaxgetorders')
def ajaxgetorders():
    return jsonify(BNight.getOrders())   

# When the user clicks on the view button in the 
# the scrolling table of the web page vieworders.html
# a function called getAjaxOrder(orderId)
# will call this server function '/ajaxgetorder'.
# The data is sent back via ajax to ther client
# to populate the modal box.
@app.route('/ajaxgetorder', methods=['POST'])
def ajaxgetorder():
	data = "bad"
	orderID = ""
	if request.method == "POST":
		orderID = (request.form["OrderID"])
		id = orderID.strip('\"')       
		data = jsonify(BNight.getFullOrder(id))
	
	return data

#----------------------------------------------------------
# Display the editorder.html page.
# Function within that page will fill in
# the data via ajax.
@app.route('/editorder')
def editorder():
	#orderID = str(request.args.get('id'))
	url = "editorder.html"
	return render_template(url)

# Client want to an object containing customers
@app.route('/ajaxgetcustomers', methods=['POST'])
def ajaxgetcustomers():
    
    data = "bad"
    orderID = ""
    if request.method == "POST":
        orderID = (request.form["OrderID"])
        
        id = orderID.strip('\"')
        
        data = jsonify(BNight.getCustomers(id))

    return data

# Client want to get an object containing all employees
@app.route('/ajaxgetemployees', methods=['POST'])
def ajaxgetemployees():
    
    data = "bad"
    orderID = ""
    if request.method == "POST":
        orderID = (request.form["OrderID"])        
        id = orderID.strip('\"')      
        data = jsonify(BNight.getEmployees(id))

    return data

# Client want to get an array of products objects.
# Each object will have ProductID, ProductName, UnitPrice from the products table.
# The data will be used by the client in a products dropdown list on each order details row.
@app.route('/ajaxgetproducts', methods=['POST'])
def ajaxgetproducts():
    
	data = "bad"
	orderID = ""
	if request.method == "POST":
		orderID = (request.form["OrderID"])        
		id = orderID.strip('\"')      
		data = jsonify(BNight.getProducts(id))

	return data

# Client has sent a json object containing the full data of an order.
@app.route('/ajaxsendorder', methods=['POST'])
def ajaxsendorder():
	msg = ''
	try:
		Order = json.loads(request.form["Order"])		
		msg = BNight.commitOrder(Order)
	except Exception as e:
		print(f'Got exception of type {type(e)}: {e}')
		msg = 'bad'
	
	return json.dumps(msg)
	
	


if __name__ == '__main__':
	# BNight = BlackNight(USER, PASSWORD, HOST, DATABASE)
	app.run(host=os.environ.get('IP'), port=int(os.environ.get('PORT') or "5000"), debug=True)

