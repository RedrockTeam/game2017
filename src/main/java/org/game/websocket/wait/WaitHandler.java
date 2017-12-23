package org.game.websocket.wait;

import org.game.service.GameService;
import org.game.websocket.BaseWebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @Author zhang
 * @Date 2017/10/9 20:24
 * @Content
 */
@Component
public class WaitHandler extends BaseWebSocket implements WebSocketHandler {

    @Autowired
    private GameService service;
    //当MyWebSocketHandler类被加载时就会创建该Map，随类而生
    public static final ConcurrentHashMap<String, WebSocketSession> waitSocketSessionMap;

    static {
        waitSocketSessionMap = new ConcurrentHashMap<String, WebSocketSession>();
    }
    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        System.out.println("waitGame " + webSocketSession.getId() + "加入");
        if (waitSocketSessionMap.get("session") == null) {
            waitSocketSessionMap.put("session", webSocketSession);
        }

        while (true){
            try {
                String json = service.processWaitGame();
                TextMessage textMessage = new TextMessage(json);
                if(!waitSocketSessionMap.get("session").isOpen() || null == waitSocketSessionMap.get(webSocketSession)){
                    break;
                }
                sendMessageToUser(textMessage);
                Thread.sleep(5000);
            }catch (Exception e){
                e.printStackTrace();
                break;
            }
        }
    }


    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
        try {
            if(webSocketSession.isOpen()){
                webSocketSession.close();
            }
            waitSocketSessionMap.remove("session");
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    /**
     * 在此刷新页面就相当于断开WebSocket连接,原本在静态变量waitSocketSessionMap中的
     * WebSocketSession会变成关闭状态(close)，但是刷新后的第二次连接服务器创建的
     * 新WebSocketSession(open状态)又不会加入到waitSocketSessionMap中,所以这样就无法发送消息
     * 因此应当在关闭连接这个切面增加去除waitSocketSessionMap中当前处于close状态的WebSocketSession，
     * 让新创建的WebSocketSession(open状态)可以加入到waitSocketSessionMap中
     * @param webSocketSession
     * @param closeStatus
     * @throws Exception
     */
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {
        try {
            if(webSocketSession.isOpen()){
                webSocketSession.close();
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //发送信息的实现
    public void sendMessageToUser(TextMessage message){
        WebSocketSession session = waitSocketSessionMap.get("session");
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(message);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }



}
