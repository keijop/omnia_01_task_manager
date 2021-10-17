const { body } = require('express-validator');

const validateSanitizeReset = [
		body('email')
				.isEmail().withMessage('Must be valid email')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Email is required')
				.trim()
				.escape(),
]

module.exports = validateSanitizeReset