import { useState, useEffect, useCallback, useRef } from 'react';

export function useWebSocket(callId: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Use the correct WebSocket URL for Retell
  const url = `wss://www.ai-mentor.help/api/retell/websockets/${callId}`;

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
      reconnectAttemptsRef.current = 0;
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket closed. Attempting to reconnect...', event.reason);
      if (reconnectAttemptsRef.current < maxReconnectAttempts) {
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connect();
        }, 3000 * Math.pow(2, reconnectAttemptsRef.current));
      } else {
        console.error('Max reconnection attempts reached');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
        // Handle additional events if needed
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    setSocket(ws);

    return () => {
      ws.close();
      clearTimeout(reconnectTimeoutRef.current);
    };
  }, [url]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendMessage = useCallback((data: string | object) => {
    if (socket && isConnected) {
      try {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        socket.send(message);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }, [socket, isConnected]);

  return { lastMessage, sendMessage, isConnected };
}
