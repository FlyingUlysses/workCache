package com.yinos.gis.core.interceptor;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
import com.jfinal.core.Controller;
import com.yinos.gis.client.model.Client;
import com.yinos.gis.common.model.ResponseData;
import com.yinos.gis.common.util.SecurityContextUtil;

/**
 * SessionInterceptor
 * Session过期拦截处理器
 */
public class ClientInterceptor implements Interceptor {
    
	public void intercept(Invocation inv) {
		Controller controller = inv.getController();
		HttpServletRequest request = controller.getRequest();
		String header = request.getHeader("X-Requested-With");
		Client client = SecurityContextUtil.getClient(request);
		if(client != null) {
			if(StringUtils.isNotEmpty(header)) {
				String _token = controller.getPara("_token");
				if(!_token.equals(client.getStr("encrypt")))
					controller.renderJson(new ResponseData(false, "访问令牌错误!"));
				else
					inv.invoke();
			}else 
				inv.invoke();
		} else {
            if(StringUtils.isEmpty(header))
                controller.redirect("/signin");
            else 
                controller.renderJson(new ResponseData(false, "尚未获取访问令牌!"));
        }
	}
}
