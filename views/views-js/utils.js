// HELPER FUNCTIONS

const scrollToView = (elem) => {
	let elemY = elem.getBoundingClientRect().y;
	let elemHeight = elem.getBoundingClientRect().height;
	window.scrollTo(0, elemY + elemHeight);
};

const removeErrMsg = () => {
	const previousErrMsgArray = [...document.querySelectorAll(".error")];
	previousErrMsgArray.forEach((node) => node.remove());
};

// loop through validation errors received from server
// for each error -> sanitize error msg, create element with sanitized innerHTML,
// append to DOM, style with classes
const displayValidationErrMsg = (responseObject) => {
	responseObject.errors.forEach((error) => {
		const errorInputElementLabel = [...document.querySelectorAll("label")].find(
			(element) => {
				return element.getAttribute("for") == error.param;
			}
		);

		errorInputElementLabel.focus();
		const cleanHTML = DOMPurify.sanitize(error.msg);
		const errorDisplayElement = document.createElement("SPAN");
		errorDisplayElement.classList.add("error");
		errorDisplayElement.innerHTML = cleanHTML;
		errorInputElementLabel.appendChild(errorDisplayElement);
	});
};

// create element with sanitized innerHTML,
// append to DOM, style with classes
const displayTaskValidationErrMsg = (responseObject) => {
	const form = document.querySelector('.task-add-form')
	const errorDisplayElement = document.createElement('DIV')
	errorDisplayElement.classList.add('task-wrapper', 'error')
	const cleanHTML = DOMPurify.sanitize(responseObject.errors[0].msg)
	errorDisplayElement.innerHTML = cleanHTML
	form.append(errorDisplayElement)

};

// create DOM element, sanitize response msg, add msg to the created element,
// append created element to form, scroll element to view, fade element out and remove from DOM
const displayResponseMsg = (responseObject, form) => {
	const responseMsgElement = document.createElement("P");
	const cleanHTML = DOMPurify.sanitize(responseObject.msg);
	responseMsgElement.innerHTML = cleanHTML;
	responseMsgElement.classList.add("message");
	form.appendChild(responseMsgElement);
	scrollToView(responseMsgElement);
	setTimeout(() => responseMsgElement.classList.add("fade-away"), 5000);
	setTimeout(() => responseMsgElement.remove(), 7000);
};

export {scrollToView, 
		removeErrMsg, 
		displayValidationErrMsg,
		displayTaskValidationErrMsg, 
		displayResponseMsg}

