function signin(){
    let em = document.getElementById('loginformEmail').value;
    let pw = document.getElementById('loginformPassword').value;

    if(em === '') return alert('Email cannot be empty')
    if(pw === '') return alert('Password cannot be empty')

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
        if (res.ok) {
            return res.json();
        }else{
            return Promise.reject('something went wrong!');
        }
    }).then(data=>{
        console.log(data);
        saveData(data.userId, data.userName, true);
        return;
    }).catch(err=>{
        console.log(err);
        return;
    });
    return;
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
        if (res.ok) {
            return res.json()
        }else{
            return Promise.reject('something went wrong!')
        }
    }).then(data=>{
        console.log(data)
        return;
    }).catch(err=>{
        console.log(err);
        return;
    });
    return;
}

function saveData(uid,un,li){
    localStorage.setItem('uid',uid);
    localStorage.setItem('un',un);
    localStorage.setItem('li',li);
    window.location.href=server+"protected_page.html";
}

function deleteData() {
    localStorage.removeItem('uid');
    localStorage.removeItem('un');
    localStorage.setItem('li',false);
}

function getLoginData(){
    return {
        uid:localStorage.getItem('uid'),
        un:localStorage.getItem('un'),
        li:localStorage.getItem('li')
    };
}

function logout(){
    deleteData();
    window.location.href=server;
}