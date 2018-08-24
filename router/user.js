const express = require('express')
const mongoose = require('mongoose')
var router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/User')
const User = mongoose.model('users')

//  user login route
router.get('/login', (req, res) => {
  res.render('user/login')
})

// User signup route
router.get('/signup', (req, res) => {
  res.render('user/signup')
})

router.post('/signup', (req, res) => {
  let errors = []

  if (req.body.password !== req.body.password2) {
    errors.push({
      text: "password do no match"
    })
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: "Password must be at least 4 charcter"
    })
  }

  if (errors.length > 0) {
    res.render('user/signup', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {

    var newUser = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash

        new User(newUser)
          .save()
          .then(user => {
            req.flash('success_msg', 'You register successfully now you can login')
            res.redirect('/user/login')
          })
          .catch(err => {
            req.flash('error_msg', `Email already exists`)
            res.redirect('/user/signup')
            // console.log(err)
            return
          })
      })
    })

  }
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next)
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', "Thank you, See you again.")
  res.redirect('/user/login')
})

module.exports = router