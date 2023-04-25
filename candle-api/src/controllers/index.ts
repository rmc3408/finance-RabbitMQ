import { Candle, ICandle } from "../models/candle";


class CandleController {

  async save(candle: ICandle): Promise<void> {
    await Candle.create(candle)
  }

  async findLastCandles(quantity: number = 10): Promise<Array<ICandle>> {
    return await Candle.find().sort('desc').limit(quantity)
  }
}

export default CandleController
