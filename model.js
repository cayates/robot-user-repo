const mongoose = require('mongoose')

const robotSchema = new mongoose.Schema({
  name: {type: String},
  avatar: {type: String},
  email: {type: String},
  university: {type: String},  
  job: {type: String},
  company: {type: String},
  skills: {type: String},
  phone: {type: Number},
  address: {street_num:{type: String}, street_name: {type: Number}, city: {type: String}, state_or_province:{type: String}},
  username: { type: String, required: true },
  password: { type: String, required: true }
})

robotSchema.statics.findByName = function (name, cb) {
    return this.find({ name: name })
  }
  
const Robots = mongoose.model('robots', robotSchema)

module.exports = Robots

// collection: robot
// db: robotdb