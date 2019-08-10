CREATE TABLE IF NOT EXISTS sales (
    id INT AUTO_INCREMENT,
    customerID int,
    total decimal,
    PRIMARY KEY (id)
)  ENGINE=INNODB;