package org.jsimek.cameltutorial.tests;

import io.restassured.RestAssured;
import org.junit.Test;

import java.util.concurrent.TimeUnit;

import static org.testcontainers.shaded.org.awaitility.Awaitility.await;

public class KafkaTest {

    @Test
    public void testKafka() {
        await().atMost(10, TimeUnit.SECONDS).until(() -> {
            String message = RestAssured.get("/example").asString();
            return message != null && message.contains("Message #");
        });
    }
}
