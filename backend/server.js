const express = require("express");
const cors = require("cors");
const db = require("./config");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Existing API routes
const recommendationRoutes = require("./routes");
app.use("/recommendations", recommendationRoutes);

app.get("/songs", (req, res) => {
    db.query("SELECT * FROM songs LIMIT 100", (err, results) => {
        if (err) {
            console.error("Error fetching songs:", err);
            res.status(500).send("Error fetching songs");
        } else {
            res.json(results);
        }
    });
});

app.get("/tracks", (req, res) => {
    db.query("SELECT * FROM songs LIMIT 100", (err, results) => {
        if (err) {
            console.error("Error fetching tracks:", err);
            res.status(500).send("Error fetching tracks");
        } else {
            res.json(results);
        }
    });
});

app.get("/autocomplete", (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    const sql = `
        SELECT DISTINCT song AS name
        FROM songs
        WHERE song LIKE ?
        UNION
        SELECT DISTINCT artist AS name
        FROM songs
        WHERE artist LIKE ?
        LIMIT 10;
    `;
    const params = [`%${query}%`, `%${query}%`];

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching autocomplete suggestions:", err);
            res.status(500).send("Error fetching autocomplete suggestions");
        } else {
            res.json(results);
        }
    });
});

app.get("/search", (req, res) => {
    const query = req.query.query; // Get the search query from the request
    if (!query) {
        return res.status(400).json({ error: "Query parameter is required" });
    }

    // SQL query to search for songs or artists
    const sql = `
        SELECT song, artist, link
        FROM songs
        WHERE song LIKE ? OR artist LIKE ?
        LIMIT 10;
    `;
    const params = [`%${query}%`, `%${query}%`]; // Use wildcards for partial matches

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching search results:", err);
            res.status(500).send("Error fetching search results");
        } else {
            res.json(results); // Send the matching results as JSON
        }
    });
});

const { spawn } = require("child_process");

app.get("/recommendations", (req, res) => {
    const songName = req.query.song;
    if (!songName) {
        return res.status(400).json({ error: "Song name is required" });
    }

    // Call the Python script
    const pythonProcess = spawn("python", ["c:\\Users\\Bee\\Desktop\\CMPE_131_Project\\CMPE_131\\backend\\recommendation_model.py", songName]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (err) => {
        console.error("Error:", err.toString());
    });

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            try {
                const recommendations = JSON.parse(data);
                res.json(recommendations);
            } catch (err) {
                console.error("Error parsing recommendations:", err);
                res.status(500).send("Error generating recommendations");
            }
        } else {
            res.status(500).send("Error generating recommendations");
        }
    });
});


// Fallback route for serving index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});



// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});