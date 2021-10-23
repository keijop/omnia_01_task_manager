const {CustomAPIError} = require('../errors/custom-error')

const errorHandler = (err, req, res, next) => {
	console.log(err instanceof CustomAPIError)
	console.log(err)
	if(err instanceof CustomAPIError){
		return res.status(err.statusCode).json({success : false, msg : err.message})
	}

	return res.status(500).json({msg : 'Something went wrong, try again later'})
}

module.exports = errorHandler