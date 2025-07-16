import "reflect-metadata";
import { exec } from "child_process";
import { AppDataSource } from "../appdatasource/AppDataSource.js"; // 👈 ต้องใส่ .js ถ้าใช้ ESModule

import path from "path";
import fs from "fs";

// ตรวจ dev/prod
const isDevelopment = process.env.NODE_ENV !== "production";

// อ่าน config จาก GlobalConfig.json
const config = JSON.parse(
  fs.readFileSync(new URL("../GlobalConfig.json", import.meta.url), "utf-8")
);
const dbConfig = config.Database;

// ดึง path สำหรับ backup
const mysqldumpPath = config.BackupConfig.mysqldumpPath;
const mysqlPath = config.BackupConfig.mysqlPath;
const backupDir = config.BackupConfig.backupPath;

function getBackupFileName() {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  return `backup-${timestamp}.sql`;
}

function backupDatabase() {
  const backupFileName = getBackupFileName();
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFilePath = path.join(backupDir, backupFileName);

  return new Promise((resolve, reject) => {
    const command = `"${mysqldumpPath}" --databases ${dbConfig.database} -u ${dbConfig.username} -p${dbConfig.password} > ${backupFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Backup error: ${error}`);
        console.error(stderr);
        return reject(error);
      }
      console.log("✅ Database backup completed");
      resolve(backupFilePath);
    });
  });
}

async function synchronizeDatabase() {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    await AppDataSource.initialize();
    await AppDataSource.synchronize();
    console.log("✅ Database schema updated");
  } catch (error) {
    console.error("❌ Error during database synchronization:", error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

function restoreDatabase(backupFilePath) {
  return new Promise((resolve, reject) => {
    const command = `"${mysqlPath}" -u ${dbConfig.username} -p${dbConfig.password} ${dbConfig.database} < ${backupFilePath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Restore error: ${error}`);
        console.error(stderr);
        return reject(error);
      }
      console.log("✅ Database restore completed");
      resolve(stdout);
    });
  });
}

function getLatestBackupFile() {
  const files = fs
    .readdirSync(backupDir)
    .filter((file) => file.startsWith("backup-") && file.endsWith(".sql"));

  if (files.length === 0) {
    return null;
  }

  files.sort(
    (a, b) =>
      fs.statSync(path.join(backupDir, b)).mtime.getTime() -
      fs.statSync(path.join(backupDir, a)).mtime.getTime()
  );

  return path.join(backupDir, files[0]);
}

async function main() {
  try {
    const backupFilePath = await backupDatabase();
    await synchronizeDatabase();
  } catch (error) {
    console.error("⚠️ Error occurred, trying to restore from backup...");
    const latestBackup = getLatestBackupFile();
    if (latestBackup) {
      await restoreDatabase(latestBackup);
    } else {
      console.error("❌ No backup file found.");
    }
  }
}

main().catch((err) => console.error(err));
