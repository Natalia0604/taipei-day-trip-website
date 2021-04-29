import json 
import mysql.connector
from mysql.connector import Error

#連接MYSQL資料庫
try:
    #主機名稱、帳號、密碼、選擇的資料庫
    connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
except Error as e:
    print("資料庫連接失敗: ", e)
mycursor = connection.cursor()

#建立table
#mycursor.execute("CREATE TABLE attractions (id int,name VARCHAR(255), category VARCHAR(255),description TEXT,address VARCHAR(255),transport TEXT, mrt VARCHAR(255),latitude FLOAT, longitude FLOAT,images TEXT )")
#mycursor.execute("CREATE TABLE attractionImage (imageId int, image TEXT)")

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
    images = ["http://"+image for image in spot["file"].split(sep="http://")
    if ".JPG" in image.upper() or ".PNG" in image.upper()]

    #查看資料表裡是否已存在資料(避免重複存取)
    def checkTableData(table):
        if table == "attractions":
            checkdata="SELECT * FROM attractions WHERE id=(%s)"
            mycursor.execute(checkdata,(id,))
        elif table == "attractionImage":
            checkimage="SELECT * FROM attractionImage WHERE imageId=(%s)"
            mycursor.execute(checkimage,(id,))

        check = mycursor.fetchall()
        return check   

    if checkTableData("attractions") == []:
        # 將資料匯入MYSQL 的 spotData
        sqlData = "INSERT INTO attractions(id, name, category, description, address, transport, mrt, latitude, longitude,images) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        valData =(id, name, category, description, address, transport, mrt, latitude, longitude,images[0])
        mycursor.execute(sqlData, valData)
        connection.commit()

    if  checkTableData("attractionImage") ==[]:
        # 將照片匯入MYSQL的 spotImage
        for img in images:
            sqlImage = "INSERT INTO attractionImage(imageId, image) VALUES (%s,%s)"
            valImage =(id,img) 
            mycursor.execute(sqlImage, valImage)
        connection.commit()
    
