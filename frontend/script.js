const searchInput = document.getElementById("search");
const autocompleteList = document.createElement("ul");
autocompleteList.id = "autocomplete-list";
autocompleteList.style.position = "absolute";
autocompleteList.style.backgroundColor = "white";
autocompleteList.style.border = "1px solid #ccc";
autocompleteList.style.listStyle = "none";
autocompleteList.style.padding = "0";
autocompleteList.style.margin = "0";
autocompleteList.style.width = "60%";
autocompleteList.style.zIndex = "1000";
searchInput.parentNode.appendChild(autocompleteList);

const spinner = document.getElementById("loading-spinner"); // Reference to the spinner

// Autocomplete functionality
searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        autocompleteList.innerHTML = ""; // Clear suggestions
        return;
    }

    try {
        const response = await fetch(`/autocomplete?query=${encodeURIComponent(query)}`);
        const suggestions = await response.json();

        autocompleteList.innerHTML = ""; // Clear previous suggestions
        suggestions.forEach(suggestion => {
            const listItem = document.createElement("li");
            listItem.textContent = suggestion.name || suggestion.artist; // Use song or artist name
            listItem.style.padding = "10px";
            listItem.style.cursor = "pointer";

            listItem.addEventListener("click", () => {
                searchInput.value = suggestion.name || suggestion.artist; // Set the selected value
                autocompleteList.innerHTML = ""; // Clear suggestions
            });

            autocompleteList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
    }
});

// Fetch recommendations with a loading spinner
document.getElementById("get-recommendations").addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
        alert("Please enter a song name!");
        return;
    }

    spinner.style.display = "block"; // Show spinner

    try {
        const response = await fetch(`/recommendations?song=${encodeURIComponent(query)}`);
        const recommendations = await response.json();

        const recommendationList = document.getElementById("recommendation-list");
        recommendationList.innerHTML = ""; // Clear previous recommendations

        recommendations.forEach(track => {
            const trackCard = document.createElement("div");
            trackCard.className = "track-card";
            trackCard.innerHTML = `
                <h3>${track.song}</h3>
                <p>Artist: ${track.artist}</p>
            `;
            recommendationList.appendChild(trackCard);
        });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        alert("Failed to fetch recommendations. Please try again later.");
    } finally {
        spinner.style.display = "none"; // Hide spinner
    }
});