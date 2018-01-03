package com.yinos.gis.core.controller;

import com.jfinal.core.Controller;

public class UserController extends Controller {
    
    /**
     * 模块：用户管理
     * 功能：用户管理界面
     */
    public void index() {
        render("index.jsp");
    }
}
