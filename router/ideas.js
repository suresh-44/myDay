const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {
  ensureAuthenticated
} = require('../helpers/auth')

// loading idea model
require('../models/Idea')
var Idea = mongoose.model('idea')


router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({
      user: req.user.id
    })
    .sort({
      date: 'desc'
    })
    .then(ideas => {
      res.render('ideas/index', {
        ideas
      })
      // console.log(ideas)
    })
})

//edit ideas
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findById(req.params.id)
    .then(idea => {
      if (idea.user !== req.user.id) {
        req.flash('error_msg', "Not Authorized")
        res.redirect('/ideas')
        return
      }
      res.render('ideas/edit', {
        idea
      })
    })
})

router.post('/', ensureAuthenticated, (req, res) => {
  var errors = []

  if (!req.body.title) {
    errors.push({
      title: 'please add a title'
    })
  }
  if (!req.body.details) {
    errors.push({
      title: 'Please fill the details'
    })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'New video idea is added')
        res.redirect('/ideas')
      })
  }
})

// update Idea
router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndUpdate(req.params.id, {
    $set: {
      title: req.body.title,
      details: req.body.details
    }
  }, {
    new: true
  }).then(idea => {
    req.flash('success_msg', 'Video idea updated')
    res.redirect('/ideas')
  })
})

// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndRemove(req.params.id).then(() => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})


module.exports = router