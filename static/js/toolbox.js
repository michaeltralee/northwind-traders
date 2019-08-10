"use strict";
/*---------------------------------------------------------
	Michael Finnegan, August 2019.

	This is a class of helper methods for the 
	editorders.js functions to use.
	This class is mostly concerned with getting data from 
	and sending data to the MySql database via the Python server.
*/
class ToolBox {

	constructor(orderId) {
		this.orderId = JSON.stringify(orderId);
		this.CustomersData = {};
		this.OrderData = {};
		//Employee names and ids for the employees Listbox
		this.Employees = {};
		//select ProductID, ProductName, UnitPrice from products;
		this.ProductsData = {};
		
		this.CustomersDone = false;
		this.error = false;
	/* Example of OrderData
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

  } //end constructor
	/*-------------------------------------------------------
		Test if the ToolBox class is working.
	*/
	test(){
		//alert("Inside Test method of ToolBox class");
		console.log(this.OrderData);
	}
	/*---------------------------------------------
		My version of parseFloat in case the number in the string is comma formatted.
		return a floating point number from a string, stripping out any commas first.
	*/
	ParseFloat(s){
		if(s == '' || s == 'undefined' || s == null){
			return 0.0;
		}
		
		var chr, ss = '', i, l = s.length;
		s = s.toString();
		for(i = 0; i < l; i += 1){
			chr = s.charAt(i);
			if(((chr >= '0') && (chr <= '9')) || chr == '.' || chr == '-') {
				ss += chr;
			}
		}
		return parseFloat(ss);
	}

	/*----------------------------------------------
		Receive a string containing a number.
		return a reformatted version the number with commas seperating the thousands as a string.
	*/
	commaFormatted(amount) {
		var delimiter = ",";
		var a = amount.split('.', 2);
		var d = a[1];
		var i = parseInt(a[0]);
		if (isNaN(i)) {
			return '';
		}
		var minus = '';
		if (i < 0) {
			minus = '-';
		}
		i = Math.abs(i);
		var n = new String(i);
		var a = [];
		while (n.length > 3) {
			var nn = n.substr(n.length - 3);
			a.unshift(nn);
			n = n.substr(0, n.length - 3);
		}
		if (n.length > 0) {
			a.unshift(n);
		}
		n = a.join(delimiter);
		if (d.length < 1) {
			amount = n;
		} else {
			amount = n + '.' + d;
		}
		amount = minus + amount;
		return amount;
	}


	/*-----------------------------------------------------
		Given an Id reference in the DOM, set a value to it.
	*/
	setIdValue( id, value){
		let idObj = document.getElementById(id);
		if (idObj)
		{
			idObj.innerText = value;
		}
		return idObj;
	}
	/*-----------------------------------------------------
	*/
	getIdValue( id, k){
		let idObj = document.getElementById(id);
		return idObj[k];
	}



	/*-----------------------------------------------------
	*/
	setInputBoxValue(k, v){

		var x = document.getElementsByTagName("input");
        x[k].value = v;
		return 0;
	}
	/*-----------------------------------------------------
	*/
	getInputBoxValue(k){

		var x = document.getElementsByTagName("input");
        return x[k].value;
	}

	/*---------------------------------------------------------
		After the customers have been read in, 
		set up the option selection listbox in HTML,
		and select the default customer name,
		and set the 'Bill To' address, city, postal code and country.
	*/
	setupCustomersListbox(){
		//console.log(this.CustomersData);
		var Customers = this.CustomersData['customers'];
		var index = this.CustomersData['element'];
		var tdObj = document.getElementById('CompanyName');
		var len = Customers.length;
		var s = '', opt = '';
		
		for(let i = 0; i < len; i += 1){
			
			let aCustomer = Customers[i];
			let custName = aCustomer['CompanyName'];
			let custId = aCustomer['CustomerID'];
			opt += '<option value="' + custId + '"';
			
			//Select the default customer
			if(index == i){
				opt += ' selected'
			}
			opt += '>' + custName + '</option>';		
		}
		s = '<select id="custList" onChange=changeCustomer(this);>' + opt + '</select>';
		tdObj.innerHTML = s;
		var aCustomer = Customers[index];
		this.setIdValue('Address', aCustomer['Address']);
		this.setIdValue('City', aCustomer['City']);
		this.setIdValue('PostalCode', aCustomer['PostalCode']);
		this.setIdValue('Country', aCustomer['Country']);

		return 0;
	}
	
	/*-----------------------------------------------------
	*/
	setupOrderValuesInDOM(){
		//alert("setupOrderValuesinDOM()");
		var orders = this.OrderData['orders'];
		var k, v, keys=['ShipName', 'ShipAddress', 'ShipCity','ShipPostalCode', 'OrderDate', 'RequiredDate', 'ShippedDate', 'ShipCountry'];
		
		for(let i = 0 ; i < keys.length; i +=1){
			k = keys[i];
			v = orders[k];
			this.setInputBoxValue(k, v);
		}
		this.setIdValue('OrderId', orders['OrderId']);
		var shipVia = (+orders['ShipVia']);
		
		for(let i = 1; i <= 3; i += 1)
		{
			let obj = document.getElementById('ShipVia'+i);
			
			if( i == shipVia){
				obj['checked'] = 'checked';
			}else{
				obj['checked'] = false;
			}
		}
		this.setIdValue('order-title-number', orders['OrderId']);
		return 0;
	}
	/*-----------------------------------------------------
		Set up the employees listbox from the data already in
		the object this.Employees
	*/
	setupEmployeesInListbox(){
		
		var Employees = this.Employees['employees'], opt = '', index = this.Employees['EmployeeID'], s = '';
		var tdObj = document.getElementById('SalesPerson');
		for(let i = 0; i < Employees.length; i += 1){
			let anEmployee = Employees[i];
			let empId = anEmployee['EmployeeID'];
			let empName = anEmployee['EmployeeName'];
			opt += '<option value="' + empId + '"';
			if(index == empId){
				opt += ' selected';
			}
			opt += '>' + empName + '</option>';			
		}
		s = '<select id="empList">' + opt + '</select>';
		tdObj.innerHTML = s;
	}
	/*---------------------------------------------------------
		Create a row of 5 cells based on the row data in a Row object.
		a row object looks like this:
		{
		  "Discount": 0.15,
		  "OrderID": 10808,
		  "ProductID": 56,
		  "ProductName": "Gnocchi di nonna Alice",
		  "Quantity": 20,
		  "Total": "646.00",
		  "UnitPrice": 38
		},
		rowObj = the order_details row as an object read in from a row in the database
		row = 0.. the row number.
	*/

	getOrderDetailsHTMLRow(rowObj, row){
		if(! rowObj){
			return '<tr><td>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>';
		}
		
		var keys = ['ProductName', 'UnitPrice', 'Quantity', 'Discount', 'Total'];
		var aRow = '<tr id="row' + row +'">';
		var total = 0, opt, s, pID;
		
		for(let i = 0; i < 5; i += 1)
		{
				let k = keys[i];
				let v = rowObj[k];

				switch(i){
					case 0: 
						//Product name
						//Create the dropdown listbox and set the ProductName in v as the selected item.
						//Setup the onchange function to changeProduct(this);
						let index = +rowObj['ProductID'];
						for(let ii = 0; ii < this.ProductsData['products'].length; ii += 1){
							pID = +this.ProductsData['products'][ii]['ProductID'];
							opt += '<option  value="' + pID + '"';
							if( index == pID){
								opt += ' selected';
							}
							opt += '>' +  this.ProductsData['products'][ii]['ProductName'] + '</option>';
						}
						v = '<select class="productsList" id="row' + row +'" onChange=changeProduct(this);>' + opt + '</select>';
						break;
					
					case 1:
						//Unit Price
						//Format the unit price. Then create an input box for it to go inside.
						s = (''+v);
						s = this.ParseFloat(s);	
						s = (s).toFixed(2);
						v = '<input class="orderDetailsInputBox" type="text" name="unitprice"' + row + '" value="' + s + '" onChange=updateTotals(this); >';
						break;
					
					case 2:
						//Quantity
						//Format the quantity. Then create an input box for it to go inside.
						s = (''+v);
						s = this.ParseFloat(s);	
						s = (s).toFixed(0);
						v = '<input class="orderDetailsInputBox" type="text" name="quantity"' + row + '" value="' + s + '" onChange=updateTotals(this);>';
						break;

					case 3:
						//Discount
						//Format the discount. Then create an input box for it to go inside.
						// Discount: change 0.05 to 5%
						v = +v;
						s = (v * 100).toFixed(0) + '%';
						v = '<input class="orderDetailsInputBox" type="text" name="discount"' + row + '" value="' + s + '" onChange=updateTotals(this);>';
						break;

					case 4:
						//Row Total (Extended Price)
						//The row total cannot be edited because it is calculated based on the values in
						// unit price, quantity and discount.
						v = (''+v);
						v = this.ParseFloat(v);
						total = v;
						v = '<span>' + this.commaFormatted((v).toFixed(2)) + '</span>';

						break;


				}//end switch
				//Center align all the columns except the last one.
				//Right align the totals column.
				if(i < 4){
					aRow += '<td>' + v + '</td>';
				}else{
					aRow += '<td class="orderDetailsTotal">' + v + '</td>';
				}
		}//end for
		aRow += '</tr>';
		return {'aRow': aRow, 'total': total };
	}

	/*-----------------------------------------------------
		called by the .done() method of the outer method getProductsArr()
		The array of products objects have been read in.
		Create the order details rows.
		Although the product name will come from the order data,
		a dropdown list must be created, with the product name from the list
		selected that matches the product name in the order_details product name for that row.

	*/
	createOrderDetailsRows(){
		var orderDetails = this.OrderData['order_details'] || null;
		var bodyRows = '', freight, v;
		var subTotal = 0;
		if(! orderDetails){
			bodyRows = '<tr><td>Missing data</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>';
		}else{
		
			for(let i = 0; i < orderDetails.length; i += 1)
			{
				let rowObj = orderDetails[i];
				let obj = this.getOrderDetailsHTMLRow(rowObj, i);

				bodyRows += obj['aRow'];
				subTotal += +obj['total'];
			}
		}
		var body = document.getElementById('orderDetailsBody');
		body.innerHTML = bodyRows;

		document.getElementById('SubTotal').innerText = this.commaFormatted(''+ (subTotal).toFixed(2));
		var total = +this.OrderData['orders']['Freight'] + subTotal;
		document.getElementById('ExtendedTotal').innerText = this.commaFormatted(''+ (total).toFixed(2));

		//TODO fix Freigh
		freight = +this.OrderData['orders']['Freight'];
		v = this.commaFormatted(''+ (freight).toFixed(2));
		this.setInputBoxValue('Freight', v);

		return 0;
	}
	/*-----------------------------------------------------
		Update the subTotal at the end of every row.
		Then update the subtotal and the grand total in the 
		little table at the bottom of the order details table.
		This method is called every time the user changes a figure in the inputbox on an order detail row,
		or if the user changes the 'Freight' amount.
	*/
	updateTotals(){
		var rows = document.getElementById('orderDetailsBody')['rows'], subTotal=0, freight, x, grandTotal;
		//console.log(rows[0]['cells'][4].innerText);
		//console.log(rows[0]['cells'][1]['children'][0]['value']);		//Unit Price
		//console.log(rows[0]['cells'][2]['children'][0]['value']);		//Quantity
		//console.log(rows[0]['cells'][3]['children'][0]['value']);		//Discount
		//console.log(rows[0]['cells'][4]['children'][0]['value']);		//Extented Price
		//console.log(rows[0]['cells'][4]['innerText']);
		//this.commaFormatted(''+ (unitPrice).toFixed(2));

		//Calculate the 'Extended Price' cell of every row in the order-details HTML table.
		//And set it in its cell as a string comma formatted.
		for(let r = 0; r < rows.length; r += 1){
			let unitPrice = this.ParseFloat(rows[r]['cells'][1]['children'][0]['value']);
			let quantity = this.ParseFloat(rows[r]['cells'][2]['children'][0]['value']);
			let discount = this.ParseFloat(rows[r]['cells'][3]['children'][0]['value']);
			if(discount >= 1.0){
				discount = discount /100.0;
			}
			let extPrice = (unitPrice * (1 - discount)) * quantity;
			rows[r]['cells'][4]['innerText'] = this.commaFormatted(''+ (extPrice).toFixed(2));
			subTotal += extPrice;
			if(discount < 1.0){
				discount = (discount * 100.0);
			}
			rows[r]['cells'][3]['children'][0]['value'] = ''+ ((discount).toFixed(0)) + '%';
		}
		
		x = this.commaFormatted(''+ (subTotal).toFixed(2));
		this.setIdValue('SubTotal', x);
		
		freight = this.ParseFloat(this.getInputBoxValue('Freight'));
		x = this.commaFormatted(''+ (freight).toFixed(2));
		this.setInputBoxValue('Freight', x);

		grandTotal = subTotal + freight;
		x = this.commaFormatted(''+ (grandTotal).toFixed(2));
		this.setIdValue('ExtendedTotal', x);

		return 0;
	}
	/*-----------------------------------------------------
		A different product name was selected from the product 
		listbox on one of the order details rows.
		1. Set the new 'Unit Price' amount.
		2. Update the totals.
	*/
	changeProduct(v){
		var rowObj = v, unitPrice = 0;		
		let vv = +rowObj['options'][v['selectedIndex']].value; //the ProductID value in the products array.
				
		//Find the original 'UnitPrice' from the products table of the product item the user selected from the dropdown list.
		//and set that unit price in the 'Unit Price' cell of the row that the user is on. Comma format it.
		for(let i = 0; i < this.ProductsData['products'].length; i += 1){
			let pId = +this.ProductsData['products'][i]['ProductID'];
			if( pId == vv ){
				unitPrice = +this.ParseFloat(''+this.ProductsData['products'][i]['UnitPrice']);			
				break;
			}
		}
		rowObj = document.getElementById(v['id']);		
		rowObj['cells'][1]['children'][0]['value'] = this.commaFormatted(''+ (unitPrice).toFixed(2));
		
		return this.updateTotals();		
	}
	/*-----------------------------------------------------
		Read all of the products into an array. 
	*/
	getProductsArr(){
		var that = this;
		$.ajax({
		  method: "POST",
		  url: "/ajaxgetproducts",
		  data: { OrderID: that.orderId }
		})
		.done(function( resp ) {
			that.ProductsData = resp;
			console.log(resp);
			return that.createOrderDetailsRows();			
		})
		.fail(function(){
			alert("Ajax Failed in setupProductsArr()");
			that.error = true;
			return false;
		});

	}

	/*-----------------------------------------------------
		Send a request via AJax to get an object containing
		a list of customers records, including all of the customers 
		names, 'Bill To' addresses.
		fnc = the function that does something with the data after it arrives.
	*/
	getCustomers() {
		var that = this;
		$.ajax({
		  method: "POST",
		  url: "/ajaxgetcustomers",
		  data: { OrderID: that.orderId }
		})
		.done(function( resp ) {
			that.CustomersData = resp;
			that.setupCustomersListbox();
			that.CustomersDone = true;
			that.error = false;
			return that.getOrder();
			
		})
		.fail(function(){
			alert("Ajax Failed in getCustomers()");
			that.CustomersDone = false;
			that.error = true;
			return false;
		});

  }
  	/*-----------------------------------------------------
		See example of contents of OrderData above.
		getCustomers(); must already have been called before calling 
		this function.
		getCustomers(); calles this function.
	*/
	getOrder(){
		var that = this;
		$.ajax({
		  method: "POST",
		  url: "/ajaxgetorder",
		  data: { OrderID: that.orderId }
		})
		.done(function( resp ) {
			that.OrderData = resp;
			
			//console.log(resp);
			//Setup the Ship To values and the Order ID,
			//Order Date, Required Date, and Shipped Dates vales in the DOM.
			that.setupOrderValuesInDOM();
			return that.getEmployees();
			
			
			
		})
		.fail(function(){
			alert("Ajax Failed in getOrder()");
		});

	}
	/*-----------------------------------------------------
		Called by the .done() method of getOrder()

		Get an object containing three outer keys:
		"EmployeeName", "EmployeeID" and "employees"
		
		The "employees" key has a value that is an array of employee objects.
		Each object has two sets of key/value pairs: the EmployeeID and EmployeeName
		
		The first two out keys are the name to select at the top of the listbox.
		The array of keys are the employee names to go into the listbox of option.
	*/
	getEmployees(){
		var that = this;
		$.ajax({
		  method: "POST",
		  url: "/ajaxgetemployees",
		  data: { OrderID: that.orderId }
		})
		.done(function( resp ) {
			that.Employees = resp;
			
			console.log(resp);
			
			that.setupEmployeesInListbox();
			//setup the order_details rows
			//First: read all of the products rows into an array called that.ProductsData
			//getProductsArr() calls createOrderDetailsRows()
			return that.getProductsArr();
					
		})
		.fail(function(){
			alert("Ajax Failed in getEmployees()");
		});
	}
	/*-----------------------------------------------------
	*/
	ajaxSendOrder(Order){
		var that = this;
		var o = JSON.stringify(Order);
		$.ajax({
		  method: "POST",
		  url: "/ajaxsendorder",
		  data: {Order: o}
		})
		.done(function( resp ) {
			let msg = JSON.parse(resp);
			
			if(msg == "ok"){
				alert("The order updated successfully.");
			}else{
				alert(msg);
			}
				
			return false;
					
		})
		.fail(function(){
			alert("Ajax Failed in ajaxSendOrder(Order)");
		});
	}

	/*-----------------------------------------------------
		Prepare the big object representing the customer order
		to contain all the key/value pairs to be
		send to the Python server and to the MySQL database via JQuery's ajax. 
	*/
	submitCustomerOrder(){
	
		var Order; //{"order_details": [], "orders": {}};
		var order_detailsKeys = ['OrderID', 'ProductID', 'UnitPrice', 'Quantity', 'Discount'];
		var ordersKeys = ['OrderID', 'CustomerID', 'EmployeeID', 'OrderDate', 'RequiredDate', 'ShippedDate', 'ShipVia', 'Freight', 
		'ShipName', 'ShipAddress', 'ShipCity', 'ShipRegion', 'ShipPostalCode', 'ShipCountry'];
		var orders = {};
		
		for(let i = 0; i < ordersKeys.length; i +=1){
			let k = ordersKeys[i];
			switch(k){
				case 'OrderID':
					orders[k] = document.getElementById('OrderId').innerText;
					break;				
				case 'CustomerID':
					let index = document.getElementById("custList").selectedIndex;
					let aCustomer = this.CustomersData['customers'][index];
					orders[k] = aCustomer['CustomerID'];
					//orders[k] =  this.OrderData['orders']['CustomerID'];
					break;
				case 'EmployeeID':
					let obj = document.getElementById('empList');
					orders[k] = obj['options'][obj['selectedIndex']].value;
					break;
				case 'OrderDate':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'RequiredDate':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShippedDate':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShipVia':
					for(let ii = 1; ii < 4; ii +=1){
						let s = 'ShipVia' +ii;
						if(document.getElementById(s).checked){
							orders[k] = ''+ ii;
							break;
						}
					}
					break;
				case 'Freight':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShipName':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShipAddress':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShipCity':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
			/*
				case 'ShipRegion':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
			*/
				case 'ShipPostalCode':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;
				case 'ShipCountry':
					orders[k] = document.getElementById(k)['firstElementChild'].value;
					break;

			}//end select

		}//end for
		//var rows = document.getElementById('OrderDetailsBody')['rows'];
		var rows = document.getElementById('orderDetailsBody')['rows'];
		var aRow, arr = [];
		/*
			Iterate through the HTML order details rows in order to
			create an array of objects. Each object is a row of key/value pairs
			that will go into the order_details MySQL table.
		*/		
		for(let r = 0; r < rows.length; r += 1){
			aRow = {};
			aRow['OrderID'] = orders['OrderID'];
			let obj = document.getElementById('row'+r);
			let index = obj['cells'][0]['children'][0]['selectedIndex'];    
			aRow['ProductID'] = obj['cells'][0]['children'][0]['options'][index].value;						
			aRow['UnitPrice'] = this.ParseFloat(rows[r]['cells'][1]['children'][0]['value']);
			aRow['Quantity'] = this.ParseFloat(rows[r]['cells'][2]['children'][0]['value']);
			aRow['Discount'] = (this.ParseFloat(rows[r]['cells'][3]['children'][0]['value']) /100);
			arr.push(aRow);					
		}
		Order = {"orders": orders, "order_details": arr}; 
		//console.log(Order);
		return this.ajaxSendOrder(Order);	
	}
	//-------------------------------------------------



}