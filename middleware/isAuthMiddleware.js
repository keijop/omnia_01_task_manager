
// VERIFY USER AUTHENTICATED & VERiFY USER NOT AUTHENTICATED MIDDLEWARES

// home route '/' has login form, if logged in, it redirects to '/tasks', no separate login page

const isAuth = (req, res, next) =>{
	if (req.isAuthenticated()) {
		next()
	} else {
		return res.redirect('/login')
	}
}

const isNotAuth = (req, res, next) =>{
	if (!req.isAuthenticated()) {
		next()
	} else {
		return res.redirect('/login')
	}
}

module.exports = {isAuth, isNotAuth}