class User {
	constructor(image, name, email, password, type){
        this.image = image;
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
        this.res = [];
    }
}

class Restaurant{
    constructor(image, name, phone, address, rate, price){
        this.image = image;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.rate = rate;
        this.price = price;
    }
}

let maxReviews = 3;
let currentPage = 1;
let editing = false;
const storeImg1 = "https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg"
const store1 = new Restaurant(storeImg1, "McDonald's", "1234567890", "552 Yonge St, Toronto", 3, 1)

// These examples are just for test purpose (sort)
const storeImg3 = "res.jpg"
const storeImg4 = "res.jpg"
const storeImg5 = "res.jpg"
const store3 = new Restaurant(storeImg3, "ATest1", "1234567890", "1 (name) St, City1", 5, 3)
const store4 = new Restaurant(storeImg4, "BTest2", "0987654321", "2 (name) St, City2", 1, 3)
const store5 = new Restaurant(storeImg5, "CTest3", "1234567890", "3 (name) St, City3", 2, 1)

const userImg = document.createElement('img');
userImg.src = "avatar.jpg";
userImg.alt = "avatar Picture";
const user = new User(userImg, "user2", "user2@mail.com", "user2", "i");
user.res.push(store1)
// These examples are just for test purpose (sort)
user.res.push(store3)
user.res.push(store4)
user.res.push(store5)

const dropDown = document.querySelector('#dropDown')
const contentBody = document.querySelector('#mainBody');
const pager = document.querySelector('#pager')


dropDown.addEventListener('click', changeMain);
pager.addEventListener('click', changePage);
contentBody.addEventListener('click', editRes);

showPage(currentPage);

function changeMain(e){
    e.preventDefault();
    if(e.target.innerText === 'add new'){
        editing = true;
        e.target.parentElement.parentElement.parentElement.style.position = 'static';
        contentBody.innerText = "";
        addNewResBox();
        const newResForm = document.querySelector('#newResForm');
        newResForm.addEventListener('submit', addNewRes);
        newResForm.addEventListener('reset', backToLst);
        const imgInput = document.querySelector('#newRestaurantImg');
        const imgView = document.querySelector('#newPreview');
        imgInput.onchange = function(){
            if(this.files && this.files[0]){
                imgView.src = URL.createObjectURL(this.files[0]);
            }
        };
        dropDown.style.visibility = 'hidden';
        pager.style.visibility = 'hidden';
    }
    else if(e.target.classList.contains('dropdown-name')){
        contentBody.innerText = ""
        sortByName(user)
		showPage(currentPage)
    }
}

function changePage(e) {
	e.preventDefault();
	if (e.target.classList.contains('previous')) {
		if (currentPage > 1) {
			currentPage = currentPage - 1
			showPage(currentPage)
		}

	} else if (e.target.classList.contains('next')) {
		if ((currentPage * 3) < user.res.length) {
			currentPage = currentPage + 1
		}
		showPage(currentPage)		
	}
}

function sortByName(user) {
	user.res.sort(function(a, b){
    if(a.name < b.name) { return -1; }
    if(a.name > b.name) { return 1; }
    return 0;
	})
}

function editRes(e){

    if(e.target.classList.contains('btn') && !(editing)){
        let index = null;
        const address = e.target.parentElement.firstElementChild.childNodes[1].lastElementChild.lastElementChild.innerText;
        for(let i = 0; i < user.res.length; i++){
            if(user.res[i].address === address){
                index = i;
                break;
            }
        }
        if(e.target.innerText === 'Edit'){ 
            editing = true;
            contentBody.innerText = "";
            addNewResBox();
            const newResForm = document.querySelector('#newResForm');
            newResForm.addEventListener('submit', addEditRes(index));
            newResForm.addEventListener('reset', backToLst);
        }
    }
}





function addNewResBox(){
    const newBoxDiv = document.createElement('div');
    newBoxDiv.id = 'newResBox';
    const newCloDiv = document.createElement('div');
    newCloDiv.className = "col-md-8";
    const newForm = document.createElement('form');
    newForm.id = 'newResForm';

    const newH2 = document.createElement('h2');
    newH2.appendChild(document.createTextNode('Add a new restaurant'));

    const imgDiv = document.createElement('div');
    imgDiv.className = "form-group";
    const imgLabel = document.createElement('label');
    imgLabel.for = "newRestaurantImg";
    imgLabel.appendChild(document.createTextNode('Restaurant Image:'));
    const imgInput =  document.createElement('input');
    imgInput.id = 'newRestaurantImg';
    imgInput.name = 'newStoreImg';
    imgInput.type = 'file';
    imgInput.accept = 'image/*';
    imgInput.required = "";
    imgDiv.appendChild(imgLabel);
    imgDiv.appendChild(imgInput);

    const newImgDiv = document.createElement('div');
    newImgDiv.className = 'storeImgContainer';
    const newImg = document.createElement('img');
    newImg.id = 'newPreview';
    newImg.src = "#";
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);

    const newNameDiv = createInputForm('newRestaurantName', 'Restaurant name:', "Restaurant name");
    const newPhoneDiv = createInputForm('newRestaurantPhone', 'Telephone:', 'Restaurant phone number');
    const newAddrDiv = createInputForm('newRestaurantAddr', 'Restaurant address:', 'Restaurant address');

    const newBtnDiv = document.createElement('div');
    newBtnDiv.className = 'form-group';
    const newBtnInput = document.createElement('input');
    newBtnInput.id = 'newResBtn';
    newBtnInput.type = 'submit';
    newBtnInput.value = 'Save';
    newBtnInput.className = 'btn float-right btn-primary'
    newBtnDiv.appendChild(newBtnInput);

    const newBtnDiv2 = document.createElement('div');
    newBtnDiv2.className = 'form-group';
    const newBtnInput2 = document.createElement('input');
    newBtnInput2.id = 'newResCancel';
    newBtnInput2.type = 'reset';
    newBtnInput2.value = 'Cancel';
    newBtnInput2.className = 'btn float-right btn-secondary'
    newBtnDiv2.appendChild(newBtnInput2);

    newForm.appendChild(newH2);
    newForm.appendChild(imgDiv);
    newForm.appendChild(newImgDiv);
    newForm.appendChild(newNameDiv);
    newForm.appendChild(newPhoneDiv);
    newForm.appendChild(newAddrDiv);
    newForm.appendChild(newBtnDiv);
    newForm.appendChild(newBtnDiv2);
    newCloDiv.appendChild(newForm);
    newBoxDiv.appendChild(newCloDiv);

    contentBody.appendChild(newBoxDiv);
}

function createInputForm(id, labelText, holderText){
    const newDiv = document.createElement('div');
    newDiv.className = 'form-group';
    const newLabel = document.createElement('label');
    newLabel.for = id;
    newLabel.appendChild(document.createTextNode(labelText));
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'form-control';
    newInput.id = id;
    newInput.placeholder = holderText;

    newDiv.appendChild(newLabel);
    newDiv.appendChild(newInput);
    return newDiv;
}

function addNewRes(e){
    e.preventDefault();
    const newRes = buildNewRes(0, 0);
    user.res.unshift(newRes);
    dropDown.style.visibility = 'visible';
    pager.style.visibility = 'visible';
    editing = false;
    showPage(currentPage);
}

function backToLst(e){
    e.preventDefault();
    dropDown.style.visibility = 'visible';
    pager.style.visibility = 'visible';
    editing = false;
    showPage(currentPage);
}

function addEditRes(index){
    return function(e){
        e.preventDefault();
        const editRes = buildNewRes(user.res[index].rate, user.res[index].price);
        user.res[index] = editRes;
        dropDown.style.visibility = 'visible';
        pager.style.visibility = 'visible';
        editing = false;
        showPage(currentPage);
    }
}

function buildNewRes(rate, price){
    const files = document.querySelector('#newRestaurantImg').files[0];
    const newResImg = URL.createObjectURL(files);
    const newResName = document.querySelector('#newRestaurantName').value;
    const newResPhone = document.querySelector('#newRestaurantPhone').value;
    const newResAddr = document.querySelector('#newRestaurantAddr').value;

    const newRes = new Restaurant(newResImg, newResName, newResPhone, newResAddr, rate, price);
    return newRes;
}

function showPage(currentPage) {
	let restPage = user.res.length - currentPage * 3
	if (restPage >= 0) {
		contentBody.innerText = ""
		for (let i = 0; i < maxReviews; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addNewResToDom(user.res[j])
		}
	} else {
		restPage = maxReviews+restPage
		contentBody.innerText = ""
		for (let i = 0; i < restPage; i++) {
			let j = ((currentPage-1)*3) + i
			// console.log(j)
			addNewResToDom(user.res[j])
		}
    }
}

//add the given restaurant to the main content body
function addNewResToDom(newRes){
    const newDiv = document.createElement('div');
    newDiv.className = "contentBox p-3"

    const newA = document.createElement('a');
    newA.className = "reviewLink";
    newA.style = "display:block";
    newA.href = "#";

    const newImgDiv = document.createElement('div');
    newImgDiv.className = 'storeImgContainer';

    const newImg = document.createElement('img');
    newImg.className = 'storeImg';
    newImg.src = newRes.image;
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);

    const newInfoDiv = document.createElement('div');
    newInfoDiv.className = 'storeInfoContainer';

    const newNameP = document.createElement('p');
    const newNameS = document.createElement('strong');
    const newNameS2 = document.createElement('span');
    newNameS.appendChild(document.createTextNode('Restaurant name: '));
    newNameS2.appendChild(document.createTextNode(newRes.name));
    newNameP.appendChild(newNameS);
    newNameP.appendChild(newNameS2);

    const newPhoneP = document.createElement('p');
    const newPhoneS = document.createElement('strong');
    const newPhoneS2 = document.createElement('span');
    newPhoneS.appendChild(document.createTextNode('Telephone: '));
    newPhoneS2.appendChild(document.createTextNode(newRes.phone));
    newPhoneP.appendChild(newPhoneS);
    newPhoneP.appendChild(newPhoneS2);

    const newAddrP = document.createElement('p');
    const newAddrS = document.createElement('strong');
    const newAddrS2 = document.createElement('span');
    newAddrS.appendChild(document.createTextNode('Restaurant address: '));
    newAddrS2.appendChild(document.createTextNode(newRes.address));
    newAddrP.appendChild(newAddrS);
    newAddrP.appendChild(newAddrS2);

    newInfoDiv.appendChild(newNameP);
    newInfoDiv.appendChild(newPhoneP);
    newInfoDiv.appendChild(newAddrP);

    newA.appendChild(newImgDiv);
    newA.appendChild(newInfoDiv);

    const newBtn = document.createElement('button');
    newBtn.className = 'btn btn-light float-right';
    newBtn.type = 'button';
    newBtn.appendChild(document.createTextNode('Edit'));

    const newBtn2 = document.createElement('button');
    newBtn2.className = 'btn btn-danger float-right';
    newBtn2.type = 'button';
    newBtn2.appendChild(document.createTextNode('Delete'));

    newDiv.appendChild(newA);
    newDiv.appendChild(newBtn2);
    newDiv.appendChild(newBtn);
    contentBody.appendChild(newDiv);
}