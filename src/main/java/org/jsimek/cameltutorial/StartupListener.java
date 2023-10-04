package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import io.quarkus.runtime.StartupEvent;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

@ApplicationScoped
public class StartupListener {

    @Inject
    LogWebSocket logWebSocket;

    void onStart(@Observes StartupEvent ev) {
        redirectSystemOut();
    }
    private List<LogRecord> records = new ArrayList<>();

    private void setupLoggers(){


        Logger global = Logger.getGlobal();
        while (global.getParent() != null){
            global = global.getParent();
        }
        global.addHandler(new java.util.logging.Handler() {
            @Override
            public void publish(LogRecord record) {
                records.add(record);
                logWebSocket.sendMessage(records.toString());
            }

            @Override
            public void flush() {

            }

            @Override
            public void close() throws SecurityException {

            }
        });
    }

    private void redirectSystemOut() {
        PrintStream originalOut = System.out;
        Object lock = new Object();

        System.setOut(new PrintStream(new OutputStream() {
            private ByteArrayOutputStream outputStream = new ByteArrayOutputStream();



            @Override
            public void write(int b) throws IOException {
                synchronized (lock) {
                    throw new RuntimeException("asdf");
//                    originalOut.write(b);
//                    if (b == '\n') {
//                        try {
//                            logWebSocket.sendMessage(outputStream.toString());
//                        } catch (Exception e) {
//                            e.printStackTrace(originalOut);
//                        } finally {
//                            outputStream.reset();
//                        }
//                    } else {
//                        outputStream.write(b);
//                    }
                }
            }
        }));
    }
}