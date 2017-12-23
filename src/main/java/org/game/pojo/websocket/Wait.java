package org.game.pojo.websocket;

import org.game.pojo.openid.SnsapiUserInfo;

import java.util.List;

/**
 * @Author zhang
 * @Date 2017/10/12 21:34
 * @Content
 */
public class Wait {
    private List<SnsapiUserInfo> list;
    private String count;

    public List<SnsapiUserInfo> getList() {
        return list;
    }

    public void setList(List<SnsapiUserInfo> list) {
        this.list = list;
    }

    public String getCount() {
        return count;
    }

    public void setCount(String count) {
        this.count = count;
    }
}
