package org.game.interceptor;

import com.alibaba.fastjson.JSONObject;
import org.game.common.Const;
import org.game.common.URL;
import org.game.component.JedisClient;
import org.game.pojo.openid.SnsapiBase;
import org.game.pojo.openid.SnsapiUserInfo;
import org.game.service.GameService;
import org.game.util.CurlUtil;
import org.game.util.JsonUtils;
import org.game.util.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

//    public static int count = 0;

    @Autowired
    private JedisClient jedisClient;

    private static String redirectUrl = "http://wx.yyeke.com/171215game/user/wait";
    private static String magicLoopUrl = "https://wx.idsbllp.cn/MagicLoop/index.php?s=/addon/Api/Api/oauth&redirect=";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
//        response.setCharacterEncoding("UTF-8");
//        String code = request.getParameter("code");
//        String state = request.getParameter("state");
//        String redirectURI = URL.REDIRECT_URL;
//        String urlEncoder = URLEncoder.encode(redirectURI,"UTF-8");
//        if(null != code && !"".equals(code.trim())){
//
//            SnsapiBase snsapiBase = new SnsapiBase();
//            String json = null;
//            String accessTokenURL = URL.WX_ACCESS_TOKEN_BASE_URL + URL.APP_ID +
//                    "&secret=" + URL.APP_SECRET + "&code="+ code
//                    + "&grant_type=authorization_code";
//
//            json = CurlUtil.getContent(accessTokenURL,null,"GET");
//            JSONObject data = JSONObject.parseObject(json);
//
//            if(null != data.getString("access_token") && !"".equals(data.getString("access_token").trim())){
//
//                snsapiBase = JsonUtils.jsonToPojo(json,SnsapiBase.class);
//                //拉取用户信息
//                String infoURL = URL.WX_USER_INFO_BASE_URL + snsapiBase.getAccess_token() +
//                        "&openid=" + snsapiBase.getOpenid() + "&lang=zh_CN ";
//
//                String infoJson = CurlUtil.getContent(infoURL,null,"GET");
//                JSONObject info = JSONObject.parseObject(infoJson);
//                if(null != info.getString("nickname") && !"".equals(info.getString("nickname").trim())){
//                    request.getSession().setAttribute("openid",info.getString("openid"));
//                    SnsapiUserInfo user = new SnsapiUserInfo();
//                    user.setOpenid(info.getString("openid"));
//                    user.setNickname(info.getString("nickname"));
//                    user.setHeadimgurl(info.getString("headimgurl"));
//                    //存储等待时用户的信息
//                    jedisClient.set(Const.WAIT_USER_INFO + user.getOpenid(),JsonUtils.objectToJson(user));
//                    jedisClient.sadd(Const.WAIT_USER_OPENID_SET,user.getOpenid());
//                    return true;
//                }
//            }
//        }
//        //没有code就去微信获取
//        String authURL = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + URL.APP_ID +
//                "&redirect_uri=" + urlEncoder + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
//        response.sendRedirect(authURL);
//        return false;
//
        //模拟数据
//        SnsapiUserInfo user = new SnsapiUserInfo();
//        user.setOpenId("ouRCyjv_UNcAc6Xb6R_68hc4UhlM"+count);
//        user.setNickName("黄桷垭吴彦祖"+count);
//        user.setHeadImgAddr("http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKDhS1ALib4eSBFnzHhT9bsXCLKYhOhricqvNuFf126nQ8RUkMFxMzO8rWFh62n5kMPgTgg30ibcJZ4Q/0");
//        //存储等待时用户的信息
//        jedisClient.set(Const.WAIT_USER_INFO + user.getOpenId(),JsonUtils.objectToJson(user));
//        jedisClient.sadd(Const.WAIT_USER_OPENID_SET,user.getOpenId());
//        count++;
//        return true;


        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin:", "*");


        String openId = request.getParameter("openid");
        String headImgUrl = request.getParameter("headimgurl");
        String nickName = request.getParameter("nickname");

        if (StringUtil.isBlank(openId) || StringUtil.isBlank(headImgUrl) || StringUtil.isBlank(nickName)) {
            String url = magicLoopUrl + URLEncoder.encode(redirectUrl, "UTF-8");
            response.sendRedirect(url);
        } else {
            request.getSession().setAttribute("openid", openId);
            SnsapiUserInfo user = new SnsapiUserInfo();
            user.setOpenid(openId);
            user.setNickname(nickName);
            user.setHeadimgurl(headImgUrl);
            //存储等待时用户的信息
            jedisClient.set(Const.WAIT_USER_INFO + user.getOpenid(), JsonUtils.objectToJson(user));
            jedisClient.sadd(Const.WAIT_USER_OPENID_SET, user.getOpenid());
            //放行
            return true;
        }
        return false;
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
