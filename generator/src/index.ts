import { config } from 'dotenv'
import axios from 'axios'
import Period from './enums/period'
import Candle from './models/Candle'
import { createChannel } from './messages/channel'
import { Channel } from 'amqplib'

config()

const readMarketPrice = async (): Promise<number> => {
  const result = await axios.get(process.env.PRICES_API!)
  const data = await result.data
  return data.tether.cad
}

const generateCandles = async (): Promise<void> => {
  const openChannel: Channel | undefined = await createChannel()

  while(openChannel) {
    const loopTime = Period.TEN_MIN / Period.FOURTY_SEC
    const candle = new Candle(process.env.COIN!)

    for (let i = 0; i < loopTime; i++) {
      const price = await readMarketPrice()
      candle.addValue(price)
      console.log(`price = ${price} in loop #${i+1} out of ${loopTime}`)
      await new Promise( (res, rej) => setTimeout(res, Period.TEN_SEC))
    }
    candle.closeCandle()
    const candleJSON = JSON.stringify(candle.simpleObject())

    await openChannel.sendToQueue(process.env.QUEUE_NAME!, Buffer.from(candleJSON)) // Publish
  }
}

generateCandles()