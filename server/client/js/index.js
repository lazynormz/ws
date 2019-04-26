const server = "http://localhost:8080/";

let products;

$(document).ready(function(){
    fetchProducts();
});

function fetchProducts(){
    fetch(server+"products").then(res=>{
        return res.json();
    }).then(data=>{
        products = data;
        createProductPanes();
    });
}

function createProductPanes(){
    let targetDiv = document.getElementById('main');
    for(i = 0; i < products.length; i++){
        let div = document.createElement('div');
        div.className = "product";

        let textDiv = document.createElement('div');
        textDiv.className = "prodText";

        let title = document.createElement('h1');
        title.innerHTML = products[i].pname;
        let price = document.createElement('h2');
        price.innerHTML = products[i].price;
        let image = document.createElement('img');
        image.src = "http://localhost:8080/images/"+products[i].pimg+".png";

        div.appendChild(image);
        textDiv.appendChild(title);
        textDiv.appendChild(price);

        div.appendChild(textDiv);
        targetDiv.appendChild(div);
    }
}

$('.loginBtn').click(function(){
    $('#loginContainer').toggleClass('active');
});

$('.logoutBtn').click(function(){
    logout();
})