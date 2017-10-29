package org.cet.websocket;

import org.cet.component.JedisClient;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.server.HandshakeInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * websocket握手拦截器
 * 拦截握手前，握手后的两个切面
 */
public class MyHandShakeInterceptor implements HandshakeInterceptor {

    public boolean beforeHandshake(ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse, WebSocketHandler webSocketHandler, Map<String, Object> map) throws Exception {
        String uri = String.valueOf(serverHttpRequest.getURI());
        try {
            String type = uri.split("=")[1];
            if(type == null || "".equals(type.trim())){
                return false;
            }
            if(MyWebSocketHandler.userSocketSessionMap.get(Integer.parseInt(type)) != null){
                return false;
            }
            JedisClient js = new JedisClient();
            synchronized (this){
                js.set("type",type);
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