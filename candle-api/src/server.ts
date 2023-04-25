import { connection } from "mongoose";
import { connectMongoDB } from "./config/db";
import app from "./app";
import { config } from "dotenv";
import CandleRabbitMQ from "./messages/channel";


const createAppServer = async () => {
  config()

  await connectMongoDB()
  const server = app.listen(process.env.PORT_WEB!, () => {
    console.debug('App server listening on ', process.env.PORT_WEB!);
  }); 
  const rabbitServer = new CandleRabbitMQ(server)
  await rabbitServer.consumeMessages()
  
  process.on('SIGINT', async () => {
    console.log('MongoDB and App server are closed')
    await connection.close()
    await server.close()
    
    process.exit();
  })
}

createAppServer()