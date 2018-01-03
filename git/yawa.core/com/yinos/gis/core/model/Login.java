package com.yinos.gis.core.model;

import java.util.Date;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.RandomStringUtils;
import com.jfinal.plugin.activerecord.Model;
import com.yinos.gis.common.model.ResponseData;
import com.yinos.gis.common.util.CodeUtil;
import com.yinos.gis.common.util.SecurityContextUtil;

public class Login {
    
    public static final Login me = new Login();
    
    /**
     * 登录验证
     * @param user
     * @return
     * @throws Exception 
     */
    public void login_validate(HttpServletRequest request, String account, String password) throws Exception{
        User user = User.me.getUser(account);
        accountValidate(user);
        afterLoad(user, password);
        SecurityContextUtil.setLogin(request, user);
    }
    
    /**
     * 验证码校验
     * @param user
     * @return
     */
    public ResponseData captchaValidate(HttpServletRequest request, String captcha) {
        try{
            if(!SecurityContextUtil.validateCaptcha(request, captcha))
                throw new Exception("验证码错误，请重新输入!");
            if(!SecurityContextUtil.isCaptchaValid(request))
                throw new Exception("验证码已过期，请重新获取!");
            return new ResponseData(true);
        } catch(Exception e) {
            return new ResponseData(false, e.getMessage());
        }
    }
    
    /**
     * 账号验证
     * @param user
     * @return
     */
    public void accountValidate(Model<?> user) throws Exception{
        if (user == null)
            throw new Exception("用户名不存在!");
        if (user.getInt("state") == 0)
            throw new Exception("账户已无效，请联系管理员!");
        if (user.getInt("state") == 2)
            throw new Exception("登录次数过多，账户已锁定!");
    }
    
    /**
     * 登录成功操作
     * @param user
     * @return
     */
    public void afterLoad(Model<?> user, String password) throws Exception{
        String encrypt = CodeUtil.md5(password + user.getStr("salt"));
        if(!encrypt.equals(user.getStr("password"))){
            Integer error = user.getInt("error_cnt") + 1;
            if(error >= 3){
                user.set("error_cnt", error)
                    .set("state", 2)
                    .set("update_time", new Date())
                    .update();
                throw new Exception("登录次数过多，账户已锁定!");
            }
            user.set("error_cnt", error)
                .set("update_time", new Date())
                .update();
            throw new Exception("密码错误，请重新输入!");
        }
        user.set("error_cnt", 0)
            .set("update_time", new Date())
            .update();
    }
    
    /**
     * 密码修改
     * @return
     */
    public ResponseData modifyPass(HttpServletRequest request, User u, String oldPass,
            String newPass, String confPass) {
        if (u == null)
            return new ResponseData(false, "未找到用户记录，请联系管理员!");
        if (u.getInt("state") == 0)
            return new ResponseData(false, "账户已无效，请联系管理员!");
        if (u.getInt("state") == 2)
            return new ResponseData(false, "登录错误次数过多，账户已锁定，请联系管理员解锁!");
        String encrypt = CodeUtil.md5(oldPass + u.getStr("salt"));
        if(!encrypt.equals(u.getStr("password")))
            return new ResponseData(false, "原密码错误，请重新输入!");
        if(!newPass.equals(confPass))
            return new ResponseData(false, "新密码与确认密码不一致！");
        if(newPass.length() < 6)
            return new ResponseData(false, "密码长度必须大于6位！");
        if(newPass.length() > 12)
            return new ResponseData(false, "密码长度必须小于12位！");
        String salt = RandomStringUtils.randomAlphanumeric(10);
        u.set("salt", salt)
            .set("state", 1)
            .set("error_cnt", 0)
            .set("password", CodeUtil.md5(newPass + salt))
            .set("update_date", new Date())
            .update();
        return new ResponseData(true, "密码修改成功！");
    }
}
