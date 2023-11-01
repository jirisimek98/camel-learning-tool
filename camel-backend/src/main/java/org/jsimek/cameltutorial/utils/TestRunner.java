package org.jsimek.cameltutorial.utils;

import org.jboss.logging.Logger;
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunner {

    private static final Logger LOGGER = Logger.getLogger("TESTS");
    public static void runTestClass(Class<?> c) {
        Result result = JUnitCore.runClasses(c);
        for (Failure failure : result.getFailures()) {
            System.err.println(failure.toString());
        }
        if (result.wasSuccessful()) {
            LOGGER.info("\u001B[32m" + "TESTS PASSED SUCCESSFULLY" + "\u001B[0m");
        } else {
            LOGGER.error("\u001B[31m" + "TESTS FAILED!" + "\u001B[0m");
        }
    }
}
