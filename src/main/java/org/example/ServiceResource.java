package org.example;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import software.tnb.common.service.ServiceFactory;
import software.tnb.kafka.service.Kafka;
import software.tnb.common.service.Service;

import java.util.HashSet;
import java.util.Set;

@ApplicationScoped
public class ServiceResource {
    private static final Set<Service> registeredServices = new HashSet<>();


    @POST
    @Path("/kafka/deploy")
    public boolean deployKafka() {
        Kafka kafka = ServiceFactory.create(Kafka.class);
        registeredServices.add(kafka);
        return true;
    }

    @DELETE
    @Path("service/flush")
    public boolean destroy() {
        for (Service service : registeredServices ) {
            try {
                registeredServices.remove(service);
                service.afterAll(null);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return true;
    }
}
