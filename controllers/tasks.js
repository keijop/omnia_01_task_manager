const queryDB = require('../utils/queryDB')
const { validationResult } = require('express-validator')
const asyncWrapper = require('../middleware/asyncWrapper')
const {createCustomError} = require('../errors/custom-error')


const getAllTasks = asyncWrapper( async (req, res, next) => {

	const stmt = 'SELECT * FROM tasks WHERE userid=? ORDER BY deadline'
	const values = req.user.userid
	const results = await queryDB(stmt, values)
	if(results instanceof Error){
		return next(createCustomError('Something went wrong', 500))
	}
	res.status(200).json({results})
})

const deleteTask = asyncWrapper ( async (req, res, next) => {

	const stmt = 'DELETE FROM tasks WHERE taskid=?'
	const values = req.params.id
	const results = await queryDB(stmt, values)
	if(results instanceof Error){
		return next(createCustomError('Something went wrong', 500))
	}
	res.status(200).json({success:true, results})

})

const updateTask = asyncWrapper( async (req, res, next) => {
	
	const stmt = 'UPDATE tasks SET completed=? WHERE taskid=?'
	const values = [req.params.completed, req.params.id]
	const results = await queryDB(stmt, values)
	if(!results.affectedRows == 1){
		return next(createCustomError('Something went wrong', 500))
	}else{
		res.status(200).json({success:true, results})
	}
		
})

const addTask = asyncWrapper( async (req, res, next) => {
	
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			console.log(errors)
		return res.status(400).json(errors)
		};

		const userid = req.user.userid
		const stmt = 'INSERT INTO tasks (description, deadline, userid) VALUES (?, ?, ?)'
		const values = [req.body.description, req.body.deadline, userid]
		const results = await queryDB(stmt, values)
		if (!results.affectedRows == 1) {
			return next(createCustomError('Something went wrong', 500))
		}
			res.status(201).json({success : true, results, msg : 'Success, task added'})
})



module.exports = {	
				getAllTasks,
				deleteTask,
				updateTask,
				addTask
				};

