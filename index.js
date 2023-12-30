// Express API made for Beggin
const express = require("express");
const fs = require("fs");
const mysql = require("mysql2");
const axios = require("axios");
require("dotenv").config();

/* Our local vars */
const app = express();
const app_port = 8182;
const routes_path = __dirname + "/routes/";

// Axios vars
app.axios = axios;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* App start listening */
app.listen(app_port, () => {

	console.log("Initializing API...");
	console.log("Initializing MySQL connection...");
    
    app.db = mysql.createPool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
    })

	console.log("MySQL connection initialized");
	console.log(`API initialized on port ${app_port}`);

});

/* Redirect routes to the correct callback */
async function loadRoutes(rootPath) {

	fs.readdir(rootPath, (err, files) => {
		if (err) throw err;
		
		files.forEach(file => {
			file = `${rootPath}${file}`;

			const filestat = fs.statSync(file);
			if (!filestat) return;

			if (filestat.isDirectory()) {
				loadRoutes(`${file}/`)
			} else {
				let routePath = "/" + file.replace(routes_path, "").replace(".js", "").replace("index", "");
				if (routePath[routePath.length - 1] === "/")
					routePath = routePath.slice(0, -1);

				const routeModule = require(file);
				const apiMethodFunc = (routeModule.post ? app.post.bind(app) : app.get.bind(app));

				apiMethodFunc(routePath, (req, res) => {
					const foundCookie = (req.headers.cookie || "").indexOf(`reputation_system=${process.env.SUPER_SECRET_TOKEN}`);
					
					if (foundCookie === -1) 
						res.status(403).send("Access restricted - you are not allowed.");
					else if (typeof routeModule.run === "function")
						routeModule.run(app, req, res);
				});
			}
		})
	})

};
loadRoutes(routes_path);
