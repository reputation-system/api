module.exports = {
    run: (app, req, res) => {
        const { steamid64, playerIp } = req.query;

        if (!steamid64)
            return res.status(400).json({ error: true, message: "Missing steamid64 query parameter" });
        if (!playerIp)
            return res.status(400).json({ error: true, message: "Missing playerIp query parameter" });

        app.db.query("SELECT * FROM players WHERE steamid64 = ?", [steamid64], (err, results) => {
            if (err) throw err;

            if (results.length > 0) return res.status(200).json({ error: false, message: "Player already exists" });

            app.db.query("INSERT INTO players (ip, steamid64) VALUES(?, ?)", [playerIp, steamid64], (err, results) => {
                if (err) return res.status(500).json({ error: true, message: "An SQL Error has occured, please contact an admin!" });

                res.json({ error: false, message: "Player added successfully" });
            });
        });
    }
}