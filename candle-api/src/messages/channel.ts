import { Channel, connect } from 'amqplib'
import { config } from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import CandleController from '../controllers'
import { ICandle } from '../models/candle'

config()

class CandleRabbitMQ {
  private _channel!: Channel
  private _candleController: CandleController
  private _io!: Server

  constructor(server: http.Server) {
    this._candleController = new CandleController()
    this._connectSocketIO(server)
  }

  private async _connectRabbitMQ() {
    try {
      const connection = await connect(process.env.AMQP_SERVER!)
      this._channel = await connection.createChannel()
      console.log('RabbitMQ server connected')

      this._channel.assertQueue(process.env.QUEUE_NAME!, { durable: false })
    } catch (error) {
      console.error('Connection to Rabbit Failed', error)
    }
  }

  private _connectSocketIO(server: http.Server) {
    this._io = new Server(server, {
      cors: {
        origin: [process.env.SOCKET_SERVER!, process.env.SOCKET_CLIENT!],
        methods: ['GET', 'POST'],
      },
    })
    this._io.once('connection', () => {
      console.log('Web Socket IO server connected')
    })
  }

  async consumeMessages() {
    await this._connectRabbitMQ()

    if (!this._channel) return

    this._channel.consume(process.env.QUEUE_NAME!, async (msg) => {
        if (msg != null) {
          const data: ICandle = JSON.parse(msg.content.toString())
          await this._candleController.save(data)
          this._io.emit(process.env.SOCKET_EVENT_NAME!, data)
          console.log('Message received by RabbitMQ and emitted by SocketIO', data)
          this._channel.ack(msg, true)
        }
    })
    console.log('RabbitMQ consuming is ON')
  }
}

export default CandleRabbitMQ
