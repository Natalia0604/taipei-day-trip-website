from flask import *
import mysql.connector
from mysql.connector import Error
import datetime
import requests

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
# app.config["DEBUG"] = True #顯示錯誤訊息
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

#----------------------------會員系統---------------------------
#註冊
@app.route('/api/user',methods=['POST'])
def signup():
	#AJAX傳值給API	
	insertValues = request.get_json()
	print(insertValues)
	signupName =insertValues['name']
	signupEmail = insertValues['email']
	signupPassword = insertValues['password']	
	print(signupName,signupEmail,signupPassword)
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "POST": 
		mycursor = connection.cursor()
		mycursor.execute("SELECT email FROM member WHERE email = (%s)",(signupEmail,))
		mydata = mycursor.fetchall() #取回全部的資料
		#檢查member資料表是否有重複的帳號: 
		# 重複→帳號已經被註冊， 無重複→新增到資料表，註冊成功
		if (signupEmail,) in mydata:
			return Response(json.dumps({"error": True,"message": "註冊失敗，Email已經被註冊過囉!"}),mimetype="application/json"),400
		else:
			newData = "INSERT INTO member (name,email,password) VALUES (%s,%s,%s)"
			newValues = (signupName, signupEmail,signupPassword)
			mycursor.execute(newData, newValues)
			connection.commit()
			return Response(json.dumps({"ok":True,"message": "註冊成功"}),mimetype="application/json"),200
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()

#登入
@app.route("/api/user",methods=["PATCH"])
def login():
	#AJAX傳值給API	
	insertValues = request.get_json()
	loginEmail = insertValues["email"]
	loginPassword = insertValues["password"]
	print(loginEmail,loginPassword)
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "PATCH": 
		#查詢member資料表中的資料
		mycursor = connection.cursor()
		mycursor.execute("SELECT email,password FROM member WHERE email = (%s) AND password = (%s)",(loginEmail,loginPassword))
		mydata = mycursor.fetchall() #取回全部的資料
		#檢查是否有對應的帳號、密碼
		#有→將name加入session ， 無→帳號或密碼錯誤
		if (loginEmail,loginPassword) in mydata:   
			session["email"] = loginEmail #會存在cookies
			session.permanent = True #如果設置了session.permanent 為 True，那麽過期時間是31天
			return Response(json.dumps({"ok":True,"message":"登入成功"}),mimetype="application/json"),200
		else:
			return Response(json.dumps({"error":True,"message":"登入失敗，Eamil或密碼輸入錯誤"}),mimetype="application/json"),400
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()
	
#會員狀態
@app.route("/api/user",methods=["GET"])
def userState():
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "GET":
		stillLogin = session.get("email")
		if stillLogin != None:
			#查詢member資料表中的資料
			mycursor = connection.cursor()
			mycursor.execute("SELECT id,name,email FROM member WHERE email = (%s)",(stillLogin,))
			mydata = mycursor.fetchall() #取回全部的資料
			data={
				"data":{
				"id": mydata[0][0],
				"name": mydata[0][1],
				"email": mydata[0][2]
				}
			}
			return Response(json.dumps(data),mimetype="application/json"),200
		else:
			return Response(json.dumps({"error":None,"message":"尚未登入"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()

#登出
@app.route("/api/user",methods=["DELETE"])
def signout():
	if request.method == "DELETE": #登出
		session.pop('email', None) #登出時一併消除儲存在cookies的資料
		return Response(json.dumps({"ok":True, "message":"登出成功"}),mimetype="application/json"),200

#----------------------------預定行程---------------------------
#建立新的預定行程
@app.route("/api/booking",methods=['POST'])
def newBooking():
	#AJAX傳值給API
	insertValues = request.get_json()
	attractionId = insertValues["attractionId"]
	date = insertValues["date"]
	time = insertValues["time"]
	price = insertValues["price"]
	stillLogin = session.get("email")
	if request.method == "POST":
		if stillLogin != None: #檢查登入狀態
			if (attractionId != None and date != None and time != None and price !=None):
				session["attractionId"] = attractionId
				session["date"] = date
				session["time"] = time
				session["price"] = price
				print("session",session["attractionId"],session["date"],session["time"],session["price"])
				return Response(json.dumps({"ok":True,"message":"建立成功"}),mimetype="application/json"),200
			else:
				return Response(json.dumps({"error":True,"message":"建立失敗，輸入不正確"}),mimetype="application/json"),400
		else:
			return Response(json.dumps({"error":True,"message":"未登入系統，拒絕存取"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()


#取得尚未下單的預定行程
@app.route("/api/booking",methods=["GET"])
def bookingState():
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "GET":
		stillLogin = session.get("email")
		get_attractionId = session.get("attractionId")
		get_date = session.get("date")
		get_time = session.get("time")
		get_price = session.get("price")
		print("getSession",get_attractionId,get_date,get_time,get_price)
		if stillLogin != None:
			if (get_attractionId != None and get_date != None and get_time != None and get_price != None):
				mycursor = connection.cursor()
				mycursor.execute("SELECT id, name, address, images FROM attractions WHERE id =(%s)",(get_attractionId,)) 
				getAttraction = mycursor.fetchall()
				imageList =[]
				for img in getAttraction[0][3].split(',')[:-1]:
					imageList.append(img)
				data ={	
					"data":{
						"attraction":{
							"id":getAttraction[0][0],
							"name":getAttraction[0][1],
							"address":getAttraction[0][2],
							"images":imageList[0]
						},
						"date":get_date,
						"time":get_time,
						"price":get_price
					}
				}
				print(data)
				return Response(json.dumps(data),mimetype="application/json"),200
			else:
				return Response(json.dumps({"error":None,"message":"目前沒有任何待預訂的行程"}),mimetype="application/json"),201
		else:
			return Response(json.dumps({"error":True,"message":"未登入系統，拒絕存取"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()

#刪除目前的預定行程
@app.route("/api/booking",methods=["DELETE"])
def deleteBooking():
	if request.method == "DELETE":
		stillLogin = session.get("email")
		if stillLogin != None:
			session.pop('attractionId', None)
			session.pop('date', None)
			session.pop('time', None)
			session.pop('price', None)
			print("session pop", session.get("date"),session.get("time"))
			return Response(json.dumps({"ok":True,"message":"刪除成功"}),mimetype ="application/json"),200
		else:
			return Response(json.dumps({"error":True,"message":"未登入系統，拒絕存取"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500
	connection.close()	

#-----------------------------訂單付款---------------------------
#建立新的訂單，並完成付款程序
@app.route("/api/orders", methods=['POST'])
def orders():
	#AJAX傳值給API
	today = datetime.datetime.now()
	bookingNumber = today.strftime('%Y%m%d%H%M%S%f')[:-3]
	insertValues = request.get_json()
	print(insertValues)
	prime = insertValues["prime"]
	price = insertValues["order"]["price"]
	attractionId = insertValues["order"]["trip"]["attraction"]["id"]
	attractionName =insertValues["order"]["trip"]["attraction"]["name"]
	attractionAddress= insertValues["order"]["trip"]["attraction"]["address"]
	attractionImage = insertValues["order"]["trip"]["attraction"]["image"]
	date =insertValues["order"]["trip"]["date"]
	time = insertValues["order"]["trip"]["time"]
	memberName =insertValues["order"]["contact"]["name"]
	memberEmail = insertValues["order"]["contact"]["email"]
	memberPhone = insertValues["order"]["contact"]["phone"]
	# payStatus 0:已付款 1:未付款
	payStatus =1
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "POST":
		stillLogin = session.get("email")
		if stillLogin != None:
			if prime != None:
				mycursor = connection.cursor()
				newData = "INSERT INTO orders (number,price,id,name,address,image,date,time,membername,memberemail,memberphone,status) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
				newValues = (bookingNumber,price,attractionId,attractionName,attractionAddress,attractionImage,date,time,memberName,memberEmail,memberPhone,payStatus)
				mycursor.execute(newData,newValues)
				connection.commit()
				payurl ="https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
				payHeader = {
					'x-api-key':'partner_cO9DRkdRvL9ONttODiNp8pTsFLPyUFj6D4xUqzqqfLR1eh7pC1XCaczm'
				}
				payData = {
					"prime":prime,
					"partner_key":'partner_cO9DRkdRvL9ONttODiNp8pTsFLPyUFj6D4xUqzqqfLR1eh7pC1XCaczm',
					"merchant_id":"20210604_TAISHIN",
					"details":"TapPay Test",
					"amount":price,
					"cardholder":{
						"phone_number":memberPhone,
						"name":memberName,
						"email":memberEmail
					}
				}
				payrequest = requests.post(payurl, headers=payHeader, json=payData)
				payresponse = json.loads(payrequest.text)
				getStatus = payresponse["status"]
				getMessage = payresponse["msg"]
				print("message",getStatus,getMessage)
				if getStatus == 0:
					mycursor = connection.cursor()
					mycursor.execute("UPDATE orders SET status =(%s) WHERE number = (%s)",(0,bookingNumber,))
					connection.commit()
					return Response(json.dumps({
						"data":{
							"number":bookingNumber,
							"payment":{
								"status":0,
								"message":"未付款"
							}
						}
					}),mimetype="application/json"),200
				else:
					return Response(json.dumps({
						"data":{
							"number":bookingNumber,
							"payment":{
								"status":getStatus,
								"message":getMessage
							}
						}
					}),mimetype="application/json"),200	
			else:
				return Response(json.dumps({"error":True,"message":"訂單建立失敗"}),mimetype="application/json"),400
		else:
			return Response(json.dumps({"error":True,"message":"未登入系統"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500

# 根據訂單編號取得訂單資訊
@app.route("/api/order/<orderNumber>", methods=['GET'])
def getorders(orderNumber):
	try:
		#主機名稱、帳號、密碼、選擇的資料庫
		connection = mysql.connector.connect(host="localhost",user="root",password="nataliaSQL12345!",database="travel_spot")
	except Error as e:
		print("資料庫連接失敗: ", e)
	if request.method == "GET":
		stillLogin = session.get("email")
		if stillLogin != None:
			mycursor = connection.cursor()
			mycursor.execute("SELECT * FROM orders WHERE number = %s",(orderNumber,))
			getresult = mycursor.fetchone()
			print(getresult)
			if getresult != None:
				result = {
					"number":getresult[0],
					"price":getresult[1],
					"trip":{
						"attraction":{
							"id":getresult[2],
							"name":getresult[3],
							"address":getresult[4],
							"image":getresult[5]
						},
						"date":getresult[6],
						"time":getresult[7]
					},
					"contact":{
						"name":getresult[8],
						"email":getresult[9],
						"phone":getresult[10]
					},
					"status":getresult[11]
				}
				print(result)
			return Response(json.dumps({"data":result}),mimetype="application/json"),200
		else:
			return Response(json.dumps({"error":True,"message":"未登入系統"}),mimetype="application/json"),403
	else:
		return Response(json.dumps({"error":True,"message":"伺服器錯誤"}),mimetype="application/json"),500

# app.run( host="0.0.0.0", port=3000,debug= True)
app.run(port=3000,debug= True)
	
