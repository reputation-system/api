module.exports = {
    run: (app, req, res) => {
        const { hostname } = req.query;

        if (!hostname)
            return res.status(400).json({ error: true, message: "Missing hostname query parameter" });

        const remoteIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        app.db.query("INSERT INTO servers (hostname, ip) VALUES(?, ?)", [hostname, remoteIP], (err) => {
            if (err) return res.status(500).json({ error: true, message: "An SQL Error has occured, please contact an admin!" });

            res.json({ error: false, message: "Server added successfully" });
        });
    }
}