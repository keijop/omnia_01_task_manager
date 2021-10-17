const con = require('../db/connectDB.js')
const {promisify} = require('util') 

const queryDB = async (stmt, values) => {

	try {
		// make con.query return promise instead of taking callback as last argument
		const query = promisify(con.query).bind(con)
		let results = await query(stmt, values)  
		return results
	} catch(e) {
		return e
	}
} 

module.exports = queryDB