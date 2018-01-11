package com.yawa.core.model;

import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class LogApp extends Model<LogApp> {
	
	public static final LogApp me = new LogApp();

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
	
	public String getFilter(Integer littleOid,Integer type,String startDate,Integer uid,boolean isLoging){
		String filter ="";
		if(littleOid !=null)
			filter += " and la.org_id ="+littleOid+" ";
		if(type != null )
			filter += " and la.plat = "+type+" ";
		if (StringUtils.isNotBlank(startDate)) 
			filter += " and la.stat_date like '"+startDate+"%' ";
		if(uid != null)
			filter += " and la.userId = "+uid;
		if(isLoging)
			filter += " and la.busitype  in ('auto','login')  ";
		else
			filter += " and la.busitype not in ('auto','login') ";
		return filter;
	}
	
	/**
	 *@Title:查询柱状图数据
	 *@Description:根据组织和账期加载详细数据图
	 *@Author:WangYong
	 *@Since:2018-01-11
	 *@Version:1.1.0
	 */
	public  List<LogApp> reloadBarCharts(Integer oid,String start_date,Integer type,boolean isLoging) {
		String filter = getFilter(null,type,start_date,null,isLoging);
		Org org = Org.me.findById(oid);
		filter += " and o.code like '"+org.getStr("code")+"%' ";
		return find("SELECT o.id id, o.name,COUNT(la.id) count FROM base_org o left join log_apps la on la.org_id = o.id where true "+filter+" GROUP BY o.code ");
	}
	
	/**
	 *@Title:查询折线图数据
	 *@Description:根据组织和账期加载详细数据图
	 *@Author:WangYong
	 *@Since:2018-01-11
	 *@Version:1.1.0
	 */
	public List<Record> reloadLineChart(Integer littleOid, String startDate,Integer type,boolean isLoging) {
		String filter = getFilter(littleOid,type,startDate,null, isLoging);
		return Db.find("select DATE_FORMAT(la.create_time,'%d') id, COUNT(1) count from log_apps la  where true "+filter+" GROUP BY  la.stat_date order by id ");
	}
	
	/**
	 *@Title:每日详细操作数据
	 *@Description:根据组织和账期加载详细数据图
	 *@Author:WangYong
	 *@Since:2018-01-11
	 *@Version:1.1.0
	 */
	public Page<Record> reloadTable(Integer page, Integer limit, Integer littleOid, String startDate,Integer type,Integer uid,boolean isLoging) {
		String filter = getFilter(littleOid, type, startDate,uid,isLoging);
		long count =Db.queryLong(" select count(1) from log_apps la where true "+filter);
		List<Record> list = Db.find(" SELECT la.id,la.ipaddress,la.remarks,la.action,DATE_FORMAT(la.create_time,'%H:%i:%s')create_time, la.org_id,"
		   +" (select name from base_user where id = la.userId) user_name, la.userId user_id,"
		   +" (select name from dict where state =1 and GROUP_CODE = 'APP.BUSITYPE' and type = 'I' and code = la.busitype)busi_name "
		   +" FROM log_apps la where true "+filter+" order by create_time desc  limit ?,? ",(page-1)*limit,limit) ;
		return new Page<Record>(page, limit, count,list);
	}
	
	
}