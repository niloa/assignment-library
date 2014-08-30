
var express = require('express');
var app = express();
var port = process.env.PORT || 8080; 		// set our port
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

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set views directory for static file serving (CSS and JS) from express
app.use(express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);

// required for passport
app.use(session({ secret: 'learningassesmentorg' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes.js')(app,passport);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
