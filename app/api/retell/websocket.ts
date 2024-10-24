import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface ServerWithIO extends HTTPServer {
  io?: SocketIOServer;
}

interface ExtendedNextApiResponse extends NextApiResponse {
  socket: {
    server: ServerWithIO;
  } & NextApiResponse['socket'];
}

export default function handler(req: NextApiRequest, res: ExtendedNextApiResponse) {
  if (!res.socket.server.io) {
    const httpServer: ServerWithIO = res.socket.server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/retell/websocket',
    });

    io.on('connection', (socket) => {
      console.log('New WebSocket connection');

      socket.on('config', (config) => {
        console.log('Received config event:', config);
        // Implement config handling logic here
      });

      socket.on('response', (response) => {
        console.log('Received response event:', response);
        // Implement response handling logic here
      });

      socket.on('agent_interrupt', (interrupt) => {
        console.log('Received agent_interrupt event:', interrupt);
        // Implement agent interrupt handling logic here
      });

      socket.on('tool_call_invocation', (toolCall) => {
        console.log('Received tool_call_invocation event:', toolCall);
        // Implement tool call invocation handling logic here
      });

      socket.on('tool_call_result', (result) => {
        console.log('Received tool_call_result event:', result);
        // Implement tool call result handling logic here
      });

      socket.on('metadata', (metadata) => {
        console.log('Received metadata event:', metadata);
        // Implement metadata handling logic here
      });

      // Implement other event handlers as needed
    });

    res.socket.server.io = io;
  }

  res.status(200).end();
}
