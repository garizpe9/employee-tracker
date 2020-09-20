const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "NUxy6>cAoH",
  database: "employee_tracker",
});

connection.connect(function (err, res) {
  if (err) throw err;
  employeeinq();
});

function employeeinq() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees", //from employee table and join?
        "View All Employees by department", //from department tracker?
        "Add Employee", //use add functionality
        "Remove Employee", //use remove functioanlity
        "Update Employee Manager", //update role table
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          employeeSearch();
           break;
        // case "View All Employees by department":
        //   departmentSearch();
        //   break;
         case "Add Employee":
           addEmployee();
           break;
        // case "Remove Employee":
        //   removeEmployee();
        //   break;
        // case "Update Employee Manager":
        //   employeeManager();
        //   break;
      }
    });
}

//ask how to use console table
function employeeSearch() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;

    for (var i = 0; i < res.length; i++) {
      console.table(
        res[i].id +
          " | " +
          res[i].first_name +
          " | " +
          res[i].role_id +
          " | " +
          res[i].manager_id
      );
    }
    console.log("-----------------------------------");
  });
}

//function departmentSearch()

function addEmployee()