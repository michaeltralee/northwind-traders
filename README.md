NorthWind Traders

<p>This is a Milestone 3 student Project I developed as part of my training on the Code Institute Full Stack programming course, at Kerry ETB, Tralee, Ireland</p>

<p>Northwind Traders is a fictions company invented by Microsoft for the purpose of demonstrating their database products, using the Northwind database. Originally Northwind database came out in 1997 with Microsoft Access in order to teach programmers how to use that application.</p>

<p>This website project is based on the way NorthWind Traders database works in Microsoft Access. But all of the functionality is not implemented. At present this website only allows you do do the following: you can view the list of customer orders; you and view the details of each order in a popup modal and you can edit an individual order.</p>

<p>This website uses a MySQL database. It was ported over from the Access .mdb file format.</p>


<p>
There are 8 tables in the database:<br>
<ol>
<li>categories</li>
<li>customers</li>
<li>employees</li>
<li>order_details</li>
<li>orders</li>
<li>products</li>
<li>shippers</li>
<li>suppliers</li>
</ol>
The relationships between the tables is show in this diagram:<br>
<img src="https://github.com/michaeltralee/northwind-traders/blob/master/northwind_relationships.png?raw=true" alt="table relationships">
</p>
<p>
Only two options in the Orders menu are implemented: <b>View Orders</b> and <b>Edit Orders</b>.The other options just point to web page placeholders in the expectation that the website will be developed more in the future. 
</p>
<p>
If you wish to edit an order there are certain restrictions that apply:
<ol>
<li>You cannot insert a new order detail row.</li>
<li>You cannot delete an order detail row.</li>
</ol>
However, you can do the following:
<ol>
<li>You can change the 'Bill To' name and address from the dropdown list.</li>
<li>You can overwrite the 'Ship To' name and address.</li>
<li>You can change the 'Order Date', 'Required Date' and 'Shipped Date'</li>
<li>You can select a different product from a dropdown list of 77 products on any of the order details rows.<br>You will notice the 'Unit Price' cell will update.</li>
<li>You can change the 'Sales Person' from the dropdown list of 9 employees who work for the Northwind company.</li>
<li>If you edit the 'Unit Price' or the 'Quantity' or the 'Discount' amount the 'Extended Price' will update and the 'Sub Total' and 'Total' will also update automatically.</li>
</ol>
</p>
