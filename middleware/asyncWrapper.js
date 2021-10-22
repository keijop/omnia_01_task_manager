// Middleware that takes a function as an argument.
// Returns async function that wraps argument/callback function in try catch block.
// Eliminates redundant try catch code in controllers.
// From Coding Addict youtube channel

const asyncWrapper = (fn) => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next)
		} catch(error) {
			next(error)
		}
	}
}

module.exports = asyncWrapper