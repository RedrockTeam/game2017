package org.game.websocket;
import org.game.websocket.game.GameInterceptor;
import org.game.websocket.game.GameHandler;
import org.game.websocket.wait.WaitInterceptor;
import org.game.websocket.wait.WaitHandler;
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
public class WebSocketConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

    @Autowired
    GameHandler gameHandler;
    @Autowired
    WaitHandler waitGame;

    public void registerWebSocketHandlers(WebSocketHandlerRegistry webSocketHandlerRegistry) {

        //添加websocket处理器，添加握手拦截器
        webSocketHandlerRegistry.addHandler(gameHandler, "/game").addInterceptors(new GameInterceptor());
        webSocketHandlerRegistry.addHandler(waitGame, "/wait").addInterceptors(new WaitInterceptor());

        //添加websocket处理器，添加握手拦截器
        webSocketHandlerRegistry.addHandler(gameHandler,"/game/sockjs").addInterceptors(new GameInterceptor()).withSockJS();
        webSocketHandlerRegistry.addHandler(waitGame,"/wait/sockjs").addInterceptors(new WaitInterceptor()).withSockJS();
    }
}