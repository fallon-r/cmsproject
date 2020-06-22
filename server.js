var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var figlet = require("figlet");
var chalk = require("chalk");
require('dotenv').config()


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.SQLPW,
    database: "cms_db"
});

connection.connect(function(err) {
    if (err) throw err;

    figlet.text('MONEYCORP CMS', {
        font: 'Larry 3D',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function(err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(chalk.green(data));
        console.log(chalk.green("Welcome to the Moneycorp CMS."));
        console.log(chalk.red("All entries are logged. We trust you have received the usual lecture from the local System Administrator. It usually boils down to these three things"));
        console.log(chalk.green("1. Respect the privacy of others."));
        console.log(chalk.green("2. Think before you type."));
        console.log(chalk.green("3. With great power comes great responsibility."));
    });


    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Roles",
                "Add Employees",
                "View Department",
                "View Roles",
                "View Employees",
                "Update Employee Roles"
            ]
        })
        .then(function(answer) {
            switch (answer.action) {
                case "View Employees":
                    staffSearch();
                    break;

                
            }
        });
}

function staffSearch() {
    inquirer
        .prompt({
            name: "staffSearchMethod",
            type: "list",
            message: "How would you like to search?",
            choices: ['ID', 'First Name', 'Last Name']
        })
        .then(function(answer) {
            var query = "SELECT position, song, year FROM top5000 WHERE ?";
            connection.query(query, { artist: answer.artist }, function(err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("Position: " + res[i].position + " || Song: " + res[i].song + " || Year: " + res[i].year);
                }
                runSearch();
            });
        });
}

function multiSearch() {
    var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
    connection.query(query, function(err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].artist);
        }
        runSearch();
    });
}

function rangeSearch() {
    inquirer
        .prompt([{
                name: "start",
                type: "input",
                message: "Enter starting position: ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "end",
                type: "input",
                message: "Enter ending position: ",
                validate: function(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function(answer) {
            var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
            connection.query(query, [answer.start, answer.end], function(err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        "Position: " +
                        res[i].position +
                        " || Song: " +
                        res[i].song +
                        " || Artist: " +
                        res[i].artist +
                        " || Year: " +
                        res[i].year
                    );
                }
                runSearch();
            });
        });
}

function songSearch() {
    inquirer
        .prompt({
            name: "song",
            type: "input",
            message: "What song would you like to look for?"
        })
        .then(function(answer) {
            console.log(answer.song);
            connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
                console.log(
                    "Position: " +
                    res[0].position +
                    " || Song: " +
                    res[0].song +
                    " || Artist: " +
                    res[0].artist +
                    " || Year: " +
                    res[0].year
                );
                runSearch();
            });
        });
}

function songAndAlbumSearch() {
    inquirer
        .prompt({
            name: "artist",
            type: "input",
            message: "What artist would you like to search for?"
        })
        .then(function(answer) {
            var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
            query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
            query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";

            connection.query(query, [answer.artist, answer.artist], function(err, res) {
                console.log(res.length + " matches found!");
                for (var i = 0; i < res.length; i++) {
                    console.log(
                        i + 1 + ".) " +
                        "Year: " +
                        res[i].year +
                        " Album Position: " +
                        res[i].position +
                        " || Artist: " +
                        res[i].artist +
                        " || Song: " +
                        res[i].song +
                        " || Album: " +
                        res[i].album
                    );
                }

                runSearch();
            });
        });
}