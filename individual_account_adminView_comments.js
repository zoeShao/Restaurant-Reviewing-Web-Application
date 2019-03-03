const log = console.log;

const mainbody = document.getElementById("mainbody");
mainbody.addEventListener("click", removeComments);




function removeComments(e){
    //should remove comments in database
    if (e.target.classList.contains("remove")){
        const commentToRemove = e.target.parentElement;
		mainbody.removeChild(commentToRemove);
        
    }
}
