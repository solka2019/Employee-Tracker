INSERT INTO department_table (dept_name)
-- VALUES ("Marketing"), ("Human Resources"), ("Finance"), ("Technology and Research");
VALUES 
-- 1
("Marketing"),
-- 2
("Human Resources"),
-- 3
("Technology and Research");


INSERT INTO role_table (title, salary, department_id)
-- VALUES ("Media", 100000, 1), ("Salesperson", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Account Lead", 150000, 3), ("Accountant", 120000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 180000, 4);
VALUES 
 ("Media Buyer", 70000, 1),
 ("Web Producer", 80000, 3),
 ("Product Manager", 150000, 3),
 ("Software Manager", 250000, 3),
 ("Payroll HR Specialist", 150000, 2),
 ("HR Consultant", 75000, 1), 
--  ("Legal Team Lead", 134000, 4),
--  ("Lawyer", 180000, 4);

INSERT INTO employee_table (first_name, last_name, role_id, manager_id)
VALUES ("Mary", "Smith", 5, null),
 ("John", "Gray", 6, 1),
 ("Lucas", "Stepp", 7, null),
 ("Peter", "Hecht", 8, null),
 ("Patricia", "Han", 9, null),
 ("Ananya", "Kush", 10, 5),
 ("Fernando", "Omli", 11, null),
 ("Preston", "Edwards", 12, null);