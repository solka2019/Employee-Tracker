const mysql = require("mysql");
const connectMySql = mysql.createConnection({  
// / const connection = mysql.createConnection({
    host: "localhost",
    port: 3008,
    user: "root",
    password: "password",
    database: "employee_db"
  });

connectMySql.connect(function(err) {
    if (err) throw err;
    console.log("this is connected" + connection.threadId);
});

module.exports = connection;