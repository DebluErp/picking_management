// 📁 src/data-source.js

import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// 📍 ช่วยให้ใช้ __dirname ได้ใน ES module
const __fileName = fileURLToPath(import.meta.url);
const __dirName = path.dirname(__fileName);

// 🌱 ตรวจว่าเป็น dev หรือ production
const isDevelopment = process.env.NODE_ENV !== "production";

// 📂 โหลด config จาก GlobalConfig.json
const configPath = path.join(__dirName, "../GlobalConfig.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

// 🗃️ ดึงค่าจาก config
const dbConfig = config.Database;

// ⚡ สร้าง DataSource
export const AppDataSource = new DataSource({
  type: dbConfig.type,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  logging: true,
  entities: ["src/entities/*.js"],
  migrations: ["src/migrations/**/*.js"],
  subscribers: [],
});
