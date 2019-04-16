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

}  

function createNew(){

}

options();