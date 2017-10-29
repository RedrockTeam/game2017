package org.cet.interceptor;

import com.alibaba.fastjson.JSONObject;
import org.cet.common.Const;
import org.cet.component.JedisClient;
import org.cet.pojo.openid.SnsapiBase;
import org.cet.pojo.openid.SnsapiUserInfo;
import org.cet.service.AuthService;
import org.cet.util.CurlUtil;
import org.cet.util.HttpClientUtil;
import org.cet.util.JsonUtils;
import org.cet.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;

/**
 * @Author zhang
 * @Date 2017/10/7 13:12
 * @Content
 */
public class SnsapiUserInfoInterceptor implements HandlerInterceptor{

    public static final String APPID = Const.AppId;
    public static final String APPSercet = Const.AppSecret;
    public static int type;
    @Autowired
    private AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        String code = request.getParameter("code");
        String state = request.getParameter("state");
        String url = String.valueOf(request.getRequestURL());
        url = url.split("[?]")[0];
        String[] types = url.split("/");
        for (int i = 0; i < types.length; i++) {
            if(i == types.length - 1){
                System.out.println(types[i]);
                type = Integer.parseInt(types[i]);
            }
        }
        if("POST".equals(request.getMethod())){
            return true;
        }
        String redirectURI = "https://wx.idsbllp.cn/gavagame/cet/click/" + type;
        String urlEncoder = URLEncoder.encode(redirectURI,"UTF-8");
        if(null != code && !"".equals(code.trim())){
            JedisClient js = new JedisClient();
            String accessToken = js.get("auth_access_token");
            SnsapiBase snsapiBase = new SnsapiBase();
            String json = null;
            String accessTokenURL = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + APPID +
                    "&secret=" + APPSercet + "&code="+ code
                    + "&grant_type=authorization_code";
            response.setHeader("Access-Control-Allow-Origin", "*");
            json = CurlUtil.getContent(accessTokenURL,null,"GET");
            JSONObject data = JSONObject.parseObject(json);
            if(null != data.getString("access_token") && !"".equals(data.getString("access_token").trim())){
                snsapiBase = JsonUtils.jsonToPojo(json,SnsapiBase.class);
                js.set("auth_access_token",snsapiBase.getAccess_token());
                js.expire("auth_access_token", Integer.parseInt(snsapiBase.getExpires_in()));
                js.set("refresh_token",snsapiBase.getRefresh_token());
                js.expire("refresh_token",2592000);
//                拉取用户信息
                String infoURL = " https://api.weixin.qq.com/sns/userinfo?access_token=" + snsapiBase.getAccess_token() +
                        "&openid=" + snsapiBase.getOpenid() + "&lang=zh_CN ";
                response.setHeader("Access-Control-Allow-Origin", "*");
                String infoJson = CurlUtil.getContent(infoURL,null,"GET");
                JSONObject info = JSONObject.parseObject(infoJson);
                if(null != info.getString("nickname") && !"".equals(info.getString("nickname").trim())){
                    SnsapiUserInfo snsapiUserInfo = JsonUtils.jsonToPojo(infoJson, SnsapiUserInfo.class);
                    System.out.println(JsonUtils.objectToJson(snsapiUserInfo));
//                    if(!authService.isBind(snsapiUserInfo)){
//                        //没绑定直接重定向到绑定页面
//                        String bindUrl = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/Bind/Bind/bind/openid/{" +
//                                snsapiUserInfo.getOpenid() + "}/token/gh_68f0a1ffc303";
//                        response.sendRedirect(bindUrl);
//                        return false;
//                    }
                    String key1 = null;
                    String key2 = null;
                    String key3 = null;
                    if(type == 1){
                        key1 = Const.HUICHANG_ONE_USER;
                        key2 = Const.HUICHANG_ONE_WAIT_USER;
                        key3 = Const.HUICHANG_ONE_WAIT_COUNT;
                    }
                    else{
                        key1 = Const.HUICHANG_TWO_USER;
                        key2 = Const.HUICHANG_TWO_WAIT_USER;
                        key3 = Const.HUICHANG_TWO_WAIT_COUNT;
                    }
                       js.sadd(key1,JsonUtils.objectToJson(snsapiUserInfo));
                       js.sadd(key2,JsonUtils.objectToJson(snsapiUserInfo));
                       if(null == js.get(key3) || "".equals(js.get(key3))){
                           js.set(key3,"1");
                       }else {
                           js.incr(key3);
                       }
                    return true;
                }
            }
        }
            //没有code就去微信获取
            String authURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID +
                    "&redirect_uri=" + redirectURI + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.sendRedirect(authURL);
            return false;

    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
