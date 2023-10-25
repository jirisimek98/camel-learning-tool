package org.jsimek.cameltutorial;

import io.quarkus.logging.Log;
import org.javacs.Main;
import org.javacs.lsp.LSP;
import org.javacs.streams.IOReader;
import org.javacs.streams.IOWriter;
import org.json.JSONObject;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@ServerEndpoint("/ws/javaLSP")
public class JavaLSPWebSocket {

    private Thread thread;

    @OnOpen
    public void onOpen(Session session) {
        LSP.headersEnabled = false;
        if (thread != null && thread.isAlive()) {
            thread.interrupt();
        }
        var reader = new IOReader();
        var writer = new IOWriter((String s) -> {
            if (s.startsWith("Content-Length:")) {
                return;
            }
            session.getAsyncRemote().sendText(s);
        });
        thread = new Thread(() -> {
            Main.runEmbedded(reader, writer);
        });
        thread.setDaemon(true);
        thread.start();
        session.addMessageHandler(String.class, s -> {
            JSONObject message = new JSONObject(s);
            if (message.getString("method").equals("initialize")) {
                JSONObject params = message.getJSONObject("params");
                params.put("rootPath", System.getProperty("user.dir"));
                params.put("rootUri", "file://" + System.getProperty("user.dir"));
            }
            s = message.toString();
            reader.write(s + "\r\n");
        });
    }

    @OnClose
    public void onClose(Session session) {
        if (thread != null && thread.isAlive()) {
            thread.interrupt();
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        throwable.printStackTrace();
    }

}