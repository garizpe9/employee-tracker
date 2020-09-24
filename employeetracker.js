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
        case "View All Employees by department":
          departmentSearch();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Update Employee Manager":
          employeeManager();
          break;
      }
    });
}
//View all Employees
//===============================
//ISSUES: HOW TO USE FOREIGN KEYS
//HOW TO REMOVE DUPLICATE VALUES
//HOW TO DELETE INFORMATION IN MULTIPLE TABLES (FOREIGN KEYS RELATED?)
//=================================
function employeeSearch() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ",manager.last_name) AS manager
    FROM employee_tracker.employee
    LEFT JOIN role
    ON employee.role_id=role.id
    LEFT JOIN department
    ON role.department_id=department.id 
    LEFT JOIN employee manager  
    ON employee.manager_id=manager.id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeinq();
    }
  );
}

//View all Employees by Department (Query needs to be fixed foreign key issue?)
//=================================
function departmentSearch() {
  connection.query(
    `SELECT department.name AS department, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(manager.first_name, " ",manager.last_name) AS manager
    FROM employee_tracker.employee
    LEFT JOIN role
    ON employee.role_id=role.id
    LEFT JOIN department
    ON role.department_id=department.id 
    LEFT JOIN employee manager  
    ON employee.manager_id=manager.id
    ORDER BY department.name`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeinq();
    }
  );
}

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
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              if (results[i].manager_id !== null) {
                choiceArray.push(results[i].manager_id);
              }
            }
            return choiceArray;
          },
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
        var query =
          "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
        query +=
          "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
        query += "= top5000.year) WHERE ?"; // (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";
        //connection.query(answer) {};
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
function employeeManager() {
  connection.query(
    "SELECT * FROM employee Left Join role on employee.id=role.id",
    function (err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            name: "employeeUpdate",
            type: "rawlist",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                if (results[i].name !== null) {
                  choiceArray.push(
                    results[i].first_name + " " + results[i].last_name
                  );
                }
              }
              return choiceArray;
            },
            message: "Select Employee",
          },
          {
            name: "managerUpdate",
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
            message: "Select Manager",
          },
        ])
        .then((answer) => {
          console.log("Adding Employee...\n");
        });
    }
  );
}

//
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
