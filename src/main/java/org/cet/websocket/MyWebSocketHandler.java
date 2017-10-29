package org.cet.websocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.cet.common.Const;
import org.cet.component.JedisClient;
import org.cet.pojo.websocket.Game;
import org.cet.pojo.websocket.Message;
import org.cet.service.AuthService;
import org.cet.util.HttpClientUtil;
import org.cet.util.JsonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;

@Component
public class MyWebSocketHandler implements WebSocketHandler{

    //当MyWebSocketHandler类被加载时就会创建该Map，随类而生
    public static final Map<Integer, WebSocketSession> userSocketSessionMap;
    public static JedisClient js;
    public static String count = null;
    static {
        userSocketSessionMap = new HashMap<Integer, WebSocketSession>();
        js = new JedisClient();
    }

    @Autowired
    private AuthService authService;

    //握手实现连接后
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        System.out.println("game " + webSocketSession.getId() + "加入");
        String str = js.get("type");
        if(null == str || "".equals(str.trim())){
            return;
        }
        synchronized (this){
            js.del("type");
        }
        int type = Integer.parseInt(str);
        if (userSocketSessionMap.get(type) == null) {
            userSocketSessionMap.put(type, webSocketSession);
        }

        String gameKey = null;
        String countKey = null;
        if(type == 1){
            gameKey = Const.HUICHANG_ONE_USER;
            countKey = Const.HUICHANG_ONE_WAIT_COUNT;
        }else{
            gameKey = Const.HUICHANG_TWO_USER;
            countKey = Const.HUICHANG_TWO_WAIT_COUNT;
        }
        count = js.get(countKey);
        if(null == count || "".equals(count.trim())){
            count = "0";
        }
        String url = "http://localhost:8080/cet/count?type=" + type;
        String flushDB = "http://localhost:8080/cet/flushdb?type=" + type;
        HttpClientUtil.doGet(flushDB);
        String clickCount = "0";

        while (true){
            try{
                clickCount  = HttpClientUtil.doGet(url);
                if(null == clickCount || "".equals(clickCount.trim())){
                    clickCount = "0";
                }
                Game game = authService.startGame(gameKey,countKey,js);
                game.setClickCount(clickCount);
                game.setCount(count);
                TextMessage textMessage = new TextMessage(JsonUtils.objectToJson(game));
                sendMessageToUser(type,textMessage);
                Thread.sleep(500);
            }catch (Exception e){
                e.printStackTrace();
                break;
            }

        }

    }


    //发送信息前的处理
    public void handleMessage(WebSocketSession webSocketSession, WebSocketMessage<?> webSocketMessage) throws Exception {

        if(webSocketMessage.getPayloadLength()==0)return;

        //得到Socket通道中的数据并转化为Message对象
        Message msg=new Gson().fromJson(webSocketMessage.getPayload().toString(),Message.class);

        Timestamp now = new Timestamp(System.currentTimeMillis());
        msg.setMessageDate(now);
        //将信息保存至数据库

        //发送Socket信息
        sendMessageToUser(msg.getToId(), new TextMessage(new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().toJson(msg)));
    }

    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {
        try {
            if(webSocketSession.isOpen()){
                webSocketSession.close();
            }
            for (Integer game:userSocketSessionMap.keySet()) {
                WebSocketSession ws = userSocketSessionMap.get(game);
                if(ws == webSocketSession){
                    userSocketSessionMap.remove(game);
                    System.out.println("game" + game + "已经移除");
                }
            }
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
        try {
            System.out.println("WebSocket:"+webSocketSession.getAttributes().get("type")+"close connection");
            for (Integer game:userSocketSessionMap.keySet()) {
                WebSocketSession ws = userSocketSessionMap.get(game);
                if(ws == webSocketSession){
                    userSocketSessionMap.remove(game);
                    System.out.println("wait" + game + "已经移除");
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //发送信息的实现
    public void sendMessageToUser(int type, TextMessage message)
            throws Exception {
        WebSocketSession session = userSocketSessionMap.get(type);
        if (session != null && session.isOpen()) {
                session.sendMessage(message);
        }
    }
}