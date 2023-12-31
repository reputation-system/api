module.exports = {
    run: (app, req, res) => {
        const { ip } = req.query;

        if (!ip)
            ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        app.db.query("SELECT id FROM servers WHERE ip = ? LIMIT 1", [ip], (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                res.send("");
                return;
            }

            res.json(results[0]);
        });
    }
}