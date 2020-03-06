// Connecting with Server

const mysql = require("mysql");
const connectMySql = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // this is mysql - port, it will always be the same #
    // Firewall - block the incoming request to my computer - security 
    user: "root",
    password: "password"
});

connectMySql.connect(function (err) {
    if (err) throw err;
    console.log("Error found connecting to server " + connectMySql.host);
    // space in string after server is because of concatenation with the host string
});

module.exports = connectMySql;

// Initialize Server function -colocar dentro da fc

const readline = require("linebyline");

const runSqlFile = function (fileName) {
    // create the obj (readline) to be able to use the library linebyline
    const rl = readline(fileName);
    // I am using the library to open the file and get an object to represent that file inside de program (rl)
    let tempBuffer =""; // use this as a buffer to store each line until we have an line ending, then send to mysql
    rl.on("line", function (line, lineCount, byteCount) {
            // do something with the line of text
            if (byteCount == 0) {
                return;
            }
            tempBuffer = tempBuffer + line; // adds to the temp buffer the current line of text from the file
            console.log(tempBuffer);
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

console.log("the end");

// what follows the . in a library or object can be a function or a property. If it is a function it 
// will always be followed by (). Neither one of these can be used without the library object in front
// of them 