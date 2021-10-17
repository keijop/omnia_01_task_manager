const sendEmail = require('../utils/sendEmail')
const { validationResult } = require('express-validator')
const queryDB = require('../utils/queryDB')


const resetHandler = async (req, res) => {

	try {
		const errors = validationResult(req)

		if(!errors.isEmpty()){
			return res.status(400).json(errors)
		};

		const stmt = 'SELECT * FROM users WHERE email=?'
		values = req.body.email

		const results = await queryDB(stmt, values)
		
		if(results.length == 1){
			return res.status(200).json({success : true, msg : 'Reset link emailed'})
		}else{
			return res.status(200).json({success : false, msg : `Email ${req.body.email} not registered`})
		}
		
	} catch(e) {
		console.log(e);
	}

}

module.exports = resetHandler