package org.game.websocket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.game.pojo.websocket.Message;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;

import java.sql.Timestamp;

/**
 * @Author zhang
 * @Date 2017/12/16 14:54
 * @Content
 */
public class BaseWebSocket {

    //握手实现连接后
    public void afterConnectionEstablished(WebSocketSession webSocketSession) throws Exception {

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
        sendMessageToUser(new TextMessage(new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create().toJson(msg)));
    }

    public void handleTransportError(WebSocketSession webSocketSession, Throwable throwable) throws Exception {

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

    }

    public boolean supportsPartialMessages() {
        return false;
    }

    //发送信息的实现
    public void sendMessageToUser(TextMessage message)
            throws Exception {
    }
}
