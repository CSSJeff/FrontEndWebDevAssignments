// Retrieve References to HTML Elements

const nameInput = document.getElementById("nameInput");
const submitButton = document.getElementById("submitButton");
const outputDiv = document.getElementById("outputDiv");
const mouseTracker = document.getElementById("mouseTracker");
const coordinates = document.getElementById("coordinates");

// Validate and Submit form

function submitForm() {

    // Remove Extra Spaces in Input
    const name = nameInput.value.trim();

    // User Enter Name Check
    if (name === "") {
        outputDiv.textContent = "Error: Please enter a name.";
        outputDiv.style.color = "red";
        outputDiv.style.backgroundColor = "";
        return;
    }

    // Welcome
    outputDiv.textContent = `Welcome, ${name}!`;
    outputDiv.style.color = "white";
    outputDiv.style.backgroundColor = "green";
}

// Click Event Listener
submitButton.addEventListener("click", submitForm);

// Keyboard Event Listener
nameInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault(); // Prevents Users Page from Refreshing 
        submitButton.click();   // Button Click
    }

});

// Mouse Move Event Listener
mouseTracker.addEventListener("mousemove", function(event) {

    // Tracker Position
    const rect = mouseTracker.getBoundingClientRect();

    // Calculate Mouse Position
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);

    // Displays Coordinates
    coordinates.textContent = `Mouse Coordinates: X: ${x}, Y: ${y}`;

});
