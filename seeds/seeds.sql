USE employeesDB;

-- EMP
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Astro", "Trailblazer", 10, 1), ("Codey", "Trailblazer", 11, 1), ("Appy", "Trailblazer", 12, 1), ("Adolfo", "de Moure", 13, 2);

-- ROLE
INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 1000.00, 1), ("Director", 2000.00, 2), ("Vicepresident", 3000.00, 1);

-- DEPARTMENT
INSERT INTO department (name)
VALUES ("Sales"), ("Development"), ("HR"), ("Support");