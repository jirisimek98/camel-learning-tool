package org.jsimek.cameltutorial.tutorials;

import org.apache.camel.ConsumerTemplate;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@ApplicationScoped
@Path("example")
public class KafkaResource {

    @Inject
    ConsumerTemplate consumerTemplate;

    @GET
    public String getMessages() {
        return consumerTemplate.receiveBody("seda:kafka-messages", 10000, String.class);
    }
}