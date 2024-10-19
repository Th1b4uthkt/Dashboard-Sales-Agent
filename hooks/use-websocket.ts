import { useState, useEffect, useCallback } from 'react';

export function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onmessage = (event) => {
      setLastMessage(event);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((data: string) => {
    if (socket) {
      socket.send(data);
    }
  }, [socket]);

  return { lastMessage, sendMessage };
}
