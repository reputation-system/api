module.exports = {
    run: (app, req, res) => {
        const { ip } = req.query;

        if (!ip)
            return res.status(400).json({ error: true, message: "Missing ip query parameter" });

        app.db.query("SELECT id FROM servers WHERE ip = ? LIMIT 1", [ip], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                res.status(404).json({ error: true, message: "No server found with this ip" });
                return;
            }

            res.json(results[0]);
        });
    }
}