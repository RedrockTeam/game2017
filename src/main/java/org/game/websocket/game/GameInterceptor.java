package org.game.websocket.game;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * websocket握手拦截器
 * 拦截握手前，握手后的两个切面
 */
public class GameInterceptor implements HandshakeInterceptor {

    public boolean beforeHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Map<String, Object> map) throws Exception {

        try {
            if(GameHandler.userSocketSessionMap.get("session") != null){
                return false;
            }
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public void afterHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Exception e) {

    }
}