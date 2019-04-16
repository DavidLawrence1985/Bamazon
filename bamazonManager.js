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
      .then(function(answer) {
        switch (answer.action) {
        case "View products for sale":
          readProducts();
          break;
  
        case "View low inventory":
          lowQuantity();
          break;
  
        case "Add inventory":
        //   rangeSearch();
          break;
  
        case "Add new product":
        //   songSearch();
          break;
            
        case "exit":
          connection.end();
          break;
        }
      });
  }




function readProducts() {
    // console.log("Selecting all bamazon...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
       
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
    });
    console.log("\r\n\r\n")
    options();
  }

function lowQuantity(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 10", function(err, res) { //quantity under 10
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
    });
    options();

}  

  
options();

//   List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.