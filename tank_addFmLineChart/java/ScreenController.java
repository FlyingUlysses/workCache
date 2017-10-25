package com.yawa.tank.controller;

import java.util.Date;

import org.apache.commons.lang.time.DateFormatUtils;

import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.yawa.core.interceptor.SessionInterceptor;
import com.yawa.core.model.Company;
import com.yawa.core.model.User;
import com.yawa.tank.model.DPJK;
import com.yawa.tank.model.Screen;
import com.yawa.tank.model.Tank;
import com.yawa.util.SecurityContextUtil;
import com.yawa.util.model.ResponseData;

@Before(SessionInterceptor.class)
public class ScreenController extends Controller {
	
    /**
     * 模块：大屏监控
     * 功能：跳转大屏监控页面
     */
    public void index() {
        User user = SecurityContextUtil.getLoginUser(getRequest());
        Company company = Company.me.findById(user.getInt("company"));
        String filter = "";
        if(!Company.me.isSystem(company))
            filter = " and parent = " + user.getInt("company");
        setAttr("cnt", Db.queryLong("select count(*) from base_companys"
            + " where state = 1 " + filter));
        setAttr("company", company);
        render("index.jsp");
    }
    
    /**
     * 模块：大屏监控
     * 功能：跳转数据监控页面
     */
    public void data() {
        setAttr("company", getParaToInt("company"));
        setAttr("tank", Tank.me.findById(getParaToInt("id")));
        render("data.jsp");
    }
    
	/**
	 * 模块：大屏监控
	 * 功能：大屏监控列表
	 */
	public void getData() {
		Integer company = getParaToInt("company");
		if(null == company){
			User user = SecurityContextUtil.getLoginUser(getRequest());
			company = user.getInt("company");
		}
		renderJson(Screen.me.getData(company));
	}
	
	/**
     * 模块：大屏监控
     * 功能：获取页面展示属性选取树
     */
	public void getColumns(){
	    Integer setCompany = getParaToInt("company");
	    User user = SecurityContextUtil.getLoginUser(getRequest());
	    Integer company = user.getInt("company");
	    if(setCompany == null)
            setCompany = company;
	    renderJson(Screen.me.getColumns(user.getInt("id"),company,setCompany));
	}
	
	/**
     * 模块：华港监控
     * 功能：一键静音
     */
    @Before(POST.class)
    public void silent(){
        Integer company = getParaToInt("company");
        try {
            if(company == null){
                User user = SecurityContextUtil.getLoginUser(getRequest());
                company = user.getInt("company");
            }
            Screen.me.silent(company);
            renderJson(new ResponseData(true,  "静音设置成功!"));
        } catch (Exception e) {
            renderJson(new ResponseData(false, "一键静音设置失败,失败原因:" + e.getMessage()+"!"));
        }
    }
	
	/**
     * 模块：华港监控大屏
     * 功能：保存属性
     */
	@Before(POST.class)
    public void saveColumns(){
	    Integer id = getParaToInt("id");
	    String columns = getPara("columns");
	    Integer setting = getParaToInt("company");
        User user = SecurityContextUtil.getLoginUser(getRequest());
        Integer company = user.getInt("company");
        if (setting == null) 
            setting = company;
        try {
            if (id == null) 
                Db.update("insert into scr_settings (columns,setting,creator,company,create_time) values (?,?,?,?,?)",
                    setting, setting, user.getInt("id"), company, new Date());
            else
                Db.update("update scr_settings set columns = ?, update_time = ? where id = ?", columns, new Date(), id);
        } catch (Exception e) {
            renderJson(new ResponseData(false,"展示属性保存失败,失败原因:"+e.getMessage()+"!"));
            return;
        }
        renderJson(new ResponseData(true,"展示属性保存成功!"));
    }
	
	/**
     * 模块：大屏监控
     * 功能：获取公司站点分页列表
     */
    public void getPageTanks(){
        Integer company = getParaToInt("company");
        User user = SecurityContextUtil.getLoginUser(getRequest());
        if(company == null)
            company = user.getInt("company");
        renderJson(Screen.me.getPageTanks(getParaToInt("id"), getPara("searchTxt"),
            company, getParaToInt("page"), getParaToInt("limit")));
    }
    
    /**
     * 模块：大屏监控
     * 功能：数据视图数据
     */
    public void getDeviceData() throws Exception{
        renderJson(DPJK.me.getDeviceData(getParaToInt("id")));
    }
    
    /**
     * 模块：大屏监控
     * 功能：数据视图数据
     */
	public void tk_curve_dyn() {
		setAttr("yearmmdd", DateFormatUtils.format(new Date(), "yyyy-MM-dd"));
		setAttr("sdate", DateFormatUtils.format(new Date(), "yyyy-MM-dd")+" 00:00:00");
		setAttr("edate", DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
		setAttr("tankid", getPara("id"));
		setAttr("tankname", getPara("name"));
		render("tk_curve_dynamic.jsp");
	}
}
