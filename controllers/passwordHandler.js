const queryDB = require('../utils/queryDB')
const bcrypt = require('bcrypt')

const passwordHandler = async (req, res) => {

	try {
		const stmt = 'SELECT * FROM reset WHERE token=?'
		const values = req.body.token
		const results = await queryDB(stmt, values)
		const userObject = results[0]
		

		if (!results.length) {
			return res.status(401).json({success:false, msg : 'Reset link is invalid'})
		}

		if(userObject.timestamp + 1800000 < Date.now() ){
			return res.status(401).json({success:false, msg : 'Reset link is expired'})
		}

		const stmt2 = 'UPDATE users SET password=? WHERE email=?'
		const newHashedPassword = await bcrypt.hash(req.body.password, 10)
		const values2 = [newHashedPassword, userObject.email]
		const results2  = await queryDB(stmt2, values2)

		if(results2.affectedRows){
			const stmt3 = 'DELETE FROM reset WHERE token=?'
			const values3 = req.body.token
			await queryDB(stmt3, values3)
			return res.status(201).json({success:true, msg : 'Password has been reset'})
		}else{
			return res.status(400).json({success:false, msg : 'Something went wrong, try again...'})
		}
		
	} catch(e) {
		console.log(e);
	}

}

module.exports = passwordHandler