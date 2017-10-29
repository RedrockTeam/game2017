package org.cet.websocket;

import org.cet.component.JedisClient;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * @Author zhang
 * @Date 2017/10/9 20:23
 * @Content
 */
public class WaitGameInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Map<String, Object> map) throws Exception {
        String uri = String.valueOf(serverHttpRequest.getURI());
        try {
            String type = uri.split("=")[1];
            if(type == null || "".equals(type.trim())){
                return false;
            }
            if(WaitGameWebSocketHandler.userSocketSessionMap.get(Integer.parseInt(type)) != null){
                return false;
            }
            JedisClient js = new JedisClient();
            synchronized (this){
                js.set("wait",type);
            }
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Exception e) {

    }
}
