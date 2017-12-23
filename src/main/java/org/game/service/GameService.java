package org.game.service;

import org.game.component.JedisClient;
import org.game.pojo.mysql.Bind;
import org.game.pojo.openid.SnsapiUserInfo;
import org.game.pojo.websocket.Game;

import java.util.List;

/**
 * @Author zhang
 * @Date 2017/10/7 21:54
 * @Content
 */
public interface GameService {
    public Bind addLuckUser(SnsapiUserInfo snsapiUserInfo);
    public String processWaitGame();
    public Game startGame();
    List<Bind> getBackLuckUser(int leftCount);
    public void cleanBackLuckUser();
}
