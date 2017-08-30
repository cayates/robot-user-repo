const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/robotdb'
const Robots = require('./model')
// mongoose.Promise = require('bluebird')
const mongoose = require('mongoose')
let robots = [];

mongoose.connect('mongodb://localhost:27017/robotdb', {
  useMongoClient: true
})


function getAllDocs (err, db) {
  let collection = db.collection('robots')
  let documents = []
  collection.find({}).toArray(function (err, docs) {
    robots = docs
    db.close()
  })
}

function getRobot (robotId) {
    connectMongodb(url, getAllDocs)
    for (let i =0; i < robots.length; i++){
      if (robots[i].id == robotId) {
        return robots[i]
      }
    }
  }

function getAllRobots () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function (err, db) {
      const collection = db.collection('robots')
      collection.find({}).toArray(function (err, docs) {
        // console.log(docs)
        resolve(docs)
        reject(err)
      })
    })
  })
}

// Use connect method to connect to the server

function connectMongodb (url, cb) {
  MongoClient.connect(url, cb)
}

function getRobots () {
  connectMongodb(url, getAllDocs)
  return robots;
}

function addRobot (name, email, university, job, company, skills, phone, avatar, username, password){
  Robots.create({name: name, university: university, job: job, company: company, skills: skills, phone: phone, avatar: avatar, username: username, password: password}, function (err, Robots){
    if (err) return handleError(err)
      console.log(Robots)
    Robots.save()
  })
}

function getRobotByUsername (username){
  return Robots.findOne({username: username})
}

module.exports = { getRobots, getAllRobots, getRobot, addRobot, getRobotByUsername }

