const logOutLink = document.querySelector('.logout')

const logOut = async (event) => {
	event.preventDefault
	// await fetch('/logout', {method : 'DELETE'})
	console.log('logout click')
}

logOutLink.addEventListener('click', logOutLink)