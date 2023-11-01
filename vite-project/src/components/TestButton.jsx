import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function TestButton() {

    const location = useLocation();

    const runTests = async () => {

        let endpoint;
    
        switch(location.pathname) {
          case '/tutorials/kafka':
            endpoint = 'http://localhost:8080/test/KafkaTest';
            break;
          case '/tutorials/httpLog':
            endpoint = 'http://localhost:8080/test/HttpLogTest';
            break;
          case '/tutorials/httpLogEndpoint':
            endpoint = 'http://localhost:8080/test/HttpLogEndpointTest';
            break;
          case '/tutorials/enrich':
              endpoint = 'http://localhost:8080/test/EnrichRouteTest';
              break;
          case '/tutorials/processor':
            endpoint = 'http://localhost:8080/test/ProcessorTest';
            break;
        }

        console.log("endpoint: " + endpoint)
        
        try {
          let response = await fetch(endpoint, {
            method: 'GET',
          });
    
          let data = await response.text();
          console.log(data);
        } catch (error) {
          console.error("Error running tests:", error);
        }
      };

    return (<Button onClick={runTests} style={{ margin: '8px' }}>Run tests</Button>);


}

export default TestButton;