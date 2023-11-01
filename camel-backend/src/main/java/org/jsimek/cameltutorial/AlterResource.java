package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;


@ApplicationScoped
@Path("/alter")
public class AlterResource {

    @GET
    public String alterMessage(@QueryParam("message") String message) {
        return message + " Altered";
    }
}
