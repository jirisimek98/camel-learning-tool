package org.jsimek.cameltutorial.tests;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

import io.restassured.RestAssured;
import org.junit.Test;

import static org.testcontainers.shaded.org.awaitility.Awaitility.await;

public class HttpLogEndpointTest {

    @Test
    public void testHttpLog() {
        RestAssured.get("/camel/helloEndpoint")
                .then()
                .statusCode(200);

        await().atMost(10L, TimeUnit.SECONDS).pollDelay(1, TimeUnit.SECONDS).until(() -> {
            String log = new String(Files.readAllBytes(Paths.get("target/quarkus.log")), StandardCharsets.UTF_8);
            return log.contains("Camel runs sis");
        });
    }

}