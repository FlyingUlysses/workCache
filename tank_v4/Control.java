package com.yawa.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.common.ConstantItems;
import com.yawa.common.DataPkg;
import com.yawa.core.model.Company;
import com.yawa.core.model.LogApp;
import com.yawa.core.model.User;
import com.yawa.http.SocketClient;
import com.yawa.rpt.model.RptTankHour;
import com.yawa.tank.model.RecordTank;
import com.yawa.tank.model.Tank;
import com.yawa.tank.model.TankAttr;
import com.yawa.util.DateTools;

public class Control {

	public static final Control me = new Control();
	
	/**
	 * 片区过滤
	 * @param user
	 * @param company
	 * @return
	 * @Description:
	 */
	public String filterMaintaince(Integer oper, Integer id){
	    String filter = "";
	    if(id == null){
            User user = User.me.findById(oper);
            id = user.getInt("company");
        }
	    Record rela = User.me.getUserMaintaince(oper);
        if(rela != null){
            Integer part = rela.getInt("part");
            String sites = rela.getStr("sites");
            if(part == 1 && StringUtils.isNotEmpty(sites))
                filter += " and find_in_set(t.site_id, '" + sites + "')";
        }
        if(!Company.me.isSystem(Company.me.findById(id)))
            filter += " and find_in_set(" + id + ", c.path)";
        return filter;
	}
	
	public DataPkg getPageList(DataPkg datapkg) {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("列表查詢成功");
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = null;
        Integer page = 1;
        Integer limit = 50;
        try{ id = jsonObj.getInt("company"); }catch(Exception e){}
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        String filter = filterMaintaince(datapkg.getOperID(), id);
        rtdatapkg.setOutParam(Db.find("select t.id, t.name, t.cube, "
        	+ " group_concat((case when sd.online is null or sd.online = 0 then concat(d.abbr, '_off_', dt.name)"
        	+ "    when sd.alerts is not null then concat(d.abbr, '_alert_', dt.name) else concat(d.abbr, '_on_', dt.name) end) order by d.sort asc) abbr"
        	+ " from tanks t left join sites s on t.site_id = s.id left join site_device sd on find_in_set(t.id, sd.tank_ids)"
        	+ " left join data_tanks dt on sd.id = dt.device_id left join data_cards dc on sd.id = dc.device_id"
        	+ " left join data_lljs dl on sd.id = dl.device_id left join devices d on sd.deviceId = d.id"
        	+ " left join (select code, name from dict where group_code = 'SITE.DEVICE' and type = 'I' and state = 1) dt on d.abbr = dt.code"
        	+ " left join base_companys c on t.company = c.id where s.state = 1 and t.state = 1 and sd.state = 1 " + filter + " group by t.id"
        	+ " order by t.company, avg(sd.online) asc, group_concat(sd.alerts) desc limit ?,?", (page - 1) * limit,limit));
        return rtdatapkg;
	}

	public DataPkg getPageData(DataPkg datapkg) {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("列表查詢成功");
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = null;
        Integer page = 1;
        Integer limit = 50;
        try{ id = jsonObj.getInt("company"); }catch(Exception e){}
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        String filter = filterMaintaince(datapkg.getOperID(), id);
        rtdatapkg.setOutParam(Db.find("select t.id, t.name, max(dt.scale) scale, max(dt.pressure) pressure, max(dt.ext_press_1) ext_press_1,"
            + " max(dt.ext_press_2) ext_press_2, max(dt.ext_temp) ext_temp, max(dl.ext_flow) ext_flow,"
            + " max(case when dt.id is not null and sd.online = 0 then 'off' when dt.id is not null and sd.alerts is not null then 'alert' end) plc_state,"
            + " max(case when dl.id is not null and sd.online = 0 then 'off' when dl.id is not null and sd.alerts is not null then 'alert' end) llj_state,"
            + "(select group_concat(b.field) from core_alerts a, core_attrs b where find_in_set(a.id, group_concat(sd.alerts)) and a.attr_id = b.attr_id) fields"
            + " from tanks t left join site_device sd on find_in_set(t.id, sd.tank_ids) left join data_tanks dt on sd.id = dt.device_id"
            + " left join data_lljs dl on sd.id = dl.device_id left join base_companys c on t.company = c.id where t.state = 1 and sd.state = 1" + filter
            + " group by t.id order by t.company, avg(sd.online) asc, group_concat(sd.alerts) desc limit ?,?", (page - 1) * limit, limit));
        return rtdatapkg;
	}
	
	public DataPkg getPageValves(DataPkg datapkg) {
		DataPkg rtdatapkg = new DataPkg();
		JSONObject jsonObj = datapkg.getInParam();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("阀门列表查詢成功");
        Integer id = null;
        Integer page = 1;
        Integer limit = 50;
        try{ id = jsonObj.getInt("company"); }catch(Exception e){}
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        String filter = filterMaintaince(datapkg.getOperID(), id);
        rtdatapkg.setOutParam(Db.find("select id, name, trans_time,"
            + "(case when online = 1 then 'on' else 'off' end) line, valve, group_concat(valve,'_', class order by sort asc) valves"
            + " from (select t.id, t.name, sdv.name valve, sd.online, sd.trans_time, sdv.sort,"
            + "(case when cv.class is not null then cv.class when tr.value = 1 then 'open' when tr.value = 0 then 'close' end) class"
            + " from tanks t inner join site_device sd on find_in_set(t.id, sd.tank_ids)"
            + " inner join site_device_valve sdv on sd.id = sdv.deviceId"
            + " inner join tank_attrs tr on sdv.deviceId = tr.device_id and sdv.attr_id = tr.attr_id"
            + " left join core_valves cv on tr.attr_id = cv.attr_id and tr.value = cv.value"
            + " left join base_companys c on t.company = c.id where t.state = 1 " + filter + ") aa"
            + " group by aa.id order by aa.id limit ?,?", (page - 1) * limit,limit));
        return rtdatapkg;
	}

	// 查看液位
    public DataPkg getPageScales(DataPkg datapkg) {
        DataPkg rtdatapkg = new DataPkg();
        JSONObject jsonObj = datapkg.getInParam();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("列表数据查詢成功");
        Integer page = 1;
        Integer limit = 50;
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        User user = User.me.findById(datapkg.getOperID());
        Integer id = Company.me.getRootCompany(user.getInt("company"));
        String filter = filterMaintaince(datapkg.getOperID(), id);
        rtdatapkg.setOutParam(Db.find("select * from (select s.id, t.id tank, t.name, t.cube,"
            + "(case when dt.id is not null then 'plc' else 'card' end) classify,"
            + "(case when dt.id is not null then concat(dt.rate,'%') when dc.id is not null then concat(dc.rate,'%') end) rate,"
            + "(case when timestampdiff(second, dt.update_time,now()) > 300 or timestampdiff(second, dc.update_time,now()) > 300 then 'off' else 'on' end) line,"
            + "(case when dt.rate < 20 or dc.rate < 20 then 'alert' when (dt.rate >= 20 and dt.rate < 50) or (dc.rate >= 20 and dc.rate < 50) then 'warn' when dt.rate >= 50 or dc.rate >= 50 then 'info' end) class,"
            + "(case when dt.id is not null and dt.supply_days is not null then dt.supply_days when dt.id is not null then '未用气' when dc.id is not null and dc.supply_days is not null then dc.supply_days when dc.id is null then '为用气' end) cnt,"
            + " dt.scale, dt.volume, dt.weight, dc.device_id, dc.card_gqzl, dc.card_yqzl, dc.card_syql, dc.card_ffyq"
            + " from sites s left join tanks t on s.id = t.site_id left join data_tanks dt on find_in_set(t.id, dt.tank_ids)"
            + " left join data_cards dc on find_in_set(t.id, dc.tank_ids) left join base_companys c on s.company = c.id"
            + " where s.state = 1 and t.state = 1 and (dt.id is not null or dc.id is not null) " + filter + " ) aa order by id asc limit ?,?", (page - 1) * limit,limit));
        return rtdatapkg;
    }
    
    private List<Record> getDeviceAttrs(Integer device, String abbr){
        return Db.find("select c.clazz, a.name, b.value, a.unit, b.alert"
            + " from site_device_attr a left join tank_attrs b on a.deviceId = b.device_id and a.attr_id = b.attr_id"
            + " left join core_attrs c on a.attr_id = c.attr_id left join site_device d on a.deviceId = d.id"
            + " where a.state = 1 and c.abbr = ? and a.deviceId = ? order by c.sort asc", abbr, device);
    }
    
    private void addAttr(List<Record> attrs, Integer loc, Record rd, String field, String value,
        String desc, String unit){
        if(attrs.size() > 0){
            Object data = StringUtils.isEmpty(field)? value : rd.get(field);
            if(data != null){
                Record attr = new Record().set("name", desc)
                    .set("value", data).set("unit", unit);
                if(loc == null)
                    attrs.add(attr);
                else
                    attrs.add(loc, attr);
                rd.remove(field);
            }
        }
    }
    
    /**
     * 设备监控
     * 手机监控详情
     * @param device
     * @param abbr
     * @return
     * @Description:
     */
    private Map<String,Object> getTankAttrs(Integer id) {
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("sattrs", TankAttr.me.getSwitchAttrs(id));
        List<Record> rds = Db.find("select a.id, a.site_id, a.online, a.trans_time, b.abbr, "
            + " round(dt.scale / 25.4,2) inch, dt.weight, dt.volume, dt.rate, "
            + " do.mass, (case when dt.id is not null then dt.supply_days when dc.id is not null then dc.supply_days"
            + " when do.id is not null then do.supply_days end) supply, b.classify, (select name from dict"
            + " where group_code = 'SITE.DEVICE' and code = b.abbr) device_name"
            + " from site_device a left join devices b on a.deviceId = b.id left join data_tanks dt on a.id = dt.device_id"
            + " left join data_cards dc on a.id = dc.device_id left join data_odors do on a.id = do.device_id"
            + " where a.state = 1 and find_in_set(?, a.tank_ids)"
            + " and (a.location is null or a.location = '' or a.location = 'trunk') order by b.sort asc", id);
        List<Record> attrs =  null;
        List<Record> dwps =  null;
        Record dwpRd = null;
        List<Record> devices = new ArrayList<Record>();
        for(Record rd: rds){
            Integer device = rd.getInt("id");
            String abbr = rd.getStr("abbr");
            if(abbr.equals("plc")){
                attrs =  getDeviceAttrs(device, "env");
                if(attrs.size() > 0)
                    devices.add(new Record().setColumns(rd.getColumns()).set("classify", "env")
                        .set("abbr", "env").set("device_name", "环境").set("items", attrs));
                attrs = getDeviceAttrs(device, "tank");
                if(attrs.size() > 0){
                    addAttr(attrs, 0, rd, "inch", null, "英寸液位", "inch");
                    addAttr(attrs, 2, rd, "weight", null, "液体质量", "KG");
                    addAttr(attrs, 3, rd, "volume", null, "液体体积", "m³");
                    addAttr(attrs, null, rd, "supply", null, "可供气天数", null);
                    devices.add(new Record().setColumns(rd.getColumns()).set("classify", "tank")
                        .set("abbr", "tank").set("device_name", "LNG").set("items", attrs));
                }
                attrs = getDeviceAttrs(device, "tyq");
                if(attrs.size() > 0)
                    devices.add(new Record().setColumns(rd.getColumns()).set("classify", "tyq")
                        .set("abbr", "tyq").set("device_name", "调压撬")
                        .set("rate", null).set("items", attrs));
                dwps = getDeviceAttrs(device, "relay");
                dwpRd = rd;
            }else if(abbr.equals("odor")){
                attrs = getDeviceAttrs(device, abbr);
                if(attrs.size() > 0){
                    addAttr(attrs, null, rd, "mass", null, "药剂质量", "g");
                    addAttr(attrs, null, rd, "supply", null, "可加臭天数", null);
                    rd.set("items", attrs);
                    devices.add(rd);
                }
            }else if(abbr.equals("cc")){
                attrs = getDeviceAttrs(device, abbr);
                if(attrs.size() > 0){
                    addAttr(attrs, null, rd, "supply", null, "可用气天数", null);
                    rd.set("items", attrs);
                    devices.add(rd);
                }
            }else if(abbr.equals("relay")){
                if(dwpRd != null){
                    rd = dwpRd;
                    rd.set("classify", "dewar")
                      .set("abbr", "relay")
                      .set("device_name", "杜瓦瓶");
                }
                rd.set("dewars", Db.find("select dd.sensor, ifnull(d.dewar, '未设置') dewar,"
                    + " dd.`group`, dd.rate, dd.update_time, (case when timestampdiff(second, dd.update_time,now()) >"
                    + "(select value from app_base where code = 'dewar_seconds') then 'off' else 'on' end) state"
                    + " from data_dewars dd left join dewars d on dd.sensor = d.sensor"
                    + " where dd.site_id = ? and rm_id = (select max(rm_id) from data_dewars where site_id = ?) order by dd.`group` asc", 
                    rd.getInt("site_id"), rd.getInt("site_id")));
                if(dwps != null && dwps.size() > 0){
                    Tank tank = Tank.me.findById(id);
                    String cnt = tank.getInt("cnt") == null? "" : String.valueOf(tank.getInt("cnt"));
                    addAttr(dwps, null, rd, null, cnt, "在线杜瓦瓶", null);
                    rd.set("items", dwps);
                }
                devices.add(rd);
            }else{
                attrs = getDeviceAttrs(device, abbr);
                rd.set("items", attrs);
                devices.add(rd);
            }
        }
        params.put("data", devices);
        return params;
    }
    
	public DataPkg getTankAttrs(DataPkg datapkg) throws Exception {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("详情数据查詢成功");
		JSONObject jsonObj = datapkg.getInParam();
		Integer id = jsonObj.getInt("id");
		if(id == null)
		    throw new Exception("未获取储罐标识!");
		rtdatapkg.setOutParam(getTankAttrs(id));
		return rtdatapkg;
	}
    
	public DataPkg isSatellite(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = jsonObj.getInt("id");
        if(id == null)
            throw new Exception("未获取储罐标识！");
        String classify = Db.queryStr("select a.classify from sites a, tanks b"
            + " where a.id = b.site_id and b.id = ?", id);
        rtdatapkg.setOutParam(classify.equals("satellite"));
        return rtdatapkg;
    } 

    public DataPkg getSwitches(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = jsonObj.getInt("id");
        if(id == null)
            throw new Exception("未获取储罐标识！");
        rtdatapkg.setOutParam(Db.find("select d.classify code, d.name"
            + " from site_device sd, devices d where sd.deviceId = d.id"
            + " and find_in_set(?, sd.tank_ids) and sd.state = 1 order by d.sort asc", id));
        return rtdatapkg;
    }
    
    public DataPkg getSiteUsers(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = jsonObj.getInt("id");
        if(id == null)
            throw new Exception("未获取储罐标识！");
        rtdatapkg.setOutParam(Db.find("select a.id, a.name, dc.card_gqzl, dc.card_yqzl, dc.card_syql, dc.card_ffyq,"
            + " dl.ext_flow, dl.flow_bk, dl.flow_gk, dl.flow_press, dl.flow_temp from csrs a"
            + " left join data_cards dc on a.card_id = dc.device_id"
            + " left join data_lljs dl on a.flow_id = dl.device_id"
            + " where a.site_id in (select site_id from tanks where id = ?) and a.state = 1", id));
        return rtdatapkg;
    }
    
    public DataPkg getCsrData(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = jsonObj.getInt("id");
        if(id == null)
            throw new Exception("未获取用户标识！");
        List<Record> rds = Db.find("select a.id, b.classify, a.online, a.trans_time,"
            + "(case when b.classify = 'llj' then '流量计' when b.classify = 'card' then '卡控表' end) device_name"
            + " from site_device a left join devices b on a.deviceId = b.id"
            + " where a.state = 1 and (a.id in(select flow_id from csrs where id = ?) or a.id in(select card_id from csrs where id = ?))"
            + " order by b.sort asc", id, id);
        for(Record rd: rds){
            Integer device = rd.getInt("id");
            String classify = rd.getStr("classify");
            rd.set("items",  getDeviceAttrs(device, classify));
        }
        rtdatapkg.setOutParam(rds);
        return rtdatapkg;
    }
    
    public DataPkg getDewar(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        String sensor = jsonObj.getString("sensor");
        if(StringUtils.isEmpty(sensor))
            throw new Exception("未获取传感器编码");
        Hashtable<String, Object> htTable = new Hashtable<String, Object>();
        htTable.put("dewar", Db.findFirst("select d.dewar, dd.* from data_dewars dd"
            + " left join dewars d on dd.sensor = d.sensor where dd.sensor = ?", sensor));
        htTable.put("specs", Db.find("select ls.code, ls.name, les.value, les.unit"
            + " from data_dewars dd inner join dewars d on dd.sensor = d.sensor"
            + " inner join ledger_equip_specs les on d.equip_id = les.equip_id"
            + " inner join ledger_specs ls on ls.deviceType = 'dewar' and les.code = ls.code"
            + " where dd.sensor = ? order by les.id asc", sensor));
        rtdatapkg.setOutParam(htTable);
        return rtdatapkg;
    }
    
	public DataPkg getValves(DataPkg datapkg) {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("远程控制界面初始化成功");
		JSONObject jsonObj = datapkg.getInParam();
		rtdatapkg.setOutParam(Db.find("select b.attr_id, b.name,"
			+ " group_concat(c.code, '-', c.action) acts, d.value code"
			+ " from site_device a inner join site_device_valve b on a.id = b.deviceId"
			+ " inner join site_valve_action c on b.id = c.valveId"
			+ " inner join tank_attrs d on a.id = d.device_id and b.attr_id = d.attr_id"
			+ " where a.state = 1 and b.state = 1 and find_in_set(?, a.tank_ids) and d.value is not null"
			+ " group by b.id order by b.sort asc", jsonObj.getInt("id")));
		return rtdatapkg;
	}

    public DataPkg getValveAttr(DataPkg datapkg) throws Exception {
        DataPkg rtdatapkg = new DataPkg();
        rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("阀门操作成功");
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = null;
        String attr = "";
        String code = "";
        try{ id = jsonObj.getInt("id"); }catch(Exception e){}
        try{ attr = jsonObj.getString("attr"); }catch(Exception e){}
        try{ code = jsonObj.getString("code"); }catch(Exception e){}
        if(id == null || StringUtils.isEmpty(attr) || StringUtils.isEmpty(code))
            throw new Exception("参数错误！");
        Long cnt = Db.queryLong("select count(*) from tank_attrs a, site_device b"
            + " where a.device_id = b.id and find_in_set(?, b.tank_ids) and a.attr_id = ? and a.value = ?", id, attr, code);
        rtdatapkg.setOutParam(cnt);
        return rtdatapkg;
    }
	   
	private com.alibaba.fastjson.JSONObject invoke(Integer id, String attr,
	    Integer value, boolean isSync) throws Exception{
	    Map<String, Object> paraMap = new HashMap<String, Object>();
	    paraMap.put("id", id);
	    paraMap.put("attr", attr);
	    paraMap.put("value", value);
	    return SocketClient.invoke("valveClick", paraMap, isSync);
	}
	
	public DataPkg valveClick(DataPkg datapkg) throws Exception {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_BUSFAILED);
        rtdatapkg.setRetmsg("未获取操作响应!");
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = null;
        String attr = "";
        Integer code = null;
	    try{ id = jsonObj.getInt("id"); }catch(Exception e){}
	    try{ attr = jsonObj.getString("attr"); }catch(Exception e){}
	    try{ code = jsonObj.getInt("code"); }catch(Exception e){}
	    if(id == null || StringUtils.isEmpty(attr) || code == null)
	    	throw new Exception("阀门参数错误！");
	    com.alibaba.fastjson.JSONObject iResult = invoke(id, attr, code, true);
	    if(iResult != null){
	        rtdatapkg.setRetcode(iResult.getString(ConstantItems.DEFAULT_ELE_RSPCODE));
	        rtdatapkg.setRetmsg(iResult.getString(ConstantItems.DEFAULT_ELE_RSPDESC));
	    }
	    LogApp.me.Log(datapkg.getRequest(), id, "valve", rtdatapkg.getsRspDesc(), datapkg.getOperID(), datapkg.getToken());
		return rtdatapkg;
	}

	public DataPkg eStop(DataPkg datapkg) throws Exception {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtdatapkg.setRetmsg("站点紧急停止操作成功");
        JSONObject jsonObj = datapkg.getInParam();
        Integer id = null;
	    try{ id = jsonObj.getInt("id"); }catch(Exception e){}
	    if(id == null)
	    	throw new Exception("参数错误！");
	    List<Record> rds = Db.find("select b.attr_id, b.estop from site_device a"
	    	+ " left join site_device_valve b on a.id = b.deviceId"
	    	+ " where find_in_set(?, a.tank_ids) and b.estop is not null", id);
	    for(Record row: rds){
	    	String attr = row.getStr("attr_id");
	    	invoke(id, attr, row.getInt("estop"), false);
	    }
	    LogApp.me.Log(datapkg.getRequest(),id, "valve", "紧急停止",
            datapkg.getOperID(), datapkg.getToken());
		return rtdatapkg;
	}
	
	private String getTime(String time, String direct){
		if(StringUtils.isEmpty(time))
	        return DateTools.formatDate(new Date());
        Date search = DateTools.parseData(time);
        if(direct.equals("prev"))
        	search = DateTools.getLast(search);
        else if(direct.equals("next"))
        	search = DateTools.getNext(search);
		return DateTools.formatDate(search);
	}
	
	public DataPkg getPageRecords(DataPkg datapkg) throws Exception {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        Integer id = null;
        Integer page = 0;
        Integer limit = 80;
        String  time = "";
        String  direct = "";
        String  device = "";
        JSONObject jsonObj = datapkg.getInParam();
        try{ id = jsonObj.getInt("id"); }catch(Exception e){}
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        try{ time = jsonObj.getString("time"); }catch(Exception e){}
        try{ direct = jsonObj.getString("direct"); }catch(Exception e){}
        try{ device = jsonObj.getString("device"); }catch(Exception e){}
        if(id == null)
        	throw new Exception("参数id错误!");
        time = getTime(time, direct);
        Hashtable<String, Object> hashTable = new Hashtable<String, Object>();
        hashTable.put("date", time);
		hashTable.put("logs", RecordTank.me.getPages(id, device, time, page, limit));
		rtdatapkg.setOutParam(hashTable);
        return rtdatapkg;
	}

	public DataPkg getPageHours(DataPkg datapkg) throws Exception {
		DataPkg rtdatapkg = new DataPkg();
		rtdatapkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        Integer id = null;
        Integer page = 0;
        Integer limit = 100;
        String  time = "";
        String  direct = "";
        JSONObject jsonObj = datapkg.getInParam();
        try{ id = jsonObj.getInt("id"); }catch(Exception e){}
        try{ page = jsonObj.getInt("page"); }catch(Exception e){}
        try{ time = jsonObj.getString("time"); }catch(Exception e){}
        try{ direct = jsonObj.getString("direct"); }catch(Exception e){}
        if(id == null)
        	throw new Exception("参数id错误!");
        time = getTime(time, direct);
        Hashtable<String, Object> hashTable = new Hashtable<String, Object>();
        hashTable.put("date", time);
		hashTable.put("logs", RptTankHour.me.getPages(id, time, time, null ,page,limit));
		rtdatapkg.setOutParam(hashTable);
        return rtdatapkg;
	}
}
