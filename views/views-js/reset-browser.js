import { displayValidationErrMsg, 
		removeErrMsg, 
		displayResponseMsg} from './utils.js'

// POST EMAIL 

const getLinkSubmitBtn = document.querySelector('.email-submit')

const getLinkSubmit = async (event) => {
	
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
		
		console.log(e);
	}

};


	getLinkSubmitBtn.addEventListener('click', getLinkSubmit)	


