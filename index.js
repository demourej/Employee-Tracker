const inquirer = require('inquirer');
const db = require("./db/database");

start();

function start() {
  let firstAnswer;
  inquirer.prompt([{
    type: "list",
    name: "choice",
    message: "What would you like to do?",
    choices: [
      {
        name: "View all employees",
        value: "viewEmployees"
      },
      {
        name: "View all employees by department",
        value: "viewEmployeesByDepartment"
      },
      {
        name: "View all employees by manager",
        value: "viewEmployeesByManager"
      },
      {
        name: "View all roles",
        value: "viewRoles"
      },
      {
        name: "View All Departments",
        value: "viewDepartments"
      },
      {
        name: "Add employee",
        value: "createEmployee"
      },
      {
        name: "Remove employee",
        value: "removeEmployee"
      },
      {
        name: "Exit",
        value: "exit"
      }
    ]


  }]).then(response => {
    firstAnswer = response.choice;
    switch (firstAnswer) {
      case "viewEmployees":
        return seeEmployees();
      case "viewEmployeesByDepartment":
        return seeEmployeesByDepartment();
      case "viewEmployeesByManager":
        return seeEmployeesByManager();
      case "viewDepartments":
        return viewDepartments();
      case "viewRoles":
        return seeRoles();
      case "createEmployee":
        return addEmployee();
      case "removeEmployee":
        return removeEmployee();
      default:
        return exit();
    }
  });
}

async function seeEmployees() {
  const allEmployees = await db.searchEmployees();
  console.log("\n");
  console.table(allEmployees);
  start();
}

async function seeEmployeesByDepartment() {
  const allDepartments = await db.searchDepartments();
  const departmentChoices = allDepartments.map((department) => ({
    name: department.name,
    value: department.id
  }));
  const { departmentId } = await inquirer.prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which employees would you like to see per department?",
      choices: departmentChoices
    }
  ]);
  const employeesByDepartment = await db.employeesByDepartment(departmentId);
  console.log("\n");
  console.table(employeesByDepartment);
  start();
}

async function seeEmployeesByManager() {
  const managers = await db.searchEmployees();
  const managersOptions = managers.map((manager) => ({
    name: `${manager.first_name} ${manager.last_name}`,
    value: manager.id
  }));
  const { managerId } = await inquirer.prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see his boss?",
      choices: managersOptions
    }
  ]);
  const employees = await db.employeesByManager(managerId);
  console.log("\n");
  if (employees.length === 0) {
    console.log("The selected employee has no boss");
  } else {
    console.table(employees);
  }
  start();
}

async function viewDepartments() {
  const departments = await db.searchDepartments();
  console.log("\n");
  console.table(departments);
  start();
}

async function seeRoles() {
  const roles = await db.searchRoles();
  console.log("\n");
  console.table(roles);
  start();
}

async function addEmployee() {
  const roles = await db.searchRoles();
  const employees = await db.searchEmployees();
  const employee = await inquirer.prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);
  const roleChoices = roles.map((role) => ({
    name: role.title,
    value: role.id
  }));
  const { roleId } = await inquirer.prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });
  employee.role_id = roleId;
  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });
  const { managerId } = await inquirer.prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });
  employee.manager_id = managerId;
  await db.newEmployee(employee);
  console.log(
    `Employee ${employee.first_name} ${employee.last_name} added`
  );
  start();
}

async function removeEmployee() {
  const employees = await db.searchEmployees();
  const employeesOptions = employees.map((employee) => ({
    name: `${employee.first_name} ${employee.last_name}`,
    value: employee.id
  }));
  const { employeeId } = await inquirer.prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to delete?",
      choices: employeesOptions
    }
  ]);
  await db.removeEmployee(employeeId);
  console.log("Employee deleted");
  start();
}

function exit() {
  console.log("Goodbye!");
  process.exit();
}
