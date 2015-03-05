var express = require('express');
var async = require('async');

var options = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
   // tmpDir: 'https://s3.amazonaws.com/assignmentlibrary/tmp',
    // AWS url that needs to be changed when we get niloa account
    uploadUrl:  'https://s3.amazonaws.com/niloa-assignment-library/',
    //uploadUrl:  'https://s3.amazonaws.com/assignmentlibrary/',
    storage : {
        type : 'aws',
        aws : {
            accessKeyId :  '',
            secretAccessKey : '',
            bucketName : ''
        }
    },
    copyImgAsThumb : true,
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    }
};
var optionsSubmit = {
    tmpDir:  __dirname + '/../public/uploaded/tmp',
   // tmpDir: 'https://s3.amazonaws.com/assignmentlibrary/tmp',
    // AWS url that needs to be changed when we get niloa account
    uploadUrl:  'https://s3.amazonaws.com/niloa-assignment-library/',
    //uploadUrl:  'https://s3.amazonaws.com/niloa-email-attachments/',
    //uploadUrl:  'niloa-email-attachments.s3-website-us-west-2.amazonaws.com/',
    //uploadUrl:  'https://niloa-email-attachments.s3.amazonaws.com/',
    //uploadUrl:  'https://s3.amazonaws.com/assignmentlibrary/',
    storage : {
        type : 'aws',
        aws : {
            accessKeyId :  '',
            secretAccessKey : '',
            bucketName : ''
           // bucketName : 'niloa-email-attachments'
        }
    },
    copyImgAsThumb : true,
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    }
};

module.exports = function (app, passport) {

    var uploader = require('blueimp-file-upload-expressjs')(options);
    var uploaderSubmit = require('blueimp-file-upload-expressjs')(optionsSubmit);
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
    router.get('/uploadMail', function (req, res) {
        uploaderSubmit.get(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    //router.post('/upload', function (req, res) {
    app.post('/uploadMail', function (req, res) {
        uploaderSubmit.post(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
    });

    // submit assignment for email
    router.get('/submitAssignment', function (req, res) {
        uploaderSubmit.get(req, res, function (obj) {
            console.log("in get submit "+obj);
            res.send(JSON.stringify(obj));
        });
    });

    app.post('/submitAssignmentTemp', function (req, res) {

        uploaderSubmit.post(req, res, function (obj) {

            console.log(obj.files[0].deleteUrl);
            var uploadedPath = obj.files[0].deleteUrl;

            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport();
            transporter.sendMail({
                from: 'suhas@gmail.com',
                to: 'mandahasa2626@gmail.com',
                subject: 'Attachment from Assignment Library 6',
                text: 'Attachment from Assignment Library Node',
                attachments: [
                    {   // file on disk as an attachment
                        //filename: 'Assignment.pdf',
                        //path: __dirname+'/secondAttach.txt' // stream this file
                        //path: 'https://s3.amazonaws.com/niloa-assignment-library/0d0b9cc6-f4a6-40f4-a434-43472ac2224a__rubric%20for%20pathophysiology-hypertension%20-%20bakhtiari.pdf'
                        path: uploadedPath
                        //path: filename
                    }
                ]
            });

            //res.send(JSON.stringify(obj));
        });
        res.json({status: 'success'});
    });
    app.post('/submitAssignment', function (req, res) {

        var filename = req.body.data.filename;
        var assignmentURL = req.body.data.assignmentURL;

        var tags = req.body.data.tagDetails;
        var tagMsg = "";
        for(var jk = 0; jk < tags.length; jk++){
          tagMsg +=  "<li>" + tags[jk] + "</li>";
        }

        var emailMsg = "<p><b>File Name: </b>"+filename+"</p>"+
                        "<p><b> Author: </b>"+(req.body.data.author)+"</p>"+
                        "<p><b> Institution: </b>"+(req.body.data.institution)+"</p>"+
                        "<p><b> Department: </b>"+(req.body.data.department)+"</p>"+
                        "<p><b> Email: </b>"+(req.body.data.emailAdd)+"</p>"+
                        "<p><b> Description: </b></p><p>"+(req.body.data.description)+"</p>"+
                        "<p><b> Tags are</b></p><ul>"+tagMsg+"</ul>"+
                        "<p><b> reflections: </b></p><p>"+(req.body.data.reflections)+"</p>"+
                        "<p><b> background: </b></p><p>"+(req.body.data.background)+"</p>";

        var attachmentsToMail = [];
        attachmentsToMail.push({path: assignmentURL});
        if(req.body.data.rubricAjaxData.length == 0){
            console.log("No Rubrics found");
        }else{
            for(var i = 0; i < req.body.data.rubricAjaxData.length; i++){
                attachmentsToMail.push({path:req.body.data.rubricAjaxData[i].url})
            }
        }

        var today = new Date();
        var timestamp = today.getMonth()+1+"/"+today.getDate()+"/"+today.getFullYear();



            var nodemailer = require('nodemailer');
            var transporter = nodemailer.createTransport();
            transporter.sendMail({
                from: 'niloalearningoutcomes@gmail.com',
                to: 'niloalearningoutcomes@gmail.com',
                subject: 'Assignment Submission from Assignment Library Website, By '+(req.body.data.author)+', On '+timestamp,
                html: emailMsg,
                attachments: attachmentsToMail
            });

        res.json({status: 'success'});
    });

    router.delete('/:name', function (req, res) {
        uploader.delete(req, res, function (obj) {
            res.send(JSON.stringify(obj));
        });
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
			async.parallel([
				function(callback) {
                    Tags.findOne().where('_id').equals(req.params.tagId).exec(callback);
					return;
				}], function(error, tag_match) {
					if (error) {
						res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
					} else {
                        async.parallel([
                            function(callback) {
                                Assignments.find().where('tags').equals(tag_match[0].secondary_tag).exec(callback);
                            }
                        ], function(error, assignments) {
						    res.json(assignments[0]);
                        });
					}
				});
		});


	router.route("/survey")
		.post(function(req, res) {
			var Surveys = require("../app/models/surveys");

			var survey = new Surveys();
			var form = req.body;

			survey.category = form.category;
			survey.email = form.emailAddress;
			survey.institution = form.institution;
			survey.heard_from = form.heardFrom;
			survey.save(function(err) {
            if (err)
                throw err;
            return true;
        	});
        	res.json({status: 'success'});
		});

	router.route("/assignments/name/:name")
		.get(function(req, res) {
			async.parallel([
				function(callback) {
					Assignments.find({name: new RegExp(req.params.name, 'i')}).exec(callback);
					return;
				}], function(error, assignmentDetails) {
					if (error) {
						res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
					} else {
						res.json(assignmentDetails[0]);
					}
				});
		});

	router.route("/assignments/:assignmentId")
		.get(function(req, res) {
			async.parallel([
				function(callback) {
					Assignments.findOne().where('_id').equals(req.params.assignmentId).exec(callback);
					return;
				}], function(error, assignmentDetails) {
					if (error) {
						res.send({"errorMessage" : "Oops something went wrong, please refresh and try again!"});
					} else {
						res.json(assignmentDetails[0]);
					}
				});
		});

    router.route("/assignments/:assignment_id")
        .delete(function(req, res) {
            Assignments.remove({
                _id : req.params.assignment_id
            }, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send("Deletion Successful!");
                }
            });
    });

    app.use("/api", router);

    app.get('/userDetails', function(req,res){
        res.json({userData: req.user});
    });


    app.get('/abc', function(req,res){
        res.json({message: 'test json'});
    });

    //process the post to save assignment details
    app.post('/saveAssignment', function(req,res){
        //console.log("Start uploading");
        //var Assignments = require("/app/models/assignments");
        var Assignments = require("../app/models/assignments");
        var assignDetails = new Assignments();
        assignDetails.name = req.body.data.fileName;
        assignDetails.author = req.body.data.author;
        assignDetails.description = req.body.data.fileDescription;
        assignDetails.file_location = req.body.data.uploadURL;
        assignDetails.created_at = req.body.data.createdAt;
        assignDetails.assignment_type = req.body.data.assignmentType;
        assignDetails.citation = req.body.data.citation;
        assignDetails.tags= req.body.data.primaryTag;
        assignDetails.rubricsData= req.body.data.rubricAjaxData;
        /*assignDetails.tags=  {
            "mapped_id" : req.body.data.secondaryTagId,
            "primary_tag": req.body.data.primaryTag,
            "secondary_tag": req.body.data.secondaryTagValue
        };*/
        assignDetails.save(function(err) {
            if (err)
                throw err;
            return true;
        });
        //console.log(req.body.data.fileName);
        res.json({status: 'success'});
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
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
