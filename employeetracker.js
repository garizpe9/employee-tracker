const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

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
        case "Remove Employee":
          removeEmployee();
          break;
        // case "Update Employee Manager":
        //   employeeManager();
        //   break;
      }
    });
}

//ask how to use foreign keys
//ask how to remove duplicate values in array

//View all Employees
//=================================
function employeeSearch() {
  connection.query(
    "SELECT * FROM employee Left Join role on employee.id=role.id",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
}

//View all Employees by Department
//=================================
//function departmentSearch()

//Add Employee
//======================
function addEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstname",
          message: "What is the employee's First Name?",
        },
        {
          type: "input",
          name: "lastname",
          message: "What is the employee's Last Name?",
        },
        {
          type: "input",
          name: "role",
          message: "What is the employee's role?",
        },
        {
          name: "manager",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              if (results[i].manager_id !== null) {
                choiceArray.push(results[i].manager_id);
              }
            }
            return choiceArray;
          },
          message: "Who is the employee's Manager",
        },
      ])
      .then((answer) => {
        console.log("Adding Employee...\n");
        connection.query("INSERT INTO employee SET?", {
          first_name: answer.firstname,
          last_name: answer.lastname,
          role_id: answer.role,
          manager_id: answer.manager,
        });
      });
  });
}

//Remove Employee
//=======================
function removeEmployee() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
          message: "Select Employee to remove",
        },
      ])
      .then((answer) => {
        console.log("good job");
      });
  });
}

//connection.query( "DELETE FROM employee WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }

//Update Manager
//===============================
// function employeeManager() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE `employee_tracker`.`employee` SET `manager_id` = 'potatoman' WHERE (`id` = '8');",
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }
