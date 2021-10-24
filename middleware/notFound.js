const notFound = (req, res) => {
	res.status(404).render('notFound.ejs')
}

module.exports = notFound