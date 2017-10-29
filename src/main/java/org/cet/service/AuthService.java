package org.cet.service;

import org.cet.component.JedisClient;
import org.cet.pojo.mysql.Bind;
import org.cet.pojo.openid.SnsapiUserInfo;
import org.cet.pojo.websocket.Game;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

/**
 * @Author zhang
 * @Date 2017/10/7 21:54
 * @Content
 */
public interface AuthService {
    public boolean isBind(SnsapiUserInfo snsapiUserInfo);
    public void addLuckUser(SnsapiUserInfo snsapiUserInfo,int type);
    public String processWaitGame(String key, String countKey, String backKey, JedisClient js);
    public Game startGame(String gameKey,String countKey,JedisClient js);
    public java.util.List<Bind> getBackLuckMan(int needBackCount, int type);
}
