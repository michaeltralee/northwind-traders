<h3>NorthWind Traders</h3>

<p>This is a Milestone 3 student Project I developed as part of my training on the Code Institute Full Stack programming course, at Kerry ETB, Tralee, Ireland</p>

<p>Northwind Traders is a fictions company invented by Microsoft for the purpose of demonstrating their database products, using the Northwind database. Originally Northwind database came out in 1997 with Microsoft Access in order to teach programmers how to use that application.</p>

<p>This website project is based on the way NorthWind Traders database works in Microsoft Access. But all of the functionality is not implemented. At present this website only allows you to do the following: you can view the list of customer orders; you and view the details of each order in a popup modal and you can edit an individual order.</p>

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
<p>&nbsp;</p>
<p><h3>Technical details</h3></p>
<p>This project is written in Python 3 for the server side and Javascript for 
the client side. The database query language is MySQL.</p>
<p>A live demonstration of this project can be seen on the Heroku website at
<a href="https://northwind-traders.herokuapp.com/index">
https://northwind-traders.herokuapp.com/index</a></p>
<p>The data passing back and forth between the server and the client takes place 
using JQuery's Ajax methods. When the client wants to see all of the customer 
orders for 1998, the client sends an Ajax request to the server. Python receives 
the request and sends an SQL query to the remote database. The database is 
hosted remotely on a server in Carlow, Ireland. The Python server running on 
Heroku is probably somewhere in San Francisco, California, and the client with 
his web browser could be anywhere in the world. Yet all of this data passes 
quickly and seamlessly between the client and the server without the user 
realising the circuitous path it takes to reach its destination.</p>
<p>The passwords and other variables used to access the database are not stored 
in the source code on Github. They are setup in the Heroku environment settings 
page and also in the AWS Cloud9 .bashrc file.</p>
<p><H3>Platforms and tools I used to develop this Project</H3></p>
<p>I have an account on Amazon Web Services. I mainly developed the project offline on my local computer. 
I have MySql server runing on my localhost for 
testing and development. Then, towards the end of the project, I uploaded all of 
the files to Cloud9 on AWS. From there I used Cloud9's bash console to 
export the project to Github. I had previously set up a free account on Heroku 
with the automatic deploys setting switched on, (which polls github regularly for updates ). I also linked my Heroku account to 
Github. Then I setup the environment variables on Heroku for database access.
<br>
<br>
I used Microsoft's Front Page to help with the complex design of the order form. 
Although this software is considered outdated by most people, (it was written in 
2004) still, I find it useful. <br>
I used Bootstrap 4 as the responsive web page framework. I added on customised 
CSS to improve the appearance of the order form.</p>
<p>About 65% of the programming is done in Javascript on the client side. I also 
used the DataTable library from <a href="https://datatables.net/">
https://datatables.net/</a> and plugged it into the Bootstrap framework. The 
scrolling, searchable orders table is done in DataTables. I did some programming 
in Javascript to place an Edit and a View button on each row of the scrolling 
orders table, with hyperkinks to target a dynamic Bootstrap modal popup 
box. The modal box is dynamic in the sense that the data for the modal is not 
hard-coded into the HTML page. The modal box gets its data by making an Ajax 
request to the server based on the ID value of the row the user clicked on. When 
the data comes back in (asynchronously) from the server it triggers a previously 
registered function in JQuery's Ajax done method. This registered method then 
plugs the relevant bits of data into the appropriate placeholders in the modal 
box's boilerplate HTML code. This all happens quite quickly such that the user doesn't 
give it a thought, but just expects the full details of an order to pop up in the 
modal box automatically.</p>
<p>EditPlus 5 is my favourite programming editor. I like it better than Visual 
Studio Code or PyCharm because it is very easy to use and I like the attractive 
syntax colouring against a white background. But I also use Visual Studio Code 
to edit, run, test and debug the Python code on my localhost. </p>
<p>Firefox is my preferred web browser for rendering the web pages and for 
debugging the Javascript code.</p>
<p>I use Oracle's MySql Workbench database editor on my localhost to develop and debug my Sql scripts before I embed them into Python as strings.</p>
<p>&nbsp;</p>
<p>This Northwind project was developed in just two weeks. It is only a small 
demonstration of displaying orders and looking into the details of an order. But 
it helped me to understand more about Python programming, and also how to put up 
a data-centric project on Heroku, and have them host it for free.</p>
<p>&nbsp;</p>
<p>Michael Finnegan, Kerry ETB, Tralee, Ireland. © 2019. 
<p>&nbsp;</p>

