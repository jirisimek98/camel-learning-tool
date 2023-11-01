import React, { useState, useEffect, useRef } from 'react';
import './styles/custom.scss';
import { Navbar, Nav, Container, Row, Col, Button, Dropdown} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './styles/styles.css'
import CodeEditor from './components/CodeEditor';
import camels from './assets/camel.png'
import ServiceSwitcher from './components/ServiceSwitcher';
import Terminal from './components/Terminal';
import TestButton from './components/TestButton';
import KafkaTutorial from './tutorials/KafkaTutorial.mdx';
import HttpLogTutorial from './tutorials/HttpLogTutorial.mdx';
import HttpLogEndpointTutorial from './tutorials/HttpLogEndpointTutorial.mdx';
import EnrichTutorial from './tutorials/EnrichTutorial.mdx';
import ProcessorTutorial from './tutorials/ProcessorTutorial.mdx';
import Playground from './tutorials/Playground.mdx';

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
              <Col style={{paddingLeft: 0, paddingRight: 0}}>
                  <Navbar bg='light'>
                      <Navbar.Brand className='custom-navbar logo' href="/playground">
                          <img
                              alt="Logo"
                              src={camels}
                              className="d-inline-block align-top"
                              width="50"
                              height="50"
                          />
                         {'   Learn Camel'}
                      </Navbar.Brand>
                  </Navbar>
              </Col>
          </Row>
          <Row>
              <Col xs={1} style={{paddingLeft: 0, paddingRight: 0}}>
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
                              <Dropdown.Item href="/tutorials/enrich">Enrich</Dropdown.Item>
                              <Dropdown.Item href="/tutorials/processor">Processor</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>
                  </Nav>
              </Navbar>
              </Col>

              <Col xs={11}>
                  <Row>
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
                      <Col xs={4} id="tutorial-container" className='flex-column'>
                        <Routes>
                          <Route path="/*" element={
                            <div>
                              <Row>
                                  <Playground/>
                              </Row>
                              <Row>
                                <ServiceSwitcher/>
                              </Row>
                            </div>
                          }/>
                          <Route path="tutorials/kafka" element={
                              <KafkaTutorial/>
                          }/>
                          <Route path="tutorials/httpLog" element={
                              <HttpLogTutorial/>
                          }/>
                          <Route path="tutorials/httpLogEndpoint" element={
                              <HttpLogEndpointTutorial/>
                          }/>
                          <Route path="tutorials/enrich" element={
                              <EnrichTutorial/>
                          }/>
                          <Route path="tutorials/processor" element={
                              <ProcessorTutorial/>
                          }/>
                        </Routes>
                      </Col>
                  </Row>
              </Col>
          </Row>
      </Container>
    </Router>
  );
}

export default App;
