var express = require('express');
var async = require('async');

var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
    uploadDir: __dirname + '/../public/uploaded/files',
    uploadUrl:  '/uploaded/files/',
    storage : {
        type : 'local'
    }
};

module.exports = function (app, passport) {

    var uploader = require('blueimp-file-upload-expressjs')(options);
	// get an instance of the express Router
	var router = express.Router();

    router.get('/upload', function (req, res) {
        uploader.get(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    //router.post('/upload', function (req, res) {
    app.post('/upload', function (req, res) {
        uploader.post(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    router.delete('/uploaded/files/:name', function (req, res) {
        uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

	router.use(function(req, res, next) {
		console.log("Starting up the app.");
		next();	
	});

	var Tags = require("../app/models/tags");
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

	router.route("tags/:tagId")
		.get(function(req, res) {
			console.log(req.params.tagId);
		});

	app.use("/api", router);

    app.get('/userDetails', function(req,res){
        res.json({userData: req.user});
    });


    app.get('/abc', function(req,res){
        res.json({message: 'test json'});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dqp', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', function(req, res, next){
        var auth = passport.authenticate('local-login', function(err, user){
            if(err) {return next(err);}
            if(!user) {res.send({success: false})}
            req.logIn(user, function(err){
                if(err) {return next(err);}
                res.send({success: true, user: user});
            })
        });
        auth(req, res, next);
    });

    app.post('/logout', function(req, res){
        req.logout();
        res.end();
    });

    // Default document when server is loaded
    app.get('*', function (req, res) {
        res.render('index.html');
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("get called");
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}