package org.game.test;

import org.game.util.CurlUtil;

/**
 * @Author zhang
 * @Date 2017/12/16 22:35
 * @Content
 */
public class OpenIdThread extends Thread {
    @Override
    public void run() {
        CurlUtil.getContent("http://localhost:8080/http/wait",null,"GET");
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        String data = CurlUtil.getContent("http://localhost:8080/startgame",null,"GET");
        System.out.println("wait " + Thread.currentThread().getName() + " " + data);
        try {
            Thread.sleep(5000);
            String click = CurlUtil.getContent("http://localhost:8080/click",null,"GET");
            System.out.println("click " + Thread.currentThread().getName() + click);
            Thread.sleep(2000);
            System.out.println("click " + Thread.currentThread().getName() + click);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
