// Movie Watchlist Application - Project #4

// The Array to Store Movie Titles
let movies = [];
// Select Elements
const movieInput = document.getElementById("movie-name");
const addMovieButton = document.getElementById("add-movie-btn");
const movieList = document.getElementById("movie-list");

// Add a Movie to the Watchlist Function
function addMovie() {
  const movieTitle = movieInput.value.trim();
  // Prevents Empty Movie Titles 
  if (movieTitle === "") {
    alert("Please enter a movie title.");
    return;
  }

  // Add Movie Title to the Array
  movies.push(movieTitle);

  // Clears Input Field After Adding Movie
  movieInput.value = "";
  // Update Webpage
  displayMovies();
}

// Function to Display all Movies in Watchlist
function displayMovies() {
  movieList.innerHTML = "";

  // Show Message if No Movies in Watchlist
  if (movies.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "collection-item";
    emptyMessage.textContent = "No movies in your watchlist yet.";
    movieList.appendChild(emptyMessage);
    return;
  }

  movies.forEach(function (movie, index) {
    const listItem = document.createElement("li");
    listItem.className = "collection-item";

    const movieTitle = document.createElement("span");
    movieTitle.className = "movie-title";
    movieTitle.textContent = movie;

    const removeButton = document.createElement("span");
    removeButton.className = "remove-btn";
    removeButton.textContent = "Watched";

    // Remove Function - Click Watched
    removeButton.addEventListener("click", function () {
      removeMovie(index);
    });

    listItem.appendChild(movieTitle);
    listItem.appendChild(removeButton);
    movieList.appendChild(listItem);
  });
}

// Function to Remove a Movie 
function removeMovie(index) {
  // Removes one Movie as Specified
  movies.splice(index, 1);
  // Update After Removing Movie
  displayMovies();
}

// Event Listener
addMovieButton.addEventListener("click", addMovie);

// Enter to Also Add Movie
movieInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addMovie();
  }
});

// Display Starting Message
window.addEventListener("DOMContentLoaded", displayMovies);
