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

    //'buyin' thingy
    let bButton = document.createElement('button');
    bButton.innerHTML = "Buy";
    bButton.setAttribute("id", "bBtn");
    descDiv.appendChild(bButton);

    //Append the div
    targetDiv.appendChild(descDiv);

    //Now that the btn is there, make it clickable
    addBtnListener();
}

function addBtnListener(){
    $('#bBtn').click(function(){
        if(getLoginData().uid == undefined) return alert('Something went wrong. Please login again')
        if(getLoginData().li){
            addOrder(getLoginData().uid, parseInt(urlParams.get('id')));
        }
    }); 
}

$(".home").click(function(){
    window.location.href=server;
})