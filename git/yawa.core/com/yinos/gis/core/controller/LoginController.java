package com.yinos.gis.core.controller;

import com.jfinal.aop.Before;
import com.jfinal.aop.Clear;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.yinos.gis.common.model.ResponseData;
import com.yinos.gis.common.util.Captcha;
import com.yinos.gis.core.interceptor.LoginInterceptor;
import com.yinos.gis.core.interceptor.SessionInterceptor;
import com.yinos.gis.core.model.Login;

/**
 * 登录操作
 * @author wrz
 */
@Clear({SessionInterceptor.class})
public class LoginController extends Controller {
    
    /**
     * 模块：登录页面
     * 功能：跳转登录JSP页面
     */
    @Before(LoginInterceptor.class)
    public void signin() {
        render("signin.jsp");
    }
    
    /**
     * 模块：登录页面
     * 功能：生成随机码 / 随机码验证
     */
    public void captcha() {
        String method = getRequest().getMethod();
        if(method.equals("GET"))
            render(new Captcha());
        else if(method.equals("POST"))
            renderJson(Login.me.captchaValidate(getRequest(), getPara("captcha")));
    }
    
    /**
     * 模块：登录页面
     * 功能：用户登录验证
     */
    @Before(POST.class)
    public void login_validate() {
        try{
            Login.me.login_validate(getRequest(), 
                getPara("account"), getPara("password"));
            renderJson(ResponseData.SUCCESS_NO_DATA);
        }catch(Exception e){
            renderJson(new ResponseData(false, "系统处理失败：" + e.getMessage()));
        }
    }
    
    /**
     * 模块：框架主页
     * 功能：登录成功后显示主页
     */
    @Before(SessionInterceptor.class)
    public void index() {
        render("index.jsp");
    }
}
