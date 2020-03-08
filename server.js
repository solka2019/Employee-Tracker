const mysql = require("mysql");
const inquirer = require("inquirer");
const readline = require("linebyline");
const consoleTable = require("console.table");
let managersArray;
let employeeArray;
let dArray;

// Connecting with Server
const connectMySql = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // this is mysql - port, it will always be the same #
    // Firewall - block the incoming request to my computer - security 
    user: "root",
    password: "password"
});

// connectMySql.connect();
// Just connect with the server, so you can send commands later!
async function connection()
{
    connectMySql.connect(function (err) {
        if (err) throw err;
    });
}

async function app()
{
    console.log("Starting the connection with mysql...");
    await connection();
    console.log("Connected with mysql");
    console.log("Starting application");
    start();
}

app();

// Functions to perform specific SQL queries that I'll need to use. Suggestion is to have a 
// constructor function or a class to organize these queries- Example below - constructor
// function Person(first, last, age, eyecolor) {
//   this.firstName = first;
//   this.lastName = last;
//   this.age = age;
//   this.eyeColor = eyecolor;
//   this.name = function() {return this.firstName + " " + this.lastName;};
// }
function start() {
    // Initalize- - this is how we use inquirer: .prompt... .then... (page inquirer)
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "task",
                choices: [
                    "Initialize Server",
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
        .then(choice => {
            const chosenTask = choice.task;
            if (chosenTask === "View All Employees") {
                viewEmployees();
            } else if (chosenTask === "Initialize Server") {
                // Create the tables in the mysql and set initial values
                initializeServer();
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
                connectMySql.end();
            }
        });
}
function initializeServer() {
  

    const runSqlFile = function (fileName) {
        // create the obj (readline) to be able to use the library linebyline. 
        const rl = readline(fileName);
        // I am using the library to open the file and get an object to represent that file inside de program (rl)
        let tempBuffer =""; // use this as a buffer to store each line until we have an line ending, then send to mysql
        rl.on("line", function (line, lineCount, byteCount) {
                // do something with the line of text
                if (byteCount == 0) {
                    return;
                }
                tempBuffer = tempBuffer + line; // adds to the temp buffer the current line of text from the file
                //console.log(tempBuffer);
                // mysql needs to get a query that ends with ";" (in the file), so we need to 
                // look for that at each line we read from the text, and only send the buffer
                // to mysql when we have found it.
                if (line.indexOf(";") > -1) {
                    connectMySql.query(tempBuffer, function (err, sets, fields) {
                        if (err) console.log(err);
                    });
                    tempBuffer = "";
                }
            })
            .on("error", function (e) {
                // something went wrong
                console.log(e);
            });
    };
    
    runSqlFile("./schema.sql");
    runSqlFile("./seed.sql");
    start();
}

//Displays all employees, If you want to return all users, no matter if they have a favorite product or not, use the LEFT JOIN statement:
function viewEmployees() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department, role_table.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_db.employee_table LEFT JOIN employee_db.role_table ON employee_table.role_id = role_table.id LEFT JOIN employee_db.department_table on role_table.department_id = department_table.id LEFT JOIN employee_db.employee_table manager ON manager.id = employee_table.manager_id ORDER BY employee_table.id;`;
    connectMySql.query(queryString, function(err, choice) {
        if (err) throw err;
        console.table(choice);
        
        start();
        
    });
}
                                                                                                      
// Displays all employees by their department.
function viewEmpByDept() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, role_table.title, department_table.dept_name AS department FROM employee_db.employee_table LEFT JOIN employee_db.role_table ON employee_table.role_id = role_table.id LEFT JOIN employee_db.department_table ON department_table.id = role_table.department_id ORDER BY role_table.title`;
    connectMySql.query(queryString, function(err, choice) {
        if (err) throw err;
        console.table();
        start();
    });
}

//View employees listed in alpahbetical order of their manager.
function viewEmpByMgr() {
    const queryString = `SELECT employee_table.id, employee_table.first_name, employee_table.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee_db.employee_table LEFT JOIN employee_db.employee_table manager ON manager.id = employee_table.manager_id ORDER BY manager;`;
    connectMySql.query(queryString, function(err, choice) {
        if (err) throw err;
        console.table(choice);
        start();
    });
}

// Lists the role_table
function viewRoles() {
    const queryString = "SELECT * FROM employee_db.role_table;";
    connectMySql.query(queryString, function(err, choice) {
        if (err) throw err;
        console.table(choice);
        start();
    });
}

//Lists all Departments
function viewAllDept() {
    const queryString = "SELECT * FROM employee_db.department_table;";
    connectMySql.query(queryString, function(err, choice) {
        if (err) throw err;
        console.table(choice);
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
                        message: "What is the employee's first name?",
                        name: "fn"
                    },
                    {
                        type: "input",
                        message: "What is the employee's last name?",
                        name: "ln"
                    },
                    {
                        type: "list",
                        message: "What is the employee's role?",
                        name: "role_id",
                        choices: [
                           
                            "1 - Product Manager", 
                            "2 - Software Manager", 
                            "3 -Media Buyer", 
                            "4 -Web Producer", 
                            "5 -Payroll HR Specialist", 
                            "6 -HR Consultant"
                           
                            
                        ]
                    }
                ])
                .then(choice => {
                    let roleNum = parseInt(choice.role_id.charAt(0));
                    let first_name = choice.fn;
                    let last_name = choice.ln;
                    let ifManager = null;
                    if (
                        roleNum === 3 ||
                        roleNum === 4 ||
                        roleNum === 5 ||
                        roleNum === 6
                    ) {
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    message: "Who is the employee's manager?",
                                    name: "manager",
                                    choices: managersArray
                                }
                            ])
                            .then(choice => {
                                ifManager = parseInt(choice.manager.charAt(0));
                                const queryString = `INSERT INTO employee_db.employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                                connectMySql.query(
                                    queryString,
                                    [first_name, last_name, roleNum, ifManager],
                                    function(err, choice) {
                                        if (err) throw err;
                                        console.log("Employee Added!");
                                        start();
                                    }
                                );
                            });
                    } else {
                        // roleNum = parseInt(choice.role_id.charAt(0));
                        console.log(roleNum);
                        const queryString = `INSERT INTO employee_db.employee_table (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;
                        console.log(choice);
                        connectMySql.query(
                            queryString,
                            [first_name, last_name, roleNum, ifManager],
                            function(err, choice) {
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
                            "What role would you like to add?",
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
                            "Which department will this new role fall under?",
                        name: "dept",
                        choices: dArray
                    }
                ])
                .then(data => {
                    let deptNum = parseInt(data.dept.charAt(0));
                    const queryString =
                        "INSERT INTO employee_db.role_table (title, salary, department_id) values (?, ?, ?);";
                        connectMySql.query(
                        queryString,
                        [data.roleName, data.salary, deptNum],
                        function(err, choice) {
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
                message: "What is the name of the new department?",
                name: "deptName"
            }
        ])
        .then(data => {
            const queryString = `INSERT INTO employee_db.department_table (dept_name) values (?);`;
            connectMySql.query(queryString, [data.deptName], function(err, choice) {
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
                            "1 - Product Manager",
                            "2 - Software Manager",
                            "3 - Media Buyer",
                            "4 - Web Producer",
                            "5 - Payroll HR Specialist",
                            "6 - HR Consultant",
                         ]
                    }
                ])
                .then(data => {
                    const roleNum = parseInt(data.newRole.charAt(0));
                    const queryString = `UPDATE employee_db.employee_table SET role_id=? WHERE first_name=?;`;
                    connectMySql.query(
                        queryString,
                        [roleNum, data.employee],
                        function(err, choice) {
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
        const queryString = `SELECT * FROM employee_db.employee_table;`;
        connectMySql.query(queryString, (err, data) => {
            if (err) reject(err);
            array = data.map(emp => emp.first_name);
            employeeArray = array;
            resolve(employeeArray);
        });
    });
}

function managerQuery() {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT * FROM employee_db.employee_table;`;
        connectMySql.query(queryString, (err, data) => {
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
        const queryString = `SELECT * FROM employee_db.department_table;`;
        connectMySql.query(queryString, (err, data) => {
            if (err) reject(err);
            let array = data.map(dept => dept.id + " " + dept.dept_name);
            dArray = array;
            resolve(dArray);
        });
    });
}