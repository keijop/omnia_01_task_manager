// ---------- SESSION SETUP ------------
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session);
const connection = require('./connectDB')

const sessionStorage = new MySQLStore({}, connection)

const sessionOptions = {
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : true,
	store : sessionStorage,
	cookie : {
		maxAge : 1000 * 60 * 60 *24 // 24hours  
	}
}

module.exports = sessionOptions

