// This is the default root (https://api.intersoft.fr/).
// Don't put any other route in this file.

module.exports = {
    run: (app, req, res) => {
        res.send("Hello world!");
    }
}