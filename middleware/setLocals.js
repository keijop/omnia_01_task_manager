// --------- SET LOCALS VAR MIDDLEWARE ---------

// setLocals sets isLoggedIn variable, it is used in dynamic view rendering, ejs

const setLocals = (req,res, next) =>{
	if(req.isAuthenticated()){
		res.locals.isLoggedIn = true;
	}else{
		res.locals.isLoggedIn = false
	} 
	next()
	
}

module.exports = setLocals