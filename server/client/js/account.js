function signin(em,pw){
    let hpass = sha256(pw);

    let userObj = {
        email: em,
        password: hpass
    };

    fetch(server + "profile/login",{
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

function signup(un, pw, em){
    let hpass = sha256(pw);

    let userObj = {
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