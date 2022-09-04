const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Fixprinters.1!',
        database: 'employee_info_db'
    },
    console.log(`Connected to the employees database.`)
);

// need to connect to server before running inquirer
db.connect(function (err) {
    if (err) throw err;
    runSearch();
});

// function which prompts the user for what action they should take
function runSearch() {
    inquirer
        .prompt({
            name: 'action',
            type: 'list',
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "View Employees by Manager",
                "View Employees by Department",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "Update Employee Manager",
                "Delete Department",
                "Delete Role",
                "Delete Employee",
                "View Total Utilized Budget of a Department",
                "Exit"
            ],
        })
        .then(function (answer) {
            switch (answer.action) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;

                case 'View All Departments':
                    viewAllDepartments();
                    break;

                case 'View All Roles':
                    viewAllRoles();
                    break;

                case 'View Employees by Manager':
                    viewEmployeesByManager();
                    break;

                case 'View Employees by Department':
                    viewEmployeesByDepartment();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole();
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;


                case 'Delete Department':
                    deleteDepartment();
                    break;

                case 'Delete Role':
                    deleteRole();
                    break;

                case 'Delete Employee':
                    deleteEmployee();
                    break;

                case 'View Total Utilized Budget of a Department':
                    viewTotalUtilizedBudget();
                    break;

                case 'Exit':
                    exit();
                    break;
            }
        });
}

// view all employees 
function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

// view all departments
function viewAllDepartments() {
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

// view all roles
function viewAllRoles() {
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

