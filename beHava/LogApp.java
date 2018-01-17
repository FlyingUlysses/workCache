package com.yawa.core.model;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.DateTools;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class LogApp extends Model<LogApp> {

	public static final LogApp me = new LogApp();

	public String getFilter(String stat, Integer plat, String type, Integer uid){
		String filter = "";
		if(StringUtils.isNotEmpty(stat))
			filter += " and a.stat_date = '" + stat + "'";
		if(plat != null)
			filter += " and a.plat = " + plat;
		if(StringUtils.isNotEmpty(type))
			filter += " and a.busitype = '" + type + "'";
		if(uid != null)
			filter += " and a.userId = " + uid;
		return filter;
	}
	
	/**
	 * 用户日志分页查询
	 * @param user
	 * @param page
	 * @param limit
	 * @return
	 */
	public Page<LogApp> getPages(Integer user, Integer page, Integer limit) {
		String filter = "";
		if(user != null)
			filter = " and t.userId = " + user;
		String sql = "select count(1) from log_apps t where 1=1";
		Long count = Db.queryLong(sql + filter);
		sql = "select t.*,d.name busitype_name  from log_apps t left join (select code,name from dict"
			+ " where group_code = 'APP.BUSITYPE' and type = 'I') d on t.busitype = d.code"
			+ " where 1 = 1" + filter;
		sql += " order by t.id desc limit ?,?";
		return new Page<LogApp>(page, limit, count, find(sql, (page - 1) * limit,limit));
	}
	
	public void Log(HttpServletRequest req,Integer keyid, 
			String act, String remarks, Integer user, String token){
		LogApp logApp = new LogApp();
	    logApp.set("userId", user)
			  .set("token", token)
			  .set("ipaddress", req.getRemoteAddr())
			  .set("keyid", keyid)
			  .set("busitype", act)
			  .set("remarks", remarks)
			  .set("action_date", new Date())
			  .save();
	}
	
	public void LogWeb(HttpServletRequest req, Integer uid,
			String busy, Integer kid, String remarks){
		LogApp logApp = new LogApp();
	    logApp.set("plat", 1)
	    	  .set("stat_date", DateTools.formatDate(new Date()))
	    	  .set("userId", uid)
			  .set("ipaddress", req.getRemoteAddr())
			  .set("keyid", kid)
			  .set("busitype", busy)
			  .set("remarks", remarks)
			  .set("create_time", new Date())
			  .save();
	}
	
	public void LogClient(HttpServletRequest req, Integer uid, String deviceId,
			String busy, Integer kid, String remarks){
		LogApp logApp = new LogApp();
	    logApp.set("plat", 2)
	    	  .set("stat_date", DateTools.formatDate(new Date()))
	    	  .set("userId", uid)
	    	  .set("deviceId", deviceId)
			  .set("ipaddress", req.getRemoteAddr())
			  .set("keyid", kid)
			  .set("busitype", busy)
			  .set("remarks", remarks)
			  .set("create_time", new Date())
			  .save();
	}
	
	/**
	 * @Title:获取filter条件
	 * @Author:WangYong
	 * @Since:2018-01-11
	 * @Version:1.1.0
	 */
	public String getFilter(Integer littleOid,Integer type,String startDate,Integer uid,boolean isLoging,Integer menuId,String searchText){
		String filter ="";
		if(littleOid !=null){
			Org org = Org.me.findById(littleOid);
			filter += " and o.code like '"+org.getStr("code")+"%' ";
		}
		if(type != null )
			filter += " and la.plat = "+type+" ";
		if (StringUtils.isNotBlank(startDate)) 
			filter += " and la.stat_date like '"+startDate+"%' ";
		if(uid != null)
			filter += " and la.userId = "+uid;
		if(isLoging)
			filter += " and la.busitype  in ('auto','login')  ";
		else
			filter += " and la.busitype = 'access' ";
		
		if(menuId != null && !isLoging)
			filter += " and la.keyid = "+menuId;
		if(StringUtils.isNotBlank(searchText))
			filter += " and u.name like '"+searchText+"%' ";
		return filter;
	}

	/**
	 * @Title:查询柱状图数据
	 * @Description:根据组织和账期加载详细数据图
	 * @Author:WangYong
	 * @Since:2018-01-11
	 * @Version:1.1.0
	 */
	public HashMap<String, Object> reloadLogingBarChart(Integer oid,String start_date, boolean isLoging) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		String filter = getFilter(null, 1, start_date, null, isLoging, null,null);
		List<Org> orgList = Org.me.find("select id,name from base_org o where o.code like CONCAT((select code from base_org where id ="+oid+"),'%') and  (o.id= "+oid+" or o.parent ="+oid+") and o.clazz =1 ");
		List<LogApp> webList = find(" select o.id, count(1) count from log_apps la , base_org o  where  o.id =la.org_id and  o.id = "+oid+filter+" "
				+ " UNION " 
				+ " select o2.id, count(1) count from log_apps la, base_org o1, base_org o2 "
				+ " where  la.org_id = o1.id and o1.code like concat(o2.code, '%') and o2.parent = "+oid+filter+" and o2.clazz = 1 group by o2.id order by id ");
		filter = getFilter(null, 2, start_date, null, isLoging, null,null);
		List<LogApp> appList = find(" select o.id, count(1) count from log_apps la , base_org o where o.id =la.org_id and o.id = "+oid+filter+"  "
				+ " UNION " 
				+ " select o2.id, count(1) count from log_apps la, base_org o1, base_org o2 "
				+ " where  la.org_id = o1.id and o1.code like concat(o2.code, '%') and o2.parent = "+oid+filter+" and o2.clazz = 1 group by o2.id order by id ");
		map.put("web", webList);
		map.put("app", appList);
		map.put("orgList", orgList);
		return map;
	}

	/**
	 * @Title:查询访问菜单柱状图数据
	 * @Description:根据组织和账期加载详细数据图
	 * @Author:WangYong
	 * @Since:2018-01-15
	 * @Version:1.1.0
	 */
	public List<Record> reloadMenuBarChart(Integer oid, Integer type,String startDate, boolean isLoging) {
		String filter = getFilter(oid, type, startDate, null, false, null,null);
		String menu ="";
		if (type ==1) 
			menu = " base_menus ";
		else
			menu = " app_menus ";
		List<Record> find = Db.find("SELECT m.name name,la.keyid id,COUNT(la.id) count FROM log_apps la left join "+menu+" m on m.id = la.keyid left join base_org o on o.id = la.org_id where la.keyid is not null  "+ filter + " group by la.keyid ");
		return find;
	}

	/**
	 * @Title:查询折线图数据
	 * @Description:根据组织和账期加载详细数据图
	 * @Author:WangYong
	 * @Since:2018-01-11
	 * @Version:1.1.0
	 */
	public List<Record> reloadLineChart(Integer littleOid, String startDate,Integer type, boolean isLoging, Integer menuId) {
		String filter = getFilter(littleOid, type, startDate, null, isLoging,menuId,null);
		List<Record> list = Db.find("select DATE_FORMAT(la.create_time,'%d') id, COUNT(1) count from log_apps la left join base_org o on o.id = la.org_id  where true "+ filter + " GROUP BY  la.stat_date order by id ");
		return list;
	}

	/**
	 * @Title:每日详细操作数据
	 * @Description:根据组织和账期加载详细数据图
	 * @Author:WangYong
	 * @Since:2018-01-11
	 * @Version:1.1.0
	 */
	public Page<Record> reloadTable(Integer page, Integer limit,Integer littleOid, String startDay, Integer type, Integer uid,boolean isLoging, Integer menuId, String searchText) {
		String filter = getFilter(littleOid, type, startDay, uid, isLoging,menuId,searchText);
		long count = Db.queryLong(" select count(1) from log_apps la left join base_org o on o.id = la.org_id left join base_user u on u.id = la.userId where true "+ filter);
		List<Record> list = Db.find(" SELECT la.id,la.ipaddress,la.remarks,la.action,DATE_FORMAT(la.create_time,'%Y-%m-%d %H:%i:%s')create_time, la.org_id, u.name user_name, la.userId user_id,"
						+ " (select deviceModel from base_mobiles bm where la.plat =2 and  bm.deviceId = la.deviceId) model, "
						+ " (case when la.plat =1 then 'PC端' when la.plat =2 then '手机端' end) plat_name, "
						+ " (select name from dict where state =1 and GROUP_CODE = 'APP.BUSITYPE' and type = 'I' and code = la.busitype)busi_name "
						+ " FROM log_apps la left join base_org o on o.id = la.org_id left join base_user u on u.id = la.userId where true "+ filter+ " order by create_time desc  limit ?,? ", (page - 1)* limit, limit);
		return new Page<Record>(page, limit, count, list);
	}

	public Page<Record> reloadTableForUser(Integer page, Integer limit,Integer uid, String start_day) {
		String filter = "";
		if (StringUtils.isNotBlank(start_day)) 
			filter += " and la.stat_date like '"+start_day+"%' ";
		if(uid != null)
			filter += " and la.userId = "+uid;
		Long count = Db.queryLong("select count(1) from log_apps la where true "+filter);
		List<Record> list = Db.find("SELECT la.id,la.ipaddress,la.remarks,la.action,DATE_FORMAT(la.create_time,'%Y-%m-%d %H:%i:%s')create_time, la.org_id, la.userId user_id,la.busitype, "
				+"	(select deviceModel from base_mobiles bm where la.plat =2 and  bm.deviceId = la.deviceId) model, "
				+"	(case when la.plat =1 then 'PC端' when la.plat =2 then '手机端' end) plat_name "
				+"	 FROM log_apps la  where true "+filter+" order by la.create_time desc limit ?,? ",(page-1)*limit,limit);
		return new Page<Record>(page, limit, count, list);
	}

}