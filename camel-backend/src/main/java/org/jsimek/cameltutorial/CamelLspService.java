package org.jsimek.cameltutorial;

import io.quarkus.runtime.StartupEvent;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Destroyed;
import javax.enterprise.event.Observes;
import java.io.*;

@ApplicationScoped
public class CamelLspService {

    private Process process;
    private File jarFile;
    private static final Logger LOGGER = Logger.getLogger(CamelLspService.class);

    void onStart(@Observes StartupEvent ev) {
        LOGGER.info("Strarting camel LSP");
        try {
            jarFile = File.createTempFile("camel-lsp-server", ".jar");
            jarFile.deleteOnExit();
            try (InputStream is = Thread.currentThread().getContextClassLoader().getResourceAsStream("camel-lsp-server-1.14.0-SNAPSHOT.jar");
                 OutputStream os = new FileOutputStream(jarFile)) {
                if (is == null) {
                    throw new FileNotFoundException("Camel LSP jar file not found in resources");
                }
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = is.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }

            process = new ProcessBuilder("java", "-jar", jarFile.getPath(), "--websocket").start();
            LOGGER.info("Camel LSP started");
        } catch (IOException e) {
            throw new RuntimeException("Failed to start Camel LSP", e);
        }
    }

    void onStop(@Observes @Destroyed(ApplicationScoped.class) Object init) {
        process.destroy();
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to stop camel lsp", e);
        }

        if (jarFile != null && jarFile.exists()) {
            jarFile.delete();
        }
    }
}