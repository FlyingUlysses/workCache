package com.yawa.util.excel;

import org.apache.commons.lang.StringUtils;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class Excel extends Model<Excel> {
	public static final Excel me = new Excel();
	
    public Page<Record> getPages(String code, String name, Integer page, Integer limit) {
        String filter ="";
        if(StringUtils.isNotBlank(code))
            filter+=" and t.busiType like '%"+code+"%' ";
        if(StringUtils.isNotBlank(name))
            filter+=" and t.name like '%"+name+"%' ";
        Long count = Db.queryLong("select count(1) from excels t left join excel_parts t1 on t.id= t1.excel_id where t.state =1 and t1.state =1 "+filter);
        String sql="select t.id, t.busiType type,t.name,DATE_FORMAT(t.create_time,'%Y-%m-%d') create_time,t.desc,t1.id part_id,t1.name part_name from excels t "
                   +" left join excel_parts t1 on t.id= t1.excel_id "
                   +" where t.state =1 and t1.state =1 "+filter+" order by t.id,t1.sort limit ?,?";
        return new Page<Record>(page, limit, count, Db.find(sql,(page - 1) * limit,limit));
    }
	
}