DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  product_sales DECIMAL(10,2) NULL,
  PRIMARY KEY (item_id)
);
INSERT INTO products (product_name, department_name, price, stock_quantity,product_sales)
VALUES  ("Record Player", "electronics", 74.50, 15,0),
  ("Growler", "household", 12, 100,0),
  ("Hiking Boots", "outdoors", 85, 40,0),
  ("Notebook", "office", 0.75, 1500,0),
  ("Tent", "outdoors", 100, 15,0),
  ("Cutting board", "kitchen", 24, 95,0),
  ("Writing desk", "furniture",250,4,0),
  ("Fight Club DVD", "entertainment", 7.50, 50,0),
  ("T-shirt", "clothing", 23, 300,0),
  ("Machi Koro", "games", 15, 140,0);

CREATE TABLE departments (
  department_id INT AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(100),
  over_head_costs DECIMAL(10,2)NULL,
  PRIMARY KEY (department_id)
  );
  
  INSERT INTO departments (department_name, over_head_costs)
  VALUES ("electronics","500"),
	("household", "800"),
	("outdoors", "750"),
    ("office", "150"),
    ("kitchen", "450"),
    ("entertainment","100"),
    ("clothing","3000"),
    ("games", "700");
  
-- item_id (unique id for each product)
-- product_name (Name of product)
-- department_name
-- price (cost to customer)
-- stock_quantity (how much of the product is available in stores)