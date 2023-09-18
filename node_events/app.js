const express = require("express")
const app = express()
const db = require('./config/database')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
   
// bring ejs template

app.set('view engine', 'ejs')
// bring body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//bring static

app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use('/uploads', express.static('uploads'));

// session and flash config .
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000 * 15}
}))
app.use(flash())
// bring passport 
app.use(passport.initialize())
app.use(passport.session())
//store user object 
app.get('*',(req,res,next)=>{
    res.locals.user = req.user|| null 
    next()
})

  
  ////////////////////////
//bring events routes
//This line tells your Express app to use the routes you imported for any path that starts with /events.
const events=require('./routes/event_routes')
app.use('/events',events)
//bring user route
const users=require('./routes/user-routes')
app.use('/users', users)

//routing of home page 
const home = require('./routes/home');  // Adjust the path accordingly
app.use('/', home);

app.get('/',(req,res)=>{
    res.redirect('/home')
})


// listen to port 3001
app.listen(3001,()=>{
    console.log('is working on this port ')
})