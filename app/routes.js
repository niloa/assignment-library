
module.exports = function (app, passport) {

//var router = express.Router();  				// get an instance of the express Router

    app.get('/userDetails', function(req,res){
        res.json({userData: req.user});
    });

/*// Default document when server is loaded
    app.get('*', function (req, res) {
        res.render('index.html');
    });*/

    //profile page once authenticated
    /*app.get('/dqp', isLoggedIn, function(req, res) {

        res.render('partials/dqp.html', {
            user : req.user // get the user out of session and pass to template
        });
    });*/

  /*  app.get('/uploadFiles', isLoggedIn, function(req, res, next) {
        console.log("get called");
       // res.render('partials/uploadFiles.html');
   //     next();
        //res.json({message: 'upload'});
    });*/

    // =====================================
    // LOGOUT ==============================
    // =====================================
   /* app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });*/

    app.get('/abc', function(req,res){
        res.json({message: 'test json'});
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dqp', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


    // process the login form
    /*app.post('/login', passport.authenticate('local-login', {

        successRedirect : '/dqp', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));*/

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