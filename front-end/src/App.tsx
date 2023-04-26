import logo from './logo.svg';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import { io } from "socket.io-client";
import 'react-toastify/dist/ReactToastify.css';
import { useLayoutEffect, useState } from 'react';
import { SocketConnectionManager } from './SocketConnection';
import { Events } from './Events';
import Candle from './models';

const socket = io(process.env.REACT_APP_SOCKET_CLIENT_SERVER!)

function App() {
  socket.connect()
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [candles, setCandles] = useState<Candle[]>([]);
  

  const notify = (msg:string) => toast(msg);

  useLayoutEffect(() => {
    function onConnect() {
      setIsConnected(socket.connected)
      console.log('WEBSOCKET IS ON-CONNECT')
    }

    function onDisconnect() {
      console.log('WEBSOCKET IS ON-DISCONNECT')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on(process.env.REACT_APP_SOCKET_EVENT_NAME!, (msg: Candle) => {
      console.log('WEBSOCKET FROM EVENT NAME')
      const candle = new Candle(msg)
      notify('New candle arrived!') 
      setCandles(prvSt => [...prvSt, candle])
    })

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(process.env.REACT_APP_SOCKET_EVENT_NAME!)
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="App-link"> WEBSOCKET CONNECTION {isConnected ? 'ON' : 'OFF'}</p>
        <Events events={ candles } />
      </header>
      <ToastContainer  />
    </div>
  );
}

export default App;
