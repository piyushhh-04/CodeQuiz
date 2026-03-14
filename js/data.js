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
            options: ["2var", "var-name", "_var", "var name"],
            correct: 2
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
            options: ["HelloWorld", "Hello World", "Hello+World", "Error"],
            correct: 0
        },
        {
            question: "Which data type is mutable in Python?",
            options: ["Tuple", "List", "String", "Integer"],
            correct: 1
        },
        {
            question: "What does the range(3) function return?",
            options: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "Error"],
            correct: 1
        },
        {
            question: "How do you take user input in Python?",
            options: ["scan()", "input()", "get()", "read()"],
            correct: 1
        },
        {
            question: "Which keyword is used to define a function in Python?",
            options: ["func", "function", "def", "define"],
            correct: 2
        },
        {
            question: "What is the output of bool(0)?",
            options: ["True", "Error", "None", "False"],
            correct: 3
        },
        {
            question: "Which of the following is a Python framework?",
            options: ["Spring", "Django", "Laravel", "Rails"],
            correct: 1
        },
        {
            question: "What is PEP 8?",
            options: ["Python editor", "Python style guide", "Python package", "Python error"],
            correct: 1
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
            options: ["char", "float", "int", "str"],
            correct: 0
        },
        {
            question: "What is the output of 3 // 2?",
            options: ["1.5", "Error", "1.0", "1"],
            correct: 3
        },
        {
            question: "Which module is used for random numbers?",
            options: ["os", "math", "random", "sys"],
            correct: 2
        },
        {
            question: "What is a dictionary in Python?",
            options: ["Ordered sequence", "Key-value pairs", "Set of values", "None"],
            correct: 1
        },
        {
            question: "How do you handle exceptions in Python?",
            options: ["handle", "catch", "throw", "try-except"],
            correct: 3
        },
        {
            question: "What is lambda in Python?",
            options: ["Variable", "Loop", "Anonymous function", "Module"],
            correct: 2
        },
        {
            question: "Which is used for string formatting?",
            options: ["d-strings", "s-strings", "t-strings", "f-strings"],
            correct: 3
        },
        {
            question: "What does the split() method do?",
            options: ["Finds text", "Joins strings", "Replaces text", "Splits string into list"],
            correct: 3
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
            options: ["Variable", "Destructor", "Method", "Constructor"],
            correct: 3
        },
        {
            question: "How do you import a module?",
            options: ["require module", "include module", "using module", "import module"],
            correct: 3
        },
        {
            question: "What is a generator in Python?",
            options: ["Returns list", "Yields values", "Creates array", "None"],
            correct: 1
        },
        {
            question: "Which is true about sets?",
            options: ["Indexed", "Ordered", "No duplicates", "Mutable"],
            correct: 2
        },
        {
            question: "What does the map() function do?",
            options: ["Applies function to items", "Maps keys", "Creates dictionary", "None"],
            correct: 0
        },
        {
            question: "What is the output of 'Hello'[1]?",
            options: ["H", "l", "e", "o"],
            correct: 2
        }
    ],
    java: [
        {
            question: "Which of these is not a Java feature?",
            options: ["Object-oriented", "Pointers", "Platform independent", "Robust"],
            correct: 1
        },
        {
            question: "What is the size of int in Java?",
            options: ["16 bits", "64 bits", "32 bits", "8 bits"],
            correct: 2
        },
        {
            question: "Which is the root class of Java class hierarchy?",
            options: ["System", "Class", "Object", "Main"],
            correct: 2
        },
        {
            question: "What is JVM?",
            options: ["Java Virtual Machine", "Java Variable Method", "Java Version Manager", "None"],
            correct: 0
        },
        {
            question: "Which keyword is used to inherit a class?",
            options: ["using", "implements", "inherits", "extends"],
            correct: 3
        },
        {
            question: "What is the default value of boolean?",
            options: ["true", "false", "null", "0"],
            correct: 1
        },
        {
            question: "Which is a reserved keyword in Java?",
            options: ["object", "main", "strictfp", "system"],
            correct: 2
        },
        {
            question: "What is the return type of main method?",
            options: ["int", "void", "String", "boolean"],
            correct: 1
        },
        {
            question: "Which package is imported by default?",
            options: ["java.lang", "java.util", "java.io", "java.net"],
            correct: 0
        },
        {
            question: "What is garbage collection in Java?",
            options: ["Memory management", "Code cleaning", "Data backup", "None"],
            correct: 0
        },
        {
            question: "What is the difference between JDK and JRE?",
            options: ["JRE includes JDK", "JDK includes JRE", "Both are same", "None"],
            correct: 1
        },
        {
            question: "Which is not a primitive data type?",
            options: ["int", "String", "float", "char"],
            correct: 1
        },
        {
            question: "What is the purpose of the 'static' keyword?",
            options: ["Local variable", "Instance variable", "Class level variable", "None"],
            correct: 2
        },
        {
            question: "What is inheritance in Java?",
            options: ["None", "Creating objects", "Overloading", "Deriving classes"],
            correct: 3
        },
        {
            question: "Which is an access modifier?",
            options: ["public", "static", "final", "abstract"],
            correct: 0
        },
        {
            question: "What is an interface in Java?",
            options: ["None", "Concrete class", "Normal class", "Abstract class"],
            correct: 3
        },
        {
            question: "What is the use of 'this' keyword?",
            options: ["Current object", "Parent object", "Child object", "None"],
            correct: 0
        },
        {
            question: "What is method overloading?",
            options: ["Same name, same params", "Same name, different params", "Different name", "None"],
            correct: 1
        },
        {
            question: "What is method overriding?",
            options: ["Static method", "New method", "Redefining parent method", "None"],
            correct: 2
        },
        {
            question: "What is the super keyword used for?",
            options: ["None", "Access child", "Access current", "Access parent"],
            correct: 3
        },
        {
            question: "What is an abstract class?",
            options: ["Cannot be instantiated", "Can be instantiated", "Final class", "None"],
            correct: 0
        },
        {
            question: "What is polymorphism in Java?",
            options: ["Single form", "Many forms", "No form", "None"],
            correct: 1
        },
        {
            question: "What is encapsulation?",
            options: ["None", "Data showing", "Data sharing", "Data hiding"],
            correct: 3
        },
        {
            question: "What is the try-catch block used for?",
            options: ["Conditional", "Looping", "Exception handling", "None"],
            correct: 2
        },
        {
            question: "What is finally block?",
            options: ["Always executes", "Never executes", "Sometimes executes", "None"],
            correct: 0
        },
        {
            question: "What is a thread in Java?",
            options: ["Heavy process", "Lightweight process", "Program", "None"],
            correct: 1
        },
        {
            question: "What is synchronization?",
            options: ["None", "Data control", "Memory control", "Thread control"],
            correct: 3
        },
        {
            question: "What is a collection in Java?",
            options: ["None", "Single object", "Primitive type", "Group of objects"],
            correct: 3
        },
        {
            question: "What is the difference between ArrayList and LinkedList?",
            options: ["Array vs Linked", "Ordered vs Unordered", "Same", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the 'final' keyword?",
            options: ["Changing value", "Variable value", "Constant value", "None"],
            correct: 2
        }
    ],
    html: [
        {
            question: "What does HTML stand for?",
            options: ["None", "High Text Machine Language", "Hyper Text Markup Leveler", "Hyper Text Markup Language"],
            correct: 3
        },
        {
            question: "Which tag is used for largest heading?",
            options: ["<heading>", "<h6>", "<h1>", "<head>"],
            correct: 2
        },
        {
            question: "What is the correct HTML for line break?",
            options: ["<br>", "<lb>", "<break>", "<hr>"],
            correct: 0
        },
        {
            question: "Which tag is used for inserting image?",
            options: ["<image>", "<img>", "<pic>", "<src>"],
            correct: 1
        },
        {
            question: "What is the correct HTML for hyperlink?",
            options: ["<a href=''>", "<link>", "<url>", "<hyperlink>"],
            correct: 0
        },
        {
            question: "Which tag is used for unordered list?",
            options: ["<list>", "<ol>", "<li>", "<ul>"],
            correct: 3
        },
        {
            question: "What does CSS stand for?",
            options: ["Creative Style System", "Computer Style Sheets", "Cascading Style Sheets", "None"],
            correct: 2
        },
        {
            question: "Which attribute is used to define inline styles?",
            options: ["class", "style", "font", "styles"],
            correct: 1
        },
        {
            question: "Which HTML tag is used for table?",
            options: ["<tab>", "<table>", "<tbl>", "<grid>"],
            correct: 1
        },
        {
            question: "What is the correct HTML for checkbox?",
            options: ["<input type='check'>", "<checkbox>", "<check>", "<input type='checkbox'>"],
            correct: 3
        },
        {
            question: "What is the correct HTML for creating a text input field?",
            options: ["<input type='textfield'>", "<text>", "<input type='text'>", "<textfield>"],
            correct: 2
        },
        {
            question: "Which tag is used to define a paragraph?",
            options: ["<para>", "<p>", "<paragraph>", "<pg>"],
            correct: 1
        },
        {
            question: "What is the correct HTML for adding a background color?",
            options: ["<body color='yellow'>", "<background>", "<body bgcolor='yellow'>", "None"],
            correct: 2
        },
        {
            question: "Which tag is used for inserting a line horizontally?",
            options: ["<hline>", "<line>", "<br>", "<hr>"],
            correct: 3
        },
        {
            question: "What does the <div> tag do?",
            options: ["Defines a list", "Defines a link", "Defines an image", "Defines a division"],
            correct: 3
        },
        {
            question: "Which tag is used for bold text?",
            options: ["<b>", "<bold>", "<strong>", "Both A and C"],
            correct: 3
        },
        {
            question: "What is the correct HTML for creating a form?",
            options: ["<input>", "<form>", "<field>", "<frm>"],
            correct: 1
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
            options: ["<dl>", "<list>", "<dropdown>", "<select>"],
            correct: 3
        },
        {
            question: "Which attribute specifies a unique identifier?",
            options: ["class", "id", "name", "type"],
            correct: 1
        },
        {
            question: "What is the correct HTML for inserting a comment?",
            options: ["<!-- -->", "//", "/* */", "#"],
            correct: 0
        },
        {
            question: "Which tag is used for the largest heading?",
            options: ["<h3>", "<h2>", "<h1>", "<h4>"],
            correct: 2
        },
        {
            question: "What does the <span> tag do?",
            options: ["Line break", "Block container", "Inline container", "None"],
            correct: 2
        },
        {
            question: "Which is the correct way to link a CSS file?",
            options: ["<style src='style.css'>", "<link rel='stylesheet' href='style.css'>", "<css>", "None"],
            correct: 1
        },
        {
            question: "What is the correct HTML for creating a radio button?",
            options: ["<input type='radio'>", "<radio>", "<input type='button'>", "<rbtn>"],
            correct: 0
        },
        {
            question: "Which tag defines the title of the document?",
            options: ["<meta>", "<head>", "<title>", "<caption>"],
            correct: 2
        },
        {
            question: "What is the correct HTML for inserting a JavaScript file?",
            options: ["<js src='script.js'>", "<script src='script.js'>", "<javascript>", "None"],
            correct: 1
        },
        {
            question: "Which tag is used for subscript text?",
            options: ["<under>", "<sup>", "<small>", "<sub>"],
            correct: 3
        }
    ],
    sql: [
        {
            question: "What does SQL stand for?",
            options: ["Standard Query Language", "Structured Query Language", "Simple Query Language", "None"],
            correct: 1
        },
        {
            question: "Which SQL statement is used to extract data from database?",
            options: ["EXTRACT", "GET", "SELECT", "OPEN"],
            correct: 2
        },
        {
            question: "Which SQL statement is used to update data?",
            options: ["UPDATE", "MODIFY", "CHANGE", "ALTER"],
            correct: 0
        },
        {
            question: "What is the full form of DDL?",
            options: ["Data Description Language", "Data Definition Language", "Data Design Language", "None"],
            correct: 1
        },
        {
            question: "Which command is used to delete a table?",
            options: ["CLEAR", "DELETE", "REMOVE", "DROP"],
            correct: 3
        },
        {
            question: "What is a primary key?",
            options: ["Unique identifier", "Foreign reference", "Index", "View"],
            correct: 0
        },
        {
            question: "Which join returns all rows from left table?",
            options: ["RIGHT JOIN", "LEFT JOIN", "INNER JOIN", "FULL JOIN"],
            correct: 1
        },
        {
            question: "What does COUNT(*) do?",
            options: ["Counts columns", "Counts rows", "Counts values", "None"],
            correct: 1
        },
        {
            question: "Which clause is used to filter groups?",
            options: ["HAVING", "WHERE", "FILTER", "GROUP BY"],
            correct: 0
        },
        {
            question: "What is a foreign key?",
            options: ["Unique key", "Primary key", "References another table", "Index"],
            correct: 2
        },
        {
            question: "What is the purpose of the WHERE clause?",
            options: ["Group records", "Sort records", "Filter records", "Join tables"],
            correct: 2
        },
        {
            question: "Which SQL statement is used to insert data?",
            options: ["NEW DATA", "ADD RECORD", "INSERT ROW", "INSERT INTO"],
            correct: 3
        },
        {
            question: "What is the purpose of the ORDER BY clause?",
            options: ["Sort results", "Filter results", "Group results", "Limit results"],
            correct: 0
        },
        {
            question: "Which SQL statement is used to delete data?",
            options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
            correct: 1
        },
        {
            question: "What is the purpose of the GROUP BY clause?",
            options: ["Sort rows", "Group rows", "Filter rows", "Join rows"],
            correct: 1
        },
        {
            question: "What is a view in SQL?",
            options: ["Virtual table", "Real table", "Index", "Query"],
            correct: 0
        },
        {
            question: "What is the purpose of the DISTINCT keyword?",
            options: ["None", "Add duplicates", "Count values", "Remove duplicates"],
            correct: 3
        },
        {
            question: "What is an index in SQL?",
            options: ["Performance booster", "Table", "View", "Query"],
            correct: 0
        },
        {
            question: "What is the purpose of the UNION operator?",
            options: ["Divide results", "Subtract results", "Multiply results", "Combine results"],
            correct: 3
        },
        {
            question: "What is a transaction in SQL?",
            options: ["Table", "Unit of work", "View", "Index"],
            correct: 1
        },
        {
            question: "What is the purpose of the COMMIT statement?",
            options: ["Save changes", "Undo changes", "Delete changes", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the ROLLBACK statement?",
            options: ["Delete changes", "Save changes", "Undo changes", "None"],
            correct: 2
        },
        {
            question: "What is a stored procedure?",
            options: ["Index", "Table", "View", "Saved SQL code"],
            correct: 3
        },
        {
            question: "What is a trigger in SQL?",
            options: ["Table", "Manual action", "Automatic action", "View"],
            correct: 2
        },
        {
            question: "What is the purpose of the ALTER statement?",
            options: ["Delete data", "Modify data", "Modify structure", "Add data"],
            correct: 2
        },
        {
            question: "What is a data type in SQL?",
            options: ["Index", "Table", "View", "Type of data"],
            correct: 3
        },
        {
            question: "What is NULL in SQL?",
            options: ["Empty string", "Zero", "Missing value", "Space"],
            correct: 2
        },
        {
            question: "What is the purpose of the IS NULL operator?",
            options: ["None", "Check for zero", "Check for empty", "Check for null"],
            correct: 3
        },
        {
            question: "What is the purpose of the BETWEEN operator?",
            options: ["Range check", "Value check", "List check", "None"],
            correct: 0
        },
        {
            question: "What is the purpose of the LIKE operator?",
            options: ["Equal check", "Pattern matching", "Greater check", "Less check"],
            correct: 1
        }
    ],
    c: [
        {
            question: "Who developed C language?",
            options: ["Bjarne Stroustrup", "Dennis Ritchie", "James Gosling", "Guido van Rossum"],
            correct: 1
        },
        {
            question: "Which is valid C variable name?",
            options: ["int", "var name", "2var", "_var"],
            correct: 3
        },
        {
            question: "What is the size of int in C?",
            options: ["2 bytes", "4 bytes", "Depends on compiler", "8 bytes"],
            correct: 2
        },
        {
            question: "Which header file is needed for printf?",
            options: ["stdlib.h", "conio.h", "stdio.h", "math.h"],
            correct: 2
        },
        {
            question: "What does '&' operator do?",
            options: ["Reference", "Bitwise AND", "Logical AND", "Address of"],
            correct: 3
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
            options: ["auto", "external", "static", "register"],
            correct: 1
        },
        {
            question: "What does malloc() do?",
            options: ["Memory free", "Memory allocation", "Memory copy", "Memory set"],
            correct: 1
        },
        {
            question: "Which is a conditional statement?",
            options: ["while", "for", "if-else", "do-while"],
            correct: 2
        },
        {
            question: "What is the output of 5/2?",
            options: ["Error", "2.5", "2.0", "2"],
            correct: 3
        },
        {
            question: "What is the use of 'break' statement?",
            options: ["Skip iteration", "Continue loop", "Exit loop", "None"],
            correct: 2
        },
        {
            question: "What is an array in C?",
            options: ["Single element", "Collection of elements", "Pointer", "None"],
            correct: 1
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
            options: ["Built-in type", "User-defined type", "Pointer", "None"],
            correct: 1
        },
        {
            question: "What is a union in C?",
            options: ["Pointer", "Separate memory", "Shared memory", "None"],
            correct: 2
        },
        {
            question: "What is a file in C?",
            options: ["Program", "Data storage", "Function", "None"],
            correct: 1
        },
        {
            question: "What does fopen() do?",
            options: ["Writes file", "Closes a file", "Reads file", "Opens a file"],
            correct: 3
        },
        {
            question: "What is a function in C?",
            options: ["Loop", "Variable", "Reusable code", "Condition"],
            correct: 2
        },
        {
            question: "What is recursion in C?",
            options: ["None", "Function calls another", "Loop", "Function calls itself"],
            correct: 3
        },
        {
            question: "What is a preprocessor directive?",
            options: ["#include", "int", "main", "return"],
            correct: 0
        },
        {
            question: "What is a header file?",
            options: ["Contains code", "Contains definitions", "Contains declarations", "None"],
            correct: 2
        },
        {
            question: "What is the main() function?",
            options: ["Entry point", "Exit point", "Loop", "Condition"],
            correct: 0
        },
        {
            question: "What is a variable in C?",
            options: ["None", "Value", "Constant", "Memory location"],
            correct: 3
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
            options: ["Change value", "Convert data type", "Create type", "None"],
            correct: 1
        },
        {
            question: "What is a static variable?",
            options: ["Loses value", "Retains value", "Global", "Local"],
            correct: 1
        },
        {
            question: "What is a register variable?",
            options: ["None", "Stored in memory", "Stored in disk", "Stored in CPU"],
            correct: 3
        }
    ],
    cpp: [
        {
            question: "Who developed C++?",
            options: ["Ken Thompson", "Dennis Ritchie", "James Gosling", "Bjarne Stroustrup"],
            correct: 3
        },
        {
            question: "Which is not a feature of C++?",
            options: ["Classes", "Inheritance", "Garbage collection", "Pointers"],
            correct: 2
        },
        {
            question: "What is cout used for?",
            options: ["Input", "Output", "Error", "None"],
            correct: 1
        },
        {
            question: "Which symbol is used for comments?",
            options: ["--", "#", "/*", "//"],
            correct: 3
        },
        {
            question: "What is a constructor?",
            options: ["None", "Destroys object", "Copies object", "Initializes object"],
            correct: 3
        },
        {
            question: "Which is a access specifier?",
            options: ["static", "public", "virtual", "const"],
            correct: 1
        },
        {
            question: "What is inheritance?",
            options: ["Creating objects", "Deriving classes", "Overloading", "None"],
            correct: 1
        },
        {
            question: "Which is a polymorphism feature?",
            options: ["Inheritance", "Classes", "Objects", "Virtual functions"],
            correct: 3
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
            options: ["Creates object", "Destroys object", "Copies object", "None"],
            correct: 1
        },
        {
            question: "What is function overloading?",
            options: ["Same name, different parameters", "Different name", "Same parameters", "None"],
            correct: 0
        },
        {
            question: "What is operator overloading?",
            options: ["Delete operators", "New operators", "Redefining operators", "None"],
            correct: 2
        },
        {
            question: "What is virtual function?",
            options: ["None", "Static binding", "Compile time", "Dynamic binding"],
            correct: 3
        },
        {
            question: "What is pure virtual function?",
            options: ["None", "Concrete function", "Normal function", "Abstract function"],
            correct: 3
        },
        {
            question: "What is a template in C++?",
            options: ["Generic programming", "Specific programming", "Normal code", "None"],
            correct: 0
        },
        {
            question: "What is exception handling?",
            options: ["Loop control", "Normal flow", "Error handling", "None"],
            correct: 2
        },
        {
            question: "What is the try-catch block?",
            options: ["Loop", "Error handling", "Condition", "None"],
            correct: 1
        },
        {
            question: "What is STL?",
            options: ["Standard Type Library", "Simple Template Library", "Standard Template Library", "None"],
            correct: 2
        },
        {
            question: "What is a vector in C++?",
            options: ["Dynamic array", "Static array", "Linked list", "None"],
            correct: 0
        },
        {
            question: "What is a list in C++?",
            options: ["Array", "Doubly linked list", "Stack", "Queue"],
            correct: 1
        },
        {
            question: "What is a map in C++?",
            options: ["List", "Array", "Key-value pairs", "Set"],
            correct: 2
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
            options: ["Protected function", "Public function", "Access private members", "None"],
            correct: 2
        },
        {
            question: "What is this pointer?",
            options: ["Points to parent", "Points to current object", "Points to child", "None"],
            correct: 1
        },
        {
            question: "What is new operator?",
            options: ["Stack memory", "Static memory", "Dynamic memory", "None"],
            correct: 2
        },
        {
            question: "What is delete operator?",
            options: ["Allocate memory", "Free memory", "Copy memory", "None"],
            correct: 1
        },
        {
            question: "What is reference variable?",
            options: ["None", "Pointer", "Value", "Alias to variable"],
            correct: 3
        }
    ],
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
    python: "10 Questions",
    java: "10 Questions",
    html: "10 Questions",
    sql: "10 Questions",
    c: "10 Questions",
    cpp: "10 Questions"
};