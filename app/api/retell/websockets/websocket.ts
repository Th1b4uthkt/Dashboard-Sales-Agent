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
      path: '/api/retell/websockets/websocket', // Ensure this path is correct for your use case
      cors: {
        origin: '*', // Update this for production to allow only trusted origins
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('New WebSocket connection');

      // Send initial config event
      socket.emit('config', {
        response_type: 'config',
        config: {
          auto_reconnect: true,
          call_details: true,
          transcript_with_tool_calls: true,
        },
      });

      // Handle incoming events from Retell
      socket.on('ping_pong', (data) => {
        console.log('Received ping_pong from Retell:', data);
        socket.emit('ping_pong', { timestamp: Date.now() });
      });

      socket.on('update_only', (update) => {
        console.log('Received update_only from Retell:', update);
        // Process update_only event
      });

      socket.on('response_required', (data) => {
        console.log('Received response_required from Retell:', data);
        // Send a response back
        socket.emit('response', {
          response_type: 'response',
          response_id: data.response_id,
          content: 'This is a response from the server.',
          content_complete: true,
        });
      });

      socket.on('reminder_required', (data) => {
        console.log('Received reminder_required from Retell:', data);
        // Send a reminder response back
        socket.emit('response', {
          response_type: 'response',
          response_id: data.response_id,
          content: 'This is a reminder from the server.',
          content_complete: true,
        });
      });

      socket.on('call_ended', (data) => {
        console.log('Received call_ended from Retell:', data);
        // Handle call ended event
      });

      socket.on('call_details', (data) => {
        console.log('Received call_details from Retell:', data);
        // Process call details event
      });

      socket.on('agent_interrupt', (data) => {
        console.log('Received agent_interrupt from Retell:', data);
        // Handle agent interrupt event
      });

      socket.on('tool_call_invocation', (data) => {
        console.log('Received tool_call_invocation from Retell:', data);
        // Handle tool call invocation event
      });

      socket.on('tool_call_result', (data) => {
        console.log('Received tool_call_result from Retell:', data);
        // Handle tool call result event
      });
    });

    res.socket.server.io = io;
  }

  res.status(200).end();
}

