package com.yawa.util.autoPoi;


import java.util.LinkedHashMap;
import java.util.List;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class PoiAutoExport extends Model<PoiAutoExport>{
    public static final PoiAutoExport me = new PoiAutoExport();

    public Page<Record> getPages(Integer page, Integer limit) {
        Long count = Db.queryLong("select count(1) from information_schema.tables where table_schema=?",PoiConstanceItems.TABLE_SCHEMA);
        String sql="select TABLE_NAME code,TABLE_COMMENT name,DATE_FORMAT(CREATE_TIME,'%Y-%m-%d')create_time from information_schema.tables where table_schema=? limit ?,?";
        return new Page<Record>(page, limit, count, Db.find(sql,PoiConstanceItems.TABLE_SCHEMA,(page - 1) * limit,limit));
    }

    public LinkedHashMap<String, List<Record>> getColumns(String tableName) {
        LinkedHashMap<String, List<Record>> map = new LinkedHashMap<String, List<Record>>();
        List<Record> data = Db.find("SELECT TABLE_NAME,COLUMN_NAME ,DATA_TYPE,COLUMN_COMMENT remarks, 't' re_table_name FROM information_schema.COLUMNS t WHERE table_name =? AND table_schema=?",tableName,PoiConstanceItems.TABLE_SCHEMA);
        map.put(tableName +"  #t", data);
        List<Record> joinTables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%'",PoiConstanceItems.TABLE_SCHEMA,tableName);
        int num=1;
        for (Record re_tables : joinTables) {
            List<Record> joinTable = Db.find("SELECT TABLE_NAME,COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_name =? AND table_schema=?",re_tables.getStr("re_table"),PoiConstanceItems.TABLE_SCHEMA);
            for (Record record : joinTable) {
                record.set("TABLE_NAME", record.get("TABLE_NAME"));
                record.set("re_table_name", "t"+num);
                record.set("re_column", re_tables.get("re_column"));
                record.set("native_column", re_tables.get("column_name"));
            }
            map.put(re_tables.getStr("re_table")+"  #t"+num, joinTable);
            num++;
        }
        return map;
    }

    public List<Record> getJoinTables(String tableName) {
        List<Record> sheetCats = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%'",PoiConstanceItems.TABLE_SCHEMA,tableName);
        return sheetCats;
    }

    

    public LinkedHashMap<String, List<Record>> gtPropertyList(String tableName) {
        LinkedHashMap<String, List<Record>> map = new LinkedHashMap<String, List<Record>>();
        List<Record> Tables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%'",PoiConstanceItems.TABLE_SCHEMA,tableName);
        Tables.add(new Record().set("re_table", tableName));
        for (Record table : Tables) {
            List<Record> colmuns = Db.find("SELECT TABLE_NAME,COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_name =? AND table_schema=?",table.getStr("re_table"),PoiConstanceItems.TABLE_SCHEMA);
            map.put(table.getStr("re_table"),colmuns);
        }
        return map;
    }
    
    /*
     * 根据主表表名获取相关分表数据
     */
    public List<Record> getSheetTable(String tableName) {
        List<Record> tables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%'",PoiConstanceItems.TABLE_SCHEMA,tableName);
        Integer num =1;
        for (Record table : tables) {
            table.set("re_tableCode", "t"+num);
            num++;
        }
        return tables;
    }
    
    /*
     * 根据选择sheet主表查询sheet字段信息
     */
    public List<Record> getSheetColumns(String tableName) {
        List<Record> tables = Db.find("SELECT COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",PoiConstanceItems.TABLE_SCHEMA,tableName);
        Integer num =1;
        for (Record table : tables) {
            table.set("re_tableCode", "t"+num);
            num++;
        }
        return tables;
    }
    
}
