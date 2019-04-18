var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "trilogy-2",

  // Your password
  password: "david123",
  database: "bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");
  });

function options() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View products for sale",
          "View low inventory",
          "Add inventory",
          "Add new product",
          "exit"
        ]
      })
      .then(function(answer) { //switch to select function 
        switch (answer.action) {
        case "View products for sale":
            readProducts();
            break;
  
        case "View low inventory":
            lowQuantity();
            break;
  
        case "Add inventory":
            addStock();
            break;
  
        case "Add new product":
            addNew();
            break;
            
        case "exit":
            connection.end();
            break;
        }
      });
  }

function show() {//shows products for add funtion
    
  var query = "SELECT item_id, IFNULL(product_name,'n/a') AS name, IFNULL(department_name,'n/a') AS dept, IFNULL(price,'0')"
        query+=" AS cost, IFNULL(stock_quantity,'0') AS amount FROM products"  

    connection.query(query, function(err, res) {
      if (err) throw err;
       
      var table = new Table({
            head: ["ID", "Product", 'Department', "Price $", "Quantity"]
        , colWidths: [10,25,25,15,20]
        });

        for(var i = 0;i < res.length; i++){   
            table.push(
                [res[i].item_id, res[i].name, res[i].dept, res[i].cost, res[i].amount]
            );
        }
            console.log("\r\n" + table.toString());
          
    });
    
  } 

function readProducts() {// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
    var query = "SELECT item_id, IFNULL(product_name,'n/a') AS name, IFNULL(department_name,'n/a') AS dept, IFNULL(price,'0')"
        query+=" AS cost, IFNULL(stock_quantity,'0') AS amount FROM products"  

    connection.query(query, function(err, res) {
      if (err) throw err;
       
      var table = new Table({
            head: ["ID", "Product", 'Department', "Price $", "Quantity"]
        , colWidths: [10,25,25,15,20]
        });

        for(var i = 0;i < res.length; i++){   
            table.push(
                [res[i].item_id, res[i].name, res[i].dept, res[i].cost, res[i].amount]
            );
        }
            console.log("\r\n" + table.toString());
            options();
            
    });
    
  }  

function lowQuantity(){// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) { //quantity under 10
        if (err) throw err

        var table = new Table({
            head: ["ID", "Product", 'Department', "Price $", "Quantity"]
        , colWidths: [10,25,25,15,20]
        });

        for(var i = 0;i < res.length; i++){   
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
            console.log("\r\n" + table.toString());
            options();
    });
    

}  

function addStock(){// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
    show();
    console.log("\r\n")
    inquirer
    .prompt([{
      name: "idSelect",
      type: "input",
      message: "Select product to add inventory by ID",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },{
        name: "quantity",
        type:"input",
        message: "How many would you like to add?",//something like else if value < stock_qunatity log not enough
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
        }
    }
    
    ])
    .then(function(answer) {
        var query = "SELECT item_id, product_name,price,stock_quantity FROM products WHERE item_id = ?";    
        connection.query(query, answer.idSelect, function(err, res) {
            
            if (err) throw err;

            else if(!res.length){
                console.log("\r\n____________________________________________________")
                console.log("\r\n!NO ITEM SELECETED CHECK ITEM ID NUBMER!");
                addStock()
            }
            
            else{

               var queryTwo = "UPDATE products SET stock_quantity=stock_quantity + ? WHERE item_id = ?"
                        // based on their answer, either call the bid or the post functions
                connection.query(queryTwo, [answer.quantity, answer.idSelect], function(err, res) {
                    if (err) throw err;
                
                     
                    console.log("\r\n");  
                    // show(); 
                    // options();
                    readProducts();       
                 })
            }
        });

    });
} 

function addNew(){// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
    inquirer
    .prompt([{
      name: "product_name",
      type: "input",
      message: "What product would you like to add?",
      validate: function(value) {
        if (value.length === 0) {
          return false;
        }
        return true;
      }
    },{
        name: "department_name",
        type:"input",
        message: "Which department of new product?",
        validate: function(value) {
          if (value.length === 0) {
            return false;
          }
          return true;
        }
    },{
        name: "price",
        type:"input",
        message: "Price?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    },{
        name: "stock_quantity",
        type:"input",
        message: "Quantity of new product?",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    },
    
    ])
    .then(function(answer) {

        var query = "INSERT INTO products SET ?";
        connection.query(query,
          {
            product_name: answer.product_name, 
            department_name: answer.department_name, 
            price: answer.price, 
            stock_quantity: answer.stock_quantity
          },
            
            function(err, res) {
          
            if (err) throw err;
            console.log("New product successfully added\r\n");
            // show();
            // console.log("\r\n");
            // options();
            readProducts();
        })
    })
    
}


options();




