package org.jsimek.cameltutorial;

import org.apache.camel.ProducerTemplate;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;

@ApplicationScoped
@Path("/trigger")
public class TriggerResource {

    @Inject
    ProducerTemplate producerTemplate;

    @GET
    @Path("/enrich")
    public String triggerEnrichRoute(@QueryParam("message") String message) {
        return producerTemplate.requestBody("direct:enrichStart", message, String.class);
    }

    @GET
    @Path("/processor")
    public String triggerProcessorRoute(@QueryParam("message") String message) {
        return producerTemplate.requestBody("direct:processorStart", message, String.class);
    }
}