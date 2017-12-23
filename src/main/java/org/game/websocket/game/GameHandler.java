package org.game.websocket.game;

import org.game.common.Const;
import org.game.component.JedisClient;
import org.game.pojo.websocket.Game;
import org.game.service.GameService;
import org.game.util.JsonUtils;
import org.game.util.StringUtil;
import org.game.websocket.BaseWebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.util.HashMap;
import java.util.Map;

@Component
public class GameHandler extends BaseWebSocket implements WebSocketHandler{

    //当MyWebSocketHandler类被加载时就会创建该Map，随类而生
    public static final Map<String,WebSocketSession> userSocketSessionMap;
    static {
        userSocketSessionMap = new HashMap<String, WebSocketSession>();
    }

    @Autowired
    private GameService service;
    @Autowired
    private JedisClient jedisClient;

    //握手实现连接后
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        System.out.println("game " + webSocketSession.getId() + "加入");

        if (userSocketSessionMap.get("session") == null) {
            userSocketSessionMap.put("session", webSocketSession);
        }

        String waitCount = String.valueOf(jedisClient.scard(Const.WAIT_USER_OPENID_SET));

        String clickCount = "0";

        while (true){
            try{
                clickCount  = jedisClient.get(Const.USER_CLICK_COUNT);
                if(StringUtil.isBlank(clickCount)){
                    clickCount = "0";
                }
                Game game = service.startGame();
                game.setClickCount(clickCount);
                game.setCount(waitCount);
                TextMessage textMessage = new TextMessage(JsonUtils.objectToJson(game));
                if(userSocketSessionMap.size() == 0){
                    break;
                }
                sendMessageToUser(textMessage);
                Thread.sleep(5000);
            }catch (Exception e){
                e.printStackTrace();
                break;
            }

        }
//        TextMessage message = new TextMessage("发送");
//        sendMessageToUser(message);
    }


    //发送信息前的处理
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {

    }

     public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
        try {
            afterConnectionClosed(webSocketSession,new CloseStatus(1001));
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 在此刷新页面就相当于断开WebSocket连接,原本在静态变量userSocketSessionMap中的
     * WebSocketSession会变成关闭状态(close)，但是刷新后的第二次连接服务器创建的
     * 新WebSocketSession(open状态)又不会加入到userSocketSessionMap中,所以这样就无法发送消息
     * 因此应当在关闭连接这个切面增加去除userSocketSessionMap中当前处于close状态的WebSocketSession，
     * 让新创建的WebSocketSession(open状态)可以加入到userSocketSessionMap中
     * @param webSocketSession
     * @param closeStatus
     * @throws Exception
     */
    public void afterConnectionClosed(WebSocketSession webSocketSession, CloseStatus closeStatus) throws Exception {
        synchronized (userSocketSessionMap){
            try {
                if(webSocketSession.isOpen()){
                    webSocketSession.close();
                }
                userSocketSessionMap.clear();
                webSocketSession.close();
                System.out.println("game" + webSocketSession.getId() + "已经移除");

            }catch (Exception e){
                e.printStackTrace();
            }
        }

    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //发送信息的实现
    public  void sendMessageToUser(TextMessage message)
            throws Exception {
        WebSocketSession session = userSocketSessionMap.get("session");
        synchronized (userSocketSessionMap){
            if (session != null && session.isOpen()) {
                session.sendMessage(message);
            }
        }
    }
}