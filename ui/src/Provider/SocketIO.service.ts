import { io, Socket } from "socket.io-client";

export let socket: Socket;

export const initiateSocketConnection = () => {
  const backend = process.env.REACT_APP_BACKEND;

  if (backend) {
    socket = io(backend);
  }
};

export const emitMessage = (emitName:string,message?:any) => {
  if(socket) {
    socket.emit(emitName,message);
  }
}

export const readMessage =() => {
  return socket.on('new-message',(data) => {
    data = data;
  })
}


export const onMessage = (channel:string,message?:any):any => {
  
  let returnedData;

  socket.on(channel,(data) => {
      returnedData = data;
  })
  
  return returnedData;
}

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};


