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
                "Update Department Role",
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

                case 'Update Department Role':
                    updateRoleDepartment();
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
    // including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
    db.query(`
        SELECT employee.id, 
        CONCAT(employee.first_name, " ", employee.last_name) 
        AS employee_name, role.title, department.name AS department, 
        role.salary, CONCAT(manager.first_name, " ", manager.last_name) 
        AS manager FROM employee 
        LEFT JOIN role ON employee.role_id = role.id 
        LEFT JOIN department ON role.department_id = department.id 
        LEFT JOIN employee manager ON manager.id = employee.manager_id`
        , function (err, res) {
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
    // gets all roles with salary and name of department
    db.query('SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id', function (err, res) {
        //db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    });
}

function viewEmployeesByManager() {
    // get employees 
    db.query('SELECT * FROM employee WHERE manager_id IS NULL', function (err, res) {
        let managerArray = [];
        for (let i = 0; i < res.length; i++) {
            // get manager first and last name and push and id to array
            managerArray.push(res[i].first_name + " " + res[i].last_name + " " + res[i].id);
        }
        inquirer
            .prompt([
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Which manager would you like to view?',
                    choices: managerArray
                }
            ])
            .then(function (answer) {
                let managerId = answer.manager.replace(/\D/g, '');
                // concat employee first and last name from employee table get role name and Manager name from employee table
                db.query(`
                    SELECT employee.id, 
                    CONCAT(employee.first_name, " ", employee.last_name) 
                    AS employee_name, role.title, department.name AS department, 
                    CONCAT(manager.first_name, " ", manager.last_name) 
                    AS manager FROM employee 
                    LEFT JOIN role ON employee.role_id = role.id 
                    LEFT JOIN department ON role.department_id = department.id 
                    LEFT JOIN employee manager ON manager.id = employee.manager_id WHERE employee.manager_id = ?`
                    , [managerId], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        runSearch();
                    });
            });
    });
}

// view all employees by department
function viewEmployeesByDepartment() {
    db.query('SELECT * FROM department', function (err, res) {
        let departmentArray = [];
        for (let i = 0; i < res.length; i++) {
            // get department name and push and id to array
            departmentArray.push(res[i].name + " " + res[i].id);
        }
        inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'list',
                    message: 'Which department would you like to view?',
                    choices: departmentArray
                }
            ])
            .then(function (answer) {
                let departmentId = answer.department;
                // gets just the depeartment number from the array
                departmentId = departmentId.replace(/\D/g, '');
                console.log(departmentId);
                // concats employee first and last name from employee table get role name and department name from employee table
                db.query(
                    `SELECT employee.id, 
                    CONCAT(employee.first_name, " ", employee.last_name) 
                    AS employee_name, role.title, department.name 
                    AS department FROM employee 
                    LEFT JOIN role 
                    ON employee.role_id = role.id 
                    LEFT JOIN department 
                    ON role.department_id = department.id 
                    WHERE department.id = ?`
                    , [departmentId], function (err, res) {
                        if (err) throw err;
                        console.table(res);
                        runSearch();
                    });
            });
    });
}

// add employee
function addEmployee() {
    // get all rolles and push to array
    db.query('SELECT * FROM role', function (err, res) {
        let roleArray = [];
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title + " " + res[i].id);
        }
        // get manager first and last name and id and push to array
        db.query('SELECT * FROM employee WHERE manager_id IS NULL', function (err, res) {
            let managerArray = [];
            for (let i = 0; i < res.length; i++) {
                managerArray.push(res[i].first_name + " " + res[i].last_name + " " + res[i].id);
            }
            inquirer
                .prompt([
                    {
                        name: 'first_name',
                        type: 'input',
                        message: 'What is the employee first name?'

                    },
                    {
                        name: 'last_name',
                        type: 'input',
                        message: 'What is the employee last name?'

                    },
                    {
                        name: 'role',
                        type: 'list',
                        message: 'What is the employee role?',
                        choices: roleArray
                    },
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is the employee manager?',
                        choices: managerArray
                    }
                ])
                .then(function (answer) {
                    let roleId = answer.role.split(" ");
                    let managerId = answer.manager.split(" ");
                    db.query('INSERT INTO employee SET ?', {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: roleId[2],
                        manager_id: managerId[2]
                    }, function (err, res) {
                        if (err) throw err;
                        console.log('Employee added successfully!');
                        runSearch();
                    });
                });
        });
    });
}

// add department
function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'name',
                type: 'input',
                message: "What is the name of the department?"
            },
        ])
        .then(function (answer) {
            db.query(
                'INSERT INTO department SET ?',
                {
                    name: answer.name,
                },
                function (err) {
                    if (err) throw err;
                    console.log('Your department was created successfully!');
                    // re-prompt the user for if they want to bid or post
                    runSearch();
                }
            );
        });
}

// add role
function addRole() {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title of the role?"
            },
            {
                name: 'salary',
                type: 'input',
                message: "What is the salary of the role?"
            },
            {
                name: 'department_id',
                type: 'input',
                message: "What is the department ID of the role?"
            },
        ])
        .then(function (answer) {
            db.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.department_id,
                },
                function (err) {
                    if (err) throw err;
                    console.log('Your role was created successfully!');
                    // re-prompt the user for if they want to bid or post
                    runSearch();
                }
            );
        });
}

// update role 
function updateRoleDepartment() {
    // update role to assing department
    db.query('SELECT * FROM role', function (err, res) {
        let roleArray = [];
        for (let i = 0; i < res.length; i++) {
            roleArray.push(res[i].title + " " + res[i].id);
        }
        inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'Which role would you like to update?',
                    choices: roleArray
                },
                {
                    name: 'department_id',
                    type: 'input',
                    message: 'What is the department ID?'
                }
            ])
            .then(function (answer) {
                let roleId = answer.role.split(" ");
                db.query('UPDATE role SET ? WHERE ?',
                    [
                        {
                            department_id: answer.department_id
                        },
                        {
                            id: roleId[2]
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        console.log('Role updated successfully!');
                        runSearch();
                    });
            });
    });
}

// update employee role
function updateEmployeeRole() {
    // get list of employees and their roles and push to array then get department titles and roles 
    db.query(`
            SELECT employee.id, 
            CONCAT(employee.first_name, " ", employee.last_name) AS employee_name, 
            role.title, department.name 
            AS department FROM employee 
            LEFT JOIN role 
            ON employee.role_id = role.id 
            LEFT JOIN department 
            ON role.department_id = department.id`
        , function (err, res) {
            let employeeArray = [];
            for (let i = 0; i < res.length; i++) {
                employeeArray.push(res[i].employee_name + " " + res[i].id);
            }
            db.query('SELECT * FROM role', function (err, res) {
                let roleArray = [];
                for (let i = 0; i < res.length; i++) {
                    roleArray.push(res[i].title + " " + res[i].id);
                }
                inquirer
                    .prompt([
                        {
                            name: 'employee',
                            type: 'list',
                            message: 'Which employee would you like to update?',
                            choices: employeeArray
                        },
                        {
                            name: 'role',
                            type: 'list',
                            message: 'What is the new role?',
                            choices: roleArray
                        }
                    ])
                    .then(function (answer) {
                        let employeeId = answer.employee.replace(/\D/g, '');
                        console.log(employeeId);
                        let roleId = answer.role.replace(/\D/g, '');
                        console.log(roleId);
                        console.log(answer.employee);
                        console.log(answer.role);
                        db.query('UPDATE employee SET ? WHERE ?',
                            [
                                {
                                    role_id: roleId
                                },
                                {
                                    id: employeeId
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                console.log('Employee updated successfully!');
                                runSearch();
                            });
                    });
            });
        }
    );
}

// update employee manager
function updateEmployeeManager() {
    // get list of employees and id's and push to array for choices in inquirer that are not null
    db.query('SELECT * FROM employee WHERE manager_id IS NOT NULL', function (err, res) {
        if (err) throw err;
        let employeeArray = [];
        for (let i = 0; i < res.length; i++) {
            employeeArray.push(res[i].first_name + " " + res[i].last_name + " " + res[i].id);
        }
        inquirer
            .prompt([
                {
                    name: 'employee',
                    type: 'list',
                    message: 'Which employee would you like to update?',
                    choices: employeeArray
                },
            ])
            .then(function (answer) {
                let employeeId = answer.employee.replace(/\D/g, '');
                // get list of managers and id's and push to array for choices in inquirer
                db.query('SELECT * FROM employee WHERE manager_id IS NULL', function (err, res) {
                    if (err) throw err;
                    let managerArray = [];
                    for (let i = 0; i < res.length; i++) {
                        managerArray.push(res[i].first_name + " " + res[i].last_name + " " + res[i].id);
                    }
                    inquirer
                        .prompt([
                            {
                                name: 'manager',
                                type: 'list',
                                message: 'Who is the new manager?',
                                choices: managerArray
                            },
                        ])
                        .then(function (answer) {
                            let managerId = answer.manager.replace(/\D/g, '');
                            console.log(managerId);
                            db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId], function (err, res) {
                                if (err) throw err;
                                console.log('Employee updated successfully!');
                                runSearch();
                            });
                        });
                });
            });
    });

}

// delete employee
function deleteEmployee() {
    // get list of employees and their roles and id
    db.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        // using input from user get id of employee to delete
        inquirer
            .prompt([
                {
                    name: 'id',
                    type: 'input',
                    message: "What is the ID of the employee you would like to delete?"
                }
            ])
            .then(function (answer) {
                db.query(
                    'DELETE FROM employee WHERE id = ?',
                    [
                        answer.id,
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log('Your employee was deleted successfully!');
                        // show updated employee using ID that was input from user
                        db.query('SELECT * FROM employee WHERE id = ?', [answer.id], function (err, res) {
                            if (err) throw err;
                            console.table(res);

                            runSearch();
                        }
                        );
                    });
            });
    });
}

// delete department
function deleteDepartment() {
    // get list of departments and their id
    db.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        // get departments in array
        let departmentArray = [];
        for (let i = 0; i < res.length; i++) {
            departmentArray.push(res[i].name + " " + res[i].id);
        }
        inquirer
            .prompt([
                {
                    name: 'department',
                    type: 'list',
                    message: 'Which department would you like to delete?',
                    choices: departmentArray
                },
            ])
            .then(function (answer) {
                let departmentId = answer.department.split(" ");
                db.query('DELETE FROM department WHERE id = ?', [departmentId[1]], function (err, res) {
                    if (err) throw err;
                    console.log('Department deleted successfully!');
                    runSearch();
                });
            });
    });

}

// delete role
function deleteRole() {
    // get list of roles and their id
    db.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        // using input from user get id of role to delete
        inquirer
            .prompt([
                {
                    name: 'id',
                    type: 'input',
                    message: "What is the ID of the role you would like to delete?"
                },
            ])
            .then(function (answer) {
                db.query(
                    'DELETE FROM role WHERE id = ?',
                    [
                        answer.id,
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log('Your role was deleted successfully!');
                        // show updated role using ID that was input from user
                        db.query('SELECT * FROM role WHERE id = ?', [answer.id], function (err, res) {
                            if (err) throw err;
                            console.table(res);

                            runSearch();
                        }
                        );
                    });
            });
    });
}

function viewTotalUtilizedBudget() {
    db.query(`SELECT department.name, 
            SUM(salary) AS total_salary 
            FROM employee 
            INNER JOIN role 
            ON employee.role_id = role.id 
            INNER JOIN department 
            ON role.department_id = department.id 
            GROUP BY department.name`
        , function (err, res) {
            if (err) throw err;
            console.table(res);
            let budgetArray = [];
            for (let i = 0; i < res.length; i++) {
                budgetArray.push(res[i].total_salary);
            }
            let totalBudget = budgetArray.map(Number);
            let total = totalBudget.reduce((a, b) => a + b, 0);
            let totalBudgetFormatted = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            console.log("Total Budget: " + totalBudgetFormatted);
            runSearch();
        });
}

// exit
function exit() {
    db.end();
    console.log('Goodbye!');
    process.exit();
}

