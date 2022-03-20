const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const jest = require('jest');

const Employee = require('./lib/Employee');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');

const DIST_DIR = path.resolve(__dirname, 'dist')
const outputPath = path.join(DIST_DIR, 'index.html');

const render = require('./src/page-template.js');

const teamArr = [];
const idArr = [];

function initApp() {
    function addManager() {
        console.log("Let's start building your team profile");
        inquirer.prompt([
            {
                type: "input",
                name: "managerName",
                message: "Please enter the Manager's name.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter the team's Manager's name.";
                }
            },
            {
                type: "input",
                name: "managerId",
                message: "Please enter the Manager's ID.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a valid Manager's ID.";
                }
            },
            {
                type: "input",
                name: "managerEmail",
                message: "Please enter the Managers Email.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Email address cannot be empty.";
                }
            },
            {
                type: "input",
                name: "managerOfficeNumber",
                message: "Please enter the Manager's office phone number. (format: 1234567890)",
                validate: answer => {
                    const pass = answer.match(
                        // regex validation
                        /^[1-9]\d*$/
                    );
                    if (pass) {
                        return true;
                    }
                    return "Please enter a proper phone number.";
                }
            }
        ]).then(answers => {
            const manager = new Manager(answers.managerName, answers.managerId, answers.managerEmail, answers.managerOfficeNumber);
            teamArr.push(manager);
            idArr.push(answers.managerId);
            addTeam();
        });
    }

    function addTeam() {
        inquirer.prompt([
            {
                type: "list",
                name: "memberChoice",
                message: "What would you like to add next?",
                choices: [
                    "Engineer",
                    "Intern",
                    "End application"
                ]
            }
        ]).then(userChoice => {
            switch (userChoice.memberChoice) {
                case "Engineer":
                    addEngineer();
                    break;
                case "Intern":
                    addIntern();
                    break;
                default:
                    generateHTML();
            }
        });
    }

    function addEngineer() {
        inquirer.prompt([
            {
                type: "input",
                name: "engineerName",
                message: "Please enter the name of the Engineer.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Engineer's name cannot be left empty.";
                }
            },
            {
                type: "input",
                name: "engineerId",
                message: "Please enter the Engineer's ID.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a valid ID for the Engineer.";
                }
            },
            {
                type: "input",
                name: "engineerEmail",
                message: "Please enter the Engineer's Email address.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Email address cannot be empty.";
                }
            },
            {
                type: "input",
                name: "engineerGithub",
                message: "Please enter the Engineer's Github username.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a valid GitHub username.";
                }
            }
        ]).then(answers => {
            const engineer = new Engineer(answers.engineerName, answers.engineerId, answers.engineerEmail, answers.engineerGithub);
            teamArr.push(engineer);
            idArr.push(answers.engineerId);
            addTeam();
        });
    }

    function addIntern() {
        inquirer.prompt([
            {
                type: "input",
                name: "internName",
                message: "Please enter the Intern's name.",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter at least one character.";
                }
            },
            {
                type: "input",
                name: "internId",
                message: "Please enter the Intern's ID",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a valid Intern ID.";
                }
            },
            {
                type: "input",
                name: "internEmail",
                message: "Please enter the Intern's Email address?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Email address cannot be empty.";
                }
            },
            {
                type: "input",
                name: "internSchool",
                message: "What school does the Intern attend?",
                validate: answer => {
                    if (answer !== "") {
                        return true;
                    }
                    return "Please enter a valid school.";
                }
            }

        ]).then(answers => {
            const intern = new Intern(answers.internName, answers.internId, answers.internEmail, answers.internSchool);
            teamArr.push(intern);
            idArr.push(answers.internId);
            addTeam();
        });
    }
    
    function generateHTML() {

        if (!fs.existsSync(DIST_DIR)) {
            fs.mkdirSync(DIST_DIR)
        }
        console.log("Generating Team Profile.... ");
        fs.writeFileSync(outputPath, render(teamArr), "utf-8");
    }

    addManager();
}

initApp();