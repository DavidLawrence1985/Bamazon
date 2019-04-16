DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,4) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("Record Player", "Electronics", 74.50, 15),
  ("Growler", "Household", 12, 100),
  ("Hiking Boots", "Outdoors", 85, 40),
  ("Notebook", "Office", 0.75, 1500),
  ("Tent", "Outdoors", 100, 15),
  ("Cutting board", "Kitchen", 24, 95),
  ("Writing desk", "Household", 250, 8),
  ("Fight Club DVD", "Entertainment", 7.50, 50),
  ("T-shirt", "Clothing", 23, 300),
  ("Machi Koro", "Games", 15, 140);


-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)