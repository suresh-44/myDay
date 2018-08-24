const express = require('express')
const hbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const path = require('path')

var app = express()

// load router
const ideas = require('./router/ideas')
const user = require('./router/user')

// Passport config
require('./config/passport')(passport)

// map to global promise
mongoose.Promise = global.Promise

// load db
const db = require('./config/db')

// connect to mongodb
mongoose.connect(db.mongodbURI, {
    useNewUrlParser: true,
  }).then(() => console.log('connected to databse.....'))
  .catch(err => console.log(err))


const port = process.env.PORT || 3000 // setting hbs
app.engine('handlebars', hbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// bodyParser middelware
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// override with POST having ?_method=DELETE {{method override middleware}}
app.use(methodOverride('_method'))

// public static page
app.use(express.static(path.join(__dirname, 'public')))

// Express session middelware
app.use(session({
  secret: "mySCrerte",
  resave: true,
  saveUninitialized: true
}))

// Passport middelware
app.use(passport.initialize())
app.use(passport.session())

// Connect-flash middelware
app.use(flash())

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

// routes
app.get('/', (req, res) => {
  res.render('home', {
    title: "Welcome"
  })
})

app.get('/about', (req, res) => {
  res.render('about')
})

// use routes
app.use('/ideas', ideas)
app.use('/user', user)


app.listen(port, () => {
  console.log(`server up at ${app.get('port')}`)
})

// JetyoxBitpyctA7