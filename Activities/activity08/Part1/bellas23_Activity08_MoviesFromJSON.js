// Author: Bella Singh
// ISU Netid : bellas23@iastate.edu
// Date : February 21st, 2024

fetch("./bellas23_Activity08_MoviesFromJSON.json")
    .then(response => response.json())
    .then(myMovies => loadMovies(myMovies));

function loadMovies(myMovies) {
    var mainContainer = document.getElementById("goodmovies");
    console.log(myMovies)

    for (let i = 0; i < myMovies.movies.length; i++) {
        let title = myMovies.movies[i].title;
        let year = myMovies.movies[i].year;
        let url = myMovies.movies[i].url;

        console.log(title);

        //construct the HTML document
        let division = document.createElement("div");

        division.innerHTML = `
        <h3>${title}</h3>
        ${year}<br>
        <img src = ${url} <br> <br>
        `;
        mainContainer.appendChild(division);
    }
}