package com.yawa.util.autoPoi;


import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class PoiAutoExport extends Model<PoiAutoExport>{
    public static final PoiAutoExport me = new PoiAutoExport();

    public Page<Record> getPages(Integer page, Integer limit, String table_name, String table_code) {
        String filter="";
        if (StringUtils.isNotBlank(table_name)) {
            filter+=" and TABLE_COMMENT like '%"+ table_name+"%' ";
        }
        if (StringUtils.isNotBlank(table_code)) {
            filter+=" and TABLE_NAME like '%"+table_code+"%' ";
        }
        Long count = Db.queryLong("select count(1) from information_schema.tables where table_schema=? "+filter,PoiConstanceItems.TABLE_SCHEMA);
        String sql="select TABLE_NAME code,TABLE_COMMENT name,DATE_FORMAT(CREATE_TIME,'%Y-%m-%d')create_time from information_schema.tables where table_schema=? "+filter+" limit ?,?";
        return new Page<Record>(page, limit, count, Db.find(sql,PoiConstanceItems.TABLE_SCHEMA,(page - 1) * limit,limit));
    }


    public LinkedHashMap<String, List<Record>> gtPropertyList(String tableName) {
        LinkedHashMap<String, List<Record>> map = new LinkedHashMap<String, List<Record>>();
        List<Record> tables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",PoiConstanceItems.TABLE_SCHEMA,tableName);
        int num =1;
        for (Record table : tables) {
           table.set("re_table_name", "t"+num);
           num++;
        }
        tables.add(new Record().set("re_table", tableName).set("re_table_name", "t"));
        for (Record table : tables) {
            List<Record> colmuns = Db.find("SELECT TABLE_NAME,COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_name =? AND table_schema=?",table.getStr("re_table"),PoiConstanceItems.TABLE_SCHEMA);
                for (Record column : colmuns) {
                        column.set("re_table_name", table.getStr("re_table_name"));
                }
            JSONObject obj = new JSONObject();
            obj.put("column_name", table.getStr("column_name"));
            obj.put("re_table", table.getStr("re_table"));
            obj.put("re_column", table.getStr("re_column"));
            obj.put("re_table_name", table.getStr("re_table_name"));
            map.put(JSONObject.toJSONString(obj),colmuns);
        }
        return map;
    }
    
    /*
     * 根据主表表名获取相关分表数据
     */
    public List<Record> getSheetTable(String tableName) {
        List<Record> tables =new ArrayList<Record>();
        tables.add(new Record().set("re_table", tableName));
        List<Record> joinTables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",PoiConstanceItems.TABLE_SCHEMA,tableName);
        int num =1;
        for (Record table : joinTables) {
           table.set("re_table_name", "t"+num);
           num++;
        }
        tables.addAll(joinTables);
        return tables;
    }
    
    /*
     * 根据选择sheet主表查询sheet字段信息
     */
    public List<Record> getSheetColumns(String tableName) {
        List<Record> tables = Db.find("SELECT COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",PoiConstanceItems.TABLE_SCHEMA,tableName);
        return tables;
    }
    
}
