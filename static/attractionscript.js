let spotId = window.location.pathname.split("/")[2]; //取Id(127.0.0.1:3000/attraction/<id>)

fetch("/api/attraction/"+spotId, {method:"get"}).then(function(response){
    return response.json()
}).then(function (data){
    let image =data["data"]["images"]
    let spotName = data["data"]["name"]
    let spotCategory = data["data"]["category"]
    let spotMrt = data["data"]["mrt"]
    let spotDescription = data["data"]["description"]
    let spotAddress =data["data"]["address"]
    let spotTransport = data["data"]["transport"]
    appendData(spotName,spotCategory,spotMrt,spotDescription,spotAddress,spotTransport);
    appendDot(image);
    appendImages(image);
})


function appendData(spotName,spotCategory,spotMrt,spotDescription,spotAddress,spotTransport){
    // const img = document.getElementById("contentImg");
    // img.setAttribute("src",image[0]); //目前只顯示第一張照片
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

//----------------------------------------------------圖片輪播--------------------------------------------------------------------

// 設定一個引數記錄當前是第幾張圖片
var slideIndex = 1;
// showSlides(slideIndex);


// 按鈕的點擊事件
function plusSlides(n) {
    showSlides(slideIndex += n);
}


// 圓點的點擊事件
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// 設定當前在第幾張的計算方式
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    // 一旦設定這個屬性，所在的圖片就會顯示
    slides[slideIndex - 1].style.display = "block";
    // 一旦設定這個屬性，所在的小圓點就會變化
    dots[slideIndex - 1].className += " active";
}

function appendImages(image){
    console.log(image.length);
    for (let i=0; i<image.length; i++){
        let mySlides = document.createElement("div");
        let img = document.createElement("img");
        img.src=image[i];
        mySlides.appendChild(img);
        img.getAttribute("img");
        mySlides.setAttribute("class","mySlides");
        document.getElementById("imageSlide").appendChild(mySlides);
        showSlides(1)
    };
}

function appendDot(image){
    console.log(image.length);
    for (let i=0; i<image.length; i++){
        let dot = document.createElement("span");
        dot.setAttribute("class", "dot");
        dot.setAttribute("onclick", "javascript:currentSlide(i);");
        document.getElementById("dotGroup").appendChild(dot);
    };
}






// let image_Slide;
// let imageSlideImg ; //改抓外框框的寬度
// //counter
// let counter = 1;
// let size;
// console.log(imageSlideImg);

// function appendImages(image){
//     //增加最後一張照片到第一個位置
//     const imgfirst =document.createElement("img");
//     imgfirst.setAttribute("src",image[image.length-1]);
//     imgfirst.setAttribute("id","lastClone");
//     imgfirst.setAttribute("class","image");
//     document.getElementById("imageSlide").appendChild(imgfirst);
//     //跑出所有的圖片
//     for (let i=0; i<image.length; i++){
//         const img = document.createElement("img");
//         img.setAttribute("src",image[i]);
//         img.setAttribute("class","image");
//         document.getElementById("imageSlide").appendChild(img);
//     }
//     //增加第一張照片到最後一個位置
//     const imglast =document.createElement("img");
//     imglast.setAttribute("src",image[0]);
//     imglast.setAttribute("id","firstClone");
//     imglast.setAttribute("class","image");
//     document.getElementById("imageSlide").appendChild(imglast);
//     //
//     image_Slide = document.querySelector(".imageSlide");
//     imageSlideImg =document.querySelectorAll(".imageSlide img"); //只要是img的都被圈選
//     size = document.querySelector("#imageContainer").clientWidth + 2; //抓圖片的寬度
//     image_Slide.style.transform = "translateX("+(-size *counter)+"px)" //移動幾個圖片的寬度
//     image_Slide.addEventListener("transitionend",function(){
//         if (imageSlideImg[counter].id === "lastClone"){
//             image_Slide.style.transition = "none"; //不要有轉場的效果出現
//             counter = imageSlideImg.length + 2;
//             image_Slide.style.transform = "translateX("+(-size *counter)+"px)" ;
//         }
//         if (imageSlideImg[counter].id === "firstClone"){
//             image_Slide.style.transition = "none"; //不要有轉場的效果出現
//             counter = imageSlideImg.length - counter;
//             image_Slide.style.transform = "translateX("+(-size *counter)+"px)" ;
//         }
//     })
//     //button Listeners
//     preBtn.addEventListener("click",function(){
//         if(counter <= 0) return;
//             image_Slide.style.transition = "transform 0.4s ease-in-out";
//             counter--; //按了幾次Pre
//             image_Slide.style.transform = "translateX("+(-size *counter)+"px)" //讓照片往右滑
//             // console.log(counter);
//     })
//     nextBtn.addEventListener("click",function(){
//         console.log(counter)
//         if (counter >= imageSlideImg.length - 1) return

//         console.log(image_Slide)
//         image_Slide.style.transition = "transform 0.4s ease-in-out";
//         counter++; //按了幾次Next
//         console.log("translateX("+(-size *counter)+"px)")
//         image_Slide.style.transform = "translateX("+(-size *counter)+"px)" //讓照片往左滑
//             // console.log(counter);
//     })
// }

// //button 
// const preBtn = document.querySelector("#pre_btn");
// const nextBtn = document.querySelector("#next_btn");






//------------------------------------------------時段選擇---------------------------------------------------------------

//選擇上半天
document.getElementById("morning_btn").onclick=function(){    
    let priceString= document.createTextNode("新台幣2000元");
    let NTD = document.getElementById("NTD");
    NTD.innerHTML="";
    NTD.appendChild(priceString);
}

//選擇下半天
document.getElementById("afternoon_btn").onclick=function(){ 
    let priceString= document.createTextNode("新台幣2500元");
    let NTD = document.getElementById("NTD");
    NTD.innerHTML="";
    NTD.appendChild(priceString);  
}
