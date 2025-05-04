// Fetch all tracks from backend
async function fetchTracks() {
    try {
        const response = await fetch("http://localhost:3000/tracks");
        const data = await response.json();
        displayTracks(data);
    } catch (error) {
        console.error("Error fetching tracks:", error);
    }
}

// Fetch tracks based on selected artist
async function fetchTracksByArtist(artistId) {
    try {
        const response = await fetch(`http://localhost:3000/tracks?artist=${artistId}`);
        const data = await response.json();
        displayTracks(data);
    } catch (error) {
        console.error("Error fetching artist tracks:", error);
    }
}

// Display tracks dynamically
function displayTracks(tracks) {
    const container = document.getElementById("track-container");
    container.innerHTML = ""; // Clear previous content

    tracks.forEach(track => {
        const trackCard = document.createElement("div");
        trackCard.className = "track-card";
        trackCard.innerHTML = `
            <h3>${track.name}</h3>
            <p>Artist: ${track.artist_uri}</p>
        `;
        container.appendChild(trackCard);
    });
}

// Search functionality for filtering track names
document.getElementById("search").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const items = document.querySelectorAll(".track-card");
    items.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(query) ? "block" : "none";
    });
});

// Artist filtering functionality
document.getElementById("artist-selector").addEventListener("change", (event) => {
    const artistId = event.target.value;
    if (artistId) {
        fetchTracksByArtist(artistId);
    } else {
        fetchTracks(); // Load all tracks
    }
});

// Load all tracks when the page first loads
window.onload = fetchTracks;