package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;

import io.quarkus.runtime.StartupEvent;
import org.jsimek.cameltutorial.utils.LSPFilter;
import org.jsimek.cameltutorial.utils.LogFormatter;

import java.io.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.logging.Handler;
import java.util.logging.LogRecord;
import java.util.logging.Logger;

@ApplicationScoped
public class StartupListener {

    @Inject
    LogWebSocket logWebSocket;

    private static final org.jboss.logging.Logger LOGGER = org.jboss.logging.Logger.getLogger(StartupListener.class);

    void onStart(@Observes StartupEvent ev) {

        setupLoggers();
        redirectSystemOut();

    }

    private List<LogRecord> records = new CopyOnWriteArrayList<>();

    private void setupLoggers(){

        Logger rootLogger = Logger.getLogger("");
        while (rootLogger.getParent() != null){
            rootLogger = rootLogger.getParent();
        }
        Handler handler = new Handler() {
            @Override
            public void publish(LogRecord record) {
                if (!record.getLoggerName().equals("main")) {
                    String m = getFormatter().format(record);
                    logWebSocket.sendMessage(m);
                }
            }

            @Override
            public void flush() {

            }

            @Override
            public void close() throws SecurityException {

            }
        };
        handler.setFormatter(new LogFormatter());
        handler.setFilter(new LSPFilter());
        rootLogger.addHandler(handler);
        Logger.getGlobal().addHandler(handler);
    }

    private void redirectSystemOut() {
        PrintStream originalOut = System.out;
        Object lock = new Object();

        System.setOut(new PrintStream(new OutputStream() {
            private ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            @Override
            public void write(int b) throws IOException {
                synchronized (lock) {
                    originalOut.write(b);
                    if (b == '\n') {
                        try {
                            logWebSocket.sendMessage(outputStream.toString());
                        } catch (Exception e) {
                            e.printStackTrace(originalOut);
                        } finally {
                            outputStream.reset();
                        }
                    } else {
                        outputStream.write(b);
                    }
                }
            }
        }));
    }

    private void redirectSystemErr() {
        PrintStream originalOut = System.err;
        Object lock = new Object();

        System.setErr(new PrintStream(new OutputStream() {
            private ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

            @Override
            public void write(int b) throws IOException {
                synchronized (lock) {
                    originalOut.write(b);
                    if (b == '\n') {
                        try {
                            logWebSocket.sendMessage(outputStream.toString());
                        } catch (Exception e) {
                            e.printStackTrace(originalOut);
                        } finally {
                            outputStream.reset();
                        }
                    } else {
                        outputStream.write(b);
                    }
                }
            }
        }));
    }
}