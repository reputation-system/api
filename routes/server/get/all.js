module.exports = {
    run: (app, _, res) => {
        app.db.query("SELECT * FROM servers", (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                res.status(404).json({ error: true, message: "No server found" });
                return;
            }

            res.json(results);
        });
    }
}