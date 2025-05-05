const express = require("express");
const router = express.Router();
const { getRecommendations } = require("./recommendation");

// Fetch recommended tracks based on a song
router.get("/", async (req, res) => {
    const songId = req.query.song;
    if (!songId) return res.status(400).json({ error: "Song ID is required" });

    try {
        const recommendations = await getRecommendations(songId);
        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ error: "Recommendation error", details: error.message });
    }
});

module.exports = router;