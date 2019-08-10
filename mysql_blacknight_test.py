import mysql.connector
import json
import locale
#import logging


class BlackNight:
	user = ''
	password = ''
	host = ''
	database = ''
	cnx = ''
  
	def connect(self):
		self.cnx = mysql.connector.connect(buffered=True, user = self.user, password = self.password, host = self.host, database = self.database)

	def __init__(self, user, password, host, database):
		self.user = user
		self.password = password
		self.host = host
		self.database = database
		self.connect()
	
	def queryExecute(self, sql):
		try:
			cursor = self.cnx.cursor()
			cursor.execute(sql)
		except mysql.connector.Error as err:
			self.connect()
			cursor = self.cnx.cursor()
			cursor.execute(sql)
		return cursor
  
  
  #------------------------------------------------
	def getOrders(self):

		query = 'select OrderID, CustomerID, CompanyName, date_format(OrderDate, "%Y-%m-%d") as OrderDate,  format(sum(SalePrice), 2) as Price, "button" from(select orders.OrderID, orders.CustomerID, CompanyName, OrderDate, products.ProductID, ProductName, order_details.UnitPrice * (1-order_details.Discount) * order_details.Quantity as SalePrice from orders inner join order_details on orders.OrderID = order_details.OrderID inner join customers on orders.CustomerID = customers.CustomerID inner join products on order_details.ProductID = products.ProductID where year(OrderDate) = "1998" order by OrderDate asc)as a group by OrderID;'
		cursor = self.queryExecute(query)
		row = cursor.column_names
		rows = cursor.fetchall()
		cursor.close()  
		myDict =	{"data": rows }
		return myDict;

  #-------------------------------------------------
  # Call sent to the server via ajax from vieworders.html
	def getFullOrder(self, orderID):
		myDict = {}
		query = 'SELECT orders.CustomerID, CompanyName, customers.Phone, customers.Address, customers.City, customers.Region, customers.PostalCode, customers.Country, OrderId, concat(employees.FirstName, " ", employees.LastName) as SalesPerson, date_format(OrderDate, "%Y-%m-%d") as OrderDate, date_format(RequiredDate, "%Y-%m-%d") as RequiredDate, date_format(ShippedDate, "%Y-%m-%d") as ShippedDate, ShipVia, Freight, ShipName, ShipAddress, ShipCity, ShipRegion, ShipPostalCode, ShipCountry FROM orders inner join employees on orders.EmployeeID = employees.EmployeeID inner join customers on orders.CustomerID = customers.CustomerID where orders.OrderID="'+ orderID +'";'
		cursor = self.queryExecute(query)
		values = cursor.fetchone()
		keys = cursor.column_names
		orders = dict(zip(keys, values))
		query = 'select OrderID, order_details.ProductID, ProductName, order_details.UnitPrice, Quantity, Discount, format(order_details.UnitPrice * (1- Discount) * Quantity, 2) as Total from order_details inner join products on order_details.ProductID = products.ProductID where order_details.OrderID = "'+ orderID +'";'
		cursor = self.queryExecute(query)
		numRows = cursor.rowcount
		keys = cursor.column_names
		order_details = []
		if numRows > 0:
			for row in range(numRows):
				values = cursor.fetchone() 
				arr = dict(zip(keys, values))
				order_details.append(arr)

			myDict =	{"orders": orders, "order_details": order_details}
		cursor.close() 
		return myDict 
  #-------------------------------------------------
	def getCustomers(self, orderID):
		myDict = {}
		customers = []
		element = -1
		query = 'select CustomerID from orders where OrderID = "' + orderID +'";'
		cursor = self.queryExecute(query)
		numRows = cursor.rowcount
		if numRows > 0:
			customerID = cursor.fetchone()[0]					
			query = 'SELECT CustomerID, CompanyName, Address, City, Region, PostalCode, Country FROM customers;'		
			
			cursor = self.queryExecute(query)
			numRows = cursor.rowcount
			keys = cursor.column_names
			
			if numRows > 0:
				for row in range(numRows):
					
					# Find the CustomerID belonging to orderID
					# and set it as element index into customers array where it was found.
					values = cursor.fetchone()
					if values[0] == customerID:
						element = row
					
					arr = dict(zip(keys, values))
					customers.append(arr)
				
				myDict = {"customers": customers, "customerId": customerID, "element": element}
		
		cursor.close() 
		return myDict
	#------------------------------------------------------
	# Get the employee name and employee id belonging to the order.
	# Also get a list of the employee names and their employee ids
	# Wrap them up into an object and return them to the client via ajax.
	def getEmployees(self, OrderID):
		myDict = {}
		employees = []
		
		# Get the EmployeeName and EmployeeID belonging to an order using OrderID
		query = 'SELECT orders.EmployeeID, concat(Lastname , ", ", FirstName) as EmployeeName FROM orders INNER JOIN employees ON orders.EmployeeID = employees.EmployeeID WHERE OrderID = "' + OrderID + '";' 
		cursor = self.queryExecute(query)
		numRows = cursor.rowcount
		if numRows > 0:
			values = cursor.fetchone()
			EmployeeID = values[0]
			EmployeeName = values[1]
			myDict = { "EmployeeName": EmployeeName, "EmployeeID": EmployeeID, "employees": []}
			
			query = 'SELECT EmployeeID, concat(Lastname , ", ", FirstName) AS EmployeeName from employees;'
			cursor = self.queryExecute(query)
			numRows = cursor.rowcount
			if numRows > 0:
				keys = cursor.column_names
				for row in range(numRows):
										
					# Get the values from a row and combine them into an object of key/value pairs
					values = cursor.fetchone()					
					arr = dict(zip(keys, values))
					employees.append(arr)
				
				myDict["employees"] = employees
		
		cursor.close()
		return myDict
	# -----------------------------------------------------
	def getProducts(self, OrderID):
		myDict = {}
		products = []
		
		# Create an object containing an array of all the products.
		# Each object contains ProductID, ProductName, UnitPrice from the products table.
		query = 'SELECT ProductID, ProductName, UnitPrice from products;'
		cursor = self.queryExecute(query)
		numRows = cursor.rowcount
		if numRows > 0:
			keys = cursor.column_names
			for row in range(numRows):
									
				# Get the values from a row and combine them into an object of key/value pairs
				values = cursor.fetchone()					
				arr = dict(zip(keys, values))
				products.append(arr)
			
			myDict = {"products": products}		
		
		cursor.close()
		return myDict
	# -----------------------------------------------------
	# Delete all the child order_details rows belonging to a particular order.
	def deleteOrderDetails(self, OrderID):

		query = ("DELETE FROM order_details WHERE OrderID ='%s' " % (OrderID))
		cursor = self.queryExecute(query)
		self.cnx.commit()
		count = cursor.rowcount
		cursor.close()
		#self.cnx.close()
		return count
	#------------------------------------------------------
	# Delete the row in the orders table referenced by a particular OrderID.
	def deleteOrdersRow(self, OrderID):
		msg = "ok"
		try:
			query = ("DELETE FROM orders WHERE OrderID ='%s' " % (OrderID))
			cursor = self.queryExecute(query)
			self.cnx.commit()
			count = cursor.rowcount
			cursor.close()
			#self.cnx.close()
		except Exception as e:
			msg = e

		
		return msg

	#------------------------------------------------------
	def	insertIntoOrderDetails(self, o):
		
		arr = o["order_details"]
		msg = 'ok'
		query = ''
		i = 0
		try:
			for rData in arr:
				s = ('INSERT INTO order_details (OrderID, ProductID, UnitPrice, Quantity, Discount) VALUES("%s", "%s", "%s", "%s", "%s")')
				
				OrderID =	str(rData['OrderID']).strip('\"')
				ProductID = str(rData['ProductID']).strip('\"')
				UnitPrice = str(rData['UnitPrice']).strip('\"')
				Quantity =	str(rData['Quantity']).strip('\"')			
				Discount =	str(rData['Discount']).strip('\"')
				
				query = s % (OrderID, ProductID, UnitPrice, Quantity, Discount)	
				print(query)		#for debugging
				cursor = self.queryExecute(query)
				self.cnx.commit()		
				cursor.close()  #closes the cursor after each rows is stored.

		except Exception as e:
			msg = e
		self.cnx.close()
		return msg
	#------------------------------------------------------
	def	insertIntoOrders(self, o):
		query = ''
		rData = o["orders"]
		s = ('INSERT INTO orders (OrderID, CustomerID, EmployeeID, OrderDate, RequiredDate, ShippedDate, ShipVia, Freight, ShipName, ShipAddress, '
			'ShipCity, ShipPostalCode, ShipCountry) VALUES("%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s", "%s");')
		keys = ['OrderID','CustomerID','EmployeeID','OrderDate','RequiredDate','ShippedDate','ShipVia',
				'Freight','ShipName','ShipAddress','ShipCity','ShipPostalCode','ShipCountry']	
		vars = []
		for i, key in enumerate(keys):
			# strip the double quotes off each key's paired value and store then in array vars
			vars.append(str(rData[key]).strip('\"'))
			
		# insert the values in the correct place holders of the formatted sql string.		
		query = s % tuple(vars)	
		print(query)			#for debugging
		cursor = self.queryExecute(query)
		self.cnx.commit()
		#count = cursor.rowcount
		cursor.close()
		self.cnx.close()
		
		return 'ok'
	#------------------------------------------------------
	def	commitOrder(self, data):
		msg = 'bad'
		o = data	# The data is already deserialise into a Python object.
		OrderID = int(str(o["orders"]["OrderID"]).strip('\"'))
		self.deleteOrderDetails(OrderID)
		self.deleteOrdersRow(OrderID)
		msg = self.insertIntoOrders(o)
		
		if msg == 'ok':
			msg = self.insertIntoOrderDetails(o)
			
		return msg
	