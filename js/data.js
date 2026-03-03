// Quiz Data - 30 questions per subject
const quizData = {
    python: [
        {
            question: "What is the output of print(2 ** 3)?",
            options: ["6", "8", "9", "5"],
            correct: 1
        },
        {
            question: "Which of the following is a valid variable name in Python?",
            options: ["2var", "_var", "var-name", "var name"],
            correct: 1
        },
        {
            question: "What does the len() function do in Python?",
            options: ["Returns length of an object", "Returns type of object", "Returns maximum value", "Returns minimum value"],
            correct: 0
        },
        {
            question: "Which symbol is used for comments in Python?",
            options: ["//", "/* */", "#", "<!-- -->"],
            correct: 2
        },
        {
            question: "What is the output of 'Hello' + 'World'?",
            options: ["Hello World", "HelloWorld", "Hello+World", "Error"],
            correct: 1
        },
        {
            question: "Which data type is mutable in Python?",
            options: ["Tuple", "String", "List", "Integer"],
            correct: 2
        },
        {
            question: "What does the range(3) function return?",
            options: ["[0, 1, 2]", "[1, 2, 3]", "[0, 1, 2, 3]", "Error"],
            correct: 0
        },
        {
            question: "How do you take user input in Python?",
            options: ["input()", "scan()", "get()", "read()"],
            correct: 0
        },
        {
            question: "Which keyword is used to define a function in Python?",
            options: ["func", "def", "function", "define"],
            correct: 1
        },
        {
            question: "What is the output of bool(0)?",
            options: ["True", "False", "None", "Error"],
            correct: 1
        },
        {
            question: "Which of the following is a Python framework?",
            options: ["Django", "Spring", "Laravel", "Rails"],
            correct: 0
        },
        {
            question: "What is PEP 8?",
            options: ["Python style guide", "Python editor", "Python package", "Python error"],
            correct: 0
        },
        {
            question: "How do you create a list in Python?",
            options: ["[]", "{}", "()", "<>"],
            correct: 0
        },
        {
            question: "What does the append() method do?",
            options: ["Adds element to list", "Removes element", "Sorts list", "Reverses list"],
            correct: 0
        },
        {
            question: "Which is not a Python data type?",
            options: ["int", "float", "char", "str"],
            correct: 2
        },
        {
            question: "What is the output of 3 // 2?",
            options: ["1.5", "1", "1.0", "Error"],
            correct: 1
        },
        {
            question: "Which module is used for random numbers?",
            options: ["random", "math", "os", "sys"],
            correct: 0
        },
        {
            question: "What is a dictionary in Python?",
            options: ["Key-value pairs", "Ordered sequence", "Set of values", "None"],
            correct: 0
        },
        {
            question: "How do you handle exceptions in Python?",
            options: ["try-except", "catch", "throw", "handle"],
            correct: 0
        },
        {
            question: "What is lambda in Python?",
            options: ["Anonymous function", "Loop", "Variable", "Module"],
            correct: 0
        },
        {
            question: "Which is used for string formatting?",
            options: ["f-strings", "s-strings", "t-strings", "d-strings"],
            correct: 0
        },
        {
            question: "What does the split() method do?",
            options: ["Splits string into list", "Joins strings", "Replaces text", "Finds text"],
            correct: 0
        },
        {
            question: "What is pip in Python?",
            options: ["Package manager", "Python interpreter", "IDE", "Debugger"],
            correct: 0
        },
        {
            question: "Which is a Python decorator?",
            options: ["@staticmethod", "#staticmethod", "$staticmethod", "%staticmethod"],
            correct: 0
        },
        {
            question: "What is __init__ in Python?",
            options: ["Constructor", "Destructor", "Method", "Variable"],
            correct: 0
        },
        {
            question: "How do you import a module?",
            options: ["import module", "include module", "using module", "require module"],
            correct: 0
        },
        {
            question: "What is a generator in Python?",
            options: ["Yields values", "Returns list", "Creates array", "None"],
            correct: 0
        },
        {
            question: "Which is true about sets?",
            options: ["No duplicates", "Ordered", "Indexed", "Mutable"],
            correct: 0
        },
        {
            question: "What does the map() function do?",
            options: ["Applies function to items", "Maps keys", "Creates dictionary", "None"],
            correct: 0
        },
        {
            question: "What is the output of 'Hello'[1]?",
            options: ["H", "e", "l", "o"],
            correct: 1
        }
    ],
    java: [
        {
            question: "Which of these is not a Java feature?",
            options: ["Object-oriented", "Platform independent", "Pointers", "Robust"],
            correct: 2
        },
        {
            question: "What is the size of int in Java?",
            options: ["16 bits", "32 bits", "64 bits", "8 bits"],
            correct: 1
        },
        {
            question: "Which is the root class of Java class hierarchy?",
            options: ["Object", "Class", "System", "Main"],
            correct: 0
        },
        {
            question: "What is JVM?",
            options: ["Java Virtual Machine", "Java Variable Method", "Java Version Manager", "None"],
            correct: 0
        },
        {
            question: "Which keyword is used to inherit a class?",
            options: ["extends", "implements", "inherits", "using"],
            correct: 0
        },
        {
            question: "What is the default value of boolean?",
            options: ["true", "false", "null", "0"],
            correct: 1
        },
        {
            question: "Which is a reserved keyword in Java?",
            options: ["object", "strictfp", "main", "system"],
            correct: 1
        },
        {
            question: "What is the return type of main method?",
            options: ["int", "void", "String", "boolean"],
            correct: 1
        },
        {
            question: "Which package is imported by default?",
            options: ["java.util", "java.lang", "java.io", "java.net"],
            correct: 1
        },
        {
            question: "What is garbage collection in Java?",
            options: ["Memory management", "Code cleaning", "Data backup", "None"],
            correct: 0
        },
        {
            question: "What is the difference between JDK and JRE?",
            options: ["JDK includes JRE", "JRE includes JDK", "Both are same", "None"],
            correct: 0
        },
        {
            question: "Which is not a primitive data type?",
            options: ["int", "float", "String", "char"],
            correct: 2
        },
        {
            question: "What is the purpose of the 'static' keyword?",
            options: ["Class level variable", "Instance variable", "Local variable", "None"],
            correct: 0
        },
        {
            question: "What is inheritance in Java?",
            options: ["Deriving classes", "Creating objects", "Overloading", "None"],
            correct: 0
        },
        {
            question: "Which is an access modifier?",
            options: ["public", "static", "final", "abstract"],
            correct: 0
        },
        {
            question: "What is an interface in Java?",
            options: ["Abstract class", "Concrete class", "Normal class", "None"],
            correct: 0
        },
        {
            question: "What is the use of 'this' keyword?",
            options: ["Current object", "Parent object", "Child object", "None"],
            correct: 0
        },
        {
            question: "What is method overloading?",
            options: ["Same name, different params", "Same name, same params", "Different name", "None"],
            correct: 0
        },
        {
            question: "What is method overriding?",
            options: ["Redefining parent method", "New method", "Static method", "None"],
            correct: 0
        },
        {
            question: "What is the super keyword used for?",
            options: ["Access parent", "Access child", "Access current", "None"],
            correct: 0
        },
        {
            question: "What is an abstract class?",
            options: ["Cannot be instantiated", "Can be instantiated", "Final class", "None"],
            correct: 0
        },
        {
            question: "What is polymorphism in Java?",
            options: ["Many forms", "Single form", "No form", "None"],
            correct: 0
        },
        {
            question: "What is encapsulation?",
            options: ["Data hiding", "Data showing", "Data sharing", "None"],
            correct: 0
        },
        {
            question: "What is the try-catch block used for?",
            options: ["Exception handling", "Looping", "Conditional", "None"],
            correct: 0
        },
        {
            question: "What is finally block?",
            options: ["Always executes", "Never executes", "Sometimes executes", "None"],
            correct: 0
        },
        {
            question: "What is a thread in Java?",
            options: ["Lightweight process", "Heavy process", "Program", "None"],
            correct: 0
        },
        {
            question: "What is synchronization?",
            options: ["Thread control", "Data control", "Memory control", "None"],
            correct: 0
        },
        {
            question: "What is a collection in Java?",
            options: ["Group of objects", "Single object", "Primitive type", "None"],
            correct: 0
        },
        {
            question: "What is the difference between ArrayList and LinkedList?",
            options: ["Array vs Linked", "Ordered vs Unordered", "Same", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the 'final' keyword?",
            options: ["Constant value", "Variable value", "Changing value", "None"],
            correct: 0
        }
    ],
    html: [
        {
            question: "What does HTML stand for?",
            options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Text Markup Leveler", "None"],
            correct: 0
        },
        {
            question: "Which tag is used for largest heading?",
            options: ["<h1>", "<h6>", "<heading>", "<head>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for line break?",
            options: ["<br>", "<lb>", "<break>", "<hr>"],
            correct: 0
        },
        {
            question: "Which tag is used for inserting image?",
            options: ["<img>", "<image>", "<pic>", "<src>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for hyperlink?",
            options: ["<a href=''>", "<link>", "<url>", "<hyperlink>"],
            correct: 0
        },
        {
            question: "Which tag is used for unordered list?",
            options: ["<ul>", "<ol>", "<li>", "<list>"],
            correct: 0
        },
        {
            question: "What does CSS stand for?",
            options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "None"],
            correct: 0
        },
        {
            question: "Which attribute is used to define inline styles?",
            options: ["style", "class", "font", "styles"],
            correct: 0
        },
        {
            question: "Which HTML tag is used for table?",
            options: ["<table>", "<tab>", "<tbl>", "<grid>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for checkbox?",
            options: ["<input type='checkbox'>", "<checkbox>", "<check>", "<input type='check'>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for creating a text input field?",
            options: ["<input type='text'>", "<text>", "<input type='textfield'>", "<textfield>"],
            correct: 0
        },
        {
            question: "Which tag is used to define a paragraph?",
            options: ["<p>", "<para>", "<paragraph>", "<pg>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for adding a background color?",
            options: ["<body bgcolor='yellow'>", "<background>", "<body color='yellow'>", "None"],
            correct: 0
        },
        {
            question: "Which tag is used for inserting a line horizontally?",
            options: ["<hr>", "<line>", "<br>", "<hline>"],
            correct: 0
        },
        {
            question: "What does the <div> tag do?",
            options: ["Defines a division", "Defines a link", "Defines an image", "Defines a list"],
            correct: 0
        },
        {
            question: "Which tag is used for bold text?",
            options: ["<b>", "<bold>", "<strong>", "Both A and C"],
            correct: 3
        },
        {
            question: "What is the correct HTML for creating a form?",
            options: ["<form>", "<input>", "<field>", "<frm>"],
            correct: 0
        },
        {
            question: "Which input type defines a submit button?",
            options: ["submit", "button", "reset", "send"],
            correct: 0
        },
        {
            question: "What is the correct HTML for inserting a video?",
            options: ["<video>", "<media>", "<movie>", "<vid>"],
            correct: 0
        },
        {
            question: "Which tag is used for italic text?",
            options: ["<i>", "<italic>", "<em>", "Both A and C"],
            correct: 3
        },
        {
            question: "What is the correct HTML for creating a drop-down list?",
            options: ["<select>", "<list>", "<dropdown>", "<dl>"],
            correct: 0
        },
        {
            question: "Which attribute specifies a unique identifier?",
            options: ["id", "class", "name", "type"],
            correct: 0
        },
        {
            question: "What is the correct HTML for inserting a comment?",
            options: ["<!-- -->", "//", "/* */", "#"],
            correct: 0
        },
        {
            question: "Which tag is used for the largest heading?",
            options: ["<h1>", "<h2>", "<h3>", "<h4>"],
            correct: 0
        },
        {
            question: "What does the <span> tag do?",
            options: ["Inline container", "Block container", "Line break", "None"],
            correct: 0
        },
        {
            question: "Which is the correct way to link a CSS file?",
            options: ["<link rel='stylesheet' href='style.css'>", "<style src='style.css'>", "<css>", "None"],
            correct: 0
        },
        {
            question: "What is the correct HTML for creating a radio button?",
            options: ["<input type='radio'>", "<radio>", "<input type='button'>", "<rbtn>"],
            correct: 0
        },
        {
            question: "Which tag defines the title of the document?",
            options: ["<title>", "<head>", "<meta>", "<caption>"],
            correct: 0
        },
        {
            question: "What is the correct HTML for inserting a JavaScript file?",
            options: ["<script src='script.js'>", "<js src='script.js'>", "<javascript>", "None"],
            correct: 0
        },
        {
            question: "Which tag is used for subscript text?",
            options: ["<sub>", "<sup>", "<small>", "<under>"],
            correct: 0
        }
    ],
    sql: [
        {
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Standard Query Language", "Simple Query Language", "None"],
            correct: 0
        },
        {
            question: "Which SQL statement is used to extract data from database?",
            options: ["SELECT", "GET", "EXTRACT", "OPEN"],
            correct: 0
        },
        {
            question: "Which SQL statement is used to update data?",
            options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
            correct: 0
        },
        {
            question: "What is the full form of DDL?",
            options: ["Data Definition Language", "Data Description Language", "Data Design Language", "None"],
            correct: 0
        },
        {
            question: "Which command is used to delete a table?",
            options: ["DROP", "DELETE", "REMOVE", "CLEAR"],
            correct: 0
        },
        {
            question: "What is a primary key?",
            options: ["Unique identifier", "Foreign reference", "Index", "View"],
            correct: 0
        },
        {
            question: "Which join returns all rows from left table?",
            options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
            correct: 0
        },
        {
            question: "What does COUNT(*) do?",
            options: ["Counts rows", "Counts columns", "Counts values", "None"],
            correct: 0
        },
        {
            question: "Which clause is used to filter groups?",
            options: ["HAVING", "WHERE", "FILTER", "GROUP BY"],
            correct: 0
        },
        {
            question: "What is a foreign key?",
            options: ["References another table", "Primary key", "Unique key", "Index"],
            correct: 0
        },
        {
            question: "What is the purpose of the WHERE clause?",
            options: ["Filter records", "Sort records", "Group records", "Join tables"],
            correct: 0
        },
        {
            question: "Which SQL statement is used to insert data?",
            options: ["INSERT INTO", "ADD RECORD", "INSERT ROW", "NEW DATA"],
            correct: 0
        },
        {
            question: "What is the purpose of the ORDER BY clause?",
            options: ["Sort results", "Filter results", "Group results", "Limit results"],
            correct: 0
        },
        {
            question: "Which SQL statement is used to delete data?",
            options: ["DELETE", "REMOVE", "DROP", "CLEAR"],
            correct: 0
        },
        {
            question: "What is the purpose of the GROUP BY clause?",
            options: ["Group rows", "Sort rows", "Filter rows", "Join rows"],
            correct: 0
        },
        {
            question: "What is a view in SQL?",
            options: ["Virtual table", "Real table", "Index", "Query"],
            correct: 0
        },
        {
            question: "What is the purpose of the DISTINCT keyword?",
            options: ["Remove duplicates", "Add duplicates", "Count values", "None"],
            correct: 0
        },
        {
            question: "What is an index in SQL?",
            options: ["Performance booster", "Table", "View", "Query"],
            correct: 0
        },
        {
            question: "What is the purpose of the UNION operator?",
            options: ["Combine results", "Subtract results", "Multiply results", "Divide results"],
            correct: 0
        },
        {
            question: "What is a transaction in SQL?",
            options: ["Unit of work", "Table", "View", "Index"],
            correct: 0
        },
        {
            question: "What is the purpose of the COMMIT statement?",
            options: ["Save changes", "Undo changes", "Delete changes", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the ROLLBACK statement?",
            options: ["Undo changes", "Save changes", "Delete changes", "None"],
            correct: 0
        },
        {
            question: "What is a stored procedure?",
            options: ["Saved SQL code", "Table", "View", "Index"],
            correct: 0
        },
        {
            question: "What is a trigger in SQL?",
            options: ["Automatic action", "Manual action", "Table", "View"],
            correct: 0
        },
        {
            question: "What is the purpose of the ALTER statement?",
            options: ["Modify structure", "Modify data", "Delete data", "Add data"],
            correct: 0
        },
        {
            question: "What is a data type in SQL?",
            options: ["Type of data", "Table", "View", "Index"],
            correct: 0
        },
        {
            question: "What is NULL in SQL?",
            options: ["Missing value", "Zero", "Empty string", "Space"],
            correct: 0
        },
        {
            question: "What is the purpose of the IS NULL operator?",
            options: ["Check for null", "Check for zero", "Check for empty", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the BETWEEN operator?",
            options: ["Range check", "Value check", "List check", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the LIKE operator?",
            options: ["Pattern matching", "Equal check", "Greater check", "Less check"],
            correct: 0
        }
    ],
    c: [
        {
            question: "Who developed C language?",
            options: ["Dennis Ritchie", "Bjarne Stroustrup", "James Gosling", "Guido van Rossum"],
            correct: 0
        },
        {
            question: "Which is valid C variable name?",
            options: ["int", "_var", "2var", "var name"],
            correct: 1
        },
        {
            question: "What is the size of int in C?",
            options: ["2 bytes", "4 bytes", "8 bytes", "Depends on compiler"],
            correct: 3
        },
        {
            question: "Which header file is needed for printf?",
            options: ["stdio.h", "conio.h", "stdlib.h", "math.h"],
            correct: 0
        },
        {
            question: "What does '&' operator do?",
            options: ["Address of", "Bitwise AND", "Logical AND", "Reference"],
            correct: 0
        },
        {
            question: "Which is a loop in C?",
            options: ["for", "foreach", "repeat", "until"],
            correct: 0
        },
        {
            question: "What is a pointer?",
            options: ["Stores address", "Stores value", "Reference", "None"],
            correct: 0
        },
        {
            question: "Which is not a storage class?",
            options: ["auto", "register", "static", "external"],
            correct: 3
        },
        {
            question: "What does malloc() do?",
            options: ["Memory allocation", "Memory free", "Memory copy", "Memory set"],
            correct: 0
        },
        {
            question: "Which is a conditional statement?",
            options: ["if-else", "for", "while", "do-while"],
            correct: 0
        },
        {
            question: "What is the output of 5/2?",
            options: ["2", "2.5", "2.0", "Error"],
            correct: 0
        },
        {
            question: "What is the use of 'break' statement?",
            options: ["Exit loop", "Continue loop", "Skip iteration", "None"],
            correct: 0
        },
        {
            question: "What is an array in C?",
            options: ["Collection of elements", "Single element", "Pointer", "None"],
            correct: 0
        },
        {
            question: "What is a string in C?",
            options: ["Array of characters", "Single character", "Integer", "Float"],
            correct: 0
        },
        {
            question: "What does strlen() do?",
            options: ["String length", "String copy", "String compare", "String concat"],
            correct: 0
        },
        {
            question: "What is a structure in C?",
            options: ["User-defined type", "Built-in type", "Pointer", "None"],
            correct: 0
        },
        {
            question: "What is a union in C?",
            options: ["Shared memory", "Separate memory", "Pointer", "None"],
            correct: 0
        },
        {
            question: "What is a file in C?",
            options: ["Data storage", "Program", "Function", "None"],
            correct: 0
        },
        {
            question: "What does fopen() do?",
            options: ["Opens a file", "Closes a file", "Reads file", "Writes file"],
            correct: 0
        },
        {
            question: "What is a function in C?",
            options: ["Reusable code", "Variable", "Loop", "Condition"],
            correct: 0
        },
        {
            question: "What is recursion in C?",
            options: ["Function calls itself", "Function calls another", "Loop", "None"],
            correct: 0
        },
        {
            question: "What is a preprocessor directive?",
            options: ["#include", "int", "main", "return"],
            correct: 0
        },
        {
            question: "What is a header file?",
            options: ["Contains declarations", "Contains definitions", "Contains code", "None"],
            correct: 0
        },
        {
            question: "What is the main() function?",
            options: ["Entry point", "Exit point", "Loop", "Condition"],
            correct: 0
        },
        {
            question: "What is a variable in C?",
            options: ["Memory location", "Value", "Constant", "None"],
            correct: 0
        },
        {
            question: "What is a constant in C?",
            options: ["Fixed value", "Changing value", "Variable", "None"],
            correct: 0
        },
        {
            question: "What is an operator in C?",
            options: ["Performs operation", "Variable", "Constant", "None"],
            correct: 0
        },
        {
            question: "What is type casting?",
            options: ["Convert data type", "Change value", "Create type", "None"],
            correct: 0
        },
        {
            question: "What is a static variable?",
            options: ["Retains value", "Loses value", "Global", "Local"],
            correct: 0
        },
        {
            question: "What is a register variable?",
            options: ["Stored in CPU", "Stored in memory", "Stored in disk", "None"],
            correct: 0
        }
    ],
    cpp: [
        {
            question: "Who developed C++?",
            options: ["Bjarne Stroustrup", "Dennis Ritchie", "James Gosling", "Ken Thompson"],
            correct: 0
        },
        {
            question: "Which is not a feature of C++?",
            options: ["Classes", "Inheritance", "Pointers", "Garbage collection"],
            correct: 3
        },
        {
            question: "What is cout used for?",
            options: ["Output", "Input", "Error", "None"],
            correct: 0
        },
        {
            question: "Which symbol is used for comments?",
            options: ["//", "#", "/*", "--"],
            correct: 0
        },
        {
            question: "What is a constructor?",
            options: ["Initializes object", "Destroys object", "Copies object", "None"],
            correct: 0
        },
        {
            question: "Which is a access specifier?",
            options: ["public", "static", "virtual", "const"],
            correct: 0
        },
        {
            question: "What is inheritance?",
            options: ["Deriving classes", "Creating objects", "Overloading", "None"],
            correct: 0
        },
        {
            question: "Which is a polymorphism feature?",
            options: ["Virtual functions", "Classes", "Objects", "Inheritance"],
            correct: 0
        },
        {
            question: "What is namespace?",
            options: ["Container for identifiers", "Function", "Class", "Variable"],
            correct: 0
        },
        {
            question: "Which is a standard header for I/O?",
            options: ["iostream", "stdio.h", "conio.h", "fstream"],
            correct: 0
        },
        {
            question: "What is the difference between struct and class?",
            options: ["Default access", "Same", "Different", "None"],
            correct: 0
        },
        {
            question: "What is a destructor?",
            options: ["Destroys object", "Creates object", "Copies object", "None"],
            correct: 0
        },
        {
            question: "What is function overloading?",
            options: ["Same name, different parameters", "Different name", "Same parameters", "None"],
            correct: 0
        },
        {
            question: "What is operator overloading?",
            options: ["Redefining operators", "New operators", "Delete operators", "None"],
            correct: 0
        },
        {
            question: "What is virtual function?",
            options: ["Dynamic binding", "Static binding", "Compile time", "None"],
            correct: 0
        },
        {
            question: "What is pure virtual function?",
            options: ["Abstract function", "Concrete function", "Normal function", "None"],
            correct: 0
        },
        {
            question: "What is a template in C++?",
            options: ["Generic programming", "Specific programming", "Normal code", "None"],
            correct: 0
        },
        {
            question: "What is exception handling?",
            options: ["Error handling", "Normal flow", "Loop control", "None"],
            correct: 0
        },
        {
            question: "What is the try-catch block?",
            options: ["Error handling", "Loop", "Condition", "None"],
            correct: 0
        },
        {
            question: "What is STL?",
            options: ["Standard Template Library", "Simple Template Library", "Standard Type Library", "None"],
            correct: 0
        },
        {
            question: "What is a vector in C++?",
            options: ["Dynamic array", "Static array", "Linked list", "None"],
            correct: 0
        },
        {
            question: "What is a list in C++?",
            options: ["Doubly linked list", "Array", "Stack", "Queue"],
            correct: 0
        },
        {
            question: "What is a map in C++?",
            options: ["Key-value pairs", "Array", "List", "Set"],
            correct: 0
        },
        {
            question: "What is a set in C++?",
            options: ["Unique elements", "Duplicate elements", "Array", "List"],
            correct: 0
        },
        {
            question: "What is an iterator?",
            options: ["Traverses containers", "Creates containers", "Deletes containers", "None"],
            correct: 0
        },
        {
            question: "What is a friend function?",
            options: ["Access private members", "Public function", "Protected function", "None"],
            correct: 0
        },
        {
            question: "What is this pointer?",
            options: ["Points to current object", "Points to parent", "Points to child", "None"],
            correct: 0
        },
        {
            question: "What is new operator?",
            options: ["Dynamic memory", "Static memory", "Stack memory", "None"],
            correct: 0
        },
        {
            question: "What is delete operator?",
            options: ["Free memory", "Allocate memory", "Copy memory", "None"],
            correct: 0
        },
        {
            question: "What is reference variable?",
            options: ["Alias to variable", "Pointer", "Value", "None"],
            correct: 0
        }
    ]
};

// Subject icons mapping
const subjectIcons = {
    python: "fab fa-python",
    java: "fab fa-java",
    html: "fab fa-html5",
    sql: "fas fa-database",
    c: "fas fa-code",
    cpp: "fas fa-code"
};

// Subject display names
const subjectNames = {
    python: "Python",
    java: "Java",
    html: "HTML",
    sql: "SQL",
    c: "C",
    cpp: "C++"
};

// Subject descriptions
const subjectDescriptions = {
    python: "10 Question",
    java: "10 Question",
    html: "10 Question",
    sql: "10 Question",
    c: "10 Question",
    cpp: "10 Question"
};