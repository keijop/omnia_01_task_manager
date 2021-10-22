
// VERIFY USER AUTHENTICATED & VERIFY USER NOT AUTHENTICATED MIDDLEWARES

// if req is authenticated, ie user is logged pass control to next middleware
// if not logged in redirect to login

const isAuth = (req, res, next) =>{
	if (req.isAuthenticated()) {
		next()
	} else {
		return res.redirect('/login')
	}
}

// does the opposite, passes control to next middleware if user is NOT logged in

const isNotAuth = (req, res, next) =>{
	if (!req.isAuthenticated()) {
		next()
	} else {
		return res.redirect('/login')
	}
}

module.exports = {isAuth, isNotAuth}