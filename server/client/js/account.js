function signin(text){

}

function signup(un, pw, em){
    let hpass = sha256(pw);

    var userObj = {
        username: un,
        password: hpass,
        email: em
    };

    fetch(server + "profile/signup",{
        credentials: 'same-origin', // 'include', default: 'omit'
        method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
        body: JSON.stringify(userObj), // Coordinate the body type with 'Content-Type'
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res=>{
        return res.json();
    }).then(data=>{
        console.log(data)
    }).catch(err=>{
        console.log(err);
    })

}