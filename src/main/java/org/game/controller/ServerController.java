package org.game.controller;

import org.game.common.Const;
import org.game.component.JedisClient;
import org.game.pojo.mysql.Bind;
import org.game.pojo.openid.SnsapiUserInfo;
import org.game.pojo.websocket.Game;
import org.game.pojo.websocket.Wait;
import org.game.service.GameService;
import org.game.util.CurlUtil;
import org.game.util.JsonUtils;
import org.game.util.Result;
import org.game.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.ArrayList;
import java.util.List;

/**
 * @Author zhang
 * @Date 2017/12/17 23:26
 * @Content 轮询方式
 */
@RequestMapping("/master")
@Controller
public class ServerController {

    @Autowired
    private JedisClient jedisClient;
    @Autowired
    private GameService service;

    private String waitCount = null;

    /**
     * 开始游戏后数据接口
     *
     * @return
     */
    @RequestMapping("/game")
    @ResponseBody
    public Game getGameData() {
        Game game = new Game();
        try {
            if (StringUtil.isBlank(jedisClient.get(Const.IS_GAME_START))) {
                jedisClient.set(Const.IS_GAME_START, "1");
            }
            if (StringUtil.isBlank(waitCount)) {
                waitCount = String.valueOf(jedisClient.scard(Const.WAIT_USER_OPENID_SET));
            }

            String clickCount = jedisClient.get(Const.USER_CLICK_COUNT);
            if (StringUtil.isBlank(clickCount)) {
                clickCount = "0";
            }
            game = service.startGame();
            game.setClickCount(clickCount);
            game.setCount(waitCount);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return game;
    }

    /**
     * 等待游戏时游戏接口
     *
     * @return
     */
    @RequestMapping("/wait")
    @ResponseBody
    public Wait getWaitData() {
        Wait wait = new Wait();
        try {
//            if(StringUtil.isBlank(jedisClient.get(Const.IS_WAIT_START))){
//                jedisClient.set(Const.IS_WAIT_START,"1");
//            }
            String json = service.processWaitGame();
            wait = JsonUtils.jsonToPojo(json, Wait.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return wait;
    }

    /**
     * 主持人结束游戏时请求接口
     *
     * @return
     */
    @RequestMapping("/endgame")
    @ResponseBody
    public Result masterEndGame() {
        Result result = new Result();
        try {
            if (!StringUtil.isBlank(jedisClient.get(Const.IS_GAME_START))) {
                jedisClient.del(Const.IS_GAME_START);
                result.setInfo("游戏结束");
                result.setStatus(200);
            } else {
                result.setInfo("主持人未进入游戏");
                result.setStatus(400);
            }
        } catch (Exception e) {
            e.printStackTrace();
            result.setInfo("网络错误");
            result.setStatus(500);
        } finally {
            return result;
        }
    }

//    @RequestMapping("/endwait")
//    public Result masterEndWait(){
//        Result result = new Result();
//        try {
//            if (!StringUtil.isBlank(jedisClient.get(Const.IS_WAIT_START))){
//                jedisClient.del(Const.IS_WAIT_START);
//                result.setInfo("等待界面结束");
//                result.setStatus(200);
//            }else{
//                result.setInfo("主持人未进入等待界面");
//                result.setStatus(400);
//            }
//        }catch (Exception e){
//            e.printStackTrace();
//            result.setInfo("网络错误");
//            result.setStatus(500);
//        }
//        finally {
//            return result;
//        }
//    }


    /**
     * 抽取幸运用户
     */

    @RequestMapping(value = "/luck", method = RequestMethod.GET)
    @ResponseBody
    public Result getLuckkey() {
        Result result = new Result();
        try {

            List<Bind> list = new ArrayList<>();
            //向数据库添加中奖用户信息

            for (int i = 0; i < 5; i++) {
                long userCounts = jedisClient.scard(Const.WAIT_USER_OPENID_SET);
                if (userCounts == 0) {
                    break;
                }
                String openid = jedisClient.spop(Const.WAIT_USER_OPENID_SET);
                if (StringUtil.isBlank(openid)) {
                    continue;
                }
                String json = jedisClient.get(Const.WAIT_USER_INFO + openid);
                SnsapiUserInfo user = JsonUtils.jsonToPojo(json, SnsapiUserInfo.class);
                Bind bind = service.addLuckUser(user);
                list.add(bind);
            }
            if (list.size() < 5) {
                //如果redis中不够5个幸运用户 就从数据库补
                int leftCount = 5 - list.size();
                List<Bind> binds = service.getBackLuckUser(leftCount);
                if (null != binds) {
                    for (Bind bind : binds) {
                        list.add(bind);
                    }
                }
            }
            return Result.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            result.setStatus(400);
            result.setInfo("抽奖失败");
            return result;
        }
    }


//    @RequestMapping(value = "/flushdb",method = RequestMethod.GET)
//    @ResponseBody
//    public Result flushDB(){
//        Result result = new Result();
//        try {
//            return Result.ok();
//        }catch (Exception e){
//            result.setStatus(400);
//            result.setInfo("删除失败");
//            return result;
//        }
//    }

    @ResponseBody
    @RequestMapping("/backuser/clean")
    public Result cleanBackLuckUser() {
        Result result = new Result();
        try {
            service.cleanBackLuckUser();
            return Result.ok();
        } catch (Exception e) {
            result.setStatus(400);
            result.setInfo("重置备份用户失败");
            return result;
        }
    }
}