const LocalStartegy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = mongoose.model('users')

module.exports = (passport) => {
  passport.use(new LocalStartegy({
    usernameField: 'email'
  }, (email, password, done) => {
    User.findOne({
      email
    }).then(user => {
      if (!user) {
        return done(null, false, {
          message: "User Not Found"
        })
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          return done(null, user)
        } else {
          return done(null, false, {
            message: "Password donot match"
          })
        }
      })
    })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user)
    })
  })
}