
let orderNumber = location.search.substring(8,);
console.log(orderNumber);
const URL = '/api/order/'+orderNumber;
fetch(URL,{
    method:"GET",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(),
    cache:"no-cache"
}).then(response =>{
    return response.json();
}).then(data=>{
    // console.log(data);
    let bNumber = data.data.number;
    let attractionName = data["data"]["trip"]["attraction"]["name"]
    let attractionAddress = data["data"]["trip"]["attraction"]["address"]
    let attractionImage = data["data"]["trip"]["attraction"]["image"]
    let date = data["data"]["trip"]["date"]
    let time =data["data"]["trip"]["time"]
    let price = data["data"]["price"]
    let memberName = data["data"]["contact"]["name"]
    let memberEmail = data["data"]["contact"]["email"]
    let phoneNumber = data["data"]["contact"]["phone"]
    console.log(bNumber,attractionName,attractionAddress,attractionImage,date,time,price,memberName,memberEmail,phoneNumber)
    appendData(bNumber,attractionName,attractionAddress,attractionImage,date,time,price,memberName,memberEmail,phoneNumber)
})

function appendData(bNumber,attractionName,attractionAddress,attractionImage,date,time,price,memberName,memberEmail,phoneNumber){
    //bookindNumber
    let bookingNumberString = document.createTextNode(bNumber);
    let bookingNumber = document.getElementById("number");
    bookingNumber.appendChild(bookingNumberString);
    //attractionName
    let attractionNameString = document.createTextNode(attractionName);
    let bookingName = document.getElementById("bookingName");
    bookingName.appendChild(attractionNameString); 
    //attractionAddress
    let attractionAddressString = document.createTextNode(attractionAddress);
    let bookingAddress = document.getElementById("bookingAddress");
    bookingAddress.appendChild(attractionAddressString); 
    //attractionImage
    const pic = document.querySelector(".bookingImage");
    pic.src = attractionImage;
    //date
    let dateString = document.createTextNode(date);
    let bookingDate = document.getElementById("bookingDate");
    bookingDate.appendChild(dateString); 
    //time
    if (time ==="morning"){
        timeString = document.createTextNode("早上9點到下午4點");
    }
    else if(time==="afternoon"){
        timeString = document.createTextNode("下午2點到晚上9點");
    }
    let bookingTime = document.getElementById("time");
    bookingTime.appendChild(timeString); 
    //price
    let priceString = document.createTextNode(price);
    let bookingPrice = document.getElementById("price");
    bookingPrice.appendChild(priceString); 
    //memberName
    let memberString = document.createTextNode(memberName);
    let headlineName = document.getElementById("headlineName");
    headlineName.appendChild(memberString); 

    let contactName = document.getElementById("contactName");
    let memberNameString = document.createTextNode(memberName);
    contactName.appendChild(memberNameString);
    //memberEmail
    let contactEmail = document.getElementById("contactEmail");
    let memberEmailString = document.createTextNode(memberEmail);
    contactEmail.appendChild(memberEmailString);
    //memberPhone
    let contactPhone = document.getElementById("contactPhone");
    let phoneString = document.createTextNode(phoneNumber);
    contactPhone.appendChild(phoneString);
}
//點台北一日遊回首頁
document.getElementById("taipeiDayTrip").onclick=function (){
    location.href = "/";
}

document.getElementById("btn_logout").onclick=function(){
    location.href="/";
}