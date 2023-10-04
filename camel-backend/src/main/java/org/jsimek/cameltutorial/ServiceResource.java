package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.jboss.logging.Logger;
import software.tnb.common.service.ServiceFactory;
import software.tnb.db.postgres.resource.local.LocalPostgreSQL;
import software.tnb.kafka.service.Kafka;
import software.tnb.common.service.Service;

import java.util.HashMap;
import java.util.Map;

@Path("/services")
@ApplicationScoped
public class ServiceResource {
    private static final Logger LOGGER = Logger.getLogger(ServiceResource.class);
    private static final Map<String, Service> registeredServices = new HashMap<>();


    @POST
    @Path("/deployKafka")
    public boolean deployKafka() {
        LOGGER.info("triggered kafka deploy");
        if (registeredServices.containsKey("Kafka")) {
            LOGGER.warn("Kafka already deployed. New deployment cancelled");
            return false;
        }
        try {
            Kafka kafka = ServiceFactory.create(Kafka.class);
            kafka.beforeAll(null);
            registeredServices.put("Kafka", kafka);
            LOGGER.info("Kafka successful: " + kafka.bootstrapServers());
        } catch (Exception e) {
            LOGGER.error("No Kafka 4 u, mf\n" + e);
            return false;
        }
        return true;
    }

    @DELETE
    @Path("/destroyKafka")
    public boolean destroyKafka() {
        LOGGER.info("triggered destroy Kafka");
        if (registeredServices.containsKey("Kafka")) {
            Kafka kafka = (Kafka) registeredServices.get("Kafka");
            try {
                kafka.afterAll(null);
            } catch (Exception e) {
                LOGGER.error("I cannot do that: \n" + e);
                return false;
            }

        }
        return true;
    }

    @POST
    @Path("/deployPostgre")
    public boolean deployPostgre() {
        LOGGER.info("triggered PostgreSQL deploy");
        if (registeredServices.containsKey("Postgre")) {
            LOGGER.warn("PostgreSQL already deployed. New deployment cancelled");
            return false;
        }
        try {
            LocalPostgreSQL postgre = ServiceFactory.create(LocalPostgreSQL.class);
            postgre.beforeAll(null);
            registeredServices.put("Postgre", postgre);
            LOGGER.info("PostgreSQL successful: " + postgre.hostname() + postgre.port());
        } catch (Exception e) {
            LOGGER.error("No DB 4 u, mf\n" + e);
            return false;
        }
        return true;
    }

    @DELETE
    @Path("/flush")
    public boolean destroy() {
        LOGGER.info("triggered flush");
        for (Service service : registeredServices.values() ) {
            try {
                registeredServices.remove(service);
                service.afterAll(null);
                LOGGER.info("Destroying: " + service.toString());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return true;
    }
}
