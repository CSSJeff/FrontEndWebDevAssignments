// Assignment 3 
// Challenge 1 - Guessing Game (While Loop)

let randomNumber = Math.floor(Math.random() * 10) + 1;
let guess = Number(prompt("Guess a number between 1 and 10 (1-10):"));

while (guess !== randomNumber) {
    guess = Number(prompt("Incorrect! Please, try again:"));
}

alert("Congrats! You guessed the correct number.");


// Challenge 2 - Password Validator (Do-While Loop)


let password = prompt("Set your password:");
let confirmPassword;

do {
    confirmPassword = prompt("Re-enter your password (to Confirm):");
    
    if (confirmPassword !== password) {
        alert("Passwords don't match. Try again.");
    }

} while (confirmPassword !== password);

alert("Password confirmed successfully!");


// Challenge 3 -  Multiplication Table Generator (For Loop)


let number = Number(prompt("Enter a number for the multiplication table:"));

for (let i = 1; i <= 10; i++) {
    console.log(`${number} x ${i} = ${number * i}`);
}

alert("Check the console for your multiplication table.");


// Challenge 4 - Grade Evaluator (If-Else Statements)


let score = Number(prompt("Enter your score 0 to 100 (0 - 100):"));

if (score >= 90 && score <= 100) {
    alert("Grade: A");
} else if (score >= 80 && score <= 89) {
    alert("Grade: B");
} else if (score >= 70 && score <= 79) {
    alert("Grade: C");
} else if (score >= 60 && score <= 69) {
    alert("Grade: D");
} else if (score >= 0 && score < 60) {
    alert("Grade: F");
} else {
    alert("Invalid score entered.");
}


// Challenge 5 - Day Finder (Switch Case)


let dayNumber = Number(prompt("Enter a number 1 to 7 (1-7):"));

switch (dayNumber) {
    case 1:
        alert("Sunday");
        break;
    case 2:
        alert("Monday");
        break;
    case 3:
        alert("Tuesday");
        break;
    case 4:
        alert("Wednesday");
        break;
    case 5:
        alert("Thursday");
        break;
    case 6:
        alert("Friday");
        break;
    case 7:
        alert("Saturday");
        break;
    default:
        alert("Invalid input.");
}
