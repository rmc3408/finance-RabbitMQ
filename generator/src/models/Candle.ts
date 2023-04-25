import CandleColor from '../enums/color'

export interface SimpleCandle {
  low: number
  high: number
  open: number
  close: number
  color: CandleColor
  closingDateTime: Date | undefined
  currency: string
}

export default class Candle implements SimpleCandle {
  public low: number
  public high: number
  public open: number
  public close: number
  public color: CandleColor
  public closingDateTime: Date | undefined
  public values: Array<number>
  public currency: string

  constructor(currency: string) {
    this.currency = currency
    this.low = Infinity
    this.high = 0
    this.close = 0
    this.open = 0
    this.values = []
    this.color = CandleColor.UNDERTEMINED
    console.log('---- GENERATED CANDLE ----')
  }

  addValue(value: number): void {
    this.values.push(value)

    if (this.values.length == 1) this.open = value
    if (this.high < value) this.high = value
    if (this.low > value) this.low = value
  }

  closeCandle(): void {
    if (this.values.length > 0) {
      this.close = this.values[this.values.length - 1]
      if (this.open >= this.close) {
        this.color = CandleColor.RED
      } else if (this.close > this.open) {
        this.color = CandleColor.GREEN
      }
      this.closingDateTime = new Date()
    }
  }

  simpleObject(): SimpleCandle {
    const { values, ...obj } = this
    return obj
  }
}
