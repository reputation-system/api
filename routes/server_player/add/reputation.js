module.exports = {
    run: (app, req, res) => {
        const { serverId, steamid64, amount } = req.query;

        if (!serverId)
            return res.status(400).json({ error: true, message: "Missing serverId query parameter" });
        if (!steamid64)
            return res.status(400).json({ error: true, message: "Missing steamid64 query parameter" });
        if (!amount)
            return res.status(400).json({ error: true, message: "Missing amount query parameter" });

        app.db.query("SELECT * FROM servers WHERE id = ? LIMIT 1", [serverId], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                res.status(404).json({ error: true, message: "No server found with this serverId" });
                return;
            }

            app.db.query("SELECT * FROM players WHERE steamid64 = ? LIMIT 1", [steamid64], (err, results) => {
                if (err) throw err;

                if (results.length === 0) {
                    res.status(404).json({ error: true, message: "No player found with this steamid64" });
                    return;
                }

                app.db.query("SELECT * FROM server_players WHERE server_id = ? AND player_steamid64 = ? LIMIT 1", [serverId, steamid64], (err, results) => {
                    if (err) throw err;

                    let reputation = ((results[0] || []).reputation || 100) + parseFloat(amount);
                    reputation = Math.max(Math.min(reputation, 0), 100);

                    if (results.length === 0) {

                        app.db.query("INSERT INTO server_players (server_id, player_steamid64, reputation) VALUES(?, ?, ?)", [serverId, steamid64, reputation], (err) => {
                            if (err) return res.status(500).json({ error: true, message: "An SQL Error has occured, please contact an admin!" });
                            res.json({ error: false, message: "Reputation added successfully" });
                        });

                    } else {

                        app.db.query("UPDATE server_players SET reputation = ? WHERE server_id = ? AND player_steamid64 = ?", [reputation, serverId, steamid64], (err) => {
                            if (err) return res.status(500).json({ error: true, message: "An SQL Error has occured, please contact an admin!" });
                            res.json({ error: false, message: "Reputation added successfully" });
                        });

                    }
                });
            });
        });
    }
}