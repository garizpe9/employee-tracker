DROP DATABASE IF EXISTS employee_tracker;
CREATE database employee_tracker;

USE employee_tracker;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(100) NOT NULL,
  salary DECIMAL(100) NOT NULL,
  department_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id VARCHAR(100) NOT NULL,
  manager_id VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

SELECT * FROM department;
select * from role;
select * from employee;
