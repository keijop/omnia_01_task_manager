import {scrollToView, 
		removeErrMsg, 
		displayValidationErrMsg,
		displayTaskValidationErrMsg, 
		displayResponseMsg} from './utils.js'

const feedBackSubmitBtn = document.querySelector('.feedback-submit')

const submitFeedback = async (event) => {
	
	event.preventDefault
	removeErrMsg()

	const data = {
		feedback : document.querySelector('#feedback').value,
		name : document.querySelector('#name').value,
		email : document.querySelector('#email').value
	}

	const response = await fetch("/feedback", {
		method : 'POST',
		headers : {
			'Content-Type': 'application/json;charset=utf-8'
		},
		body : JSON.stringify(data)
	})


	const responseObject = await response.json()
	if(responseObject.errors) {
		displayValidationErrMsg(responseObject);
	}else{
		displayResponseMsg(responseObject, document.querySelector('.feedback-form'))
	}

	document.querySelector('#feedback').value = ''
	document.querySelector('#name').value = ''
	document.querySelector('#email').value = ''

}

feedBackSubmitBtn.addEventListener('click', submitFeedback)