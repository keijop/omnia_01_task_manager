const connection = require('../config/connectDB.js')
const {promisify} = require('util') 

const queryDB = async (stmt, values) => {

	try {
		// make connection.query return promise instead of taking callback as last argument
		const query = promisify(connection.query).bind(connection)
		let results = await query(stmt, values)  
		return results
	} catch(err) {
		return err
	}
} 

module.exports = queryDB