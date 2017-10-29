package org.cet.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.sun.xml.internal.bind.v2.schemagen.xmlschema.List;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.cet.common.Const;
import org.cet.component.JedisClient;
import org.cet.dao.BindMapper;
import org.cet.pojo.mysql.Bind;
import org.cet.pojo.mysql.BindExample;
import org.cet.pojo.openid.SnsapiUserInfo;
import org.cet.pojo.websocket.Game;
import org.cet.pojo.websocket.Wait;
import org.cet.service.AuthService;
import org.cet.util.*;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.Set;

/**
 * @Author zhang
 * @Date 2017/10/7 21:15
 * @Content
 */
@Service
public class AuthServiceImpl implements AuthService{

    private boolean flag = true;
    @Autowired
    private BindMapper mapper;

    public boolean isBind(SnsapiUserInfo snsapiUserInfo) {
        String isBindURL = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=" + snsapiUserInfo.getOpenid();
//        String isBindURL = "https://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=ouRCyjv_UNcAc6Xb6R_68hc4UhlM";
        String json = HttpsUtil.get(isBindURL);
        JSONObject data = JSONObject.parseObject(json);
        if (data.getString("status").equals("200")) {
            return true;
        }
        return false;
    }


    public void addLuckUser(SnsapiUserInfo snsapiUserInfo,int type) {
        String isBindURL = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=" + snsapiUserInfo.getOpenid();
//        String isBindURL = "https://hongyan.cqupt.edu.cn/MagicLoop/index.php?s=/addon/UserCenter/UserCenter/getStuInfoByOpenId&openId=ouRCyjv_UNcAc6Xb6R_68hc4UhlM";
        String json = HttpsUtil.get(isBindURL);
        System.out.println(json);
        JSONObject data = JSONObject.parseObject(json);
        if (data.getString("status").equals("200")) {
            json = data.getString("data");
            data = JSONObject.parseObject(json);
            Bind bind = new Bind();
            bind.setUsernumber(data.getString("usernumber"));
            bind.setRealname(data.getString("realname"));
            bind.setGender(data.getString("gender"));
            bind.setEmail(data.getString("email"));
            bind.setOpenid(snsapiUserInfo.getOpenid());
            bind.setNickname(snsapiUserInfo.getNickname());
            bind.setHeadimgurl(snsapiUserInfo.getHeadimgurl());
            bind.setCreateTime(new Date());
            bind.setType(String.valueOf(type));
            mapper.insertSelective(bind);
        }
    }
    public String processWaitGame(String waitKey,String countKey,String backKey,JedisClient js){
        int length = (int) js.scard(waitKey);
        Wait wait = new Wait();
        java.util.List<SnsapiUserInfo> list = new ArrayList<>();
        if(length > 0){
            for (int i = 0; i < 12; i++){
                String json = js.spop(waitKey);
                if(null == json || "".equals(json.trim())){
                    continue;
                }
                list.add(JsonUtils.jsonToPojo(json,SnsapiUserInfo.class));
            }
            if(list.size() != 12){
                int needCount = 12 - list.size();
                for (int i = 0; i < needCount; i++){
                    String json = js.spop(waitKey);
                    if(null == json || "".equals(json.trim())){
                        json = js.srandmember(backKey);
                    }
                    list.add(JsonUtils.jsonToPojo(json,SnsapiUserInfo.class));
                }
            }
        }else{
            for (int i = 0; i < 12; i++){
                String json = js.srandmember(backKey);
                if(null == json || "".equals(json.trim())){
                    continue;
                }
                list.add(JsonUtils.jsonToPojo(json,SnsapiUserInfo.class));
            }
        }
        if(list.size() == 0){
            list.add(null);
        }
        wait.setList(list);
        countKey = js.get(countKey);
        if(null == countKey || "".equals(countKey.trim())){
            countKey = "0";
        }
        wait.setCount(countKey);
        return JsonUtils.objectToJson(wait);
    }

    public Game startGame(String gameKey,String countKey,JedisClient js){
        Game game = new Game();
        java.util.List<SnsapiUserInfo> list = new ArrayList<>();
        for (int i = 0; i < 10; i++){
            String json = js.srandmember(gameKey);
            if (null == json || "".equals(json.trim())){
                continue;
            }
            list.add(JsonUtils.jsonToPojo(json,SnsapiUserInfo.class));
        }
        if(list.size() == 0){
            list.add(null);
        }
        game.setList(list);
        return game;
    }

    public java.util.List<Bind> getBackLuckMan(int needBackCount,int type){
        BindExample example = new BindExample();
        BindExample.Criteria criteria = example.createCriteria();
        String strType = null;
        if(type == 1){
            strType = "11";
        }
        else{
            strType = "22";
        }
        criteria.andTypeEqualTo(strType);
        java.util.List<Bind> needList = new ArrayList<>();
        java.util.List<Bind> list = mapper.selectByExample(example);
        if(null != list && list.size() > 0){
            int size = needBackCount;
            if(size > list.size()){
                size = list.size();
                needBackCount = size - list.size();
            }
            for (int i = 0; i < size; i++){
                needList.add(list.get(i));
            }
            for (int i = 0; i < needBackCount; i++){
                needList.add(list.get(0));
            }
        }
        return needList;
    }

}
