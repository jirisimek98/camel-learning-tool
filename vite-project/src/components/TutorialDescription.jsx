import { useLocation } from "react-router-dom";

const TutorialDescription = () => {

    const location = useLocation();

    const getName = () => {
        let name;

        switch(location.pathname) {
            case '/tutorials/kafka':
              name = 'Kafka Tutorial';
              break;
            case '/tutorials/httpLog':
              name = 'HTTP Log Tutorial';
              break;
            case '/tutorials/httpLogEndpoint':
              name = 'HTTP Log with Endpoint DLS';
              break;
          }

        return name;
    }

    const getContent = () => {
        let content = 'Stuff'
        return content;
    }


    return (
        <div>
            <h1>{getName()}</h1>
            <p>{getContent()}</p>
        </div>
    )
}

export default TutorialDescription;