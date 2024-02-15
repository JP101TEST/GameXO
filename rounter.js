const express = require('express');
const rounter = express.Router();
const path = require('path');
const db = require('./databaseSetting.js');

rounter.get('/', (req, res) => {
    // res.status(200)
    //     .type('text/html')
    //     .sendFile(path.join(__dirname,'public',"index.html"));
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

rounter.get('/getData', (req, res) => {
    db.query("SELECT * FROM historygame ORDER BY `historygame`.`id` ASC", function (err, result, fields) {
        if (err) {
            res.status(500).send('Error occurred while fetching data from database.');
            return;
        }
        res.status(200).json(result);
    });
});


rounter.get('/saveData/:history', (req, res) => {
    // Extracting the history parameter from the request URL
    // แยก history parameter ออกจาก URL
    const historyParam = req.params.history;

    // Parsing the history parameter from string to JSON
    // แปลง historyParam จาก string เป็น JSON
    const history = JSON.parse(historyParam);

    // Logging the history object to the console
    // แสดง history 
    //console.log(history);

    const queryString = "INSERT INTO `historygame`(`playerWinner`,`gridSize`,`sizeWinnerScale`,`history`) VALUES (?,?,?,?)";
    const queryValues = [history.playerWin,history.gridSize,history.sizeWinnerScale, JSON.stringify(history.step)];
    // Execute the query
    db.query(queryString, queryValues, (error, result) => {
        if (error) {
            console.error("Error inserting data into database:", error);
            res.status(500).send("Internal server error");
        } else {
            console.log("Data inserted into database successfully");
            res.status(200).send("Data inserted into database successfully");
        }
    });
});



module.exports = rounter;

