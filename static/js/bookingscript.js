TPDirect.setupSDK(20555,"app_QGKeV7DULhNUSosQpoWmiBuVnIunDdFb3QIVhs53WyY3wycblpXpGn2gdTKu","sandbox")
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element:'#card-expiration-date',
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': 'orange'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        },
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})
function btn_onSubmit(){
    // event.preventDefault();
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }
    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        alert('get prime 成功，prime: ' + result.card.prime)
    })
}
//開始預定行程按鈕按下去傳送訂單畫面資訊
function btn_booking(){
    //從attraction.html取值，傳值給api
    let spotId = window.location.pathname.split("/")[2];
    let date = document.getElementById("date").value; 
    let price = document.getElementById("NTD").textContent;
    //取 radio button 的value 來取時間
    let radio_btn_time =document.getElementsByName("dayTime");
    let timeArray =[];
    for (var i=0; i<radio_btn_time.length;i++){
        if(radio_btn_time[i].checked){
            timeArray.push(radio_btn_time[i].value);
        }
    }
    let time = timeArray.join()
    // 將attraction.html的值，傳給api，從api取得回傳結果
    let data ={
        "attractionId":spotId,
        "date":date,
        "price":price,
        "time":time
    }
    console.log(data);
    const URL = '/api/booking';
    fetch(URL,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data),
        cache:"no-cache"
    }).then(response =>{
        let myStatus = response.status;
        if (myStatus === 403){
            console.log("尚未登入");
            showLoginBox();
        }
        return response.json();
    }).then(data=>{
        if (data["ok"] === true){
            location.href = "/booking";
        }
    }).catch(console.error);
}

// 點擊header 預定行程的流程 
//確定登入狀況 未登入→強制要求登入 登入→導向頁面booking
function loginCheck_booking(){
    const URL = '/api/user';
    fetch( URL,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },
        cache: "no-cache"
    }).then(response =>{
        let myStatus = response.status;    
        if (myStatus === 200){
            location.href = "/booking";
        }
        else if (myStatus === 403){
            console.log("尚未登入");
            showLoginBox();
        }
        return response.json();
    })
}

//完成預定行程頁面
function bookingDone(){
    //取訂單資料
    const URL = '/api/booking';
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
        if (data["error"] === null){
            deleteBooking();
        }
        else{
            let attractionName = data["data"]["attraction"]["name"]
            let attractionAddress = data["data"]["attraction"]["address"]
            const attractionImage = data["data"]["attraction"]["images"]
            let date = data["data"]["date"]
            let time = data["data"]["time"]
            let price = data["data"]["price"]
            console.log(attractionName,attractionAddress,attractionImage,date,time,price);
            appendBookingData(attractionName,attractionAddress,attractionImage,date,time,price);
        }
    }).catch(console.error);
    //取個人資料
    const URL2 = '/api/user';
    fetch(URL2,{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(),
        cache:"no-cache"
    }).then(response =>{
        let myStatus = response.status;    
        if (myStatus === 403){
            console.log("尚未登入");
            location.href = "/";
        }
        return response.json();
    }).then(data=>{
            let memberName = data["data"]["name"]
            let memberEmail = data["data"]["email"]
            appendMemberData(memberName,memberEmail);
    })
}

//刪除訂單連接fetch
function deleteBooking(){
    const URL = '/api/booking';
    fetch(URL,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(),
        cache:"no-cache"
    }).then(response =>{
        let myStatus = response.status;    
        if (myStatus === 403){
            console.log("尚未登入");
            showLoginBox();
        }
        else if (myStatus === 200){
            deleteIcon();
            let footer = document.getElementById("footer");
            footer.style.height="800px";
        }
        return response.json();
    })
}

//點擊垃圾桶刪除訂單 
function deleteIcon(){
    let section = document.getElementById("section");
    section.style.display = "none";
    let contactForm =document.getElementById("contactForm");
    contactForm.style.display ="none";
    let payment =document.getElementById("payment");
    payment.style.display ="none";
    let confirm =document.getElementById("confirm");
    confirm.style.display ="none";
    let hr = document.querySelectorAll("hr");
    for (let i=0;i<hr.length;i++){
        hr[i].style.display = "none";
    }
    let noschedule = document.getElementById("noschedule");
    noschedule.style.display="block";
}
//將訂單資訊顯示在booking.html
function appendBookingData(attractionName,attractionAddress,attractionImage,date,time,price){
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
    let bookingDate = document.getElementById("date");
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
    //total
    let totalString = document.createTextNode(price);
    let total = document.getElementById("total");
    total.appendChild(totalString);
}
//將會員資訊顯示在booking.html
function appendMemberData(memberName,memberEmail){
    //memberName
    let memberString = document.createTextNode(memberName);
    let headlineName = document.getElementById("headlineName");
    headlineName.appendChild(memberString); 
    let contactName = document.querySelector("#contactName");
    contactName.value = memberName;
    //memberEmail
    let contactEmail = document.querySelector("#contactEmail");
    contactEmail.value = memberEmail;
}
//點台北一日遊回首頁
document.getElementById("taipeiDayTrip").onclick=function (){
    location.href = "/";
}