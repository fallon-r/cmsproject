var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
var figlet = require("figlet");
var chalk = require("chalk");
require('dotenv').config()



function welcome(){
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

    validator = () =>{   
        inquirer
        .prompt({
            name:"waiver",
            type: "confirm",
            message:"Do you agree to the above terms?"
        }).then(function (answer){
            if(answer.waiver === true){
                runSearch();
            }else{
                console.log(chalk.red("YOU MUST AGREE TO THE ABOVE TERMS"))
            }
        })}
 
 
    setTimeout(validator, 1500)
}


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
                "Update Employee Roles",
                new inquirer.Separator(),
                "View Department",
                "View Roles",
                "View Employees",
                new inquirer.Separator(),
                "QUIT"
            ]
        })
        .then(function(answer) {
            // cases for choice
            switch (answer.action) {
                case "Add Department":
                   return  addDept();
                case "Add Roles":
                    return addRole();
                case "Add Employees":
                    return addEmployee();
                case "Update Employee Roles":
                    return updateEmployee();
                 
                case "View Department":
                    return deptSearch();
               case  "View Roles":
                   return roleSearch();
                case "View Employees":
                    return employeeSearch();
                default:
                    return quit();
                
            }

            async function addDept(){

                const department = await prompt([
                    {
                      name: "name",
                      message: "What is the name of the department?"
                    }
                  ]);
                
                  await db.createDepartment(department);
                
                  console.log(`Added ${department.name} to the database`);
                  runSearch();
            }
        });

}
 


welcome();