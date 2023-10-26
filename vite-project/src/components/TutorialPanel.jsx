import { useLocation } from "react-router-dom";

const TutorialPanel = () => {
    const location = useLocation();

    const getContent = () => {
        let route;

        switch(location.pathname) {
            case '/tutorials/kafka':
              route = (`
              
              @Override
              public void configure() throws Exception {
                  // produces messages to kafka
                  from("timer:foo?period=10000&delay=10000")
                          .routeId("FromTimer2Kafka")
                          .setBody().simple("Message #\${exchangeProperty.CamelTimerCounter}")
                          .to("kafka:test")
                          .log("Message correctly sent to the topic! : \\\"\${body}\\\" ");
           
                  // kafka consumer
                  from("kafka:test")
                          .routeId("FromKafka2Seda")
                          .log("Received : \\\"\${body}\\\"")
                          .to("seda:kafka-messages");
              }`).trim();
              break;
            case '/tutorials/httpLog':
              route = '';
              break;
            case '/tutorials/httpLogEndpoint':
              route = 'HTTP Log with Endpoint DLS';
              break;
          }

        return route;
    }

    return (
        <div>
            Napis routu, kundo
            <p>{getContent()}</p>
        </div>
    )
}

export default TutorialPanel;