const sendEmail = require('../utils/sendEmail')
const { validationResult } = require('express-validator')
const queryDB = require('../utils/queryDB')
const crypto = require('crypto')


const resetHandler = async (req, res) => {
	console.log(Date.now())

	try {
		const errors = validationResult(req)

		if(!errors.isEmpty()){
			return res.status(400).json(errors)
		};

		const stmt = 'SELECT * FROM users WHERE email=?'
		values = req.body.email
		const results = await queryDB(stmt, values)

		if (results.length == 1){
			const token = crypto.randomUUID({disableEntropyCache : true});
			const stmt = 'INSERT INTO reset (token, email, timestamp) VALUES (?,?,?)';
			const values = [token, req.body.email, Date.now()]
			const results = await queryDB(stmt, values)

			if (results.affectedRows == 1) {

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
				return res.status(500).json({success : false, msg : 'Something went wrong, try again...', results})
			}

		}else{
			return res.status(404).json({success : false, msg : `Email ${req.body.email} not found`})
		}
		
	} catch(e) {
		console.log(e);
	}

}

module.exports = resetHandler