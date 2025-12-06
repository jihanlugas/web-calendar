import { useEffect, useRef, useState, useCallback } from "react";

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value]
  );

  return debouncedValue;
}

export default function useWebSocket({ url, autoReconnect = true }) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const connect = useCallback(() => {
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      // console.log("WS Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setMessages((prev) => [...prev, parsed]);
      } catch {
        setMessages((prev) => [...prev, event.data]);
      }
    };

    ws.onclose = (e) => {
      // console.log("WS Disconnected");
      // console.log("WS Closed", e.code, e.reason);
      setIsConnected(false);

      if (autoReconnect) {
        reconnectRef.current = setTimeout(() => {
          // console.log("WS Reconnecting...");
          connect();
        }, 2000);
      }
    };

    ws.onerror = (err) => {
      // console.log("WS Error");

      // console.log("WS ERROR:", err);
      ws.close();
    };
  }, [url, autoReconnect]);

  const disconnect = useCallback(() => {
    autoReconnect = false;
    clearTimeout(reconnectRef.current);
    wsRef.current?.close();
    setIsConnected(false);
  }, [autoReconnect]);

  const sendMessage = useCallback((data) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("WS not connected");
      return false;
    }

    wsRef.current.send(JSON.stringify(data));
    return true;
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, []);

  return {
    isConnected,
    messages,
    connect,
    disconnect,
    sendMessage,
  };
}
