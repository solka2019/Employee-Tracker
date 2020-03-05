const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const connection = require("./connection");
let managersArray;
let employeeArray;
let dArray;

start();

// Initalize
function start() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "task",
                choices: [
                    "View All Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "View All Roles",
                    "View All Departments",
                    "Add Employee",
                    "Add Role",
                    "Add Department",
                    "Update Employee Role",
                    "Exit"
                ]
            }
        ])
        .then(res => {
            const chosenTask = res.task;
            if (chosenTask === "View All Employees") {
                viewEmployees();
            } else if (chosenTask === "View All Employees By Department") {
                viewEmpByDept();
            } else if (chosenTask === "View All Employees By Manager") {
                viewEmpByMgr();
            } else if (chosenTask === "View All Roles") {
                viewRoles();
            } else if (chosenTask === "View All Departments") {
                viewAllDept();
            } else if (chosenTask === "Add Employee") {
                addEmployee();
            } else if (chosenTask === "Add Role") {
                addRole();
            } else if (chosenTask === "Add Department") {
                addDept();
            } else if (chosenTask === "Update Employee Role") {
                updateRole();
            } else {
                console.log("Goodbye");
                connection.end();
            }
        });
}

//Displays all employees
function viewEmployees() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department, role_table.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_table LEFT JOIN role_table ON employee_table.role_id = role_table.id LEFT JOIN department_table on role_table.department_id = department_table.id LEFT JOIN employee_table manager ON manager.id = employee_table.manager_id ORDER BY employee_table.id;`;
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Displays all employees by their department.
function viewEmpByDept() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department FROM employee_table LEFT JOIN role_table ON employee_table.role_id = role_table.id LEFT JOIN department_table ON department_table.id = role_table.department_id ORDER BY role_table.title`;
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//View employees listed in alpahbetical order of their manager.
function viewEmpByMgr() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_table LEFT JOIN employee_table manager ON manager.id = employee_table.manager_id ORDER BY manager;`;
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Lists the role_table
function viewRoles() {
    const queryString = "SELECT * FROM role_table;";
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

//Lists all Departments
function viewAllDept() {
    const queryString = "SELECT * FROM department_table;";
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}

// Adds an employee **
function addEmployee() {
    managerQuery()
        .then(result => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "Please Enter the Employees First Name.",
                        name: "fn"
                    },
                    {
                        type: "input",
                        message: "Please Enter the Employees Last Name.",
                        name: "ln"
                    },
                    {
                        type: "list",
                        message: "What is the Employees Role?",
                        name: "role_id",
                        choices: [
                            "1 - Media Buyer",
                            "2 - Web Producer",
                            "3 - Product Manager",
                            "4 - Software Engineer",
                            "5 - Payroll HR Specialist",
                            "6 - Accountant",
                            // "7 - Legal Team Lead",
                            // "8 - Lawyer"
                        ]
                    }
                ])
                .then(res => {
                    let roleNum = parseInt(res.role_id.charAt(0));
                    let first_name = res.fn;
                    let last_name = res.ln;
                    let ifManager = null;
                    if (
                        roleNum === 2 ||
                        roleNum === 4 ||
                        roleNum === 6 ||
                        roleNum === 8
                    ) {
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Who is the employees manager?",
                                    name: "manager",
                                    choices: managersArray
                                }
                            ])
                            .then(res => {
                                ifManager = parseInt(res.manager.charAt(0));
                                const queryString = `INSERT INTO employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                connection.query(
                                    queryString,
                                    [first_name, last_name, roleNum, ifManager],
                                    function(err, res) {
                                        if (err) throw err;
                                        console.log("Employee Added!");
                                        start();
                                    }
                                );
                            });
                    } else {
                        // roleNum = parseInt(res.role_id.charAt(0));
                        console.log(roleNum);
                        const queryString = `INSERT INTO employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                        console.log(res);
                        connection.query(
                            queryString,
                            [first_name, last_name, roleNum, ifManager],
                            function(err, res) {
                                if (err) throw err;
                                console.log("Employee Added!");
                                start();
                            }
                        );
                    }
                });
        })
        .catch(console.error);
}

// Adds a job to the role_table
function addRole() {
    departmentQuery()
        .then(result => {
            inquirer
                .prompt([
                    {
                        type: "input",
                        message:
                            "Enter the name of the role you would like to add.",
                        name: "roleName"
                    },
                    {
                        type: "input",
                        message: "What will the salary be for this new role?",
                        name: "salary"
                    },
                    {
                        type: "list",
                        message:
                            "Which Department will this new role fall under?",
                        name: "dept",
                        choices: dArray
                    }
                ])
                .then(data => {
                    let deptNum = parseInt(data.dept.charAt(0));
                    const queryString =
                        "INSERT INTO role_table (title, salary, department_id) values (?, ?, ?);";
                    connection.query(
                        queryString,
                        [data.roleName, data.salary, deptNum],
                        function(err, res) {
                            if (err) throw err;
                            console.log("Role Added!");
                            start();
                        }
                    );
                });
        })
        .catch(console.error);
};

//adds a new department
function addDept() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the name of the new department.",
                name: "deptName"
            }
        ])
        .then(data => {
            const queryString = `INSERT INTO department_table (dept_name) values (?);`;
            connection.query(queryString, [data.deptName], function(err, res) {
                if (err) throw err;
                console.log("Department added!");
                start();
            });
        });
};

// Updates an employees role
function updateRole() {
    employeeQuery()
        .then(result => {
            inquirer
                .prompt([
                    {
                        type: "list",
                        message:
                            "Which employee's role would you like to update?",
                        name: "employee",
                        choices: employeeArray
                    },
                    {
                        type: "list",
                        message: "Which role would you like for them to have?",
                        name: "newRole",
                        choices: [
                            "1 - Media Buyer",
                            "2 - Web Producer",
                            "3 - Product Manager",
                            "4 - Software Engineer",
                            "5 - Payroll HR Specialist",
                            "6 - Accountant",
                            // "7 - Legal Team Lead",
                            // "8 - Lawyer"
                        ]
                    }
                ])
                .then(data => {
                    const roleNum = parseInt(data.newRole.charAt(0));
                    const queryString = `UPDATE employee_table SET role_id=? WHERE first_name=?;`;
                    connection.query(
                        queryString,
                        [roleNum, data.employee],
                        function(err, res) {
                            if (err) throw err;
                            console.table("Role Updated!");
                            start();
                        }
                    );
                });
        })
        .catch(console.error);
}

function employeeQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            array = data.map(emp => emp.first_name);
            employeeArray = array;
            resolve(employeeArray);
        });
    });
}

function managerQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            let array = data
                .filter(mgr => {
                    return mgr.manager_id === null;
                })
                .map(x => x.id + " " + x.first_name);
            managersArray = array;
            resolve(managersArray);
        });
    });
}

function departmentQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM department_table;`;
        connection.query(queryString, (err, data) => {
            if (err) reject(err);
            let array = data.map(dept => dept.id + " " + dept.dept_name);
            dArray = array;
            resolve(dArray);
        });
    });
}