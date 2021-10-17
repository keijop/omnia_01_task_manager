import { displayValidationErrMsg, 
		removeErrMsg, 
		displayResponseMsg} from './utils.js'

const resetPasswordSubmitBtn = document.querySelector('.reset-submit')

const resetPasswordSubmit = async (event) => {
	
	try {
		event.preventDefault
		removeErrMsg()
		const email = document.querySelector('#email').value
		let response = await fetch("/reset", {
			method: "POST",
			headers: {
	    		'Content-Type': 'application/json;charset=utf-8'
	  			},
			body: JSON.stringify({email : email})
		});

		const responseObject = await response.json();
		console.log(responseObject)
		if(responseObject.errors) {
			displayValidationErrMsg(responseObject);
		}else{
			displayResponseMsg(responseObject, document.querySelector('.reset-form'))
		}
	} catch(e) {
		// statements
		console.log(e);
	}

};

resetPasswordSubmitBtn.addEventListener('click', resetPasswordSubmit)

