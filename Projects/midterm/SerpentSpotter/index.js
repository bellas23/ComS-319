function identifySnake() {
    // Get user input from the search bar
    let userInput = document.getElementById("search-input").value.toLowerCase().trim();

    // Get the container for snake cards
    let snakeCardsContainer = document.getElementById("snakeCards");
    snakeCardsContainer.innerHTML = ""; // Clear existing snake cards

    // Fetch data from data.json
    fetch("./data.json")
        .then(response => response.json())
        .then(mySnakes => {
            // Split user input into individual features
            let userFeatures = userInput.split(',').map(feature => feature.trim());

            // Filter snakes based on user input
            let filteredSnakes = mySnakes.snakes.filter(snake => {
                let snakeFeatures = Object.values(snake.features).flat().map(feature => feature.toLowerCase());
                // Check if all user features are included in snake features
                return userFeatures.every(feature => snakeFeatures.includes(feature));
            });

            // Load only the filtered snakes
            loadSnakes(filteredSnakes);
        });
}

function loadSnakes(filteredSnakes) {
    var snakeCardsContainer = document.getElementById("snakeCards");

    for (let i = 0; i < filteredSnakes.length; i++) {
        let snake = filteredSnakes[i];
        let name = snake.name;
        let summary = snake.summary;
        let url = snake.url;
        let features = snake.features;

        // Concatenate features into a comma-separated string
        let featuresString = Object.values(features).flat().join(", ");

        // Create card element
        let card = document.createElement("div");
        card.classList.add("col-md-3");

        // Populate card with snake data including features
        card.innerHTML = `
            <div class="card mb-4 shadow-sm card-shape">
                <img src="${url}" alt="${name}" class="card-img-top square-image">
                <div class="card-body square-image">
                    <h5 class="card-title">${name}</h5>
                    <p><strong>Features: </strong>${featuresString}</p>
                    <p class="card-text" id="summary${i}"><strong>Description: </strong>${summary}</p>
                    <button onclick="toggleText(${i})" class="btn btn-primary">More</button>
                </div>
            </div>
        `;

        // Append card to container
        snakeCardsContainer.appendChild(card);
    }
}

function toggleText(index) {
    let summary = document.getElementById(`summary${index}`);
    let button = summary.parentElement.querySelector('button');

    if (summary.classList.contains('expanded')) {
        summary.classList.remove('expanded');
        button.textContent = 'More';
    } else {
        summary.classList.add('expanded');
        button.textContent = 'Less';
    }
}