const express = require('express')
const router = express.Router()
const passport = require('passport')

const {
	getAllTasks,
	deleteTask,
	updateTask,
	addTask
	} = require('../controllers/tasks')

const registerHandler = require('../controllers/registerHandler')
const feedbackHandler = require('../controllers/feedbackHandler')
const resetHandler = require('../controllers/resetHandler')
const passwordHandler = require('../controllers/passwordHandler')

const validateSanitizeRegistration = require('../middleware/validateSanitizeRegister')
const validateSanitizeAddTask = require('../middleware/validateSanitizeAddTask')
const validateSanitizeFeedback = require('../middleware/validateSanitizeFeedback')
const {validateSanitizeReset, validateSanitizePassword} = require('../middleware/validateSanitizeReset')

const {isAuth, isNotAuth} = require('../middleware/isAuthMiddleware')

router.route('/').get(isAuth, (req, res) => {
				res.set('Cache-control', 'no-cache, max-age=0')
				res.render('tasks', {name : req.user.name})
				})

router.route('/login').get( (req, res) =>{
						res.render('login.ejs', {h1 : 'Login to see task'})
						})
						.post(passport.authenticate('local', 
						{failureRedirect : '/login', 
						successRedirect : '/tasks',
						failureFlash : true}))
						
router.route('/logout').get(isAuth, (req, res) => {
						req.logout()
						res.redirect('/')
						})

router.route('/about').get( (req, res) =>{
						res.render('about.ejs')
						})

router.route('/tasks').get( isAuth, (req, res) =>{
						res.set('Cache-control', 'no-store, max-age=0')
						res.render('tasks.ejs', {name : req.user.name})
						})
						.post(validateSanitizeAddTask, addTask)

router.route('/task-data').get(isAuth, getAllTasks)
router.route('/tasks/:id').delete(isAuth, deleteTask)
router.route('/tasks/:id/:completed').patch(isAuth, updateTask)

router.route('/registration').get( (req, res) =>{
							res.render('registration.ejs')
							})
							.post(validateSanitizeRegistration, registerHandler)

router.route('/feedback').get((req, res) => {
							res.render('feedback.ejs')
							})
							.post(validateSanitizeFeedback, feedbackHandler)

router.route('/reset').get((req, res) =>{
							res.render('reset.ejs')
							})
							.post(validateSanitizeReset, resetHandler)

router.route('/password').get((req, res) =>{
							res.render('password.ejs')
							})
							.patch(validateSanitizePassword, passwordHandler)


module.exports = router
