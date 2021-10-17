const sendEmail = require('../utils/sendEmail')
const { validationResult } = require('express-validator');

const feedbackHandler = (req, res) => {

	const errors = validationResult(req)

	if(!errors.isEmpty()){
		return res.status(400).json(errors)
	}

	//business logic, do something with the feedback ()

	const emailData = {
	from :' "Task manager" <webTesting@mail.com>',
	to : req.body.email,
	subject : 'Feedback received',
	html : `<h2>We appreciate your feedback</h2><br>
			<p>Dear ${req.body.name}</p><br>
			<p>Thank you for your feedback.<br>
			We will get back to you asap!<br>
			<div>
				<a href="http://localhost:3000/" target="_blank">Task Manager</a>
				</p>
			</div>`
	}

	sendEmail(emailData)
	res.status(200).json({success : true, msg : 'Feedback received'})
};

module.exports = feedbackHandler