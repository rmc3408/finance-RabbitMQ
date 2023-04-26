import Candle from './models'

export function Events({ events }: { events: Candle[] }) {
  return (
    <ul>
      {events.map((event, index) => (
        <li key={index}>{event.color}</li>
      ))}
    </ul>
  )
}
