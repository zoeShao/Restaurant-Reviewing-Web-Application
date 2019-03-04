class Restaurant{
    constructor(image, name, phone, address){
        this.image = image;
        this.name = name;
        this.phone = phone;
        this.address = address;
    }
}

const mainBody = document.querySelector('.mainBody');
const newResForm = document.querySelector('#newResForm');

newResForm.addEventListener('submit', addNewRes);

function addNewRes(e){
    e.preventDefault();

    const newResImg = document.querySelector('#newRestaurantImg').files[0];
    const newResName = document.querySelector('#newRestaurantName').value;
    const newResPhone = document.querySelector('#newRestaurantPhone').value;
    const newResAddr = document.querySelector('#newRestaurantAddr').value;

    const newRes = new Restaurant(newResImg, newResName, newResPhone, newResAddr);
    addNewResToDom(newRes);
}


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
    newImg.src = URL.createObjectURL(newRes.image);
    newImg.alt = "Store Picture";
    newImgDiv.appendChild(newImg);

    const newInfoDiv = document.createElement('div');
    newInfoDiv.className = 'storeInfoContainer';

    const newNameP = document.createElement('p');
    const newNameS = document.createElement('strong');
    newNameS.appendChild(document.createTextNode('Restaurant name: '));
    newNameP.appendChild(newNameS);
    newNameP.appendChild(document.createTextNode(newRes.name));

    const newPhoneP = document.createElement('p');
    const newPhoneS = document.createElement('strong');
    newPhoneS.appendChild(document.createTextNode('Telephone: '));
    newPhoneP.appendChild(newPhoneS);
    newPhoneP.appendChild(document.createTextNode(newRes.phone));

    const newAddrP = document.createElement('p');
    const newAddrS = document.createElement('strong');
    newAddrS.appendChild(document.createTextNode('Restaurant address: '));
    newAddrP.appendChild(newAddrS);
    newAddrP.appendChild(document.createTextNode(newRes.address));

    newInfoDiv.appendChild(newNameP);
    newInfoDiv.appendChild(newPhoneP);
    newInfoDiv.appendChild(newAddrP);

    newA.appendChild(newImgDiv);
    newA.appendChild(newInfoDiv);

    newDiv.appendChild(newA);
    mainBody.insertBefore(newDiv, mainBody.children[mainBody.childElementCount - 1]);
}