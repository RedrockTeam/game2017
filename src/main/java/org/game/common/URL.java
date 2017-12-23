package org.game.common;

/**
 * @Author zhang
 * @Date 2017/12/16 13:21
 * @Content
 */
public final class URL {
    //回调到42服务器的地址，也是获取用户信息的地址
    public static final String REDIRECT_URL = "http://wx.yyeke.com/171215game/user/wait";
    //测试app
    public static final String APP_ID = "wx81a4a4b77ec98ff4";
    public static final String APP_SECRET = "872a908ec98bd92f8db811eba2a83236";
    //微信服务器提供的地址
    public static final String WX_ACCESS_TOKEN_BASE_URL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=";
    public static final String WX_USER_INFO_BASE_URL = "https://api.weixin.qq.com/sns/userinfo?access_token=";

}
