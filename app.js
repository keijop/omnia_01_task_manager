const express = require('express')
const app = express()
require('dotenv').config()
const multer = require('multer')
const upload = multer()
const session = require('express-session')
const passport = require('passport')
const connection = require('./config/connectDB')
const queryDB = require('./utils/queryDB')

const registerHandler = require('./controllers/registerHandler')
const feedbackHandler = require('./controllers/feedbackHandler')
const resetHandler = require('./controllers/resetHandler')
const validateSanitizeRegistration = require('./middleware/validateSanitizeRegister')
const validateSanitizeAddTask = require('./middleware/validateSanitizeAddTask')
const validateSanitizeFeedback = require('./middleware/validateSanitizeFeedback')
const validateSanitizeReset = require('./middleware/validateSanitizeReset')
const {getAllTasks, deleteTask, updateTask, addTask} = require('./controllers/tasks')
const {isAuth, isNotAuth} = require('./middleware/isAuthMiddleware')

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

const MySQLStore = require('express-mysql-session')(session);

const sessionStorage = new MySQLStore({}, connection)

app.use(session({
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : true,
	store : sessionStorage,
	cookie : {
		maxAge : 1000 * 60 * 60 *24 // 24hours  
	}
}))

// ---------- PASSPORT SETUP ------------

require('./config/passport') // entire passport config module 

app.use(passport.initialize())
app.use(passport.session())

// --------- SET LOCALS VAR MIDDLEWARE ---------

app.use((req,res, next) =>{
	if(req.isAuthenticated()){
		res.locals.isLoggedIn = true;
	}else{
		res.locals.isLoggedIn = false
	} 
	next()
	
})

// --------- TEST MIDDLEWARE -----------
// app.use( (req, res, next) =>{
// 	console.log(req.session)
// 	console.log(req.user)
// 	console.log(req.isAuthenticated())
// 	console.log(res.locals)
// 	next()
// })


// ------------ ROUTES ------------

app.get('/', isAuth, (req, res) => {
	res.set('Cache-control', 'no-cache, max-age=0')
	res.render('tasks', {name : req.user.name})
})

app.get('/login', (req, res) =>{
	res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', 
	{failureRedirect : '/login', 
	successRedirect : '/tasks'}))

app.get('/logout', isAuth, (req, res) => {
	req.logout()
	res.redirect('/')
})

// about routes
app.get('/about', (req, res) => {
	res.render('about.ejs')
})

// tasks routes
app.get('/tasks', isAuth, (req, res) =>{
	res.set('Cache-control', 'no-store, max-age=0')
	res.render('tasks.ejs', {name : req.user.name})
})

app.get('/task-data', isAuth, getAllTasks) 

app.delete('/tasks/:id', isAuth, deleteTask)

app.patch('/tasks/:id/:completed', isAuth, updateTask)

app.post('/tasks', validateSanitizeAddTask, addTask)


// registration routes
app.get('/registration', (req, res) =>{
	res.render('registration.ejs')
})

app.post('/registration', validateSanitizeRegistration, registerHandler)

// feedback route
app.get('/feedback', (req, res) => {
	res.render('feedback.ejs')
})

app.post('/feedback', validateSanitizeFeedback, feedbackHandler)

// reset routes
app.get('/reset', (req, res) =>{
	res.render('reset.ejs')
})

app.post('/reset', validateSanitizeReset, resetHandler)



const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App is listening on port ${port}...`))











