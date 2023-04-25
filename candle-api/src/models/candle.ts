import { Schema, model } from 'mongoose';

export interface ICandle {
  currency: string
  closingDateTime: Date
  open: number
  close: number
  high: number
  low: number
  color: string
}

const candleSchema = new Schema<ICandle>({
  currency: { type: String, required: true },
  closingDateTime: { type: Date, required: true },
  open: { type: Number, required: true },
  close: { type: Number, required: true },
  high: { type: Number, required: true },
  low: { type: Number, required: true },
  color: { type: String, required: true }
});

export const Candle = model<ICandle>('Candle', candleSchema);