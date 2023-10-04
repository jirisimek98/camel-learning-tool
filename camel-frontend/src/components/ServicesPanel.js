import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const ServicesPanel = () => {

  const [serviceStates, setServiceStates] = useState({
    kafka: false,
    postgre: false,
  });

  const handleToggle = (service) => {
    setServiceStates({
      ...serviceStates,
      [service]: !serviceStates[service],
    });
  };


  const handleDeploy = async () => {
    const requestData = { ...serviceStates };

    const response = await fetch('/api/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });

  };

  return (
    <Container>
      <Row>
        {Object.keys(serviceStates).map(service => (
          <Row key={service}>
            <Form.Check 
              type="switch"
              id={service}
              label={service}
              checked={serviceStates[service]}
              onChange={() => handleToggle(service)}
            />
          </Row>
        ))}
      </Row>
      <Row>
        <Col>
          <Button onClick={handleDeploy}>Deploy</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ServicesPanel;