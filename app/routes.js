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
	var Assignments = require("../app/models/assignments");

	router.route("/tags")
		.get(function(req, res) {
			var allTags = [];
			async.parallel([
				function(callback) {
					Tags.find().distinct('primary_tag', callback);
					return;
				}],
				function(error, primaryTags) {
					if (error) {
						res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
					};
					
					async.forEach(primaryTags[0], 
						function(primaryTag, callback) {
							var map = {};
							async.parallel([
								function(callback) {
									map["primary_tag"] = primaryTag;
									Tags.find({'primary_tag': primaryTag}, 'secondary_tag', callback);
									return;		
								}], 
								function(error, secondaryTags) {
									if (error) {
										res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
									};
									map["secondary_tags"] = secondaryTags[0];
									allTags.push(map);
									callback();
								}
							);
						}, function(error) {
							if (error) {
								res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
							} else {
								res.json(allTags);
							}
						}
					);	
				}
			);
		});

	router.route("/tags/:tagId")
		.get(function(req, res) {
			async.parallel([ function(callback) {
				Assignments.find(callback);
				return;
			}], function(error, assignments) {
				if (error) {
					res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
				} else {
					res.json(assignments[0]);
				}
			});
		});

	app.use("/api", router);
}
