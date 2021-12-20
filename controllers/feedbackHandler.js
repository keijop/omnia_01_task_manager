const sendEmail = require('../utils/sendEmail')
const { validationResult } = require('express-validator')

const feedbackHandler = (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  //business logic, do something with the feedback
  // -------------
  const data = {
    from: ' "Task manager Admin" <pruntk@gmail.com>',
    to: 'pruntk@gmail.com',
    subject: 'Feedback',
    html: `<div><b>name:</b> ${req.body.name}<br>
			<b>email:</b> ${req.body.email}<br>
			<b>text:</b> ${req.body.feedback}</div>`,
  }

  sendEmail(data)
  // --------------

  const emailData = {
    from: ' "Task manager" <webTesting@mail.com>',
    to: req.body.email,
    subject: 'Feedback received',
    html: `<h2>We appreciate your feedback</h2><br>
			<p>Dear ${req.body.name}</p><br>
			<p>Thank you for your feedback.<br>
			We will get back to you asap!<br>
			<div>
				<a href="https://omnia-task-manager.herokuapp.com" target="_blank">Task Manager</a>
				</p>
			</div>`,
  }

  sendEmail(emailData)
  res.status(200).json({ success: true, msg: 'Feedback received' })
}

module.exports = feedbackHandler
