const queryDB = require('../utils/queryDB')
const asyncWrapper = require('../middleware/asyncWrapper')
const {createCustomError} = require('../errors/custom-error')



const emailVerifyHandler = asyncWrapper ( async (req, res, next) =>{

	

	const stmt = 'SELECT * FROM users WHERE token=?'
	const values = req.params.token
	console.log(values)
	const results = await queryDB(stmt, values) 

	

	if (!results.length == 1) {
		return res.redirect('/notFound')
	}

	

	const stmt2 = 'INSERT INTO users (isverified) VALUES (1) WHERE token=?'
	const values2 = req.params.token
	const results2 = await queryDB(stmt, values)

	return res.redirect('/login')

})

module.exports = emailVerifyHandler

