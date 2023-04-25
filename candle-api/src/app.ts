import express from "express";
import logger from "morgan";
import cors from 'cors'
import { candleRouter } from "./routes";

const app = express();
app.use(cors({ origin: ['http://localhost:27017', 'http://localhost:4200'] }))
app.use(express.json())
app.use(logger('dev'))

app.use('/candles', candleRouter)

export default app
