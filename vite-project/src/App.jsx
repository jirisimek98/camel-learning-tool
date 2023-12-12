import React, { useState, useEffect, useRef } from 'react';
import './styles/custom.scss';
import { Navbar, Nav, Container, Row, Col, Button, Dropdown, Collapse, Card} from 'react-bootstrap';
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
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';

function App() {
  const [javaCode, setJavaCode] = useState('');
  const [open, setOpen] = useState(false);

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
                         {' Learn Camel'}
                      </Navbar.Brand>
                  </Navbar>
              </Col>
          </Row>
          <Row>
            <Col xs={1} style={{ paddingLeft: 0, paddingRight: 0}}>
              <Navbar bg="light" style={{height: '100%'}}>
                <Nav defaultActiveKey="/playground" className="flex-column">
                  <Nav.Link href="/playground" className="text-left" style={{ padding: '.5rem 1rem', fontWeight: 'bold', color: 'black' }}>Playground</Nav.Link>
                  <Card border="0" className="bg-light">
                    <Card.Header className="p-0 border-0">
                      <Button
                        onClick={() => setOpen(!open)}
                        aria-controls="example-collapse-text"
                        aria-expanded={open}
                        variant="link"
                        className="bg-light w-100 text-dark"
                        style={{ textDecoration: 'none', border: 'none', color: 'inherit', textAlign: 'left', padding: '.5rem 1rem', fontWeight: 'bold', color: 'black' }}
                      >
                        Tutorials {open ? <FaAngleDown /> : <FaAngleRight />}
                      </Button>
                    </Card.Header>
                    <Collapse in={open}>
                      <div style={{alignItems: "center"}}>
                        <Nav.Link href="/tutorials/kafka" className="text-left" style={{ padding: '.5rem 2rem' }}>Kafka</Nav.Link>
                        <Nav.Link href="/tutorials/httpLog" className="text-left" style={{ padding: '.5rem 2rem' }}>HTTP Log</Nav.Link>
                        <Nav.Link href="/tutorials/httpLogEndpoint" className="text-left" style={{ padding: '.5rem 2rem' }}>HTTP Log (Endpoint DSL)</Nav.Link>
                        <Nav.Link href="/tutorials/enrich" className="text-left" style={{ padding: '.5rem 2rem' }}>Enrich</Nav.Link>
                        <Nav.Link href="/tutorials/processor" className="text-left" style={{ padding: '.5rem 2rem' }}>Processor</Nav.Link>
                      </div>
                    </Collapse>
                  </Card>
                </Nav>
              </Navbar>
            </Col>

              <Col xs={11}>
                  <Row>
                      <Col xs={8}>
                          <CodeEditor setJavaCode={setJavaCode}/>
                          <Row className='buttonRow'>
                            <Button className='customButton' onClick={sendJavaCode}>Submit route</Button>
                            <Routes>
                              <Route className='customButton' path="/tutorials/*" element={<TestButton/>}/>
                            </Routes>
                            <Button className='customButton' variant='danger' onClick={clearContext}>Clear context</Button>
                          </Row>
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
