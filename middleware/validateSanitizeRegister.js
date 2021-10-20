const { body } = require('express-validator');
const queryDB = require('../utils/queryDB')

const validateSanitizeRegistration = [

	body('name')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Name is required')
				.trim()
				.escape(),

	body('email')
				.isEmail().withMessage('Must be valid email')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Email is required')
				.trim()
				.escape(),
				//custom validation -> query db to check email is not in use
				// .custom( (value, {req}) => {
				// 	const stmt = 'SELECT * FROM users WHERE email=?'
				// 	const values = req.body.email
				// 	return queryDB(stmt, values).then(users =>{
				// 		if(users.length){
				// 			return Promise.reject('E-mail already in use');
				// 		}
				// 	}) 
				// }),

	body('password')
				.not().isEmpty({ ignore_whitespace:true }).withMessage('Password is required')
				.isLength({ min : 8 }).withMessage('Minimum 8 characters')
				.trim()
				.escape(),

	body('password1')
			.not().isEmpty({ ignore_whitespace:true }).withMessage('Password is required')
			.isLength({ min : 8 }).withMessage('Minimum 8 characters ')
			.trim()
			.escape()
			// custom check if passwords match
			.custom( (value, { req }) =>{
				if (value !== req.body.password) {
					throw('Password must match')
				}

				return true
			})
];

module.exports = validateSanitizeRegistration
