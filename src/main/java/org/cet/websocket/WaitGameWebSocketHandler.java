package org.cet.websocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.cet.common.Const;
import org.cet.component.JedisClient;
import org.cet.pojo.websocket.Message;
import org.cet.service.AuthService;
import org.omg.CORBA.CODESET_INCOMPATIBLE;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.io.IOException;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Timer;

/**
 * @Author zhang
 * @Date 2017/10/9 20:24
 * @Content
 */
@Component
public class WaitGameWebSocketHandler implements WebSocketHandler {

    @Autowired
    private AuthService authService;
    //当MyWebSocketHandler类被加载时就会创建该Map，随类而生
    public static final Map<Integer, WebSocketSession> userSocketSessionMap;
    public static JedisClient js;
    static {
        userSocketSessionMap = new HashMap<Integer, WebSocketSession>();
        js = new JedisClient();
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {
        System.out.println("waitGame " + webSocketSession.getId() + "加入");
        String str = js.get("wait");
        if(null == str || "".equals(str.trim())){
            return;
        }
        synchronized (this){
            js.del("wait");
        }
        int wait = Integer.parseInt(str);
        if (userSocketSessionMap.get(wait) == null) {
            userSocketSessionMap.put(wait, webSocketSession);
        }
        String waitKey = null;
        String countKey = null;
        String backKey = null;
        if(wait == 1){
            waitKey = Const.HUICHANG_ONE_WAIT_USER;
            countKey = Const.HUICHANG_ONE_WAIT_COUNT;
            backKey = Const.HUICHANG_ONE_USER;
        }else if(wait == 2){
            waitKey = Const.HUICHANG_TWO_WAIT_USER;
            countKey = Const.HUICHANG_TWO_WAIT_COUNT;
            backKey = Const.HUICHANG_TWO_USER;
        }
        js.del(countKey);
        Boolean flag = true;
        while (true){
            try {
            String json = authService.processWaitGame(waitKey,countKey,backKey,js);
            TextMessage textMessage = new TextMessage(json);
            sendMessageToUser(wait,textMessage);
            if(flag){
                flag = false;
                continue;
            }
            Thread.sleep(3000);
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
            for (Integer wait:userSocketSessionMap.keySet()) {
                WebSocketSession ws = userSocketSessionMap.get(wait);
                if(ws == webSocketSession){
                    userSocketSessionMap.remove(wait);
                    System.out.println("wait" + wait + "已经移除");
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
            System.out.println("WebSocket:"+webSocketSession.getAttributes().get("wait")+"close connection");
            for (Integer wait:userSocketSessionMap.keySet()) {
                WebSocketSession ws = userSocketSessionMap.get(wait);
                if(ws == webSocketSession){
                    userSocketSessionMap.remove(wait);
                    System.out.println("wait" + wait + "已经移除");
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
