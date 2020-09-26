//SEE FUNCTION NOTES FOR QUESTIONS ON ENTERING INFORMATION FROM FK & DUPLICATE VALUE REMOVAL
//ENSURE ALL FUNCTIONS HAVE EMPLOYEEINQ
//UPDATE EMPLOYEEINQ TO HAVE AN EXIT FEATURE

// Minimum Requirements
// Functional application.
// GitHub repository with a unique name and a README describing the project.
// The command-line application should allow users to:
// Add departments, roles, employees
// View departments, roles, employees
// Update employee roles
// Bonus
// The command-line application should allow users to:
// Update employee managers
// View employees by manager
// Delete departments, roles, and employees
// View the total utilized budget of a department -- ie the combined salaries of all employees in that department

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
        "Add a Department",
        "Add a Role",
        "View Departments",
        "View Roles",
        "View All Employees",
        "View All Employees by department",
        "Add Employee",
        "Remove Employee",
        "Update Employee Manager",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "View Roles":
          viewRoles();
          break;
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

//Add Departments
//=================================
function addDepartment() {
  connection
    .query(`SELECT * FROM employee_tracker.department`, function (
      err,
      results
    ) {
      if (err) throw err;
      inquirer.prompt([
        {
          type: "input",
          name: "addDept",
          message: "Enter Department Name",
        },
      ]);
    })
    .then((answer) => {
      connection.query("INSERT INTO role SET?", {
        name: answer.name,
      });
    });
}

//View all Employees
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
//View all Employees by Department
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
//Add Employee //HOW TO REMOVE DUPLICATE VALUES ?
//======================
function addEmployee() {
  var managerchoiceArray = [];
  var managerchoiceid = [];
  connection.query(
    `SELECT department.name AS department, employee.first_name, employee.last_name, role.title, role.salary,  manager.id, CONCAT(manager.first_name, " ",manager.last_name) AS manager
    FROM employee_tracker.employee
    LEFT JOIN role
    ON employee.role_id=role.id
    LEFT JOIN department
    ON role.department_id=department.id 
    LEFT JOIN employee manager  
    ON employee.manager_id=manager.id
    ORDER BY department.name`,
    function (err, results) {
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
            type: "rawlist",
            name: "role",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                if (results[i].title !== null) {
                  choiceArray.push(results[i].title);
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
              for (var i = 0; i < results.length; i++) {
                if (results[i].id !== null) {
                  managerchoiceArray.push(results[i].manager);
                }
              }
              return managerchoiceArray;
            },
            message: "What is the employee's manager?",
          },
        ])
        .then((answer) => {
          console.log("Adding Employee...\n");
          var manageranswer = answer.manager;
          var splitmanager = manageranswer.split(" ");
          console.log(splitmanager);
          // connection.query("INSERT INTO employee SET?", {
          //   first_name: answer.firstname,
          //   last_name: answer.lastname,
          //   role_id: answer.role,
          //   manager_id:
          //     managerchoiceid[managerchoiceArray.indexof(answer.manager)], ///this cannot be right since it is using an id for employee how to pull?
          //  connection.query() , {

          //});
        });
    }
  );
}
//Remove Employee
//=======================
function removeEmployee() {
  connection.query("SELECT * FROM employee", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(
                results[i].first_name + " " + results[i].last_name
              );
            }
            return choiceArray;
          },
          message: "Select Employee to remove",
        },
      ])
      .then((answer) => {});
  });
  employeeinq();
}
//ASK HOW TO DELETE THIS????

//connection.query( "DELETE FROM employee WHERE ?",
//     {
//       first_name: "answer.employee"
//        last_name: " answer.employee"
//
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
    `SELECT department.name AS department, employee.first_name, employee.last_name, role.title, role.salary, manager.id, CONCAT(manager.first_name, " ",manager.last_name) AS manager
    FROM employee_tracker.employee
    LEFT JOIN role
    ON employee.role_id=role.id
    LEFT JOIN department
    ON role.department_id=department.id 
    LEFT JOIN employee manager  
    ON employee.manager_id=manager.id
    ORDER BY department.name`,
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
                if (results[i].id !== null) {
                  choiceArray.push(results[i].id);
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
  employeeinq();
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
