const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const queryDB = require('../utils/queryDB')
const sendEmail = require('../utils/sendEmail')
const asyncWrapper = require('../middleware/asyncWrapper')

const registerHandler = asyncWrapper(  async (req, res, next) =>{
	
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json(errors)
	};

	const hashedPassword = await bcrypt.hash(req.body.password, 10)
	const stmt = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
	const values =[req.body.name, req.body.email, hashedPassword]
	const results = await queryDB(stmt, values)

	if(results.affectedRows !== 1){
		res.status(500).json({
							success : false, 
							msg : 'Something went wrong, try again later...',
							response : results
							})
	}else{
		res.status(201).json({	
							success : true,
							msg : 'Great success, we will send you a confirmation email shortly!',
							name : req.body.name,
							response : results
							})

		const emailData = {
			from :' "Task manager" <webTesting@mail.com>',
			to : req.body.email,
			subject : 'Welcome to Task Manager',
			html : `<h1>Welcome ${req.body.name}</h1><br>
					<p>You have now successfully registered.<br>
					<a href="http://localhost:3000/" target="_blank">Sign in</a>
					and start using the application</p>`
		}

		sendEmail(emailData)
	}


})

module.exports = registerHandler

