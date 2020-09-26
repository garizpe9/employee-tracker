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
        "View Departments",
        "Add a Department",
        "Remove a Department",
        "View Roles",
        "Add a Role",
        "Remove a Role",
        "View All Employees",
        "Add Employee",
        "Remove Employee",
        "View All Employees by Department",
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
        case "View All Employees by Department":
          departmentSearch();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "Remove a Department":
          removeDept();
          break;
        case "Remove a Role":
          removeRole();
          break;
      }
    });
}
//Add Departments
//=================================
function addDepartment() {
  connection.query(`SELECT * FROM employee_tracker.department`, function (
    err,
    results
  ) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "addDept",
          message: "Enter Department Name",
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department SET?",
          {
            name: answer.addDept,
          },
          function (err) {
            if (err) throw err;
            console.log("Department was successfully added");
            employeeinq();
          }
        );
      });
  });
}
//Add Role
//=================================
function addRole() {
  connection.query(
    `SELECT * FROM employee_tracker.role
    LEFT JOIN department
    ON role.department_id=department.id`,
    function (err, results) {
      if (err) throw err;
      inquirer
        .prompt([
          {
            type: "input",
            name: "addrole",
            message: "Enter Role Title",
          },
          {
            type: "input",
            name: "salary",
            message: "Enter Salary Amount",
          },
          {
            type: "list",
            name: "departmentid",
            choices: function () {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                if (results[i].department_id !== null) {
                  choiceArray.push(
                    results[i].department_id + "." + " " + results[i].name
                  );
                }
                var unique = new Set(choiceArray);
                var backtoarr = [...unique];
              }
              return backtoarr;
            },

            message: "What Department?",
          },
        ])
        .then((answer) => {
          var dept = answer.departmentid;
          var splitdept = dept.split("");
          connection.query(
            "INSERT INTO role SET?",
            {
              title: answer.addrole,
              salary: answer.salary,
              department_id: splitdept[0],
            },
            function (err) {
              if (err) throw err;
              console.log("Role was successfully added\n");
              employeeinq();
            }
          );
        });
    }
  );
}
//View all Roles
//=================================
function viewRoles() {
  connection.query(
    `SELECT title as Roles FROM employee_tracker.role;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeinq();
    }
  );
}
//View all Departments
//=================================
function viewDepartments() {
  connection.query(
    `SELECT name as Departments FROM employee_tracker.department;`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeinq();
    }
  );
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
  connection.query(`SELECT * FROM role;`, function (err, results) {
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
                choiceArray.push(results[i].id + ". " + results[i].title);
              }
            }
            return choiceArray;
          },
          message: "What is the employee's role?",
        },
      ])
      .then((answer) => {
        var roleanswer = answer.role;
        var splitrole = roleanswer.split(". ");
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answer.firstname,
            last_name: answer.lastname,
            role_id: splitrole[0],
          },
          function (err) {
            if (err) throw err;
            console.log("Employee was successfully added!\n");
            employeeinq();
          }
        );
      });
  });
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
      .then((answer) => {
        connection.query(
          "Delete from Employee where CONCAT (first_name, ' ', last_name) = ?",
          [answer.employee],
          function (err, res) {
            if (err) throw err;
            console.log("Employee Removed\n");
            employeeinq();
          }
        );
      });
  });
}
//Remove Dept
//====================
function removeDept() {
  connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "department",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].name);
            }
            return choiceArray;
          },
          message: "Select a Department to remove",
        },
      ])
      .then((answer) => {
        connection.query(
          "Delete from Department where name = ?",
          [answer.department],
          function (err, res) {
            if (err) throw err;
            console.log("Department Removed\n");
            employeeinq();
          }
        );
      });
  });
}
//Remove Role
//====================
function removeRole() {
  connection.query("SELECT * FROM role", function (err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "role",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
            }
            return choiceArray;
          },
          message: "Select a Role to remove",
        },
      ])
      .then((answer) => {
        connection.query(
          "Delete from role where title = ?",
          [answer.role],
          function (err, res) {
            if (err) throw err;
            console.log("Role Removed\n");
            employeeinq();
          }
        );
      });
  });
}
