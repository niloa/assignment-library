
var express = require('express');
var app = express();
var port = process.env.PORT || 9000; 		// set our port
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

Tags.find({}).exec(function(err, collection){
    if(collection.length == 0) {
		var t1 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Arts and humanities"});
		var t2 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "History and social sciences"});
		var t3 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Mathematics and computer science"});
		var t4 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Physical sciences"});
		var t5 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Life sciences"});
		var t6 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Engineering"});
		var t7 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Business"});
		var t8 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Education"});
		var t9 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Health Sciences"});

		var t10 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Introductory course"});
		var t11 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Online course"});
		var t12 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "General education"});
		var t13 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Capstone"});
		var t14 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Community engagement"});
		var t15 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Group project"});
		var t16 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Library assignment"});
		var t17 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Exam"});
		var t18 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Research methods"});
		var t19 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Writing assignment"});
		var t20 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Portfolio"});
		var t21 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Presentation"});
		var t22 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Spreadsheet"});
		var t23 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Reflection"});
		var t24 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Self-assessment"});
		var t25 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "VALUE rubrics"});
		var t26 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Program assessment"});
		var t27 = new Tags({primary_tag: "Academic Disciplines and Assignment Characteristics", secondary_tag: "Sequenced/scaffolded assignments"});

		var t28 = new Tags({primary_tag: "Degree and Course Levels", secondary_tag: "Associate"});
		var t29 = new Tags({primary_tag: "Degree and Course Levels", secondary_tag: "Bachelor’s"});
		var t30 = new Tags({primary_tag: "Degree and Course Levels", secondary_tag: "Master’s"});

		var t31 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Specialized Knowledge"});
		var t32 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Broad and Integrative Knowledge"});
		var t33 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Intellectual Skills"});
		var t34 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Analytic inquiry"});
		var t35 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Use of information resources"});
		var t36 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Engaging diverse perspectives"});
		var t37 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Ethical reasoning"});
		var t38 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Quantitative fluency"});
		var t39 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Communicative fluency"});
		var t40 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Applied and Collaborative Learning"});
		var t41 = new Tags({primary_tag: "DQP Proficiencies", secondary_tag: "Civic and Global Learning"});

        t1.save();
		t2.save();
		t3.save();
		t4.save();
		t5.save();
		t6.save();
		t7.save();
		t8.save();
		t9.save();
		t10.save();
		t11.save();
		t12.save();
		t13.save();
		t14.save();
		t15.save();
		t16.save();
		t17.save();
		t18.save();
		t19.save();
		t20.save();
		t21.save();
		t22.save();
		t23.save();
		t24.save();
		t25.save();
		t26.save();
		t27.save();
		t28.save();
		t29.save();
		t30.save();
		t31.save();
		t32.save();
		t33.save();
		t34.save();
		t35.save();
		t36.save();
		t37.save();
		t38.save();
		t39.save();
		t40.save();
		t41.save();
    }
    else
        console.log("Tags collection has been populated and has "+ collection.length + " entries.");
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
