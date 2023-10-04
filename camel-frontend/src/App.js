import React, { useState, useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button} from 'react-bootstrap';
import ServicesPanel from './components/ServicesPanel';

function App() {
  const [javaCode, setJavaCode] = useState('');
  const [logs, setLogs] = useState('');

  const sendJavaCode = async () => {
    try {
      let response = await fetch('http://localhost:8080/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: javaCode,
      });

      let data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error sending code:", error);
    }
  };

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

  return (
    <Container fluid>
        <Row>
            <Col>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#">
                        <img
                            alt="Logo"
                            src="./resources/camel-pic.jpg"
                            className="d-inline-block align-top"
                        />
                        {'Learn Camel'}
                    </Navbar.Brand>
                </Navbar>
            </Col>
        </Row>
        <Row>
            <Col xs={1} id="sidebar-wrapper">
                <Navbar bg="light" className="flex-column">
                    <Nav defaultActiveKey="/home" className="flex-column">
                        <Nav.Link href="/home">Playground</Nav.Link>
                        <Nav.Link eventKey="link-1">Tutorials</Nav.Link>
                    </Nav>
                </Navbar>
            </Col>

            <Col xs={10} id="page-content-wrapper">
                <Row>
                    <Col xs={8}>
                        <Editor
                            height="60vh"
                            defaultLanguage="java"
                            defaultValue={`import org.apache.camel.builder.RouteBuilder;

public class RouteBuilderImpl extends RouteBuilder {

    @Override
    public void configure() throws Exception {

        //Write your route here

    }
}`.trim()}
                            value={javaCode}
                            onChange={(value) => setJavaCode(value)}
                        />
                        <Button onClick={sendJavaCode}>Submit</Button>
                        <Container bg="dark">
                            <h2>Terminal</h2>
                            <p>{logs}</p>
                        </Container>
                    </Col>

                    <Col xs={4}>
                        <ServicesPanel/>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
  );
}

export default App;