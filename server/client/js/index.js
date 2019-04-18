let products;

$(document).ready(function(){
    fetchServer("products");
});

function fetchServer(subject){
    let server = "http://localhost:8080/"
    fetch(server+subject).then(response=>{
        return response.json();
    }).then(myJson=>{
        products = myJson;
    });
}