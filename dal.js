const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/robotdb'
let robots = [];

function getAllDocs (err, db) {
  let collection = db.collection('robots')
  let documents = []
  collection.find({}).toArray(function (err, docs) {
    robots = docs
    // console.log(robots)
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

module.exports = { getRobots, getAllRobots, getRobot }

