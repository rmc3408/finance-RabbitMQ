import { Dispatch, SetStateAction } from "react";
import { Socket } from "socket.io-client";

type managerProps = {
  socket: Socket,
  setIsConnected: Dispatch<SetStateAction<boolean>>
}
export function SocketConnectionManager({ socket, setIsConnected }: managerProps) {
  function connect() {
    socket.connect();
    setIsConnected(socket.connected)
  }

  function disconnect() {
    socket.disconnect()
    setIsConnected(socket.connected)
  }

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}