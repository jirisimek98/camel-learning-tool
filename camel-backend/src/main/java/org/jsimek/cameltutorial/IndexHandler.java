package org.jsimek.cameltutorial;


import org.apache.commons.io.IOUtils;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@ApplicationScoped
@Path("/")
public class IndexHandler {

    @GET
    @Produces("text/html")
    @Path("/playground")
    public String getIndex() throws IOException {
        return IOUtils.toString(getClass().getResource("/META-INF/resources/index.html").openStream(), StandardCharsets.UTF_8);
    }

    @Path("/tutorials/{name}")
    @GET
    @Produces("text/html")
    public String getTutorial(String name) throws IOException {
        return getIndex();
    }

}
