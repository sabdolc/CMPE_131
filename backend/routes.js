const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");

// router.get("/", async (req, res) => {
//     console.log("Received request for recommendations");
//     const query = req.query.song || req.query.artist; // Accept song or artist

//     if (!query) {
//         console.error("No song or artist provided in the query");
//         return res.status(400).json({ error: "Song or artist is required" });
//     }

//     // Call the Python script with the query
//     const pythonProcess = spawn("python", [
//         "c:\\Users\\Bee\\Desktop\\CMPE_131_Project\\CMPE_131\\backend\\recommendation_model.py",
//         query,
//     ]);

//     let data = "";
//     pythonProcess.stdout.on("data", (chunk) => {
//         data += chunk.toString();
//     });

//     pythonProcess.stderr.on("data", (err) => {
//         console.error("Python script error:", err.toString());
//     });

//     pythonProcess.on("close", (code) => {
//         if (code === 0) {
//             try {
//                 const recommendations = JSON.parse(data);
//                 res.json(recommendations);
//             } catch (err) {
//                 console.error("Error parsing recommendations:", err);
//                 res.status(500).json({ error: "Error generating recommendations" });
//             }
//         } else {
//             res.status(500).json({ error: "Error generating recommendations" });
//         }
//     });
// });

router.get("/", async (req, res) => {
    console.log("Received request for recommendations");
    const query = req.query.song || req.query.artist; // Accept song or artist

    if (!query) {
        console.error("No song or artist provided in the query");
        return res.status(400).json({ error: "Song or artist is required" });
    }

    console.log("Query passed to Python script:", query); // Debug log

    // Call the Python script with the query
    const pythonProcess = spawn("python", [
        "c:\\Users\\Bee\\Desktop\\CMPE_131_Project\\CMPE_131\\backend\\recommendation_model.py",
        query,
    ]);

    let data = "";
    pythonProcess.stdout.on("data", (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.stderr.on("data", (err) => {
        console.error("Python script error:", err.toString());
    });

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            try {
                const recommendations = JSON.parse(data);
                res.json(recommendations);
            } catch (err) {
                console.error("Error parsing recommendations:", err);
                res.status(500).json({ error: "Error generating recommendations" });
            }
        } else {
            res.status(500).json({ error: "Error generating recommendations" });
        }
    });
});

module.exports = router; // Export `router`