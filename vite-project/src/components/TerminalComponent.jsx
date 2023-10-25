import React, { useState, useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import Terminal, { ColorMode, TerminalOutput } from 'react-terminal-ui';

const TerminalComponent = () => {

  const [logs, setLogs] = useState('');

  useEffect(() => {
    const options = {
      connectionTimeout: 4000,
      maxRetries: 10,
    };

    const ws = new ReconnectingWebSocket('ws://localhost:8080/ws/logs', [], options);

    ws.addEventListener('message', (event) => {
            console.log(event)
      setLogs(prevLogs => prevLogs + event.data);
    });

    return () => ws.close();
  }, []);

  return (
    <div className="container" style={{whiteSpace: 'pre-line', margin: 0, padding: 0, lineHeight: '1', height: "40vh"}}>
      <Terminal name='React Terminal Usage Example' colorMode={ ColorMode.Dark } >
        <TerminalOutput>
        { logs }
        </TerminalOutput>
      </Terminal>
    </div>
  )
};

export default TerminalComponent;