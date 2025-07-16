import app from './app.js';
import { AppDataSource } from './appdatasource/AppDataSource.js';

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(() =>{
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`)
        })
    })
    .catch((err) =>{
        console.error("Error connecting to the database:", err);
    })