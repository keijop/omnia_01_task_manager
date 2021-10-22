const queryDB = require('../utils/queryDB')
const { validationResult } = require('express-validator')
const asyncWrapper = require('../middleware/asyncWrapper')



const getAllTasks = asyncWrapper( async (req, res) => {

	const stmt = 'SELECT * FROM tasks WHERE userid=? ORDER BY deadline'
	const values = req.user.userid
	const results = await queryDB(stmt, values)
	res.status(200).json({results})
})

const deleteTask = asyncWrapper ( async (req, res) => {

	const stmt = 'DELETE FROM tasks WHERE taskid=?'
	const values = req.params.id
	const results = await queryDB(stmt, values)
	res.status(200).json({success:true, results})

})

const updateTask = asyncWrapper( async (req, res) => {
	
	const stmt = 'UPDATE tasks SET completed=? WHERE taskid=?'
	const values = [req.params.completed, req.params.id]
	const results = await queryDB(stmt, values)
	if(results.affectedRows == 1){
		res.status(200).json({success:true, results})
	}else{
		res.status(500).json({success : false, msg : 'Something went wrong, try again...'})
	}
		
})

const addTask = asyncWrapper( async (req, res) => {
	
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			console.log(errors)
		return res.status(400).json(errors)
		};

		const userid = req.user.userid
		const stmt = 'INSERT INTO tasks (description, deadline, userid) VALUES (?, ?, ?)'
		const values = [req.body.description, req.body.deadline, userid]
		const results = await queryDB(stmt, values)
		if (results.affectedRows == 1) {
			res.status(201).json({success : true, results, msg : 'Success, task added'})
		}
})



module.exports = {	
				getAllTasks,
				deleteTask,
				updateTask,
				addTask
				};

