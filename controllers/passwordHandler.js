const { validationResult } = require('express-validator');
const queryDB = require('../utils/queryDB')
const bcrypt = require('bcrypt')
const asyncWrapper = require('../middleware/asyncWrapper')
const {createCustomError} = require('../errors/custom-error')


const passwordHandler = asyncWrapper(  async (req, res, next) => {

		const errors = validationResult(req)
		if(!errors.isEmpty()){
			return res.status(400).json(errors)
		};

		// token exists in DB ?
		const stmt = 'SELECT * FROM reset WHERE token=?'
		const values = req.body.token
		const results = await queryDB(stmt, values)
		const userObject = results[0]

		if (!results.length) {
			return next(createCustomError('Reset link is invalid', 401))
		console.log('Reset link is invalid')
		}

		// reset link is not expired ? (valid 30 min)
		// 30min = 1800000ms
		if(userObject.timestamp + 1800000 < Date.now() ){
			console.log('Reset link is exp')
			next(createCustomError('Reset link is expired', 401))
		}
		//valid token and not expired reset request => set new password
		const stmt2 = 'UPDATE users SET password=? WHERE email=?'
		const newHashedPassword = await bcrypt.hash(req.body.password, 10)
		const values2 = [newHashedPassword, userObject.email]
		const results2  = await queryDB(stmt2, values2)
		if(!results2.affectedRows){
			console.log('Reset')
			next(createCustomError('Something went wrong, try again...', 500))

		//if set password was success delete reset userObject from DB (token can be used only once)
		}else{
						console.log('Reset  success')

			const stmt3 = 'DELETE FROM reset WHERE token=?'
			const values3 = req.body.token
			await queryDB(stmt3, values3)
			return res.status(201).json({success:true, msg : 'Password has been reset'})
		}

})

module.exports = passwordHandler
