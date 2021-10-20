const queryDB = require('../utils/queryDB')
const { validationResult } = require('express-validator');


const getAllTasks = async (req, res) => {
	try {
		const stmt = 'SELECT * FROM tasks WHERE userid=? ORDER BY deadline'
		const values = req.user.userid
		const results = await queryDB(stmt, values)
		res.status(200).json({results})
	} catch(e) {
		res.send('Something went worng here, try again ...')
	}
}

const deleteTask = async (req, res) => {
	try {
		const stmt = 'DELETE FROM tasks WHERE taskid=?'
		const values = req.params.id
		const results = await queryDB(stmt, values)
		res.status(200).json({success:true, results})
	} catch(e) {
		res.json({e})
	}
}

const updateTask = async (req, res) => {
	try {
		console.log(req.params)
		const stmt = 'UPDATE tasks SET completed=? WHERE taskid=?'
		const values = [req.params.completed, req.params.id]
		const results = await queryDB(stmt, values)
		if(results.affectedRows == 1){
			res.status(200).json({success:true, results})
		}else{
			res.status(500).json({success : false, msg : 'Something went wrong, try again...'})
		}
	} catch(e) {
		console.log(e)
		res.json({e})
	}
}

const addTask = async (req, res) => {
	console.log(req.body)
	try {
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			console.log(errors)
		return res.status(400).json(errors)
		};

		const userid = req.user.userid
		const stmt = 'INSERT INTO tasks (description, deadline, userid) VALUES (?, ?, ?)'
		const values = [req.body.description, req.body.deadline, userid]
		console.log(values)
		const results = await queryDB(stmt, values)
		if (results.affectedRows == 1) {
			res.status(201).json({success : true, results, msg : 'Success, task added'})
		} else {
			res.status(500).json({success : false, msg : 'Something went wrong, try again...', results})
		}
	
	} catch(e) {
		res.status(500).json({success : false, msg : 'Something went wrong, try again...', e})
	}
}



module.exports = {	
				getAllTasks,
				deleteTask,
				updateTask,
				addTask
				};

