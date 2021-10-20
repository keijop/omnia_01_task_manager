const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const queryDB = require('../utils/queryDB')

// custom option when login form input names are not what passport expects('username' and 'password')
const customFields = {
		usernameField : 'email'
}

// callback for passport to use internally
// checks if username exists in db
// if existst, compares hashed passwords
// passes verification result to passport done function 
const verifyCallback = async (username, password, done) => {

	try {
		const stmt = 'SELECT * FROM users WHERE email=?'
		const values = username
		const results = await queryDB(stmt, values)
		const user = results[0]

		if(!user){
			return done(null, false)
		}

		//hashes user input pw and compares it to hashed user.password from DB, returs true/false
		const match = await bcrypt.compare(password, user.password)

		if(match){
			return done(null, user)	// user authenticated
		}else{
			return done(null, false)
		}
		
	} catch(err) {
		done(err)
	}


}

// construct new LocalStregy with customFields object and verifyCallback
const strategy = new LocalStrategy(customFields, verifyCallback)

// initialize passport with newly created strategy variable
passport.use(strategy)

// after authentication, a session will be established with a cookie set
// this cookie stores serialized user - it will store just the user.userid
passport.serializeUser( (user, done) => {
	done(null, user.userid)
})

// with request, the cookie comes along to server and server needs to desrialize 
// the serialized user, so it will query database to get the user by id
passport.deserializeUser( async (userid, done) => {
	try {
	const results = await queryDB('SELECT * FROM users WHERE userid=?', userid)
	done(null, results[0])
	} catch(err) {
		done(err)
	}
})






