// requiring all of our npm installs to be used in our app

const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const app = express();
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const robotDal = require('./dal')
const robots =[];
const { Strategy: LocalStrategy } = require('passport-local')

// const bcrypt = require('bcryptjs');

// to call authentication later on in my post to log in page

// app.use(function(req, res, next){
//     if(req.session.usr) {
//       req.isAuthenticated = true;
//     } else {
//       req.isAuthenticated = false;
//     }
//     console.log(req.isAuthenticated, 'session');
//     next();
//   })

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username, password: password }, function (err, user) {
        done(err, user);
        });
    }
));

// initializing passport and using passport with our session

app.use(passport.initialize())
app.use(passport.session())

// mustache basics, using body parser and making our css sheet accessible

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// all of my routes

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/', function (req, res){ // redirects you instantly to the robots page
    res.redirect('./robots')
})

app.get('/robots', function(req, res) { // bringing in the get robot function
    const robots = robotDal.getRobots(req.params.id)    
    res.render('robots', { robots })
})
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/robotDetail', function (req, res){ // populating the robotDetail page
    res.render('robotDetail')
})

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/_robot/:id', function (req, res) { // brings in specific robot and renders their specific page
    const chosenRobot = robotDal.getRobot(req.params.id)
    if (chosenRobot) {
      res.render('robotDetail', chosenRobot)
    } else {
      res.send('Please refresh the page to get your robot, bro.')
    }
  })

app.post('/_robot/:id', function (req, res){
    res.redirect('./_robot/{{id}}')
})

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.post('/robots', function(req, res){ // post of the form submission throws you back to main robots page
    robotDal.addRobot(req.body.name, req.body.email, req.body.university, req.body.job, req.body.company, req.body.skills, req.body.phone, req.body.avatar, req.body.username, req.body.password);
    console.log(req.body.password)
    res.redirect('./robots')
})

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/addrobot', function(req, res){ // takes you to the login page 
    res.render('addrobot')
})

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/login', function (req, res){
    res.render('login')
})

app.post('/login', function (req, res, next){
    res.redirect('./login/{{id}}')
})

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

app.get('/editrobot', function (req, res){
    res.render('editrobot')
})

app.post('/editrobot', function (req, res){
    res.redirect('./editrobot')
})

app.set('port', 3000); // setting up my port

app.listen(3000, function(){ // console logging to make sure we are running on that port
    console.log('Express started successfully on 3000, bro.');
})

