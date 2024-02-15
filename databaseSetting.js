
const mysql = require('mysql');

// MySQL Settings
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'historygamexo',
    port: 3306
});

/**
CREATE TABLE historyGame (
	id int NOT NULL AUTO_INCREMENT,
    playerWinner CHAR(5) NOT NULL,
    gridSize INT(255) NOT NULL,
    sizeWinnerScale INT(255) NOT NULL,
    history JSON,
    PRIMARY KEY (ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8; 
**/

connection.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = connection;