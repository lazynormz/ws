$(document).ready(function(){
    if(getLoginData().li === "false" || getLoginData().li === null) logout();
});