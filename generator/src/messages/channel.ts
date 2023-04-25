import { config } from 'dotenv'
import amqp, { Channel } from 'amqplib'

config()
const AMQP_SERVER = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@localhost:${process.env.RABBITMQ_QUEUE_PORT}`

export const createChannel = async (): Promise<Channel | undefined> => {
  try {
    const conn = await amqp.connect(AMQP_SERVER)
    const channel = await conn.createChannel()
    await channel.assertQueue(process.env.QUEUE_NAME!, { durable: false }) // Create Queue

    return channel
  } catch (error) {
    console.error(error)
    return undefined
  }
}
