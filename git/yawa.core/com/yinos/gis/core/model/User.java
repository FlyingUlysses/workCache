package com.yinos.gis.core.model;

import com.jfinal.plugin.activerecord.Model;

@SuppressWarnings("serial")
public class User extends Model<User> {

	public static final User me = new User();
	
	/**
     * 模块：登录界面
     * 功能：根据账户和密码查找用户，登录时使用
     * @param account
     * @param password
     * @return
     */
    public User getUser(String account) {
        return findFirst("select * from sys_user where account = ? ", account);
    }

    public void ssoLogin(Integer uid) {
        
    }
}