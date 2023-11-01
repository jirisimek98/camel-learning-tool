package org.jsimek.cameltutorial.tests;

import org.junit.Test;


import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.lessThan;

public class EnrichRouteTest {

    @Test
    public void testEnrichRoute() {
        given()
                .queryParam("message", "Original Message")
                .when()
                .get("/trigger/enrich")
                .then()
                .statusCode(200)
                .body(equalTo("Original Message Altered"))
                .time(lessThan(3000L));
    }
}