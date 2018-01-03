package com.yinos.gis.core.interceptor;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.yinos.gis.common.model.ResponseData;
import com.yinos.gis.common.util.SecurityContextUtil;
import com.yinos.gis.core.model.User;

/**
 * SessionInterceptor
 * Session过期拦截处理器
 */
public class SessionInterceptor implements Interceptor {
    
	public void intercept(Invocation inv) {
		Controller controller = inv.getController();
		HttpServletRequest request = controller.getRequest();
		User user = SecurityContextUtil.getLogin(request);
		if (user != null)
            inv.invoke();
        else {
            String header = request.getHeader("X-Requested-With");  
            if(StringUtils.isEmpty(header))
                controller.redirect("/signin");
            else 
                controller.renderJson(new ResponseData(false, "您尚未登录该系统!"));
        }
	}
}
