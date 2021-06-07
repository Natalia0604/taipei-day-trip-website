//註冊 POST
function signup(){
    let signname = document.getElementById("signupName").value;
    let signemail = document.getElementById("signupEmail").value;
    let signpassword = document.getElementById("signupPassword").value;
    if (signname.length == 0 | signemail.length == 0 | signpassword.length == 0){
        alert("不能為空");
    }else{
        let data={
            "name": signname,
            "email": signemail,
            "password":signpassword
        };
        const URL = '/api/user';
        fetch(URL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            cache: "no-cache"
        }).then(response =>{
            return response.json();
        }).then(data => {
            //顯示提示訊息
            let message = data["message"]
            let messageString = document.createTextNode(message);
            let signupMessage = document.getElementById("signupMessage");
            signupMessage.innerHTML="";
            signupMessage.appendChild(messageString);
            setTimeout('closeSignupBox()',2000);
            if (message == "註冊成功"){
                setTimeout('showLoginBox()',1500);
            }
        }).catch(console.error);
    }
}

//登入 PATCH
function login(){
    let loginEmail = document.getElementById("loginEmail").value;
    let loginPassword = document.getElementById("loginPassword").value;
    if (loginEmail.length == 0 | loginPassword.length == 0){
        alert("不能為空");
    }else{
        let data = {
            "email": loginEmail,
            "password": loginPassword
        };
        const URL = '/api/user';
        fetch( URL,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data),
            cache: "no-cache"
        }).then(response =>{
                return response.json();
        }).then(data => {
            //顯示提示訊息
            let message = data["message"]
            let messageString = document.createTextNode(message);
            let loginMessage = document.getElementById("loginMessage");
            loginMessage.innerHTML="";
            loginMessage.appendChild(messageString);
            setTimeout('closeLoginBox()',2000);
            if (message === "登入成功"){
                change_btn_word();
                setTimeout('refreshPage()',1500);
            }
            else{
                setTimeout('refreshPage()',1500);
            }
        }).catch(console.error);
    }
}

//檢查會員登入狀態 GET
function loginCheck(){
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
                change_btn_word();
            }
            else if (myStatus === 403){
                console.log("尚未登入");
                // showLoginBox();
            }
            return response.json();
    }).catch(console.error);
}

//登出 DELETE
function logout(){
    const URL = '/api/user';
    fetch(URL,{
        method:"DELETE",
        cache:"no-cache"
    }).then(response =>{
        return response.json();
    }).then(data => {
        // console.log(data);
        setTimeout('refreshPage()',1500);
    }).catch(console.error);
}

// [登入/註冊]換成[登出系統] 先把登入按鈕隱藏，把登出按鈕顯示
function change_btn_word(){
    let btn_member =document.getElementById("btn_member");
    btn_member.style.display ="none";
    let btn_logout =document.getElementById("btn_logout");
    btn_logout.style.display ="block";
}

//重新載入頁面
function refreshPage(){
    window.location.reload();
}

// 會員登入註冊 彈跳視窗
function showLoginBox(){
    let loginBox = document.getElementById("loginBox");
    let signupBox = document.getElementById("signupBox");
    loginBox.style.display="block";
    signupBox.style.display ="none";
}
function showSignupBox(){
    let signupBox = document.getElementById("signupBox");
    let loginBox = document.getElementById("loginBox");
    loginBox.style.display="none";
    signupBox.style.display ="block";
}
function closeLoginBox(){
    let loginBox = document.getElementById("loginBox");
    loginBox.style.display="none";
}
function closeSignupBox(){
    let signupBox = document.getElementById("signupBox");
    signupBox.style.display="none";
}
loginCheck();

