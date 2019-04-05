import {getLogInInfo, signOutUser} from './navBar.js';
/* Class */
class User {
	constructor(image, name, email, password, type, reviews){
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.reviews = [];
    }
}

// global arrays
// const Users = []

/* call functions from navBar.js*/
getLogInInfo();
window.signOutUser = signOutUser;

/* Select all DOM form elements you'll need. */ 
const infoForm = document.querySelector('#infoForm')

/* Event listeners for button submit and button click */
infoForm.addEventListener('click', modifyUserInfo);

/*-----------------------------------------------------------*/
/*** 
Functions can call DOM functions 
***/
function modifyUserInfo(e) {
	e.preventDefault();
	if (e.target.classList.contains('editInfo')) {
		if (e.target.innerText === 'edit') {
			e.target.parentElement.style.position = "static"
			addProfileSelector(e.target.parentElement.parentElement.parentElement)
			addTaskTextBox(e.target.parentElement.firstElementChild)
			addTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling)
			addPassTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling)
			// change the button text to 'save'
			e.target.style.left = "94%";
			e.target.style.top = "100%"
			e.target.innerText = 'save'
		} else {
			e.target.parentElement.style.position = "relative"
			e.target.parentElement.style.top = "10%";
			removeProfileSelector(e.target.parentElement.parentElement.parentElement)
			removeTaskTextBox(e.target.parentElement.firstElementChild)
			removeTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling)
			removePassTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling)
			// change the button text to 'edit'
			e.target.style.top = "75%";
			e.target.style.left = "0%";
			e.target.innerText = 'edit'
		}
	}
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addTaskTextBox(task) {
	const spanElement = task.firstElementChild.nextElementSibling
	const taskText = spanElement.innerText;
	task.removeChild(spanElement)
	const textBox = document.createElement('input')
	textBox.type = 'text'
	textBox.className = "form-control"
	textBox.value = taskText;
	task.appendChild(textBox)
}

function removeTaskTextBox(task) {
	const taskLabel = document.createElement('span')
	taskLabel.className = "info"
	const textBox = task.lastElementChild
	const taskText = document.createTextNode(textBox.value)
	taskLabel.appendChild(taskText)
	textBox.before(taskLabel)
	task.removeChild(textBox)
}

function addProfileSelector(task) {
	const divElement = document.createElement('div')
	divElement.className = "file-loading"
	const labelElement = document.createElement('label')
	labelElement.htmlFor = "avatar"
	labelElement.innerHTML = "<strong>Choose a profile picture:</strong>"
	const inputElement = document.createElement('input')
	inputElement.type = 'text'
	inputElement.id = "avatar"
	inputElement.type = "file"
	inputElement.name = "avatar"
	inputElement.accept ="image/*"
	inputElement.required = ""
	divElement.appendChild(labelElement)
	divElement.appendChild(inputElement)
	task.firstElementChild.firstElementChild.nextElementSibling.appendChild(divElement)
}

function removeProfileSelector(task) {
	const fileLoadingDiv = task.firstElementChild.firstElementChild.nextElementSibling.firstElementChild
	const newProfileImg = document.querySelector('#avatar').files[0];
	const profileImg = task.firstElementChild.firstElementChild.firstElementChild
	if (newProfileImg) {
		profileImg.src = URL.createObjectURL(newProfileImg);
	}
	profileImg.alt = "Profile Picture";
	task.firstElementChild.firstElementChild.nextElementSibling.removeChild(fileLoadingDiv)
}

function addPassTaskTextBox(task) {
	task.firstElementChild.innerText = "Password: "
	const textBox = document.createElement('input')
	textBox.type = 'text'
	textBox.className = "form-control"
	textBox.value = "user";
	task.appendChild(textBox)
}

function removePassTaskTextBox(task) {
	task.firstElementChild.innerText = ""
	const textBox = task.lastElementChild
	task.removeChild(textBox)
}