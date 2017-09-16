const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const app = express();
const session = require('express-session')
const robotDal = require('./dal')
const robots =[];
const { Strategy: LocalStrategy } = require('passport-local')
const { isAuthenticated } = require('./passport.js')
const Robots = require('./model')
const { createToken, ensureAuthentication } = require('./helpers.js')
const jwt = require('jsonwebtoken')
require('dotenv').config()

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res){ 
    res.redirect('./login')
})

app.get('/robots', function(req, res) { 
    const robots = robotDal.getRobots(req.params.id)    
    res.render('robots', { robots })
})

app.get('/robotDetail', function (req, res){ 
    res.render('robotDetail')
})

app.get('/_robot/:id', function (req, res) { 
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

app.post('/robots', function(req, res){ 
    robotDal.addRobot(req.body.name, req.body.email, req.body.university, req.body.job, req.body.company, req.body.skills, req.body.phone, req.body.avatar, req.body.username, req.body.password);
    console.log(req.body.password)
    res.redirect('./robots')
})

app.get('/addrobot', function(req, res){
    res.render('addrobot')
})

app.get('/login', function(req, res){
    res.render('login')
  })

app.post('/login', (req, res) => {
    Robots.findOne({ username: req.body.username }, 'username password', function (err, user, next) {
      if (err) return next(err)
      if (!user) {
        return res.status(401).send({ message: 'Wrong info, try again bro.' })
      }
      user.comparePassword(req.body.password, user.password, function ( err, isMatch ) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong info, try again bro.' })
        }
        let token = { token: createToken(user)};
        res.redirect('/robots');
      })
    })
  })

app.get('/editrobot/:id', function (req, res){
    const editedRobot = robotDal.getRobot(req.params.id)
    res.render('editrobot', {editedRobot})
})

// updated and testing

// app.post('/editrobot/:id', (req, res) => {
//     const id = req.params.id;
//     const newRobot = req.body;
//     robotDal.editRobot(id, newRobot).then(function(robot){
//     res.redirect('/robots')        
//     })
// })

// end updated and testing

// original

app.post('/editrobot/:id', (req, res) => {
    const id = req.params.id
    const newRobot = (req.body)
    robotDal.editRobot(id, newRobot)
    res.redirect('/robots')
})

app.listen(3000, function(){
    console.log('Express started successfully on Andre 3000.');
})

