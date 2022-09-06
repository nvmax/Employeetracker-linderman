INSERT INTO department (name)
VALUES 
    ("Managers"), 
    ("Project Managers"), 
    ("Engineering"), 
    ("Technicians"), 
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUE 
    ("Site Manager", 250000, 1),
    ("Project Manager", 150000.00, 2), 
    ("Sales Manager", 115000.00, 5),
    ("Hardware Engineer", 140000.00, 3), 
    ("Frontend Technician", 130000.00, 4),
    ("Backend technician", 130000.00, 4),
    ("Sales Representative", 75000.00, 5),
    ("Lead Sales", 80000.00, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE 
    ("Jerrod", "Linderman", 1, null), 
    ("Lynn", "Gubber", 2, null), 
    ("Quin", "Tin", 3, null), 
    ("Bobby", "Jones", 4, null), 
    ("Anna", "Finch", 7, 1),
    ("Sam", "Gangie ",6, 2),
    ("Byran", "Dook", 7, 3),
    ("Felicia", "Goseman", 8, 3),
    ("Lindsay", "Post", 5, 2),
    ("Jade", "Barrett", 4, 4),
    ("Ever", "Schofield", 2, 2),
    ("Briar", "Winship", 5, 4),
    ("Kit", "Herbertson", 8, 3),
    ("Gayle", "Braddock", 5, 4),
    ("Haven", "Quincy", 4, 2),
    ("Jessey", "Bumphrey", 6, 1),
    ("Thatcher", "Dybald", 5, 2),
    ("Dorice", "Kliner", 6, 2),
    ("Morse", "Hannabus", 7, 3),
    ("Trescha", "Maso", 7, 1),
    ("Andriette","Cannavan", 7, 4),
    ("Xylina", "Rekes", 6, 2),
    ("Con", "Diche", 8, 4),
    ("Sherry", "Guisler", 7, 1),
    ("Meredith", "Plews", 8, 1),
    ("Marris", "Bhatia", 6, 1),
    ("Grant", "Senechell", 8, 4),
    ("Arlana", "Butchard", 7, 2),
    ("Ulrich", "Mettetal", 8, 2),
    ("Orlan", "Rowlands", 6, 1),
    ("Lionel", "Vasyatkin", 8, 1),
    ("Merle", "Everitt", 6, 1),
    ("Mimi", "Brill", 5, 3),
    ("Shelba", "McClymont", 8, 4),
    ("Gaultiero", "Utton", 5, 2),
   