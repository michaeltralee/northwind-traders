create table sales
select format(sum(d.tt), 2) as total, d.year from
(
	select c.Company as Company, c.total as tt, format(c.total, 2) as total, year(c.OrderDate) as Year from
	(
		select b.Company, sum(b.total) as total, b.OrderDate from 
		(
			select a.OrderId, a.CompanyName as Company, sum(a.UnitPrice * (1- a.Discount)*a.Quantity) as total, a.OrderDate from 
			(
				select customers.CompanyName, orders.OrderID, order_details.UnitPrice, OrderDate, Discount, Quantity from orders
				inner join order_details on orders.OrderID = order_details.OrderID
				inner join products on order_details.ProductID = products.ProductID
				inner join customers on orders.CustomerID = customers.CustomerID
			) as a 
			group by a.OrderId  having year(a.OrderDate) = '1998'
		) as b
		group by b.Company
		order by total desc
	) as c
) as d
group by d.year
;