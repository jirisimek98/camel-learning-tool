package org.jsimek.cameltutorial.tests;

import org.junit.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.lessThan;

public class ProcessorTest {

    @Test
    public void testProcessor() {
        given()
                .queryParam("message", "hello world")
                .when()
                .get("/trigger/processor")
                .then()
                .statusCode(200)
                .body(equalTo("HELLO WORLD"))
                .time(lessThan(3000L));
    }
}
