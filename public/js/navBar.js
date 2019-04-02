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
        log("sign out status")
        changeToSignOutStatus();
      } else{
        return res.json()
      }
      
    }).then((data) =>{
      if(data){
        changeToLoggedInStatus(data)
      }
      
    }).catch(error => {log(error)})
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
              console.log('sign out')
              changeToSignOutStatus();
          } 
      }).catch((error) => {
          console.log(error)
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
    const imgSrc = userObj.profilePicture;
    //add profile pic
    const profileLink = document.createElement('a');
    //TODO: add profile picture link
    if(userObj.type === 'u'){
        profileLink.href = '';
    }
    const img = document.createElement('img');
    //TODO: change image source link
    img.src = "https://img.icons8.com/ios/50/000000/gender-neutral-user.png"//imgSrc;
    img.className = "float-right img-thumbnail rounded-circle";
    profileLink.appendChild(img);
    $("#portraitContainer").append(profileLink);
  
    //add username
    $("#loginOrUsername").attr({
      'class': "nav-link userName submitLink"
    })

    if(userObj.type === 'u'){
        $("#loginOrUsername").attr({
            //TODO: add profile link
            'href': ""
        }) 
    }
    $("#loginOrUsername").text(userName)
  
    //change sign up to sign out
    $('#signInOutLink').attr({
      'href': '#',
      'onClick': 'javascript:signOutUser()',
      'class': 'nav-link signOut submitLink'
    })
    $('#signInOutLink').text("Sign Out")
  
  }