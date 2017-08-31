const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const Robots = require('./model')

passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  
passport.deserializeUser((id, done) => {
    Robots.getRobotByUsername(username, (err, user) => {
        done(err, user)
    })
})

passport.use(new LocalStrategy((username, password, done) => {
    Robots.findOne({ username: username.toLowerCase() }, '+password', (
      err,
      user
    ) => {
      if (err) {
          console.log(username)
        return done(err)
      }
      if (!user) {
        return done(null, false, { msg: `Username ${username} not found.` })
      }
      user.comparePassword(password, user.password, (err, isMatch) => {
        if (err) {
          return done(err)
        }
        if (isMatch) {
          return done(null, user)
        }
        return done(null, false, { msg: 'Invalid email or password.' })
      })
    })
  }))