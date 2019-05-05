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

function signup(){
    let un = document.getElementById('registerformUsername').value;
    let em = document.getElementById('registerformEmail').value;
    let pw = document.getElementById('registerformPassword').value;

    if(un === '') return alert('Username cannot be empty!');
    if(em === '') return alert('Email cannot be empty!');
    if(pw === '') return alert('Password cannot be empty!');

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
        alert('Register successfull... Please log in now to continue shoppin\'');
        return;
    }).catch(err=>{
        console.log(err);
        return;
    });
    return;
}

function addOrder(uid, pid){

    let orderObj = {
        uid:parseInt(uid),
        pid:pid
    };

    console.log(orderObj);

    fetch(server + "profile/addOrder",{
        credentials: 'same-origin', // 'include', default: 'omit'
        method: 'POST', // 'GET', 'PUT', 'DELETE', etc.
        body: JSON.stringify(orderObj), // Coordinate the body type with 'Content-Type'
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
    window.location.href=server;
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