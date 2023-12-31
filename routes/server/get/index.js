module.exports = {
    run: (app, req, res) => {
        const { serverId } = req.query;

        if (!serverId)
            return res.status(400).json({ error: true, message: "Missing serverId query parameter" });

        app.db.query("SELECT * FROM servers WHERE id = ? LIMIT 1", [serverId], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                res.status(404).json({ error: true, message: "No server found with this serverId" });
                return;
            }

            res.json(results[0]);
        });
    }
}