const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const robotDal = require('./dal')
const robots =[];

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.get('/', function (req, res){
    res.redirect('./robots')
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
    // console.log(chosenRobot);
  })

app.post('/robots', function(req, res){
    res.redirect('./robots')
})

app.get('/login', function(req, res){
    res.render('login')
})

app.set('port', 3000);

app.listen(3000, function(){
    console.log('Express started successfully, bro.');
})