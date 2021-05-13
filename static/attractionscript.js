let spotId = window.location.pathname.split("/")[2]; //取Id(127.0.0.1:3000/attraction/<id>)

fetch("/api/attraction/"+spotId, {method:"get"}).then(function(response){
    return response.json()
}).then(function (data){
    const image =data["data"]["images"][0]
    //name
    let spotName = data["data"]["name"]
    //category
    let spotCategory = data["data"]["category"]
    //mrt 
    let spotMrt = data["data"]["mrt"]
    //description
    let spotDescription = data["data"]["description"]
    //address
    let spotAddress =data["data"]["address"]
    //transport
    let spotTransport = data["data"]["transport"]
    appendData(image,spotName,spotCategory,spotMrt,spotDescription,spotAddress,spotTransport);
})
btn_check_dayTime();

function appendData(image,spotName,spotCategory,spotMrt,spotDescription,spotAddress,spotTransport){
    const img = document.getElementById("contentImg");
    img.setAttribute("src",image); //目前只顯示第一張照片
    //name
    let nameString = document.createTextNode(spotName);
    let name = document.getElementById("name");
    name.appendChild(nameString);
    //category
    let categoryString = document.createTextNode(spotCategory);
    let category = document.getElementById("attractionCategory");
    category.appendChild(categoryString);
    //mrt 
    let mrtString = document.createTextNode(spotMrt);
    let mrt = document.getElementById("attractionMrt");
    mrt.appendChild(mrtString);
    //description
    let descriptionString = document.createTextNode(spotDescription);
    let description =document.getElementById("description");
    description.appendChild(descriptionString);
    //address
    let addressString =document.createTextNode(spotAddress);
    let address = document.getElementById("address");
    address.appendChild(addressString);
    //transport
    let transportString= document.createTextNode(spotTransport);
    let transport = document.getElementById("transport");
    transport.appendChild(transportString);
}

function btn_check_dayTime(){
    const btn_morning = document.querySelector('.morning_btn');
    const btn_afternoon = document.querySelector('.afternoon_btn');
    if (btn_morning.checked){
        let ntd = document.getElementById("NTD");
        let ntdString = document.createTextNode("新台幣2000元");
        ntd.appendChild(ntdString);
    }
    if(btn_afternoon.checked){
        let ntd = document.getElementById("NTD");
        let ntdString = document.createTextNode("新台幣2500元");
        ntd.appendChild(ntdString);
    }
}
// fetch("/api/attraction/"+pathId, {method:"get"}).then(function(response){
//     return response.json()
// }).then(function getAttractions(obj){
//     const img = document.getElementById("contentImg");
//     img.setAttribute("src",obj.data.images[0]); //只顯示第一張照片
//     //name
//     let nameString = document.createTextNode(obj.data.name);
//     let name = document.getElementById("name");
//     name.appendChild(nameString);
//     //category
//     let categoryString = document.createTextNode(obj.data.category);
//     let category = document.getElementById("attractionCategory");
//     category.appendChild(categoryString);
//     //mrt 
//     let mrtString = document.createTextNode(obj.data.mrt);
//     let mrt = document.getElementById("attractionMrt");
//     mrt.appendChild(mrtString);
//     //description
//     let descriptionString = document.createTextNode(obj.data.description);
//     let description =document.getElementById("description");
//     description.appendChild(descriptionString);
//     //address
//     let addressString =document.createTextNode(obj.data.address);
//     let address = document.getElementById("address");
//     address.appendChild(addressString);
//     //transport
//     let transportString= document.createTextNode(obj.data.transport);
//     let transport = document.getElementById("transport");
//     transport.appendChild(transportString);
    