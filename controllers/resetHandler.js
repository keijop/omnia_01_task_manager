const sendEmail = require('../utils/sendEmail')
const { validationResult } = require('express-validator')
const queryDB = require('../utils/queryDB')
const crypto = require('crypto')
const asyncWrapper = require('../middleware/asyncWrapper')
const {createCustomError} = require('../errors/custom-error')



const resetHandler = asyncWrapper( async (req, res, next) => {

	const errors = validationResult(req)
	if(!errors.isEmpty()){
		return res.status(400).json(errors)
	};

	//check user exist in DB
	const stmt = 'SELECT * FROM users WHERE email=?'
	values = req.body.email
	const results = await queryDB(stmt, values)
	if(!results.length == 1){
		next(createCustomError(`Email ${req.body.email} not found`, 404))
	}

	//create token and insert userObject into reset DB
	const token = crypto.randomUUID({disableEntropyCache : true});
	const stmt2 = 'INSERT INTO reset (token, email, timestamp) VALUES (?,?,?)';
	const values2 = [token, req.body.email, Date.now()]
	const results2 = await queryDB(stmt2, values2)

	if (results2.affectedRows == 1) {


		//send reset link with the unique token in the url param
		const emailData = {
			from :' "Task manager" <webTesting@mail.com>',
			to : req.body.email,
			subject : 'Password reset',
			html : `<h1>Password reset</h1>
					<a href="http://localhost:3000/password?token=${token}" target="_blank">
					<b>This is your password reset link</b></a>
					`
		}

		sendEmail(emailData)

		return res.status(200).json({success : true, msg : 'Your link has been sent'})
	} else {
		next(createCustomError('Something went wrong, try again...', 500))
	}
	
})

module.exports = resetHandler
