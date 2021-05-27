//搜尋框，刪除前面搜尋的舊資料
function search(){
    document.getElementById("content").innerHTML = "";
    getData();
}
//跑資料
function getData(Page=0){
    sessionStorage.setItem("loading",true);
    let keyword=document.getElementById("keyword").value;
    if (keyword!=null){
        var url = "/api/attractions?page="+Page.toString()+"&keyword="+keyword;
    }
    else{
        var url = "/api/attractions?page="+Page.toString();
    } 
    let req=new XMLHttpRequest();
    req.open("GET",url);
    req.onload=function(){
        sessionStorage.setItem("loading",false);
        let nextPage = JSON.parse(req.responseText)["nextPage"];
        sessionStorage.setItem("nextPage", nextPage);
        let myData = JSON.parse(req.responseText)["data"];
        if (myData.length != 0){
            for(let i=0 ; i < myData.length ; i++){
                let content = document.querySelector(".content");
                let box = document.createElement("div"); //建立一個div
                box.className ="box"; //命名div 為box
                box.id = "box" //命名div 的id 為box
                content.append(box);
                //照片
                let imgContainer = document.createElement("div");
                imgContainer.className = "imgContainer";
                imgContainer.id = "imgContainer";
                box.appendChild(imgContainer);
                const pic = document.createElement("img");
                pic.className="contentImg";
                pic.src= myData[i]["images"][0];
                document.getElementById("imgContainer").appendChild(pic); //利用imgContainer 的id 將img append進去
                imgContainer.appendChild(pic);
                //文字: 景點名稱
                let getSpotId= "attraction/" + myData[i]["id"];
                let name =document.createElement("a");
                name.setAttribute("href",getSpotId);
                name.className ="attractionName";
                let getName = myData[i]["name"];
                let nameString = document.createTextNode(getName);
                name.appendChild(nameString);
                box.appendChild(name);
                //文字 :將 <div class="attractionName"></div> 和 <div class="attractionMrt"></div>包進去，為了排版
                let textcontainer = document.createElement("div");
                textcontainer.className = "textcontainer"; 
                box.appendChild(textcontainer);
                //文字: 捷運站
                let mrt =document.createElement("div");
                mrt.className ="attractionMrt";
                let getMrt = myData[i]["mrt"];
                let mrtString = document.createTextNode(getMrt);
                mrt.appendChild(mrtString);
                textcontainer.appendChild(mrt);
                //文字: 分類
                let category =document.createElement("div");
                category.className ="attractionCategory";
                var getCategory = myData[i]["category"];
                let categoryString = document.createTextNode(getCategory);
                category.appendChild(categoryString);
                textcontainer.appendChild(category);
            }
        } 
        else{
            let emptyResult = document.createTextNode("查無結果");
            content.appendChild(emptyResult);
        }
    }
    req.send(null);
}
getData();

// // 會員登入註冊 彈跳視窗
// function showLoginBox(){
//     let loginBox = document.getElementById("loginBox");
//     let signupBox = document.getElementById("signupBox");
//     loginBox.style.display="block";
//     signupBox.style.display ="none";
// }
// function showSignupBox(){
//     let signupBox = document.getElementById("signupBox");
//     let loginBox = document.getElementById("loginBox");
//     loginBox.style.display="none";
//     signupBox.style.display ="block";
// }
// document.getElementById("closeLoginBox").onclick=function(){
//     let loginBox = document.getElementById("loginBox");
//     loginBox.style.display="none";
// }
// document.getElementById("closeSignupBox").onclick=function(){
//     let signupBox = document.getElementById("signupBox");
//     signupBox.style.display="none";
// }

// 滾動式卷軸
function fetchData() {
    let triggerDistance = 10;
    let footerNode = document.getElementById("footer");
    let distance = footerNode.getBoundingClientRect().bottom - window.innerHeight;
    if (distance < triggerDistance) {
        let nextPage = sessionStorage.getItem("nextPage");
        let loading = sessionStorage.getItem("loading"); 
        if (nextPage != "null"){
            if (loading === "false"){
                getData(page=nextPage);
            }
        }  
    }
}
window.addEventListener("scroll", fetchData);
