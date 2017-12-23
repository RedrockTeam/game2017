package org.game.controller;

import org.game.test.OpenIdThread;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @Author zhang
 * @Date 2017/12/16 18:40
 * @Content
 */
@Controller
public class TestController {

    @RequestMapping("/index")
    public String index(){
        return "index";
    }
    @RequestMapping("/gametest")
    public String game(){
        return "gametest";
    }

    @RequestMapping("/test")
    @ResponseBody
    public void test(){
        for (int i = 0; i < 500; i++){
            OpenIdThread thread = new OpenIdThread();
            thread.setName("" + i);
            thread.start();
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }


}
