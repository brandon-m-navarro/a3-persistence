require('dotenv').config()
const express        = require('express'),
      app            = express(),
      bcrypt         = require('bcrypt'),
      passport       = require('passport'),
      passportLocal  = require('passport-local'),
      LocalStrategy  = passportLocal.Strategy,
      flash          = require('express-flash'),
      session        = require('express-session'),
      morgan         = require('morgan'),
      helmet         = require('helmet'),
      // bodyparser = require( 'body-parser' ),
      users = [],
      appdata = []

app.use(morgan("common"));

function initialize(passport, getUserByEmail, getUserById) {
  async function authenticateUser(email, password, done) {
    // Get user by email
    const user = getUserByEmail(email)
    if (user == null) {
      // Done(error, user_that_was_found, message)
      return done(null, false, { message: 'No user found with that email' }); 
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Incorrect password'})
      }
    }catch (error) {
      return done(error)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => { return done(null, getUserById(id))})
}

initialize(passport, 
           email => users.find(user => user.email === email),
           id => users.find(user => user.id === id)
          )

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, // don't resave our env variables if nothings changed
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
// get json when appropriate
// app.use( bodyparser.json() )

// 
app.get('/', checkAuth, function(request, response) {
  response.render( __dirname + '/public/views/index.ejs', { name: request.user.name } )
})

// Get routes for views
app.get('/login', checkNotAuth, function(request, response) {
    response.render( __dirname + '/public/views/login.ejs')
})

app.post('/login', checkNotAuth, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuth, function(request, response) {
    response.render( __dirname + '/public/views/register.ejs' )
})

app.post('/register', checkNotAuth, async function(request, response) {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword
    })
    response.redirect('/login')
  } catch (error) {
    response.redirect('/register')
  }
  console.log(users)
})

app.post('/logout', function(request, response, next) {
  request.logout()
  response.redirect('/login')
})

function checkAuth(request, response, next) {
  if (request.isAuthenticated()) {
    return next()
  }
  response.redirect('/login')
}

function checkNotAuth(request, response, next) {
  if (request.isAuthenticated()) {
    return response.redirect('/')
  }
  next()
}

// Add task to appdata
const addTask = function (data) {
  const newTask = data
  appdata.push(newTask)
}

app.post('/add-task', function(request, response, next) {
  console.log(request.body)
  response.send(response)
})

// app.post( '/submit', function( request, response ) {
//   dreams.push( request.body.newdream )
//   response.writeHead( 200, { 'Content-Type': 'application/json'})
//   response.end( JSON.stringify( dreams ) )
// })

app.listen( process.env.PORT )