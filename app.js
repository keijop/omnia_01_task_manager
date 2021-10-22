const express = require('express')
const app = express()
require('dotenv').config()
const multer = require('multer')
const upload = multer()
const session = require('express-session')
const passport = require('passport')
const connection = require('./config/connectDB')
const queryDB = require('./utils/queryDB')
const router = require('./routes/router')
const notFound = require('./middleware/notFound')

const setLocals = require('./middleware/setLocals')
const sessionOptions = require('./config/session')

app.set('view engine', 'ejs')

// --- Middleware ---

// for parsing application/json
app.use(express.json())

// for parsing application/x-www-form-urlencoded -- HTML form submit
app.use(express.urlencoded({extended : false}))

// for parsing multipart/form-data -- FormData with ajax
app.use(upload.array())

app.use(express.static('views'))

// ---------- SESSION SETUP ------------

app.use(session(sessionOptions))

// ---------- PASSPORT SETUP ------------

require('./config/passport') // entire passport config module 

app.use(passport.initialize())
app.use(passport.session())

app.use(setLocals)

//routes
app.use('/', router)

// not-found
app.use(notFound)

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App is listening on port ${port}...`))











