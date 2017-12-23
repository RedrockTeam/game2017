package org.game.controller;

import org.game.common.Const;
import org.game.component.JedisClient;
import org.game.pojo.mysql.Bind;
import org.game.pojo.openid.SnsapiUserInfo;
import org.game.service.GameService;
import org.game.util.*;
import org.game.websocket.game.GameHandler;
import org.game.websocket.wait.WaitHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

/**
 * @Author zhang
 * @Date 2017/9/29 22:11
 * @Content
 */
@Controller
@RequestMapping("/user")
public class GameController {

    @Autowired
    private GameService authService;

    @Autowired
    private JedisClient jedisClient;

    private String BTN_URL = "http://wx.yyeke.com/171215game/dist/view/index.html";

    /**
    * 用户在拦截器里获取信息验证通过后 重定向到前端页面
    */
    @RequestMapping(value = "/wait",method = RequestMethod.GET)
    public String getView(HttpServletRequest request, HttpServletResponse response) throws IOException {
//            response.sendRedirect(BTN_URL);
            return "redirect:" + BTN_URL;

    }

    /**
     * 用户点击记录openID
     * @param
     * @return
     */
    @RequestMapping(value = "/click",method = RequestMethod.GET)
    @ResponseBody
    public Result caculateClickCount(){
        Result result = new Result();
        try {
            //判断开始条件
            //StringUtil.isBlank(jedisClient.get(Const.IS_GAME_START)) null == GameHandler.userSocketSessionMap.get("session")
            if(StringUtil.isBlank(jedisClient.get(Const.IS_GAME_START))){
                result.setStatus(400);
                result.setInfo("游戏已经结束");
                return result;
            }
            String click = processUserClickException();
            return Result.ok(click);
        }catch (Exception e){
            result.setStatus(500);
            result.setInfo("服务器异常");
            return result;
        }

    }




    /**
    * 根据websocket里面的sessionMap里面的值来判断游戏是否开始
    */
    @RequestMapping(value = "/startgame",method = RequestMethod.GET)
    @ResponseBody
    public Result authStartGame(){
        Result result = new Result();
        try {

            //!StringUtil.isBlank(Const.IS_GAME_START) null != GameHandler.userSocketSessionMap.get("session")
            boolean is = StringUtil.isBlank(jedisClient.get(Const.IS_GAME_START));
            if(!is){
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

    /**
    * 用户点击后增加本会场的点击次数
    */
    private String processUserClickException(){
        String clickKey = Const.USER_CLICK_COUNT;

        String click = jedisClient.get(clickKey);
        if(click == null || "".equals(click.trim())){
            jedisClient.set(clickKey,"10");
        }else{
            int count = Integer.parseInt(click);
            count += 10;
            jedisClient.set(clickKey,String.valueOf(count));
        }
        click = jedisClient.get(Const.USER_CLICK_COUNT);
        return click;
    }


}
