# 📦 ใช้ image ที่เบา
FROM node:22-alpine

# 📂 ตั้ง working directory
WORKDIR /app

# 🧾 คัดลอกไฟล์ package ก่อนเพื่อลด build cache invalidation
COPY package*.json ./

# 🛠️ ติดตั้ง dependencies (รวม devDependencies ด้วย)
RUN npm install

# 📁 คัดลอกไฟล์อื่น ๆ
COPY . .

# 🔥 ติดตั้ง nodemon ทั่วไป (ถ้าไม่ได้ใส่ใน package.json)
# RUN npm install -g nodemon

# 📤 เปิด port 3000
EXPOSE 3000

# 🚀 สั่งรัน dev
CMD ["npm", "run", "dev"]
