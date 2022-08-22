const express = require('express') // Using express to help build out API
const app = express()
const mongoose = require('mongoose') // Using mongoose to help me with my models and talking to my DB
const passport = require('passport') // Using passport to talk with Microsoft's identity platform
const session = require('express-session') // To stay logged in
const MongoStore = require('connect-mongo') // Passing session to db
const connectDB = require('./config/database') // db file inside of config folder which enables connection to mongo DB
const authRoutes = require('./routes/auth') // look at requests and determine which controller to use
const homeRoutes = require('./routes/home') // look at requests and determine which controller to use
const todoRoutes = require('./routes/todos') // look at requests and determine which controller to use

require('dotenv').config({path: './config/.env'}) // get env file enabling us to use env file in application
// Passport config which includes a function
require('./config/passport')(passport)
// call to connect to the db
connectDB()

app.set('view engine', 'ejs') // pass data into to spit out HTML (embedded js template)
app.use(express.static('public')) // enables static files to serve on express behalf
app.use(express.urlencoded({ extended: true })) // look at data coming along with each of our requests
app.use(express.json()) // look at data coming along with each of our requests

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
// Sessions, keeping users logged in
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: oneDay },
        store: MongoStore.create(
            { 
                mongoUrl: process.env.DB_STRING  //(URI FROM.env file)
            }
        ), // keep track of sessions in db
    })
)

// Passport middleware, so users can stay logged in
app.use(passport.initialize())
app.use(passport.session())

app.use('/', homeRoutes) // beginning of the router, req on main route when the home page loads
app.use('/auth', authRoutes) // using auth to log in or log out
app.use('/todos', todoRoutes) // anything with todos

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})