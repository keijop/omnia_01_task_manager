const notFound = (req, res) => {
	res.status(404).send('<div class="container"><h1>Route not found</h1><h2><a href="login">Back to home page</a></h2></div>')
}

module.exports = notFound