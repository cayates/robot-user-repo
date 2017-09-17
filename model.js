const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const robotSchema = new mongoose.Schema({
  name: {type: String},
  avatar: {type: String},
  email: {type: String},
  university: {type: String},  
  job: {type: String},
  company: {type: String},
  skills: {type: String},
  phone: {type: Number},
  address: [{
    street_num:{type: String}, 
    street_name: {type: Number}, 
    city: {type: String}, 
    state_or_province:{type: String}
  }],
  username: { type: String, required: true },
  password: { type: String, required: true }
})


robotSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) {
    next()
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash
      user.updated_at = new Date().toISOString()
      next()
      // console.log(password)
      console.log('--------------' + user.password)
    })
  })
})

robotSchema.methods.comparePassword = function (pwd, dbPass, done) {
  // pwd = plain text
  bcrypt.compare(pwd, dbPass, (err, isMatch) => {
    done(err, isMatch)
  })
}

robotSchema.statics.findByName = function (name, cb) {
    return this.find({ name: name })
  }

const Robots = mongoose.model('robots', robotSchema)

module.exports = Robots

// collection: robot
// db: robotdb