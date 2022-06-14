# 台北一日遊 - 旅遊電商網站

## 網站介紹
本網站以台北市資料大平台所提供之觀光景點資料，運用前後端分離的架構建置的旅遊電商網站。使用者可以點選想去的景點、旅遊日期最後線上付款，安排自己喜歡的旅程。

## Demo
* 台北一日遊網址 : https://travel-taipei-spot.herokuapp.com/

* 網站登入試用:
    Test acccunt : testuser@gmail.com
    password : 12345

* 金流服務試用:
    Credit Card : 4242-4242-4242-4242
    Date : 01/23
    CVV : 123

## 使用技術
### 資料整理
* 採用Python進行資料處理，並將景點資料匯入MySQL中。
### 網站建置
* 原生 HTML + CSS 撰寫，支援RWD。
* 原生 Javascript 撰寫前端，無使用第三方套件。
* Python Flask 撰寫後端 ，使用 Session 紀錄會員資訊。
* 採用 RESTful API 的設計。
* 整合金流服務，串接 TapPay API 建立線上付款功能。
### 部屬網站 
* 原先使用 AWS EC2 部屬網站，但因期限問題將網站轉移至 Heroku 雲端平台部屬並使用 uptimerobot 定時喚醒。
* 使用 Heroku clearDB 存放觀光景點資料。

## 功能介紹
### 首頁
* 可以透過搜尋功能輸入關鍵字尋找該景點。(ex. 搜尋有關山的景點)
![](https://i.imgur.com/gR393t1.jpg)

* 偵測 Scroll 事件，自動載入下一頁景點資訊。
![](https://i.imgur.com/lcFFfNw.jpg)


### 帳號管理
* 具備完善會員系統，有註冊、登入、登出網站。
* 採會員式管理，需登入後才可預定行程。
![](https://i.imgur.com/dES28yu.png)

* 顯示會員的訂單資訊。
![](https://i.imgur.com/Ew19l9y.png)
