# What is a Movie Watchlist?
This project is a Movie Watchlist web app created with HTML, CSS, and JavaScript. It attempts to keep track of the movies you have watched recently.

# The Key Features
1. Allows user to enter a movie title to the watchlist.
2. Stores the movie titles in a JavaScript array (for easy tracking).
3. Watchlist displays dynamically onto a webpage.
4. Removes the movie from your list by clicking **Watched** 
5. Enter or add a movie by pressing **Enter** 
6. Let's user know if watchlsit is empty. 

# HTML. CSS, and JavaScript Files
1. `index.html` - This provides the structure of the web app.
2. `css/styles.css` - This provides the style as in aesthetics, fonts, and etc.
3.  `js/main.js` - Makes the web app interactive the backbone of the app. 

# How the JavaScript Works
The JavaScript file uses an array named `movies` to store the movie watchlist.

# There are 3 Main Functions:
1. `addMovie()` - This receives the movie title from the input and adds it into the array.
2. `displayMovies()` - Updates the webpage, so that new movies additions are shown. 
3. `removeMovie(index)` - Let's the user remove a movie from the list, and updates the array. 

# How to Use the App
1. Open `index.html` in web browser.
2. Type a movie into the input box.
3. Click **Add Movie** or press **Enter**.
4. The movie will appear in the watchlist (array).
5. Click **Watched** to remove a movie from your list.