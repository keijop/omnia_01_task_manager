import {scrollToView, 
		displayTaskValidationErrMsg, 
		removeErrMsg, 
		displayResponseMsg} from './utils.js'

// LOAD TASKS
// fetch all tasks, sanitize tasks
// map tasks into new array as html, then join arr to create a single html
// use single html as innerHTML for DOM element
const loadTasksDOM = async () => {
	const taskData = await fetch('/task-data')
	const tasks = await taskData.json()

	// sanitize 
	const tasksCopy = JSON.parse(JSON.stringify(tasks.results)) //deep copy
	const purifiedTasks = tasksCopy.map( taskObj =>{
		 for(let prop in taskObj){
				taskObj[prop] = DOMPurify.sanitize(taskObj[prop]) 
		}
		return taskObj
	})

	
	const tasksDOMinnerHTML = tasks.results.map(task => {

		return `<div class="task-wrapper ${task.completed ? 'completed' : ''} ">
                <div class="task-description"> ${task.description} </div>
                <div class="task-date"> ${new Date(task.deadline).toLocaleDateString() };</div>
                <div class="task-actions" 
                    data-id= ${task.taskid}
                    data-complete= ${task.completed} >
                    <div class="task-update " >
                        <span class="material-icons edit ">edit</span>
                        <span class="tooltipText">Edit</span>
                    </div>
                    <div class="task-update">
                        <span class="material-icons delete">delete_forever</span>
                        <span class="tooltipText">Delete</span>
                    </div>
                    <div class="task-update">
                        <span class="material-icons complete">
                            ${task.completed ? 'check_circle' : 'check'}
                        </span>
                        <span class="tooltipText">
                            ${task.completed ? 'Uncheck' : 'Done'}
                        </span>
                    </div>
                </div>  
            </div>`

	}).join('')

	document.querySelector('.tasksDOM').innerHTML = tasksDOMinnerHTML
}

loadTasksDOM() //loads tasks on page load

// toggles task add container visibility
const taskAddVisibilityToggler = (event) => {
	event.preventDefault
	const taskAddForm = document.querySelector('.task-add-form')
	taskAddForm.classList.toggle('visible')
	const iconElement = document.querySelector('.task-add-icon')
	iconElement.innerText = iconElement.innerText == 'add_circle_outline' 
													? 'remove_circle_outline'
													: 'add_circle_outline'
};

// DELETE
const taskDelete = async (event) => {
	try {
		const id = event.target.parentElement.parentElement.dataset.id
		const resp = await fetch(`/tasks/${id}`, {method : 'delete'})
		const parsedResp = await resp.json()
		console.log(parsedResp)
		loadTasksDOM() 
	} catch(e) {
		console.log(e)
	}
};


// COMPLETE/NOT COMPLETE
const taskComplete = async (event) => {
	try {
		const id = event.target.parentElement.parentElement.dataset.id
		const complete = event.target.parentElement.parentElement.dataset.complete //typeof string
		const completed = Number(complete) ? 0 : 1
		const resp = await fetch(`/tasks/${id}/${completed}`, {method : 'PATCH'}) // PATCH is case sensitive/ 'patch' will throw error
		const parsedResp = await resp.json()
		loadTasksDOM()
	} catch(e) {
		console.log(e);
	}
};


// ADD 
const taskAdd = async () => {
	event.preventDefault();

	try {
		removeErrMsg(); //remove err msg from previous form submit response
		
		const data = {
			description : document.querySelector('#description').value,
			deadline : document.querySelector('#deadline').value
		}

		let response = await fetch("/tasks", {
			method: "POST",
			headers: {
	    		'Content-Type': 'application/json;charset=utf-8'
	  			},
			body: JSON.stringify(data)
		});

		const responseObject = await response.json();

		if(responseObject.errors) {
			displayTaskValidationErrMsg(responseObject);
		}else{
			displayResponseMsg(responseObject, document.querySelector('.task-add-form'))
		}

		loadTasksDOM()
		
	} catch(e) {
		
		console.log(e);
	}

}


// for dynamically rendered content add event listener to parent element
// that was rendered on initial load - event delegation
const tasksDOMContainer = document.querySelector('.tasksDOM')

tasksDOMContainer.addEventListener('click', (event) =>{
	
	if(event.target.classList.contains('delete')){
		taskDelete(event)
	}else if (event.target.classList.contains('complete')) {
		taskComplete(event)
	}
})



const addTaskBtn = document.querySelector('.task-add-submit')
const taskAddToggleBtn = document.querySelector('.task-add').firstElementChild

taskAddToggleBtn.addEventListener('click', taskAddVisibilityToggler)
addTaskBtn.addEventListener('click', taskAdd)


