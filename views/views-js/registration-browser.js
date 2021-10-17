import {
	removeErrMsg, 
	displayValidationErrMsg,
	displayResponseMsg } from './utils.js'

// post form data and handle response
const postForm = async (event) => {
	event.preventDefault();
	removeErrMsg(); //remove err msg from previous form submit response

	let formData = new FormData(document.querySelector("#form-register"));

	let response = await fetch("/registration", {
		method: "POST",
		body: formData,
	});

	let responseObject = await response.json();

	if(responseObject.errors) {
		displayValidationErrMsg(responseObject);
	}else{
		displayResponseMsg(responseObject, document.querySelector('.form'))
	}
};

const submitBtn = document.querySelector(".submit-register");

submitBtn.addEventListener("click", postForm);
