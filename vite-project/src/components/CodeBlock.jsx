import React, { useRef, useState } from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import copy from '../assets/copy.png'

function CodeBlock({ code }) {
  const textAreaRef = useRef(null);
  const [isSolutionVisible, setSolutionVisible] = useState(false);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
  }

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col md={8}>
          <Button 
            variant="primary" 
            onClick={() => setSolutionVisible(!isSolutionVisible)}
            style={{width: '100%'}}
          >
            {isSolutionVisible ? 'Hide Solution' : 'Show Solution'}
          </Button>
        </Col>
      </Row>
      {isSolutionVisible && (
        <Row className="justify-content-center mt-4">
          <Col md={11}>
            <Card>
              <Card.Body>
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  <code>
                    <textarea 
                      ref={textAreaRef} 
                      value={code} 
                      readOnly 
                      style={{ width: '100%', height: '200px', border: 'none' }}
                    />
                  </code>
                </pre>
              </Card.Body>
              <Button variant="success" onClick={copyToClipboard}>Copy<img src={copy} width='16' height='16'/></Button>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default CodeBlock;