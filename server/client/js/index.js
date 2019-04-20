let products;

$(document).ready(function(){
    fetchProducts();
});

function fetchProducts(){
    let server = "http://localhost:8080/"
    fetch(server+"products").then(response=>{
        return response.json();
    }).then(myJson=>{
        products = myJson;
        createProductPanes();
    });
}

function createProductPanes(){
    for(i = 0; i < products.length; i++){
        console.log(products[i]);
    }
}

$('.loginBtn').click(function(){
    $('#loginContainer').toggleClass('active');
})