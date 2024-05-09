// Author: Bella Singh
// ISU Netid : bellas23@iastate.edu
// Date : February 23rd, 2024

// fetch("./bellas23_Activity08_MoviesFromJSON.json")
//     .then(response => response.json())
//     .then(myMovies => loadMovies(myMovies));

// function loadMovies(myMovies) {
//     // Find element “col” in HTML
//     var CardMovie = document.getElementById("col");
//     var checkboxes = [];
//     var cards = [];

//     // Read every movie from array
//     for (var i = 0; i < myMovies.movies.length; i++) {
//         let title = myMovies.movies[i].title;
//         let year = myMovies.movies[i].year;
//         let url = myMovies.movies[i].url;
//         let checkbox = "checkbox" + i.toString();
//         let card = "card" + i.toString();

//         // create new HTML div division
//         let AddCardMovie = document.createElement("div");
//         // add class = “col” to new division for Bootstrap
//         AddCardMovie.classList.add("col");
//         // create Bootstrap card
//         AddCardMovie.innerHTML = `
//         <input type="checkbox" id=${checkbox} class="form-check-input" checked>
//         <label for=${checkbox} class="form-check-label">Show Image ${i}</label> 
//             <div id=${card} class="card shadow-sm">
//             <img src=${url} class="card-img-top" alt="..."></img>
//                 <div class="card-body">
//                     <p class="card-text"> <strong>${title}</strong>, ${year}</p>
//                     <div class="d-flex justify-content-between align-items-center">
//                         <div class="btn-group">
//                         <!-- <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
//                             <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button> -->
//                         </div>
//                         <!--<small class="text-body-secondary">9 mins</small>-->
//                     </div>
//                 </div>
//             </div>
//             `;

//         // append new division
//         CardMovie.appendChild(AddCardMovie);
//         let cbox = document.getElementById(checkbox);
//         checkboxes.push(cbox);
//         let ccard = document.getElementById(card);
//         cards.push(ccard);

//         // explore console
//         console.log(checkbox);
//         console.log(card);

//     } // end of for

//     console.log(checkboxes);
//     console.log(cards);

//     // Add event listeners to checkboxes to toggle card visibility
//     checkboxes.forEach((checkboxParam, index) => {
//         console.log(index);
//         checkboxParam.addEventListener('change', () => {
//             if (checkboxParam.checked) {
//                 cards[index].style.display = 'block'; // Show the card
//             } else {
//                 cards[index].style.display = 'none'; // Hide the card
//             }
//         });
//     });

// } // end of function


// fetch("./")
//     .then(response => response.json())
//     .then(myRobots => loadRobots(myRobots));

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.get("/listRobots", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
        .collection("robot")
        .find(query)
        .limit(100)
        .toArray();
    console.log(results);
    res.status(200);
    res.send(results);
});

function loadRobots(myRobots) {
    // Find element “col” in HTML
    var CardRobot = document.getElementById("col");
    var cards = [];

    // Read every robot from array
    for (var i = 0; i < myRobots.length; i++) {
        let name = myRobots[i].name;
        let price = myRobots[i].price;
        let description = myRobots[i].description;
        let url = myRobots[i].imageUrl;
        let card = "card" + i.toString();

        // create new HTML div division
        let AddCardRobot = document.createElement("div");
        // add class = “col” to new division for Bootstrap
        AddCardRobot.classList.add("col");
        // create Bootstrap card
        AddCardRobot.innerHTML = `
        <label class="form-check-label"></label> 
            <div id=${card} class="card shadow-sm">
            <img src=${url} class="card-img-top" alt="..."></img>
                <div class="card-body">
                    <p class="card-text">${i+1} <strong>${name}</strong>, $${price} <br/><br/>${description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                        <!-- <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button> -->
                        </div>
                        <!--<small class="text-body-secondary">9 mins</small>-->
                    </div>
                </div>
            </div>
            `;

        // append new division
        CardRobot.appendChild(AddCardRobot);
        let ccard = document.getElementById(card);
        cards.push(ccard);

        // explore console
        console.log(card);

    } // end of for

    console.log(cards);

} // end of function
