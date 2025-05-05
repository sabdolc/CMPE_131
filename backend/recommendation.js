const db = require("./config");

async function getRecommendations(songId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT t.uri, t.name, t.artist_uri
            FROM tracks t
            JOIN song_similarity s ON t.uri = s.similar_song_uri
            WHERE s.song_uri = ?
            ORDER BY s.similarity_score DESC
            LIMIT 10;
        `;

        db.query(query, [songId], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}

module.exports = { getRecommendations };