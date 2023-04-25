import { config } from 'dotenv'
import mongoose from 'mongoose'
config()

export const connectMongoDB = () => {
  mongoose
    .connect(process.env.MONGODB_SERVER!)
    .then(() => console.debug('MongoDB server listening on ', process.env.MONGO_PORT!))
    .catch((e) => console.log(e))
}
