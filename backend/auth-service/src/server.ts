import app from "./app";
import dotenv from 'dotenv';
import { connectDB } from "./config/db";
import { connectRabbitMQ } from "./config/rabbitmq";

import path from 'path'
dotenv.config({path: path.join(process.cwd(), '.env')})
let server;
const PORT = process.env.PORT
const startServer = async () => {
    try {
      server = app.listen( PORT ,async() => {
        await connectDB();
        await connectRabbitMQ();
        console.log(`server started on port ${PORT}`)
      })

    } catch (error) {
        console.log(error instanceof Error ? error.message : 'postgreSQL connection failed')
        process.exit(1);
    }
}

startServer();