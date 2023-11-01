package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import org.apache.camel.CamelContext;
import org.apache.camel.component.file.remote.FtpComponent;
import org.apache.camel.component.kafka.KafkaComponent;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.KafkaAdminClient;
import org.jboss.logging.Logger;
import software.tnb.common.service.ServiceFactory;
import software.tnb.db.postgres.resource.local.LocalPostgreSQL;
import software.tnb.db.postgres.service.PostgreSQL;
import software.tnb.ftp.ftp.service.FTP;
import software.tnb.kafka.service.Kafka;
import software.tnb.common.service.Service;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

@Path("/services")
@ApplicationScoped
public class ServiceResource {
    private static final Logger LOGGER = Logger.getLogger(ServiceResource.class);
    private static final Map<String, Service> registeredServices = new HashMap<>();

    @Inject
    CamelContext context;

    public boolean isKafkaReady(Kafka kafka) {
        Properties props = new Properties();
        props.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, kafka.bootstrapServers());

        try (AdminClient adminClient = KafkaAdminClient.create(props)) {
            adminClient.listTopics();
            return true;
        } catch (Exception e) {
            LOGGER.error("Kafka is not ready: " + e);
            return false;
        }
    }

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

            long startTime = System.currentTimeMillis();
            long timeout = 60000;
            KafkaComponent kafkaComponent = (KafkaComponent) context.getComponent("kafka");
            kafkaComponent.getConfiguration().setBrokers(kafka.bootstrapServers());
            LOGGER.info("\u001B[32m" + "Kafka deployed successfully:" + "\u001B[0m" + kafka.bootstrapServers());
            context.getGlobalOptions().put("camel.component.kafka.brokers", kafka.bootstrapServers());
            context.getGlobalOptions().put("kafka.topic.name", "test");
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
                registeredServices.remove("Kafka");
                kafka.afterAll(null);
            } catch (Exception e) {
                LOGGER.error("I cannot do that: \n" + e);
                return false;
            }

        }
        return true;
    }

    public boolean isPostgreReady(LocalPostgreSQL postgre) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(postgre.hostname(), postgre.port()), 1000);
            return true;
        } catch (IOException e) {
            LOGGER.error("PostgreSQL is not ready: " + e);
        }
        return false;
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
            LOGGER.info("\u001B[32m" + "Postgre deployed successfully:" + "\u001B[0m" + postgre.hostname() + ":"+ postgre.port());

        } catch (Exception e) {
            LOGGER.error("No DB 4 u, mf\n" + e);
            return false;
        }
        return true;
    }

    @DELETE
    @Path("/destroyPostgre")
    public boolean destroyPostgre() {
        LOGGER.info("triggered destroy Postgre");
        if (registeredServices.containsKey("Postgre")) {
            PostgreSQL postgre = (LocalPostgreSQL) registeredServices.get("Postgre");
            try {
                registeredServices.remove("Postgre");
                postgre.afterAll(null);
            } catch (Exception e) {
                LOGGER.error("I cannot do that: \n" + e);
                return false;
            }

        }
        return true;
    }

    @POST
    @Path("/deployFTP")
    public boolean deployFTPServer() {
        LOGGER.info("triggered PostgreSQL deploy");
        if (registeredServices.containsKey("FTP")) {
            LOGGER.warn("FTP server already deployed. New deployment cancelled");
            return false;
        }
        try {
            FTP ftp = ServiceFactory.create(FTP.class);
            ftp.beforeAll(null);
            registeredServices.put("FTP", ftp);
            LOGGER.info("\u001B[32m" + "FTP deployed successfully:" + "\u001B[0m" + ftp.host() + ":" + ftp.port());

        } catch (Exception e) {
            LOGGER.error("No DB 4 u, mf\n" + e);
            return false;
        }
        return true;
    }

    @DELETE
    @Path("/destroyFTP")
    public boolean destroyFTPServer() {
        LOGGER.info("triggered destroy FTP");
        if (registeredServices.containsKey("FTP")) {
            FTP ftp = (FTP) registeredServices.get("FTP");
            try {
                registeredServices.remove("FTP");
                ftp.afterAll(null);
            } catch (Exception e) {
                LOGGER.error("I cannot do that: \n" + e);
                return false;
            }

        }
        return true;
    }

    @DELETE
    @Path("/flush")
    public boolean destroy() {
        LOGGER.info("triggered flush");
        for (String service : registeredServices.keySet() ) {
            try {
                Service s = registeredServices.get(service);
                registeredServices.remove(service);
                s.afterAll(null);
                LOGGER.info("Destroying: " + service);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return true;
    }
}
