const server = "http://localhost:8080/";

let urlParams = new URLSearchParams(window.location.search);

let product;

$(document).ready(function(){
    getProduct(urlParams.get('id').toString());
});

function getProduct(requestingProductId){

    fetch(server+"product/id/"+requestingProductId).then(res=>{
        return res.json();
    }).then(data=>{
        product = data;
        createProductPane();
    });
}

function createProductPane(){
    let targetDiv = document.getElementById('main');

    //Create the content-div
    let div = document.createElement('div');
    div.className = "product";

    let textDiv = document.createElement('div');
    textDiv.className = "prodText";

    let title = document.createElement('h1');
    title.innerHTML = product.pname;
    let price = document.createElement('h2');
    price.innerHTML = product.price;
    let image = document.createElement('img');
    image.src = "http://localhost:8080/images/"+product.pimg+".png";

    div.appendChild(image);
    textDiv.appendChild(title);
    textDiv.appendChild(price);

    div.appendChild(textDiv);

    //Append the div
    targetDiv.appendChild(div);

    //Create the 'description' div
    let descDiv = document.createElement('div');
    descDiv.className = "descDiv"
    let descText = document.createElement('p');
    descText.innerHTML = product.pdesc;

    descDiv.appendChild(descText);

    //Append the div
    targetDiv.appendChild(descDiv);
}