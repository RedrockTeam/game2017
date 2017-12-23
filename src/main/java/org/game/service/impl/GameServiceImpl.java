package org.game.service.impl;

import com.alibaba.fastjson.JSONObject;
import org.game.common.Const;
import org.game.component.JedisClient;
import org.game.dao.BindMapper;
import org.game.pojo.mysql.Bind;
import org.game.pojo.mysql.BindExample;
import org.game.pojo.openid.SnsapiUserInfo;
import org.game.pojo.websocket.Game;
import org.game.pojo.websocket.Wait;
import org.game.service.GameService;
import org.game.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

/**
 * @Author zhang
 * @Date 2017/10/7 21:15
 * @Content
 */
@Service
public class GameServiceImpl implements GameService {

    private static int index = 0;
    @Autowired
    private BindMapper mapper;
    @Autowired
    public JedisClient jedisClient;

    public Bind addLuckUser(SnsapiUserInfo user) {
//        String isBindURL = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=" + user.getOpenid();
        String isBindURL = "https://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=" + user.getOpenid();
        String json = HttpsUtil.get(isBindURL);
        JSONObject obj = JSONObject.parseObject(json);
        Bind bind = new Bind();
        bind.setOpenid(user.getOpenid());
        bind.setNickname(user.getNickname());
        bind.setHeadimgurl(user.getHeadimgurl());
        bind.setCreateTime(new Date());
        bind.setType("1");
        if (obj.getString("status").equals("200")) {
            JSONObject data = obj.getJSONObject("data");
            bind.setUsernumber(data.getString("usernumber"));
            bind.setRealname(data.getString("realname"));
            bind.setGender(data.getString("gender"));
            bind.setEmail(data.getString("email"));
        }
        mapper.insertSelective(bind);
        return bind;
    }


    /**
     * 倒计时等待游戏
     * @return
     */
    public String processWaitGame(){
        Wait wait = new Wait();
        List<SnsapiUserInfo> list = selectUser(12);
        if(list.size() == 0){
            list.add(null);
        }
        wait.setList(list);
        wait.setCount(String.valueOf(jedisClient.scard(Const.WAIT_USER_OPENID_SET)));
        return JsonUtils.objectToJson(wait);
    }

    /**
     * 开始游戏
     * @return
     */
    public Game startGame(){
        Game game = new Game();
        List<SnsapiUserInfo> list = selectUser(10);
        if(list.size() == 0){
            list.add(null);
        }
        game.setList(list);
        return game;
    }

    /**
     * 如果redis幸运用户不够就向mysql中随机选出来几个
     * @param leftCount
     * @return
     */
    @Override
    public List<Bind> getBackLuckUser(int leftCount) {
        BindExample example =  new BindExample();
        BindExample.Criteria criteria = example.createCriteria();
        criteria.andTypeEqualTo("0");
        List<Bind> users = new ArrayList<>();
        List<Bind> list = mapper.selectByExample(example);
        if(null != list){
            int i = 1;
            for (Bind bind:list) {
                if(i == leftCount + 1){
                    break;
                }
                bind.setType("1");
                mapper.updateByPrimaryKeySelective(bind);
                users.add(bind);
                i++;
            }
        }
        return users;

    }

    /**
     * 获得若干个用户的信息
     * @param needUserCount
     * @return
     */
    private List<SnsapiUserInfo> selectUser(int needUserCount){
        SnsapiUserInfo snsapiUserInfo = null;
        java.util.List<SnsapiUserInfo> list = new ArrayList<>();
        String info = null;
        String openId = null;
        for (int i = 0 ;i < needUserCount; i++){
            openId = jedisClient.srandmember(Const.WAIT_USER_OPENID_SET);
            if(!StringUtil.isBlank(openId)){
                info = jedisClient.get(Const.WAIT_USER_INFO + openId);
                if(!StringUtil.isBlank(info)){
                    snsapiUserInfo = JsonUtils.jsonToPojo(info,SnsapiUserInfo.class);
                    if(snsapiUserInfo == null){
                        snsapiUserInfo = new SnsapiUserInfo();
                    }
                    snsapiUserInfo.setOpenid(null);
                    list.add(snsapiUserInfo);
                }
            }
        }
        //判断List的数量符不符合要求
        if(list.size() == 0){
            list.add(null);
        }else{
            if(list.size() != needUserCount){
                int leftCount = needUserCount - list.size();
                int listIndex = 0;
                for (int i = 0; i < leftCount; i++){
                    if(listIndex == list.size() - 1){
                        listIndex = 0;
                    }
                    list.add(list.get(listIndex));
                    listIndex++;
                }
            }
        }

        return list;
    }

    /**
     * 将备份幸运用户type置为0
     */
    public void cleanBackLuckUser(){
        BindExample example = new BindExample();
        BindExample.Criteria criteria = example.createCriteria();
        criteria.andTypeEqualTo("1");
        List<Bind> list = mapper.selectByExample(example);
        if(null != list){
            for (Bind bind:list) {
                bind.setType("0");
                mapper.updateByPrimaryKeySelective(bind);
            }
        }
    }

}
