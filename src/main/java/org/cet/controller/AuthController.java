package org.cet.controller;

import org.cet.common.Const;
import org.cet.component.JedisClient;
import org.cet.pojo.mysql.Bind;
import org.cet.pojo.openid.SnsapiUserInfo;
import org.cet.service.AuthService;
import org.cet.util.*;
import org.cet.websocket.MyWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


/**
 * @Author zhang
 * @Date 2017/9/29 22:11
 * @Content
 */
@Controller
public class AuthController {

    public static final String APPID = Const.AppId;
    public static final String APPSercet = Const.AppSecret;
    public static int backLuckManCountOne = 0;
    public static int backLuckManCountTwo = 0;
    @Autowired
    private AuthService authService;
    @Value("${BTN_URL}")
    private String BTN_URL;

    @RequestMapping(value = "/click/{type}",method = RequestMethod.GET)
    public void getView(HttpServletRequest request, HttpServletResponse response,@PathVariable Integer type) throws IOException {
        try {
            //重定向到按钮页面的URL
            String url = null;
            int userType = 0;
            int backUserCount = 0;
            String backFlag = null;
            if(!checkType(type)){
                return;
            }
            if(type == 1){
                url = BTN_URL + 1;
                backFlag = Const.HUICHANG_ONE_USER;
                userType = 11;
                backUserCount = backLuckManCountOne;
                backLuckManCountOne++;

            }
            else{
                url = BTN_URL + 2;
                backFlag = Const.HUICHANG_TWO_USER;
                userType = 22;
                backUserCount = backLuckManCountTwo;
                backLuckManCountTwo++;
            }
//            if(backUserCount < 20){
//                JedisClient js = new JedisClient();
//                String json = js.srandmember(backFlag);
//                //先缓存20个中奖用户
//                if(null != json && !"".equals(json.trim())){
//                    SnsapiUserInfo snsapiUserInfo = JsonUtils.jsonToPojo(json,SnsapiUserInfo.class);
//                    authService.addLuckUser(snsapiUserInfo,userType);
//                }
//            }
            response.sendRedirect(url);
            return;
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    /**
     * 用户点击记录openID和点击次数
     * @param
     * @return
     */
    @RequestMapping(value = "/user/click",method = RequestMethod.GET)
    @ResponseBody
    public Result caculateClickCount(Integer type){
        Result result = new Result();
        JedisClient js = new JedisClient();
        try {
            if(!checkType(type)){
                result.setStatus(300);
                result.setInfo("type不正确");
                return result;
            }
            if(null == MyWebSocketHandler.userSocketSessionMap.get(type)){
                result.setStatus(400);
                result.setInfo("游戏已经结束");
                return result;
            }
            String click = processUserClickException(type);
            return Result.ok(click);
        }catch (Exception e){
            result.setStatus(500);
            result.setInfo("服务器异常");
            return result;
        }

    }

    /**
     * 得到点击总数
     * @return
     */
    @RequestMapping(value = "/count",method = RequestMethod.GET)
    @ResponseBody
    public String getTotalCount(Integer type){
        try {
            if(!checkType(type)){
                return null;
            }
            JedisClient js = new JedisClient();
            String click = null;
            if(type == 1){
                click = js.get(Const.CLICK_ONE_COUNT);
            }else{
                click = js.get(Const.CLICK_TWO_COUNT);
            }
            if(null == click || "".equals(click.trim())){
                click = "0";
                return click;
            }
            return click;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/luck",method = RequestMethod.GET)
    @ResponseBody
    public Result getLuckkey(Integer type){
        Result result = new Result();
        try {
            if(!checkType(type)){
                result.setStatus(400);
                result.setInfo("type不正确");
                return result;
            }
            String key = null;
            JedisClient js = new JedisClient();
            List<SnsapiUserInfo> list = new ArrayList<>();
            if(type == 1) {
                key = Const.HUICHANG_ONE_USER;
            }else{
                key = Const.HUICHANG_TWO_USER;
            }

            for(int i = 0; i < 5; i++){
                String json = js.spop(key);
                if(null == json || "".equals(json.trim())){
                    continue;
                }
                SnsapiUserInfo snsapiUserInfo = JsonUtils.jsonToPojo(json, SnsapiUserInfo.class);
                list.add(snsapiUserInfo);
            }
            //向数据库添加中奖用户信息
            for (SnsapiUserInfo luckMan:list) {
                if(luckMan == null){
                    continue;
                }
                authService.addLuckUser(luckMan,type);
            }

            if(list.size() == 0){
                List<Bind> backList = authService.getBackLuckMan(5,type);
                if (null != backList && backList.size() != 0){
                    return Result.ok(backList);
                }
            }
            return Result.ok(list);
        }catch (Exception e){
            e.printStackTrace();
            result.setStatus(400);
            result.setInfo("抽奖失败");
            return result;
        }
    }
    @RequestMapping(value = "/flushdb",method = RequestMethod.GET)
    @ResponseBody
    public Result flushDB(Integer type){
        Result result = new Result();
        try {
            if(!checkType(type)){
                result.setStatus(400);
                result.setInfo("type不正确");
                return result;
            }
            JedisClient js = new JedisClient();
            String key1 = null;
            if(type == 1){
                key1 = Const.CLICK_ONE_COUNT;

            }else{
                key1 = Const.CLICK_TWO_COUNT;
            }
            js.del(key1);
            return Result.ok();
        }catch (Exception e){
            result.setStatus(400);
            result.setInfo("删除失败");
            return result;
        }
    }

    private boolean checkType(Integer type){
        if(null == type || (type != 1 && type != 2)){
            return false;
        }
        return true;
    }

    @RequestMapping(value = "/auth/startgame",method = RequestMethod.GET)
    @ResponseBody
    public Result authStartGame(Integer type){
        Result result = new Result();
        try {
            if(!checkType(type)){
                result.setStatus(300);
                result.setInfo("type不正确");
                return result;
            }
            if(null != MyWebSocketHandler.userSocketSessionMap.get(type)){
                result.setStatus(200);
                result.setInfo("游戏开始");
                return result;
            }
            result.setStatus(400);
            result.setInfo("游戏尚未开始");

        }catch (Exception e){
            e.printStackTrace();
            result.setInfo("服务器异常");
            result.setStatus(500);
            return result;
        }
        return result;
    }

    private String processUserClickException(Integer type){
        String clickKey = null;
        if(type == 1) {
            clickKey = Const.CLICK_ONE_COUNT;
        }else{
            clickKey = Const.CLICK_TWO_COUNT;
        }
        JedisClient js = new JedisClient();
        String click = js.get(clickKey);
        if(click == null || "".equals(click.trim())){
            js.set(clickKey,"10");
            click = js.get(clickKey);
        }else{
            click = js.get(clickKey);
            int count = Integer.parseInt(click);
            count += 10;
            js.set(clickKey,String.valueOf(count));
            click = js.get(clickKey);
        }
        return click;
    }



}
