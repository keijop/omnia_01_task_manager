const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const queryDB = require('../utils/queryDB')
const sendEmail = require('../utils/sendEmail')
const asyncWrapper = require('../middleware/asyncWrapper')
const crypto = require('crypto')

const registerHandler = asyncWrapper(  async (req, res, next) =>{
	
	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json(errors)
	};

	const hashedPassword = await bcrypt.hash(req.body.password, 10)
	const token = crypto.randomUUID({disableEntropyCache : true});

	const stmt = 'INSERT INTO users (name, email, password, token) VALUES (?,?,?,?)';
	const values =[req.body.name, req.body.email, hashedPassword, token]
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
							msg : 'Success, we will email you a verification link!',
							name : req.body.name,
							response : results
							})

		const emailData = {
			from :' "Task manager" <webTesting@mail.com>',
			to : req.body.email,
			subject : 'Welcome to Task Manager',
			html : `<h1>Hi ${req.body.name}</h1><br>
					<p>Press
					<a href="https://omnia-task-manager.herokuapp.com/verify/${token}" target="_blank">here</a>
					to verify your email and start using the application</p>`
		}

		sendEmail(emailData)
	}


})

module.exports = registerHandler

