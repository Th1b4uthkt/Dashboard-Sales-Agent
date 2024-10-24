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
      cors: {
        origin: 'https://www.ai-mentor.help',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('New WebSocket connection');

      // Handle incoming events from the client
      socket.on('config', (config) => {
        console.log('Received config event:', config);
        socket.emit('config_ack', { status: 'success' });
      });

      socket.on('response', (response) => {
        console.log('Received response event:', response);
        // Forward the response to Retell
      });

      socket.on('agent_interrupt', (interrupt) => {
        console.log('Received agent_interrupt event:', interrupt);
        // Forward the interrupt to Retell
      });

      socket.on('tool_call_invocation', (toolCall) => {
        console.log('Received tool_call_invocation event:', toolCall);
        // Handle tool call invocation
      });

      socket.on('tool_call_result', (result) => {
        console.log('Received tool_call_result event:', result);
        // Handle tool call result
      });

      socket.on('metadata', (metadata) => {
        console.log('Received metadata event:', metadata);
        // Handle metadata
      });

      // Handle events from Retell
      socket.on('ping_pong', (data) => {
        console.log('Received ping_pong from Retell:', data);
        socket.emit('ping_pong', { timestamp: Date.now() });
      });

      socket.on('update_only', (update) => {
        console.log('Received update_only from Retell:', update);
        socket.emit('transcript_update', update);
      });

      socket.on('response_required', (data) => {
        console.log('Received response_required from Retell:', data);
        socket.emit('llm_request', data);
      });

      socket.on('reminder_required', (data) => {
        console.log('Received reminder_required from Retell:', data);
        socket.emit('llm_request', data);
      });

      socket.on('call_ended', (data) => {
        console.log('Received call_ended from Retell:', data);
        socket.emit('call_ended', data);
      });
    });

    res.socket.server.io = io;
  }

  res.status(200).end();
}
