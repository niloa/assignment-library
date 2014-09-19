
var express = require('express');
var app = express();
var port = process.env.PORT || 8000; 		// set our port
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);
require('./config/passport')(passport); // pass passport for configuration

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error...'));
db.once('open',function callback(){
    console.log('libAuth db opened-value is '+configDB.url);
});


var Tags = require("./app/models/tags");
var Assignments = require("./app/models/assignments");
/*=======
//create default tags if tag list is empty
var Tags = require("./app/models/tags");
>>>>>>> Upload-Assignment*/
Tags.find({}).exec(function(err, collection){
    if(collection.length == 0) {
        console.log("zero");
        var t1 = new Tags({primary_tag: "NILOA", secondary_tag: "Sociology"});
        var t2 = new Tags({primary_tag: "NILOA", secondary_tag: "Philosophy"});
        var t3 = new Tags({primary_tag: "DQP", secondary_tag: "Mathematics"});
        t1.save();
        t2.save();
        t3.save();
    }
    else
        console.log("non zero "+collection.length);
});

/*Assignments.find({}).exec(function(err, collection){
    if(collection.length == 0) {
		var a1 = new Assignments({
			name : "Assignment1",
            author: "Author1",
			description: "Welcome to NILOA", 
			file_location: "https://dl.dropboxusercontent.com/u/44789714/How%20to%20use%20the%20Public%20folder.txt",
			created_at: new Date().getSeconds(),
			tags: [ {
				"mapped_id" : "5417149a7e2e1c3b3c000002",
				"primary_tag": "NILOA",
				"secondary_tag": "Philosophy"
			},
			{
				"mapped_id" : "5417149a7e2e1c3b3c000001",
				"primary_tag" : "NILOA",
				"secondary_tag" : "Sociology"
			}]
		});
		var a2 = new Assignments({
			name : "Assignment2",
            author: "Author2",
			description: "Welcome to NILOA", 
			file_location: "https://dl.dropboxusercontent.com/u/44789714/How%20to%20use%20the%20Public%20folder.txt",
			created_at: new Date().getSeconds(),
			tags: [{
				"mapped_id": "5417149a7e2e1c3b3c000003",
				"primary_tag": "DQP",
				"secondary_tag": "Mathematics"

			}]
		});
		a1.save();
		a2.save();
    }
    else
        console.log("non zero "+collection.length);
});*/

//create default tags if tag list is empty


// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set views directory for static file serving (CSS and JS) from express
app.use(express.static(__dirname + "/public"));
// setting directory for partials, so in order to link a partial use partials/dqp.html
app.set('views', __dirname+'/public');
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'learningassesmentorg' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// writing user details to console, undefined otherwise
/*app.use(function(req,res, next){
    console.log(req.user);
    next();
});*/

require('./app/routes.js')(app,passport);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
