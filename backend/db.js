const mysql = require("mysql2/promise"); // Using  mysql2

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "transport_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;