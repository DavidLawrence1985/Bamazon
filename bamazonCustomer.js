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

function readProducts() {
    // console.log("Selecting all bamazon...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
       
      var table = new Table({//create table constructor npm cli table
            head: ["ID", "Product", 'Department', "Price $", "Quantity"]
        , colWidths: [10,25,25,15,15]
        });

        for(var i = 0;i < res.length; i++){   
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]//push each item into table 
            );
        }
            console.log(table.toString());

      
      purchase();
    });
  }

function purchase(){
    inquirer
    .prompt([{
      name: "idSelect",
      type: "input",
      message: "Select item to purchase by ID",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },{
        name: "quantity",
        type:"input",
        message: "How many would you like to purchase",
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }
        
    
    ])
    .then(function(answer) {
        var query = "SELECT item_id, product_name,price,stock_quantity FROM products WHERE item_id = ?"    
        connection.query(query, answer.idSelect, function(err, res) {
            
            if (err) throw err;

            else if(!res.length){
                console.log("\r\n____________________________________________________");
                console.log("\r\n!NO ITEM SELECETED\r\n CHECK ITEM ID NUBMER!");
                readProducts()
            }
            else if( answer.quantity > res[0].stock_quantity){
                console.log("\r\n____________________________________________________");
                console.log("\r\n!INSUFFICIENT QUANTITY\r\n CHECK ORDER AMOUNT!");
                readProducts()
            }
            
            else{

                var queryTwo = "UPDATE products SET stock_quantity=stock_quantity - ? WHERE item_id = ?"
                        
                connection.query(queryTwo, [answer.quantity, answer.idSelect], function(err, res) {
                    if (err) throw err;
                            
                })

                var queryFour = "UPDATE products SET product_sales = product_Sales + price * ? WHERE item_id = ?"//updates produce_sales
                
                
                connection.query(queryFour, [answer.quantity, answer.idSelect], function(err, res) {
                    
                    if (err) throw err;
                            
                })


                var queryThree = "SELECT item_id, product_name,price,stock_quantity FROM products WHERE item_id = ?"    
                connection.query(queryThree, answer.idSelect, function(err, res) {
                    if (err) throw err;
                    var x = res[0].price * answer.quantity
                    
                    var table = new Table({
                        head: ["Product", "Quantity", "Price"]
                        , colWidths: [25,25,20]
                    });
    
                    table.push(
                       [res[0].product_name, answer.quantity, "$" + x.toFixed(2)]
                    );
                    console.log("\r\n_____________________________ Order Details _____________________________\r\n");
                    console.log(table.toString());
                    console.log("\r\n_________________________________________________________________________");
                    after();
                
                });
            
        }

        });

    });
} 

function after(){
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "Make another purchase",
          "exit"
        ]
      })
      .then(function(answer) {  
        switch (answer.action) {
        case "Make another purchase":
            readProducts();
            break;
            
        case "exit":
            connection.end();
            break;
        }
      });
}

  readProducts();
