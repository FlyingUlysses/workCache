package com.yawa.core.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.yawa.core.interceptor.MenuInterceptor;
import com.yawa.core.interceptor.SessionInterceptor;
import com.yawa.core.model.LogApp;

@Before(SessionInterceptor.class)
public class BehaveController extends Controller{
	
	/**
		 *@Title:手机端库存管理接口
		 *@Description:
		 *@Author:WangYong
		 *@Since:2018-01-03
		 *@Version:1.1.0
	 */
	 @Before(MenuInterceptor.class)
	 public void index() {
		setAttr("day", new SimpleDateFormat("Y-MM").format(new Date()));
		render("index.jsp");
	 }
	 
	 /**
		 *@Title:加载柱状图
		 *@Description:根据集团加载下属组织的树状图
		 *@Author:WangYong
		 *@Since:2018-01-03
		 *@Version:1.1.0
	 */
	 @Before(POST.class)
	 public void reloadLogingBarChart() {
		 renderJson(LogApp.me.reloadLogingBarChart(getParaToInt("org"),getPara("start_date"),getParaToBoolean("isLoging")));
	 }
	 
	 /**
		 *@Title:加载折线图
		 *@Description:根据组织和账期加载详细数据图
		 *@Author:WangYong
		 *@Since:2018-01-10
		 *@Version:1.1.0
	 */
	 @Before(POST.class)
	 public void reloadLineChart() {
		 renderJson(LogApp.me.reloadLineChart(getParaToInt("littleOid"),getPara("start_date"),getParaToInt("type"),getParaToBoolean("isLoging")));
	 }
		 
	 /**
		 *@Title:加载数据表格
		 *@Description:根据组织和账期加载详细数据分页列表展示
		 *@Author:WangYong
		 *@Since:2018-01-11
		 *@Version:1.1.0
	 */
	 @Before(POST.class)
	 public void reloadTable() {
		 renderJson(LogApp.me.reloadTable(getParaToInt("page"),getParaToInt("limit"),getParaToInt("littleOid"),getPara("start_day"),getParaToInt("type"),getParaToInt("uid"),getParaToBoolean("isLoging")));
	 }
	 
	 /**
		 *@Title:跳转用户某日操作记录页
		 *@Description:根据选择用户跳转用户某日操作详情记录页
		 *@Author:WangYong
		 *@Since:2018-01-11
		 *@Version:1.1.0
	 */
	 public void showUserLog() {
		 setAttr("littleOid", getParaToInt("littleOid"));
		 setAttr("uid", getParaToInt("uid"));
		 setAttr("type", getParaToInt("type"));
		 setAttr("start_day", getPara("start_day"));
		 setAttr("isLoging", getParaToBoolean("isLoging"));
		 renderJsp("showUserLog.jsp");
	 }

	 
}
