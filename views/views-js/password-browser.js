import { displayValidationErrMsg, 
		removeErrMsg, 
		displayResponseMsg} from './utils.js'


//  POST NEW PASSWORD

const newPasswordSubmitBtn = document.querySelector('.password-submit')

const newPassword = async (event) => {
	
	try {
		event.preventDefault
		removeErrMsg()

		const password = document.querySelector('#password').value
		const password1 = document.querySelector('#password1').value
		document.querySelector('#password').value = ''
		document.querySelector('#password1').value = ''

		const url = new URL(window.location) 
		const token = url.searchParams.get('token')
		

		let response = await fetch("/password", {
			method: "PATCH",
			headers: {
	    		'Content-Type': 'application/json;charset=utf-8'
	  			},
			body: JSON.stringify({ password, password1, token})
		});

		const responseObject = await response.json();
		console.log(responseObject)
		if(responseObject.errors) {
			displayValidationErrMsg(responseObject);
		}else{
			displayResponseMsg(responseObject, document.querySelector('.reset-password-form'))
		}
	} catch(e) {
		console.log(e);
	}

};

newPasswordSubmitBtn.addEventListener('click', newPassword)

