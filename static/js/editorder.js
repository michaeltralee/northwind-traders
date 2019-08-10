	"use strict";
	/* This is an example of an order object received via ajax from Python.
		There are two outer keys: "order_details" and "orders".
		"orders" value is one single object, whereas "order_details" value is an
		array of objects, one for each row.
		{
		  "order_details": [
			{
			  "Discount": 0,
			  "OrderID": 10966,
			  "ProductID": 37,
			  "ProductName": "Gravad lax",
			  "Quantity": 8,
			  "Total": "208.00",
			  "UnitPrice": 26
			},
			{
			  "Discount": 0.15,
			  "OrderID": 10966,
			  "ProductID": 56,
			  "ProductName": "Gnocchi di nonna Alice",
			  "Quantity": 12,
			  "Total": "387.60",
			  "UnitPrice": 38
			},
			{
			  "Discount": 0.15,
			  "OrderID": 10966,
			  "ProductID": 62,
			  "ProductName": "Tarte au sucre",
			  "Quantity": 12,
			  "Total": "502.86",
			  "UnitPrice": 49.3
			}
		  ],
		  "orders": {
			"Address": "Hauptstr. 29",
			"City": "Bern",
			"CompanyName": "Chop-suey Chinese",
			"Country": "Switzerland",
			"CustomerID": "CHOPS",
			"Freight": 27.19,
			"OrderDate": "1998-03-20",
			"OrderId": 10966,
			"Phone": "0452-076545",
			"PostalCode": "3012",
			"Region": "",
			"RequiredDate": "1998-04-17",
			"SalesPerson": "Margaret Peacock",
			"ShipAddress": "Hauptstr. 31",
			"ShipCity": "Bern",
			"ShipCountry": "Switzerland",
			"ShipName": "Chop-suey Chinese",
			"ShipPostalCode": "3012",
			"ShipRegion": "",
			"ShipVia": 1,
			"ShippedDate": "1998-04-08"
		  }
		}
	*/
	function getParameterByName(name, url) {
			if (!url) url = window.location.href;
			name = name.replace(/[\[\]]/g, '\\$&');
			var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}
	//-----------------------------------------------------
	var TB = {}; //Global variable not yet set.

	/*-----------------------------------------------------
		The user has changed the customer name from the dropdown listbox. 
		1. In the "Bill To" selection set the new address, City, postal code and country.
		2. In the "Ship To:" section set the new CompanyName, address, City, Postal Code, and country.
	*/
	function changeCustomer(v){

		//var x = document.getElementById("mySelect").selectedIndex;
		//alert(document.getElementsByTagName("option")[x].value);

		var index = document.getElementById("custList").selectedIndex
		var aCustomer = TB.CustomersData['customers'][index];
	
		TB.setIdValue('Address', aCustomer['Address']);
		TB.setIdValue('City', aCustomer['City']);
		TB.setIdValue('PostalCode', aCustomer['PostalCode']);
		TB.setIdValue('Country', aCustomer['Country']);

		//In the "Ship To:" section set the new ShipName, ShipAddress, ShipCity, ShipPostalCode, ShipCountry
		var x = document.getElementsByTagName("input");
        x["ShipName"].value			= aCustomer['CompanyName'];
		x["ShipAddress"].value		= aCustomer['Address'];
		x["ShipCity"].value			= aCustomer['City'];
		x["ShipPostalCode"].value	= aCustomer['PostalCode'];
		x["ShipCountry"].value		= aCustomer['Country'];
		
		return false;
	}
	/*-----------------------------------------------------
		This function runs automatically when the web page is loaded.
		1. Get the OrderId from the end of the url or prompt the user
		for it. Then send an Ajax request to the server requesting the order data.
		including the order details rows data.
		2. set the values into the appropriate places in the HTML order template.
		3. 
	*/
		$(	function(){
				
				var orderId = getParameterByName('id');
				//alert("id: " + orderId);
				if (orderId == null)
				{
					  orderId = prompt("Please enter an OrderId:", "10952");
				}
				TB = new ToolBox(orderId);		//Instantiate global var
				//GetCustomers  calls getOrder()
				//The method TB.getCustomers() sets up the Customs list box in the DOM
				//Then getOrder calls TB.setupOrderValuesInDOM()
				//Then getOrder calles getEmployees()
				TB.getCustomers();				
				
		}
	);
	/*---------------------------------------------------------
		The user clicked on one of the checkboxes.
		1. untick all of the checkboxes.
		2. Tick the checkbox the user selected
	*/
	function changeCheckboxes(v){
		var i, checkboxId, obj;
		
		console.log(v);
		for(i = 1; i <=3 ; i += 1){
			checkboxId = "ShipVia" + i;
			document.getElementById(checkboxId).checked = false;
		}
		v['checked'] = true;
	}
	/*---------------------------------------------------------
	*/
	function updateTotals(){
		return TB.updateTotals();
	}
	/*---------------------------------------------------------
	*/
	function changeProduct(v){
		return TB.changeProduct(v);
	}
	//---------------------------------------------------------
	function submitCustomerOrder(){		
		TB.submitCustomerOrder();	
		return false;
	}
	//-----------------------------------------------------