import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useLocation } from 'react-router-dom';
import { AnsiUp } from 'ansi_up';

function Terminal() {
  const [logs, setLogs] = useState('');
  const location = useLocation();
  const ansiUp = new AnsiUp();

  const convertAnsiToHTML = (ansiText) => {
    return ansiUp.ansi_to_html(ansiText);
  }

  useEffect(() => {
    clearRoutes();
    flushServices();
    if (location.pathname === '/tutorials/kafka') {
      deployKafka();
    }
  }, [location.pathname]);

  const deployKafka = async () => {
    try {
      let response = await fetch('http://localhost:8080/services/deployKafka', {
        method: 'POST',
      });
      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deploying resources:", error);
    }
  };

  const clearRoutes = async () => {
    try {
      let response = await fetch('http://localhost:8080/routes/delete', {
        method: 'DELETE',
      });
      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting routes:", error);
    }
  };

  const flushServices = async () => {
    try {
      let response = await fetch('http://localhost:8080/services/flush', {
        method: 'DELETE',
      });
      let data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error deleting resources:", error);
    }
  };

  useEffect(() => {
    const options = {
      connectionTimeout: 4000,
      maxRetries: 10,
    };

    const ws = new ReconnectingWebSocket('ws://localhost:8080/ws/logs', [], options);

    ws.addEventListener('message', (event) => {
      setLogs(prevLogs => prevLogs + convertAnsiToHTML(event.data));
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
        height: '100%',
        overflowY: 'scroll',
        backgroundColor: '#000',
        color: '#fff',
        fontFamily: 'monospace',
        padding: '1em',
        whiteSpace: 'pre-wrap'
      }}
      dangerouslySetInnerHTML={{ __html: logs }}
    />  
  );
}

export default Terminal;

