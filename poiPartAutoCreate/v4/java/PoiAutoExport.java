package com.yawa.util.autoPoi;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.excel.ExcelCell;
import com.yawa.util.excel.ExcelPart;
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

    
    /**
     * 获取编辑页面所需数据
     * @param partId
     * @return
     * @Description:
     */
    public   HashMap<String, Object> loadEditData(Integer partId,Integer limit) {
        ExcelPart part = ExcelPart.me.findById(partId);
        String dataSql = part.getStr("data_sql");
        JSONObject baseTabel= new JSONObject();
        ArrayList<JSONObject> tables=new ArrayList<JSONObject>();
        String[] split = dataSql.split("join\\s+");
        Matcher matcher=null;
        for (String str : split) {
            if (str.contains("on")) {
                matcher = Pattern.compile("(\\w+)\\s*(\\w+)\\s*on\\s*(\\w+\\.\\w+)\\s*=\\s*(\\w+\\.\\w+)\\s*.+").matcher(str);
                if (matcher.find()) {
                    JSONObject tableTemp = new JSONObject();
                    tableTemp.put("re_table", matcher.group(1));
                    tableTemp.put("re_table_name ", matcher.group(2));
                    if (matcher.group(3).contains(matcher.group(2))) {
                        tableTemp.put("re_column", matcher.group(3));
                        tableTemp.put("column_name", matcher.group(4));
                    }else{
                        tableTemp.put("re_column", matcher.group(4));
                        tableTemp.put("column_name", matcher.group(3));
                    }
                    tables.add(tableTemp);
                }
            }else if (str.contains("from")) {
                matcher = Pattern.compile(".*from\\s*(\\w+)\\s*(\\w+)\\s*.*").matcher(str);
                if (matcher.find()) {
                    baseTabel.put("re_table", matcher.group(1));
                    baseTabel.put("re_table_name ", matcher.group(2));
                    tables.add(0,baseTabel);
                }
            }
        }
        
        
        //拼接主表页
        HashMap<String, Object> map = new HashMap<String, Object>();
        Page<Record> page=null;
        Record table = Db.findFirst("select t2.* from  (select @rownum:=@rownum+1 rownum, TABLE_NAME code,TABLE_COMMENT name,DATE_FORMAT(CREATE_TIME,'%Y-%m-%d')create_time "
                                  + " from (select @rownum:=0) t1 ,information_schema.TABLES t where t.table_schema =? order by t.table_name )t2 where t2.code=? ",PoiConstanceItems.TABLE_SCHEMA,baseTabel.getString("re_table"));
            if (table.getStr("code").equals(baseTabel.getString("re_table"))) {
                Integer rowNum = table.getNumber("rownum").intValue();
                Integer pageNum =rowNum/limit;
                if (rowNum%limit >0) 
                    pageNum++;
                Long count = Db.queryLong("select count(1) from information_schema.tables where table_schema=? ",PoiConstanceItems.TABLE_SCHEMA);
                String sql="select TABLE_NAME code,TABLE_COMMENT name,DATE_FORMAT(CREATE_TIME,'%Y-%m-%d')create_time from information_schema.tables where table_schema=?  limit ?,?";
                page = new Page<Record>(pageNum, limit, count, Db.find(sql,PoiConstanceItems.TABLE_SCHEMA,(pageNum - 1) * limit,limit));
                map.put("page_num",pageNum);
                map.put("page", page);
                map.put("base_table", baseTabel.getString("re_table"));
        }
            
        
        //拼接cell    
        List<ExcelCell> cellList = ExcelCell.me.find("SELECT * FROM excel_cells t where t.template =? order by t.startRow,t.startColumn ",part.getInt("template"));
        map.put("cell_list", cellList);
            
        return map;
    }
    
    
}
