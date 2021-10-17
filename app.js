const express = require('express')
const app = express()
require('dotenv').config()
const multer = require('multer')
const upload = multer()
const registerHandler = require('./controllers/registerHandler')
const feedbackHandler = require('./controllers/feedbackHandler')
const resetHandler = require('./controllers/resetHandler')
const validateSanitizeRegistration = require('./middleware/validateSanitizeRegister')
const validateSanitizeAddTask = require('./middleware/validateSanitizeAddTask')
const validateSanitizeFeedback = require('./middleware/validateSanitizeFeedback')
const validateSanitizeReset = require('./middleware/validateSanitizeReset')
const {getAllTasks, deleteTask, updateTask, addTask} = require('./controllers/tasks')

app.set('view engine', 'ejs')

// --- Middleware ---

// for parsing application/json
app.use(express.json())

// for parsing application/x-www-form-urlencoded -- HTML form submit
app.use(express.urlencoded())

// for parsing multipart/form-data -- FormData with ajax
app.use(upload.array())

app.use(express.static('views'))

const user = {name : 'Külli'}

// Routes

app.get('/', (req, res) => {
	res.render('index.ejs')
})

app.get('/feedback', (req, res) => {
	res.render('feedback.ejs')
})

app.get('/about', (req, res) => {
	res.render('about.ejs')
})

// tasks routes
app.get('/tasks', getAllTasks)

app.delete('/tasks/:id', deleteTask)

app.patch('/tasks/:id/:completed', updateTask)

app.post('/tasks', validateSanitizeAddTask, addTask)


// registration routes
app.get('/registration', (req, res) =>{
	res.render('registration.ejs', user)
})

app.post('/registration', validateSanitizeRegistration, registerHandler)

// feedback route
app.post('/feedback', validateSanitizeFeedback, feedbackHandler)

// reset route
app.get('/reset', (req, res) =>{
	res.render('reset.ejs')
})

app.post('/reset', validateSanitizeReset, resetHandler)



const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App is listening on port ${port}...`))











