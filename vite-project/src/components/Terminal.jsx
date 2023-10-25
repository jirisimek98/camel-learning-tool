import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

function Terminal() {
  const [logs, setLogs] = useState('');

  useEffect(() => {
    const options = {
      connectionTimeout: 4000,
      maxRetries: 10,
    };

    const ws = new ReconnectingWebSocket('ws://localhost:8080/ws/logs', [], options);

    ws.addEventListener('message', (event) => {
      setLogs(prevLogs => prevLogs + event.data);
    });

    return () => ws.close();
  }, []);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const terminalRef = useRef(null);

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = terminalRef.current;
    const atBottom = scrollTop === scrollHeight - clientHeight;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    const terminalElement = terminalRef.current;
    terminalElement.addEventListener('scroll', handleScroll);

    return () => {
      terminalElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, isAtBottom]);

  return (
    <div
      ref={terminalRef}
      style={{
        width: '100%',
        height: '400px',
        overflowY: 'scroll',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        padding: '1em',
        whiteSpace: 'pre-wrap'
      }}
    >
      {logs}
    </div>
  );
}

export default Terminal;

