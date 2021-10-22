const { body } = require('express-validator');

const validateSanitizeReset = [
		body('email')
				.isEmail().withMessage('Must be valid email')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Email is required')
				.trim()
				.escape(),
]

const validateSanitizePassword = [
	body('password')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Password is required')
				.isLength({ min : 8 }).withMessage('Minimum 8 characters')
				.trim()
				.escape(),

		body('password1')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Password is required')
				.isLength({ min : 8 }).withMessage('Minimum 8 characters')
				.trim()
				.escape()
				.custom( (value, { req }) =>{
				if (value !== req.body.password) {
					throw('Password must match')
				}

				return true
			})

]

module.exports = {validateSanitizeReset, validateSanitizePassword}

