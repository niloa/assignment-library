var express = require('express');
var async = require('async');

module.exports = function (app, passport) {

	// get an instance of the express Router
	var router = express.Router(); 

	// Default document when server is loaded
	router.get("/", function (req, res) {
        	res.render('index.html');
    	});
	
	router.use(function(req, res, next) {
		console.log("Starting up the app.");
		next();	
	});

	var Tags = require("../app/models/tags");
	router.route("/tags")
		.get(function(req, res) {
			Tags.find(function(err, tags) {
				if(err) {
					res.send({message: "Oops something went wrong please refresh and try!"}); 
				}
				res.json(tags);
			});
		});


	app.use("/api", router);
}
