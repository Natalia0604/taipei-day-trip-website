function getData(Page=0){
    sessionStorage.setItem("loading",false);
    let keyword=document.getElementById("keyword").value;
    if (keyword!=null){
        var url = "/api/attractions?page="+Page.toString()+"&keyword="+keyword;
    }
    else{
        var url = "/api/attractions?page="+Page.toString();
    }
} 

fetch(url,{method:"get"}).then(function(response){
    return response.json()
})
.then(function(data){
    sessionStorage.setItem("loading",true)
    sessionStorage.setItem("nextPage", nextPage) 
    let nextPage = data["nextPage"]
    console.log(nextPage) //
    if(data !=[]){
        for(let i=0 ; i < data.length ; i++){
            //照片
            let image =data["data"]["images"][0]
            //文字: 景點名稱
            let nameString = data["data"]["name"]
            //文字: 捷運站
            let mrtString = data["data"]["mrt"]
            //文字: 分類
            let categoryString = data["data"]["category"]
            appendData(image,nameString,mrtString,categoryString)
        }
    }
    else{
        let emptyResult = document.createTextNode("查無結果");
        content.appendChild(emptyResult);
        console.log("查無結果"); //
    }
    req.send(null);
    sessionStorage.setItem("loading",false); 
})

function appendData(image,nameString,mrtString,categoryString){
    //建立裝所有東西的box
    let content = document.getElementById("content");
    let box = document.createElement("div"); //建立一個div
    box.className ="box"; //命名div 為box
    box.id = "box"; //命名div 的id 為box
    content.append(box);
    //照片
    let imgContainer = document.createElement("div");
    imgContainer.className = "imgContainer";
    imgContainer.id = "imgContainer";
    box.appendChild(imgContainer);
    const pic = document.createElement("img");
    pic.setAttribute("src",image);
    //文字: 景點名稱
    let name =document.createElement("div");
    name.className ="attractionName";
    let nameString = document.createTextNode(nameString);
    name.appendChild(nameString);
    box.appendChild(name);
    //文字 :將 <div class="attractionName"></div> 和 <div class="attractionMrt"></div>包進去，為了排版
    let textcontainer = document.createElement("div");
    textcontainer.className = "textcontainer"; 
    box.appendChild(textcontainer);
    //文字: 捷運站
    let mrt =document.createElement("div");
    mrt.className ="attractionMrt";
    let mrtString = document.createTextNode(mrtString);
    mrt.appendChild(mrtString);
    textcontainer.appendChild(mrt);
    //文字: 分類
    let category =document.createElement("div");
    category.className ="attractionCategory";
    var getCategory = myData[i]["category"];
    let categoryString = document.createTextNode(categoryString);
    category.appendChild(categoryString);
    textcontainer.appendChild(category);
}

function fetchData() {
    let triggerDistance = 10;
    let footerNode = document.getElementById("footer");
    let distance = footerNode.getBoundingClientRect().bottom - window.innerHeight;
    if (distance < triggerDistance) {
        let nextPage = sessionStorage.getItem("nextPage");
        let loading = sessionStorage.getItem("loading"); 
        console.log(loading); //
        if (loading === false){
            getData(page=nextPage);
        }
    }
}
window.addEventListener("scroll", fetchData);




