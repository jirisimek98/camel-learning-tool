package org.jsimek.cameltutorial;

import javax.enterprise.context.ApplicationScoped;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
@ServerEndpoint("/ws/logs")
public class LogWebSocket {

    private final Set<Session> sessions = Collections.newSetFromMap(new ConcurrentHashMap<Session, Boolean>());

    @OnOpen
    public void onOpen(Session session) {

        sessions.add(session);

    }

    @OnClose
    public void onClose(Session session) {
        sessions.remove(session);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        sessions.remove(session);
        throwable.printStackTrace();
    }

    public void sendMessage(String message) {
        sessions.forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.getAsyncRemote().sendObject(message);
                }
            } catch (Exception e) {
                e.printStackTrace();
                sessions.remove(session);
            }
        });
    }
}