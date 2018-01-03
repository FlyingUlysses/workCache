package com.yinos.gis.core.interceptor;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.yinos.gis.common.util.SecurityContextUtil;
import com.yinos.gis.core.model.User;

/**
 * LoginInterceptor
 * 用户如果在登录中，直接跳转至首页，无需再次登录
 */
public class LoginInterceptor implements Interceptor {
	
	public void intercept(Invocation inv) {
		Controller controller = inv.getController();
		User user = SecurityContextUtil.getLogin(controller.getRequest());
	    if (user != null)
	    	controller.redirect("/index");
	    else
	    	inv.invoke();
	}
}
