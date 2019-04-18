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
          "View product sales by department",
          "Create new department",
          "exit"
        ]
      })
      .then(function(answer) { //switch to select function 
        switch (answer.action) {
        case "View product sales by department":
            viewDepartment();
            break;
  
        case "Create new department":
            createNew();
            break;
            
        case "exit":
            connection.end();
            break;
        }
      });
  }

function viewDepartment(){
 
  var query = "SELECT products.department_name, IFNULL(SUM(products.product_sales),0) AS sales, departments.department_id, departments.over_head_costs FROM products INNER JOIN"
      query += " departments On products.department_name = departments.department_name GROUP BY department_name";
      
      connection.query(query, function(err, res) {//join tables
        if (err) throw err;

        var table = new Table({//create table constructor npm cli table
            head: ["Department ID", "Department Name", "Overhead costs", "Product Sales", "Total Profit"]
        , colWidths: [10,20,20,15,15]
        });

        for(var i = 0;i < res.length; i++){   
            var x =res[i].sales - res[i].over_head_costs;//var for profit
                
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].sales, x.toFixed(2)]//push each item into table 
            );

        }
            console.log(table.toString());
            options()
    });
    
}  

function createNew(){
  inquirer
  .prompt([{
    name: "newdepartment",
    type: "input",
    message: "Name of new department",
    validate: function(value) {
      if (value.length === 0) {
        return false;
      }
      return true;
    }
  },{
      name: "overhead",
      type:"input",
      message: "Department overhead costs",
      validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
  }
])
  .then(function(answer) {
    var query = "INSERT INTO departments SET ?"
    
    connection.query(query,
      {
        department_name: answer.newdepartment, 
        over_head_costs: answer.overhead
      }, 
      function(err, res) {
      if (err) throw err;
      
    })

    var queryTwo = "INSERT INTO products SET ?"

    connection.query(queryTwo,
      {
        department_name: answer.newdepartment,
        product_sales: "0",
      },
      function(err, res){
      if (err) throw err;
    })

  viewDepartment();  
  });  
  
}


options();