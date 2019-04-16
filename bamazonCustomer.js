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
       
      var table = new Table({
            head: ["ID", "Product", 'Department', "Price $", "Quantity"]
        , colWidths: [10,25,25,15,20]
        });

        for(var i = 0;i < res.length; i++){   
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
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
        message: "How many would you like to purchase",//something like else if value < stock_qunatity log not enough
        validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
    }
        //if answer.quantity > answer.idselect stock_quantity (show error)
    
    ])
    .then(function(answer) {
        var query = "SELECT item_id, product_name,price,stock_quantity FROM products WHERE item_id = ?"    
        connection.query(query, answer.idSelect, function(err, res) {
            
            if (err) throw err;

            else if(!res.length){
                console.log("\r\n____________________________________________________")
                console.log("\r\n!NO ITEM SELECETED\r\n CHECK ITEM ID NUBMER!");
                readProducts()
            }
            else if( answer.quantity > res[0].stock_quantity){
                console.log("\r\n____________________________________________________")
                console.log("\r\n!INSUFFICIENT QUANTITY\r\n CHECK ORDER AMOUNT!");
                readProducts()
            }
            
            else{

               var queryTwo = "UPDATE products SET stock_quantity=stock_quantity - ? WHERE item_id = ?"
                        // based on their answer, either call the bid or the post functions
                connection.query(queryTwo, [answer.quantity, answer.idSelect], function(err, res) {
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
                    console.log("\r\n_____________________________ Order Details _____________________________\r\n")
                    console.log(table.toString());
                    console.log("\r\n_________________________________________________________________________")
                    connection.end();
                
                })
            
        }

        })

    })
} 
// UPDATE products SET stock_quantity=stock_quantity - 5 WHERE item_id=4


  readProducts();


  
//   The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// in insuficiant quantity console.lognot enough
// if enough show order with item quantity and total price