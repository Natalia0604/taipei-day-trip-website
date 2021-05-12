import json 
import mysql.connector
from mysql.connector import Error

#連接MYSQL資料庫
try:
    #主機名稱、帳號、密碼、選擇的資料庫
    connection = mysql.connector.connect(host="localhost",user="root",password="0604",database="travel_spot")
except Error as e:
    print("資料庫連接失敗: ", e)
mycursor = connection.cursor()

#建立table
# mycursor.execute("CREATE TABLE attractions (id int,name VARCHAR(255), category VARCHAR(255),description TEXT,address VARCHAR(255),transport TEXT, mrt VARCHAR(255),latitude FLOAT, longitude FLOAT,images TEXT )")

#去除不為 PNG 和 JPG 的圖片檔案
def filter_out_png_and_jpg(imgUrlList):
    result =""
    for imgUrl in imgUrlList[1:]: #1代表全部
        imgType = imgUrl[-3:]
        if imgType == "png" or imgType== "PNG" or imgType == "jpg" or imgType == "JPG":
            result = result + "http" + imgUrl + ","
        else:
            continue
    return result

#讀取JSON檔案
f = open('taipei-attractions.json',"r",encoding="utf-8")
data = json.load(f)
spotList= data["result"]["results"]
# 分析資料
for spot in spotList:
    id = spot["_id"]
    name = spot["stitle"]
    category = spot["CAT2"]
    description = spot["xbody"]
    address = spot["address"]
    transport = spot["info"]
    mrt = spot["MRT"]
    latitude = spot["latitude"]
    longitude = spot["longitude"]
    img  = spot["file"]
    imgUrlList = img.split("http")
    images = filter_out_png_and_jpg(imgUrlList=imgUrlList)

    #查看資料表裡是否已存在資料(避免重複存取)
    def checkTableData(table):
        if table == "attractionsSpot":
            checkdata="SELECT * FROM attractions WHERE id=(%s)"
            mycursor.execute(checkdata,(id,))
        check = mycursor.fetchall()
        return check   

    if checkTableData("attractions") == []:
        # 將資料匯入MYSQL 的 spotData
        sqlData = "INSERT INTO attractions(id, name, category, description, address, transport, mrt, latitude, longitude,images) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        valData =(id, name, category, description, address, transport, mrt, latitude, longitude,images)
        mycursor.execute(sqlData, valData)
        connection.commit()
    
