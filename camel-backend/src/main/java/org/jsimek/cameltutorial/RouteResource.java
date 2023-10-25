package org.jsimek.cameltutorial;

import org.apache.camel.CamelContext;
import org.apache.camel.Route;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.dsl.java.joor.CompilationUnit;
import org.apache.camel.dsl.java.joor.MultiCompile;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.File;
import java.util.Arrays;
import java.util.stream.Collectors;

import org.jboss.logging.Logger;


@Path("/routes")
@ApplicationScoped
public class RouteResource {

    @Inject
    CamelContext context;

    private static final Logger LOGGER = Logger.getLogger(RouteResource.class);

    @POST
    @Path("/add")
    @Consumes(MediaType.TEXT_PLAIN)
    public Response addRoute(String javaSource) {
        try {
            System.setProperty("java.class.path", getClassPath());
            CompilationUnit compilationUnit = CompilationUnit.input();
            String className = "RouteBuilderImpl";
            compilationUnit.addClass(className, javaSource);
            CompilationUnit.Result compilationResult = MultiCompile.compileUnit(compilationUnit);
            Class<?> compiledClass = compilationResult.getClass(className);
            if (compiledClass == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Shit sucks, man...").build();
            }

            RouteBuilder builder = (RouteBuilder) compiledClass.getDeclaredConstructor().newInstance();
            context.addRoutes(builder);
            LOGGER.info("Route added successfully");
            return Response.ok().build();
        } catch (Exception e) {
            LOGGER.error("Bad class:" + javaSource);
            LOGGER.error("failed compilation", e);
            e.printStackTrace();
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
        }

    }

    private String getClassPath() {
        var libFolder = new File("target/quarkus-app/lib/main");
        return Arrays.stream(libFolder.list()).map(s -> libFolder.getAbsolutePath() + "/" + s).collect(Collectors.joining(":"));
    }

    @DELETE
    @Path("/delete")
    public Response deleteRoutes() {
        for (Route route : context.getRoutes()) {
            try {
                context.getRouteController().stopRoute(route.getId());
                context.removeRoute(route.getId());
            } catch (Exception e) {
                LOGGER.error("Error removing the route.", e);
            }
        }
        LOGGER.info("Routes removed");
        return Response.ok().build();
    }
}
