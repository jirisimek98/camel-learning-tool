import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, Container, Row, Col, Button, Dropdown} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './styles/styles.css'
import CodeEditor from './components/CodeEditor';
import camels from './assets/camels.png'
import ServiceSwitcher from './components/ServiceSwitcher';
import Terminal from './components/Terminal';
import TestButton from './components/TestButton';
import TutorialDescription from './components/TutorialDescription';
import KafkaInstructions from './tutorials/KafkaInstructions.mdx';

function App() {
  const [javaCode, setJavaCode] = useState('');

  const sendJavaCode = async () => {
    try {
      let response = await fetch('http://localhost:8080/routes/add', {
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

  const clearContext = async () => {
    try {
      let response = await fetch('http://localhost:8080/routes/delete', {
        method: 'DELETE',
      });

      let data = await response.text();
      console.log(data);
    } catch (error) {
      console.error("Error deleting routes:", error);
    }
  };

  return (
    <Router>
      <Container fluid className="main-container">
          <Row>
              <Col>
                  <Navbar bg="dark" variant="dark">
                      <Navbar.Brand href="#">
                          <img
                              alt="Logo"
                              src={camels}
                              className="d-inline-block align-top"
                              width="50"
                              height="50"
                          />
                          {'Learn Camel'}
                      </Navbar.Brand>
                  </Navbar>
              </Col>
          </Row>
          <Row className="flex-grow-1">
              <Col xs={1} id="sidebar-wrapper">
              <Navbar bg="light" className="flex-column">
                  <Nav defaultActiveKey="/playground" className="flex-column">
                      <Nav.Link href="/playground">Playground</Nav.Link>
                      <Dropdown>
                          <Dropdown.Toggle as={Nav.Link}>
                              Tutorials
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                              <Dropdown.Item href="/tutorials/kafka">Kafka</Dropdown.Item>
                              <Dropdown.Item href="/tutorials/httpLog">HTTP Log</Dropdown.Item>
                              <Dropdown.Item href="/tutorials/httpLogEndpoint">HTTP Log (Endpoint DSL)</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                  </Nav>
              </Navbar>
              </Col>

              <Col xs={11} id="page-content-wrapper">
                  <Row className="h-100">
                      <Col xs={8}>
                          <CodeEditor setJavaCode={setJavaCode}/>
                          <Button onClick={sendJavaCode} style={{ margin: '10px' }}>Submit route</Button>
                          <Routes>
                            <Route path="/tutorials/*" element={<TestButton/>}/>
                          </Routes>
                          <Button variant='danger' onClick={clearContext} style={{ margin: '10px' }}>Clear context</Button>
                          <Container id='terminal-container'>
                              <Terminal/>
                          </Container>
                      </Col>
                      
                      <Routes>
                        <Route path="/playground" element={
                          <Col xs={4}>
                            <Row className="height-35vh">
                              <h2>Camel Playground</h2>
                              <div>You can play and shit</div>
                            </Row>
                            <Row>
                              <ServiceSwitcher/>
                            </Row>
                          </Col>
                        }/>
                        <Route path="tutorials/*" element={
                          <Col xs={4}>
                            <KafkaInstructions/>
                          </Col>
                        }/>
                      </Routes>
                  </Row>
              </Col>
          </Row>
      </Container>
    </Router>
  );
}

export default App;
