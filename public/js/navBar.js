const log = console.log;
//send request to server to get log in status
export function getLogInInfo(){
    const url = '/getLogInInfo';
    const request = new Request(url, {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
    });
    fetch(request).then((res) => {
      if(res.status == 204){
        changeToSignOutStatus();
      } else{
        return res.json()
      }
      
    }).then((data) =>{
      if(data){
        changeToLoggedInStatus(data)
      }
      
    }).catch(error => {alert("Fail to get log in information!")})
  }
  
  //sign out user
export function signOutUser(){
        const url = '/users/logout';
        const request = new Request(url, {
          method: 'get', 
          headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
          },
    });
    fetch(request).then(function(res) {
          // Handle response we get from the API
          // Usually check the error codes to see what happened
          if (res.status === 200) {
              changeToSignOutStatus();
          } 
      }).catch((error) => {
          alert("Fail to sign out user!");
      })
      
  }

  function changeToSignOutStatus(){
    const header = document.getElementById("header");
    
    //remove profile pic
    $('#portraitContainer').empty();
    
    //remove username
    //set form
    $('#loginOrUsername').attr({
      'href': '/login',
      'class': "nav-link submitLink"
    })
  
    $('#loginOrUsername').text("Log In")
  
    //change sign out to sign up
    $('#signInOutLink').attr({
      'href': '/signUp',
      'class': 'nav-link submitLink'
    })
    $('#signInOutLink').text("Sign Up");
    
  }
  
  function changeToLoggedInStatus(userObj){
    const header = document.getElementById("header");
    const userName = userObj.name;
    const imgSrc = userObj.profileImg;
    const type = userObj.accountType;
    //add profile pic
    const profileLink = document.createElement('a');
    if(type === 'u'){
        profileLink.href = '/individual_account';
    }
    const img = document.createElement('img');
    if(imgSrc === ""){
      img.src = 'https://finanzmesse.ch/userdata/uploads/referenten/avatar.jpg'
    }
    else{
      img.src = "/readImg/" + imgSrc;
    }
    img.className = "float-right img-thumbnail rounded-circle peopleIcon";
    profileLink.appendChild(img);
    $("#portraitContainer").append(profileLink);
  
    //add username
    $("#loginOrUsername").attr({
      'class': "nav-link userName"
    })

    if(type === 'u'){
        $("#loginOrUsername").attr({
            'href': "/individual_account"
        }) 
    }
    $("#loginOrUsername").text(userName)
  
    //change sign up to sign out
    $('#signInOutLink').attr({
      'href': '/users/logout',
      'class': 'nav-link submitLink'
      // 'class': 'nav-link signOut submitLink'
    })
    $('#signInOutLink').text("Sign Out")
  
  }