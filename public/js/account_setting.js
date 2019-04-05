import {getLogInInfo, signOutUser} from './navBar.js';
/* Class */
let userInfo = {} 

// global arrays
// const Users = []

/* call functions from navBar.js*/
window.signOutUser = signOutUser;

/* Select all DOM form elements you'll need. */ 
const infoForm = document.querySelector('#infoForm')
const imgDiv = document.querySelector('#imgDiv')
/* Event listeners for button submit and button click */
infoForm.addEventListener('click', modifyUserInfo);

getUserInfo();
/*-----------------------------------------------------------*/
/*** 
Functions can call DOM functions 
***/
function modifyUserInfo(e) {
	e.preventDefault();
	if (e.target.classList.contains('editInfo')) {
		//Server part TODO: update the user info in the server
		if (e.target.innerText === 'edit') {
			e.target.parentElement.style.position = "static"
			addProfileSelector(e.target.parentElement.parentElement.parentElement)
			addTaskTextBox(e.target.parentElement.firstElementChild, 'nameInput')
			addTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling, 'emailInput')
			addPassTaskTextBox(e.target.parentElement.firstElementChild.nextElementSibling.nextElementSibling, 'passwordInput')
			// change the button text to 'save'
			e.target.style.left = "94%";
			e.target.style.top = "100%"
			e.target.innerText = 'save'
			const imgView = document.querySelector('#fileUpload');
			const imgInput = document.querySelector('#avatar');
			imgInput.onchange = function(){
			if(this.files && this.files[0]){
				imgView.src = URL.createObjectURL(this.files[0]);
				}
			};
		} else if (e.target.innerText === 'save'){
			const form = new FormData();
			form.append('userImg', document.querySelector('#avatar').files[0]);
			form.append('name', document.querySelector('#nameInput').value);
			form.append('email', document.querySelector('#emailInput').value);
			form.append('password', document.querySelector('#passwordInput').value);
			const url = '/editUserInfo'
			$.ajax({
				url: url,
				method: 'patch',
				processData: false,
				contentType: false,
				mimeType: "multipart/form-data",
				data: form
			}).done((res) =>{
				console.log('edit user info');
				const navImg = document.querySelector('#portraitContainer');
				navImg.innerText = "";
				getUserInfo();
			}).fail((error) =>{
				if(error.status === 400){
					alert(error.responseText);
				}
				else{
					alert('fail to change user info');
				}
				console.log(error);
			})
		}
	}
}

/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/
function addTaskTextBox(task, id) {
	const spanElement = task.firstElementChild.nextElementSibling
	const taskText = spanElement.innerText;
	task.removeChild(spanElement)
	const textBox = document.createElement('input')
	textBox.type = 'text'
	textBox.className = "form-control"
	textBox.id = id;
	textBox.value = taskText;
	task.appendChild(textBox)
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


function addPassTaskTextBox(task, id) {
	task.firstElementChild.innerText = "Password: "
	const textBox = document.createElement('input')
	textBox.type = 'password'
	textBox.className = "form-control"
	textBox.id = id;
	task.appendChild(textBox)
}

function addUserInfoToDom(){
	infoForm.innerText = "";
	imgDiv.innerText = "";
	// name div
	const nameDiv = document.createElement('div');
	nameDiv.className = 'form-group';
	const nameLabel = document.createElement('label');
	nameLabel.setAttribute('for', 'InputName') ;
	nameLabel.appendChild(document.createTextNode('User name: '));
	const nameSpan = document.createElement('span');
	nameSpan.className = 'info';
	nameSpan.appendChild(document.createTextNode(userInfo.name));
	nameDiv.appendChild(nameLabel);
	nameDiv.appendChild(nameSpan);
	//email div
	const emailDiv = document.createElement('div');
	emailDiv.className = 'form-group';
	const emailLabel = document.createElement('label');
	emailLabel.setAttribute('for', 'InputEmail');
	emailLabel.appendChild(document.createTextNode('Email address: '));
	const emailSpan = document.createElement('span');
	emailSpan.className = 'info';
	emailSpan.appendChild(document.createTextNode(userInfo.email));
	emailDiv.appendChild(emailLabel);
	emailDiv.appendChild(emailSpan);
	//password div
	const passDiv = document.createElement('div');
	passDiv.className = 'form-group';
	const passLabel = document.createElement('label');
	passLabel.setAttribute('for', 'InputPassword') ;
	passDiv.appendChild(passLabel);
	//button
	const button = document.createElement('button');
	button.className = 'editInfo btn btn-primary';
	button.innerText = 'edit';
	//user image view
	const imgViewDiv = document.createElement('div');
	imgViewDiv.className = 'portraitSetting';
	const img = document.createElement('img');
	if(userInfo.profileImg === ""){
		img.src = 'https://finanzmesse.ch/userdata/uploads/referenten/avatar.jpg';
	}
	else{
		img.src = '/readImg/' + userInfo.profileImg;
	}
	img.id = "fileUpload" ;
	img.className = "portraitIcon rounded img-thumbnail rounded-circle";
	img.setAttribute('alt', "avatar Picture");
	imgViewDiv.appendChild(img);
	//user image input
	const imgInputDiv = document.createElement('div');
	imgInputDiv.className = 'kv-avatar'
	//append to dom
	imgDiv.appendChild(imgViewDiv);
	imgDiv.appendChild(imgInputDiv);
	infoForm.appendChild(nameDiv);
	infoForm.appendChild(emailDiv);
	infoForm.appendChild(passDiv);
	infoForm.appendChild(button);
}

function getUserInfo(){
	const url = '/getLogInInfo';
	$.ajax({
		url: url,
		method: 'get'
	}).done((res) =>{
		userInfo = res;
		getLogInInfo();
		addUserInfoToDom();
	}).fail((error) =>{
		alert('cannot get user info');
		console.log(error);
	})
}