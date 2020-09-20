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

//ask how to use console tables
//ask how to join tables
//=================================
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

function addEmployee() {
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
        type: "input",
        name: "manager",
        message: "What is the employee's Manager",
      },
    ])
    .then((answers) => {
      console.log(answers.firstname);
      console.log(answers.lastname);
      console.log(answers.role);
      console.log(answers.manager);
    });
}
// console.log("Inserting a new product...\n");
// var query = connection.query(
//   "INSERT INTO products SET ?",
//   {
//     flavor: "Rocky Road",
//     price: 3.0,
//     quantity: 50,
//   },
//   function (err, res) {
//     if (err) throw err;
//     console.log(res.affectedRows + " product inserted!\n");
//     // Call updateProduct AFTER the INSERT completes
//     updateProduct();
//   }
// );

// logs the actual query being run
// console.log(query.sql);

// function removeEmployee() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
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

// function employeeManager() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
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
