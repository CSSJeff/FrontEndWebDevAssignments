// Assignment 2 - 6/6/2026

// 1. Variables / Data Types
let personName = "Jeffrey";
let age = 22;
let isStudent = true;

console.log("Name:", personName);
console.log("Type of name:", typeof personName);

console.log("Age:", age);
console.log("Type of age:", typeof age);

console.log("Is student:", isStudent);
console.log("Type of isStudent:", typeof isStudent);

// 2. Basic Arithmetic Operations
let numberOne = 4;
let numberTwo = 8;

console.log("Addition:", numberOne + numberTwo);
console.log("Subtraction:", numberOne - numberTwo);
console.log("Multiplication:", numberOne * numberTwo);
console.log("Division:", numberOne / numberTwo);

// 3. Strings
let sentence = "My name is Jeffrey and this is my 2nd assignment";

console.log("Sentence length:", sentence.length);
console.log("First character:", sentence.charAt(0));
console.log("Last character:", sentence.charAt(sentence.length - 1));

// 4. Math Object
let negativeNumber = -2;

console.log("Square root:", Math.sqrt(Math.abs(negativeNumber)));
console.log("Number squared:", Math.pow(negativeNumber, 2));
console.log("Absolute value:", Math.abs(negativeNumber));

// 5. Boolean Logic / Comparison Operators
let firstNumber = 10;
let secondNumber = 20;

console.log("First number is greater than second number:", firstNumber > secondNumber);
console.log("First number is less than second number:", firstNumber < secondNumber);
console.log("First number is equal to second number:", firstNumber === secondNumber);

// 6. Logical Operators
let booleanA = true;
let booleanB = true;

console.log("Logical AND:", booleanA && booleanB);
console.log("Logical OR:", booleanA || booleanB);
console.log("Logical NOT booleanA:", !booleanA);
console.log("Logical NOT booleanB:", !booleanB);

// 7. Template Literals
let firstName = "Jeff";
let lastName = "Johns";

let greetingMessage = `Hello, ${firstName} ${lastName}! Welcome to Assignment 2.`;

console.log(greetingMessage);
