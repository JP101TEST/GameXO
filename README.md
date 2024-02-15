เกมส์ XO 

วิธีการติดตั้ง
- โหลดโปรเจคไปไว้ในเครื่อง
- ติดตั้ง nod.js (ถ้ายังไม่ได้ติดตั้ง)
- สร้างฐานข้อมูลชื่อ historygamexo
    - Table มี 2 วิธีในการสร้างดังนี้
        1. สามารถ Import จากโฟลเดอร์ database
        2. สร้างด้วยคำสั่ง 
            "
            CREATE TABLE historyGame (
	        id int NOT NULL AUTO_INCREMENT,
            playerWinner CHAR(5) NOT NULL,
            gridSize INT(255) NOT NULL,
            sizeWinnerScale INT(255) NOT NULL,
            history JSON,
            PRIMARY KEY (ID)
            )ENGINE=InnoDB DEFAULT CHARSET=utf8; 
            "
- ตั้งค่าฐานข้อมูลที่จะดึงมาใช้จากไฟล์ databaseSetting.js
    - แก้ไข user: 'root' เป็นที่ผู้ใช้กำลังใช้งานอยู่
    - แก้ไข password: 'root' เป็นที่ผู้ใช้กำลังใช้งานอยู่
    - แก้ไข port: 3306 เป็นที่ผู้ใช้กำลังใช้งานอยู่ ซึ่ง port เอามากจากโปรแกรมจำลอง server ที่ผู้ใช้กำลังใช้งาน

วิธีการเล่น
- เปิดโปรแกรมจำลอง server
- เปิด teminal ในโฟลเดอร์โปรเจค
- พิมพ์คำสั่ง node index.js
- จะมีข้อความ Start server at port 8080.Run in http://localhost:8080/ 
- คัดลอก http://localhost:8080/ ไปเปิดหรือกด ctrl+คลิกซ้าย เพื่อเปิดหน้าเกมส์ได้
- เริ่มเล่นเกมส์

ขั้นตอนการออกแบบ
- ออกแบบตารางและวิธีการตรวจหาผู้ชนะ สามารถดูเอกสารการออกแบบได้ที่โฟลเดอร์ ขั้นตอนการออกแบบ -> algorithm การตรวจหาผู้ชนะ
- ออกแบบระบบเกมส์ สามารถดูเอกสารการออกแบบได้ที่โฟลเดอร์ ขั้นตอนการออกแบบ -> ระบบเกมส์ 