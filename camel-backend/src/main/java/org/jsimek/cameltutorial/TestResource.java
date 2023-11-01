package org.jsimek.cameltutorial;

import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.RestPath;
import org.jsimek.cameltutorial.utils.TestRunner;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("/test/{test}")
@ApplicationScoped
public class TestResource {

    private static final Logger LOGGER = Logger.getLogger(TestResource.class);

    @GET
    public Response runTest(@RestPath String test) {
        LOGGER.info("Running tests: " + test);
        try {
            Class c = Class.forName("org.jsimek.cameltutorial.tests." + test);
            TestRunner.runTestClass(c);
            return Response.ok("Tests run successfully").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

}
