package com.yawa.util.autoPoi;


import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.alibaba.fastjson.JSONObject;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Record;
import com.yawa.util.excel.ExcelPart;
import com.yawa.util.model.Page;

@SuppressWarnings("serial")
public class PoiAutoExport extends Model<PoiAutoExport>{
    public static final PoiAutoExport me = new PoiAutoExport();
    
    public static final String TABLE_SCHEMA="ngms";

    
    
    public Page<Record> getPages(Integer page, Integer limit, String table_name, String table_code) {
        String filter="";
        if (StringUtils.isNotBlank(table_name)) {
            filter+=" and TABLE_COMMENT like '%"+ table_name+"%' ";
        }
        if (StringUtils.isNotBlank(table_code)) {
            filter+=" and TABLE_NAME like '%"+table_code+"%' ";
        }
        Long count = Db.queryLong("select count(1) from information_schema.tables where table_schema=? "+filter,TABLE_SCHEMA);
        String sql="select TABLE_NAME code,TABLE_COMMENT name,DATE_FORMAT(CREATE_TIME,'%Y-%m-%d')create_time from information_schema.tables where table_schema=? "+filter+" limit ?,?";
        return new Page<Record>(page, limit, count, Db.find(sql,TABLE_SCHEMA,(page - 1) * limit,limit));
    }


    public LinkedHashMap<String, List<Record>> gtPropertyList(String tableName) {
        LinkedHashMap<String, List<Record>> map = new LinkedHashMap<String, List<Record>>();
        List<Record> tables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",TABLE_SCHEMA,tableName);
        int num =1;
        for (Record table : tables) {
           table.set("re_table_name", "t"+num);
           num++;
        }
        tables.add(new Record().set("re_table", tableName).set("re_table_name", "t"));
        for (Record table : tables) {
            List<Record> colmuns = Db.find("SELECT TABLE_NAME,COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_name =? AND table_schema=?",table.getStr("re_table"),TABLE_SCHEMA);
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
        tables.add(new Record().set("re_table", tableName).set("re_table_name", "t"));
        List<Record> joinTables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",TABLE_SCHEMA,tableName);
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
        List<Record> tables = Db.find("SELECT COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",TABLE_SCHEMA,tableName);
        return tables;
    }

    
    /**
     * 获取编辑页面所需数据
     * @param partId
     * @return
     * @Description:
     */
    public  List<Record> loadEditData(Integer partId,Integer limit) {
        ExcelPart part = ExcelPart.me.findById(partId);
        List<Record> cellList = Db.find("SELECT * FROM excel_cells t where t.template =? order by t.startRow,t.startColumn ",part.getInt("template"));
        int maxColumn =0;
        int maxRow = 0;
        for (Record cell : cellList) {
        	if (cell.getStr("isMerge") =="Y") {
        		if (cell.getInt("endColumn")>maxColumn) 
        			maxColumn = cell.getInt("endColumn");
        		maxRow = cell.getInt("endRow");
			}else{
				if (cell.getInt("startColumn")>maxColumn) 
					maxColumn = cell.getInt("startColumn");
				maxRow = cell.getInt("startRow");
			}
		}
        cellList.get(cellList.size()-1).set("maxColumn", maxColumn);
        cellList.get(cellList.size()-1).set("maxRow", maxRow);
        return cellList;
    }


	public  List<Record> getJoinTables(String tableName) {
		List<Record> joinTables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",TABLE_SCHEMA,tableName);
		return joinTables;
	}


	public LinkedHashMap<String, Object> getDataColumns(ArrayList<String> tables) {
		LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
		for (String tableName : tables) {
			List<Record> tableTemp = Db.find("SELECT COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",TABLE_SCHEMA,tableName);
			map.put(tableName, tableTemp);
		}
		return map;
	}
    
    
    
    
}
