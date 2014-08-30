
module.exports = function (app, passport) {

//var router = express.Router();  				// get an instance of the express Router

// Default document when server is loaded
    app.get('/', function (req, res) {
        res.render('index.html');
    });
}