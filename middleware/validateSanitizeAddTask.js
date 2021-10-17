const { body } = require('express-validator');

const maxDate = new Date(9999, 12, 31).toString()			

const validateSanitizeAddTask = [

	body('description')
			.not().isEmpty({ ignore_whitespace:true }).withMessage('Description is required')
			.trim()
			.escape(),

	body('deadline')
			.isISO8601({strict : true}).withMessage('Invalid date')
			.isBefore(maxDate).withMessage('Maximum deadline is 31/12/999')
			.trim()
			.escape()
];

module.exports = validateSanitizeAddTask