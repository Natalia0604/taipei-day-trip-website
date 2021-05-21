from flask import *
import mysql.connector
from mysql.connector import Error

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config["DEBUG"] = True #顯示錯誤訊息
app.secret_key= "somesecretkeythatonlyishouldknow"

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


#APIs
@app.route("/api/attractions",methods=['GET'])
def api_attractions():
	#取得url上要求字串(Querrystring)欲查詢的page & keyword
	page = int(request.args.get("page"))
	keyword = str(request.args.get("keyword",None))
	limitNum=page *12 #建立LIMIT 刪除前面資料的數字
	#連接MYSQL資料庫
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	mycursor = connection.cursor()
	try:
		if keyword!='None':
			#找景點的資料
			string="SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions WHERE name LIKE CONCAT('%',%s,'%') LIMIT %s,12 "
			val=(keyword,limitNum)
			mycursor.execute(string,val)
			getAttraction = mycursor.fetchall()
		else:
			#找景點的資料
			mycursor.execute("SELECT id,name,category,description,address,transport,mrt,latitude,longitude,images FROM attractions ORDER BY id asc LIMIT %s,12 ",(limitNum,)) 
			getAttraction = mycursor.fetchall()
		
		#將圖片url放進LIST
		nextpage=None
		attractionList=[] #建立List將12筆資料放入
		for attraction in getAttraction:
		#將MYSQL的資訊顯示於網頁上
			if getAttraction != []:
				nextpage=page+1
				imageList = []
				for img in attraction[9].split(',')[:-1]:
					imageList.append(img)
				data ={
						"id":attraction[0],
						"name":attraction[1],
						"category":attraction[2],
						"description":attraction[3],
						"address":attraction[4],
						"transport":attraction[5],
						"mrt":attraction[6],
						"latitude":attraction[7],
						"longitude":attraction[8],
						"images":imageList
					}
				attractionList.append(data) 
		return jsonify({"nextPage":nextpage,"data":attractionList})
	except Error as e:
		print(e)
		return jsonify({"error": True,"message":"伺服器錯誤"})	
	connection.close()
	
@app.route("/api/attraction/<attractionId>")
def api_attraction(attractionId):
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	mycursor = connection.cursor()
	try:
		#找景點的資料
		mycursor.execute("SELECT id, name, category, description, address, transport, mrt, latitude, longitude , images FROM attractions WHERE id =(%s)",(attractionId,)) 
		getAttraction = mycursor.fetchall()
		#將圖片url放進LIST
		#將MYSQL的資訊顯示於網頁上
		if getAttraction != []:
			imageList =[]
			for img in getAttraction[0][9].split(',')[:-1]:
				imageList.append(img)
			data ={
				"id":getAttraction[0][0],
				"name":getAttraction[0][1],
				"category":getAttraction[0][2],
				"description":getAttraction[0][3],
				"address":getAttraction[0][4],
				"transport":getAttraction[0][5],
				"mrt":getAttraction[0][6],
				"latitude":getAttraction[0][7],
				"longitude":getAttraction[0][8],
				"images":imageList
			}
			return jsonify({"data":data})
		else:
			return jsonify({"error": True,"message": "景點編號錯誤"})
	except Error as e:
		return jsonify({"error": True,"message":"伺服器錯誤"})	
	connection.close()

#會員系統
# @app.route("api/user",methods=["GET","POST","PATCH","DELETE"])
# def member():
# 	#連接MYSQL資料庫
# 	try:
# 		#主機名稱、帳號、密碼、選擇的資料庫
# 		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
# 	except Error as e:
# 		print("資料庫連接失敗: ", e)
# 	try:
# 		if request.method == "POST": #註冊
# 			#接收前端註冊資料
# 			signupName = request.form["name"]
# 			signupEmail = request.form["email"]
# 			signupPassword = request.form["password"]
# 			#查詢member資料表中的資料
# 			mycursor = connection.cursor()
# 			mycursor.execute("SELECT email FROM member WHERE email = (%s)",(signupEmail,))
# 			#取回全部的資料
# 			data = mycursor.fetchall()
# 			#檢查member資料表是否有重複的帳號: 
# 			# 重複→帳號已經被註冊， 無重複→新增到資料表，註冊成功
# 			if (signupEmail,) in data:
# 				return jsonify({"error": True,"message": "註冊失敗，Email已經被註冊過囉!"}),400
# 			else:
# 				newData = "INSERT INTO member (name,email,password) VALUES (%s,%s,%s)"
# 				newValues = (signupName, signupEmail,signupPassword)
# 				mycursor.execute(newData, newValues)
# 				connection.commit()
# 				return jsonify({"ok":True,"message":"註冊成功"}),200
# 		elif request.method == "PATCH": #登入
# 			#接收前端登入資料
# 			loginEmail = request.form["email"]
# 			loginPassword = request.form["password"]
# 			#查詢member資料表中的資料
# 			mycursor = connection.cursor()
# 			mycursor.execute("SELECT email,password FROM member WHERE email= (%s) AND password = (%s)",(loginEmail,loginPassword))
# 			data = mycursor.fetchall()
# 			#檢查是否有對應的帳號、密碼
# 			#有→將name加入session ， 無→帳號或密碼錯誤
# 			if (loginEmail,loginPassword) in mydata:   
# 				session["email"] = loginEmail #會存在cookies
# 				data={
# 					"email":data[2],
# 					"password":data[3]
# 				}
# 				return jsonify(data),200
# 			else:
# 				return jsonify({"error":True,"message":"登入失敗，Eamil或密碼輸入錯誤"}),400
# 		elif request.method == "DELETE": #登出
# 			session.pop('email', None) #登出時一併消除儲存在cookies的資料
# 			return jsonify({"ok":True, "message":"登出成功"}),200
# 		elif request.method =="GET": #是否為登入狀態
# 			stillLogin = session.get("email")
# 			if stillLogin != None:
# 				data={
# 					"data":{
# 					"id"= data[0],
# 					"name"= data[1],
# 					"email"= data[2]
# 					}
# 				}
# 				return jsonify(data),200
# 			else:
# 				return jsonify({"error":"null"})	
#     except:
#         return jsonify({"error":True,"message":"伺服器錯誤"}),500
# 	connection.close()

app.run(port=3000)
# app.run(port=3000, host="0.0.0.0" ,debug= True)