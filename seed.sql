INSERT INTO department_table (dept_name)
VALUES 
("Marketing"),
("Human Resources"),
("Technology and Research");


INSERT INTO role_table (title, salary, department_id)
VALUES 
 ("Product Manager", 150000, 3),
 ("Software Manager", 250000, 3),
 ("Media Buyer", 70000, 1),
 ("Web Producer", 80000, 3),
 ("Payroll HR Specialist", 150000, 2),
 ("HR Consultant", 75000, 1);

INSERT INTO employee_table (first_name, last_name, role_id, manager_id)
VALUES 
 ("Lucas",    "Stepp",   1, null),
 ("Peter",    "Hecht",   2, null),
 ("Mary",     "Smith",   5, 1),
 ("John",     "Gray",    6, 1),
 ("Patricia", "Han",     3, 1),
 ("Ananya",   "Kush",    4, 1),
 ("Fernando", "Omli",    3, 2),
 ("Preston",  "Edwards", 4, 2);