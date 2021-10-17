const { body } = require('express-validator');

const validateSanitizeFeedback = [

	body('feedback')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Feedback is required')
				.trim()
				.escape(),

	body('email')
				.isEmail().withMessage('Must be valid email')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Email is required')
				.trim()
				.escape(),

	body('name')
			.not().isEmpty({ ignore_whitespace:true }).withMessage('Name is required')
			.trim()
			.escape(),

]

module.exports = validateSanitizeFeedback