import {scrollToView, 
		displayTaskValidationErrMsg, 
		removeErrMsg, 
		displayResponseMsg} from './utils.js'

const deleteBtns = document.querySelectorAll('.delete')
const editBtns = document.querySelectorAll('.edit')
const completeBtns = document.querySelectorAll('.complete')
const addTaskBtn = document.querySelector('.task-add-submit')
const taskAddToggleBtn = document.querySelector('.task-add').firstElementChild

const taskAddVisibilityToggler = (event) => {
	event.preventDefault
	const taskAddForm = document.querySelector('.task-add-form')
	taskAddForm.classList.toggle('visible')
	const iconElement = document.querySelector('.task-add-icon')
	iconElement.innerText = iconElement.innerText == 'add_circle_outline' 
													? 'remove_circle_outline'
													: 'add_circle_outline'

													
};

const taskDelete = async (event) => {
	try {
		const id = event.target.parentElement.parentElement.dataset.id
		const resp = await fetch(`/tasks/${id}`, {method : 'delete'})
		const parsedResp = await resp.json()
		console.log(parsedResp)
		window.location.reload(true); 
	} catch(e) {
		console.log(e)
	}
};

const taskComplete = async (event) => {
	try {
		const id = event.target.parentElement.parentElement.dataset.id
		const complete = event.target.parentElement.parentElement.dataset.complete //typeof string
		const completed = Number(complete) ? 0 : 1
		const resp = await fetch(`/tasks/${id}/${completed}`, {method : 'PATCH'}) // PATCH is case sensitive/ 'patch' will throw error
		const parsedResp = await resp.json()
		window.location.reload(true);
	} catch(e) {
		console.log(e);
	}
};

const taskAdd = async () => {
	event.preventDefault();
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
}



[...deleteBtns].forEach( btn => btn.addEventListener('click', taskDelete));
[...completeBtns].forEach( btn => btn.addEventListener('click', taskComplete));
taskAddToggleBtn.addEventListener('click', taskAddVisibilityToggler)
addTaskBtn.addEventListener('click', taskAdd)


