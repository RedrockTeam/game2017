package org.cet.websocket;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.beans.factory.annotation.Autowired;
/**
 * Component注解告诉SpringMVC该类是一个SpringIOC容器下管理的类
 * 其实@Controller, @Service, @Repository是@Component的细化
 */
@Component
@EnableWebSocket
public class MyWebSocketConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

    @Autowired
    MyWebSocketHandler gameHandler;
    @Autowired
    WaitGameWebSocketHandler waitGame;

    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {

        //添加websocket处理器，添加握手拦截器
        webSocketHandlerRegistry.addHandler(gameHandler, "/game").addInterceptors(new MyHandShakeInterceptor());
        webSocketHandlerRegistry.addHandler(waitGame, "/wait").addInterceptors(new WaitGameInterceptor());

        //添加websocket处理器，添加握手拦截器
        webSocketHandlerRegistry.addHandler(gameHandler,"/game/sockjs").addInterceptors(new MyHandShakeInterceptor()).withSockJS();
        webSocketHandlerRegistry.addHandler(waitGame,"/wait/sockjs").addInterceptors(new WaitGameInterceptor()).withSockJS();
    }
}