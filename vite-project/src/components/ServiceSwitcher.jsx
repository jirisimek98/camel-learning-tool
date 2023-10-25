import React, { useState } from 'react';
import { Form, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../styles/styles.css'

const ServiceSwitcher = () => {
  const [serviceStatus, setServiceStatus] = useState({
    Postgre: { isDeployed: false, isLoading: false, urlTag: 'Postgre' },
    Kafka: { isDeployed: false, isLoading: false, urlTag: 'Kafka' },
    FTP: {isDeployed: false, isLoading: false, urlTag: 'FTP'}
  });

  const handleToggle = async (service) => {
    setServiceStatus(prevState => ({
      ...prevState,
      [service]: { ...prevState[service], isLoading: true }
    }));
    
    try {
      const action = serviceStatus[service].isDeployed ? 'destroy' : 'deploy';
      const method = serviceStatus[service].isDeployed ? 'delete' : 'post';
      const endpoint = `http://localhost:8080/services/${action}${service}`;
      
      const response = await axios({
        method,
        url: endpoint
      });
      
      setServiceStatus(prevState => ({
        ...prevState,
        [service]: { isDeployed: !prevState[service].isDeployed, isLoading: false } 
      }));
    } catch (error) {
      console.error('Failed to toggle service:', error);
      // Reset the loading status on error
      setServiceStatus(prevState => ({
        ...prevState,
        [service]: { ...prevState[service], isLoading: false }
      }));
    }
  };

  return (
    <Container className="service-switcher">
      <h2>Services available</h2>
      {Object.keys(serviceStatus).map(service => (
        <Row className="align-items-center justify-content-center my-3" key={service}>
          <Col xs={12} md={6} className="text-center">
            <Form.Group controlId={service} className="d-flex align-items-center justify-content-center">
              <Form.Label className="mr-3">{service}</Form.Label>
              <Form.Check
                type="switch"
                className="mr-3"
                checked={serviceStatus[service].isDeployed}
                disabled={serviceStatus[service].isLoading}
                onChange={() => handleToggle(service)}
              />
              {serviceStatus[service].isLoading && <Spinner animation="border" />}
            </Form.Group>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ServiceSwitcher;