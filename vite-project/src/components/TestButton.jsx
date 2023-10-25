import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

function TestButton() {

    const location = useLocation();

    const runTests = async () => {

        let endpoint;
    
        switch(location.pathname) {
          case '/tutorials/kafka':
            endpoint = 'http://localhost:8080/test/BadTest';
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
          console.error("Error deleting routes:", error);
        }
      };

    return (<Button onClick={runTests} style={{ margin: '8px' }}>Run tests</Button>);


}

export default TestButton;