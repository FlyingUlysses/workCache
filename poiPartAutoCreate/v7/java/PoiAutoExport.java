package com.yawa.util.autoPoi;


import java.util.ArrayList;
import java.util.HashMap;
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
    
    public Page<Record> getExcelPages(String code, String name, Integer page, Integer limit) {
        String filter ="";
        if(StringUtils.isNotBlank(code))
            filter+=" and t.busiType like '%"+code+"%' ";
        if(StringUtils.isNotBlank(name))
            filter+=" and t.name like '%"+name+"%' ";
        Long count = Db.queryLong("select count(1) from excels t left join excel_parts t1 on t.id= t1.excel_id where t.state =1 and t1.state =1 "+filter);
        String sql="select t.id, t.busiType type,t.name,t.create_time,t1.create_time part_create_time,t.desc,t1.id part_id,t1.name part_name from excels t "
                   +" left join (select * from excel_parts where state =1) t1  on t.id= t1.excel_id "
                   +" where t.state =1  "+filter+" order by t.create_time desc,t1.create_time desc,t.id desc,t1.sort limit ?,?";
        return new Page<Record>(page, limit, count, Db.find(sql,(page - 1) * limit,limit));
    }

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
    
    /**
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
    
    /**
     * 根据选择sheet主表查询sheet字段信息
     */
    public List<Record> getSheetColumns(String tableName) {
        List<Record> tables = Db.find("SELECT COLUMN_NAME name FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",TABLE_SCHEMA,tableName);
        return tables;
    }

    
    /**
     * 获取编辑页面所需数据
     * @param partId
     * @return
     * @Description:
     */
    public  HashMap<String, Object> loadEditData(Integer partId,Integer limit) {
    	HashMap<String, Object> map = new HashMap<String, Object>();
    	List<String> tableNames = new ArrayList<String>();
    	List<String> reNames = new ArrayList<String>();
        ExcelPart part = ExcelPart.me.findById(partId);
        String tablesStr = part.getStr("data_tables");
        if(tablesStr != null ){
	        String[] table = tablesStr.split(",");
	        for (String tableStr : table) {
	        	if (tableStr.contains("#")) {
	        		String[] strs = tableStr.split("#");
	        			tableNames.add(strs[0]);
	        			reNames.add(strs[1]);
				}
			}
	        LinkedHashMap<String, Object> tables = getDataColumns(tableNames,reNames);
	        map.put("tables", tables);
	        map.put("tables_str",part.getStr("data_tables"));
        }
        
        List<Record> cellList = Db.find("SELECT * FROM excel_cells t where t.template =? order by t.startRow,t.startColumn ",part.getInt("template"));
        Record[][] cellTable = formartCelltoTable(cellList);
        
        map.put("cellList", cellTable);
        return map;
    }


	public  List<Record> getJoinTables(String tableName) {
		List<Record> joinTables = Db.find("select column_name,REFERENCED_TABLE_NAME re_table,REFERENCED_COLUMN_NAME re_column  from information_schema.KEY_COLUMN_USAGE where TABLE_SCHEMA =? and table_name =? and column_name != 'id' and CONSTRAINT_NAME like 'FK%' order by REFERENCED_TABLE_NAME ",TABLE_SCHEMA,tableName);
		return joinTables;
	}

	
	public LinkedHashMap<String, Object> getDataColumns(List<String> tableNames,List<String> reNames) {
		LinkedHashMap<String, Object> map = new LinkedHashMap<String, Object>();
			for (int i = 0; i <tableNames.size(); i++) {
				List<Record> tableTemp = Db.find("SELECT COLUMN_NAME ,COLUMN_COMMENT remarks FROM information_schema.COLUMNS t WHERE table_schema=? AND table_name =?  ",TABLE_SCHEMA,tableNames.get(i));
				if (tableTemp.size()>0) {
					for (Record column : tableTemp) {
						column.set("re_table",reNames.get(i));
					}
					String subName = tableNames.get(i);
					if (subName.length() >18) 
						subName = subName.substring(0,16)+"...";
					map.put(reNames.get(i)+"  "+subName, tableTemp);
				}	
					
			}
		return map;
	}
    
	/**
	 * 遍历cell数据拼装为一个cell二维数组返回
	 * @param cellList
	 * @return 
	 */
	public Record[][] formartCelltoTable(List<Record> cellList){
		Integer rowNum =0;
		Integer colNum =0;
		for (Record cell : cellList) {
        	String native_strs = cell.getStr("native_name");
        	if (StringUtils.isNotBlank(native_strs)) {
        		String[] strs = native_strs.split("#");
        		if (strs.length>1) {
        			cell.set("native_column", strs[0]);
        			cell.set("table", strs[1]);
				}
			}
        	if (cell.getStr("ismerge").equals("Y")) {
        		if (cell.getInt("endColumn")>colNum) 
        			colNum = cell.getInt("endColumn");
        		rowNum = cell.getInt("endRow");
			}else{
				if (cell.getInt("startColumn")>colNum) 
					colNum = cell.getInt("startColumn");
				rowNum = cell.getInt("startRow");
			}
		}
        colNum++;
        rowNum++;
		
		Record[][] cellTable = new Record[rowNum][colNum];
		setCell(cellList.get(0), cellTable);
		
		for (int i = 1; i < cellList.size(); i++) {
			setCell(cellList.get(i),cellTable);
		}
		return cellTable;
	}
	
	
	/**
	 * 赋值给cell
	 * @param cell
	 * @param cellList
	 */
	public void setCell(Record cell,Record[][] cellTable){
		int row =cell.getInt("startrow");
		int col =cell.getInt("startcolumn");
		if(cellTable[row][col] == null)
			cellTable[row][col]=cell;
		if (cell.getStr("ismerge").equals("Y")) {
			for (int i = 0; i <= cell.getInt("endrow") - row; i++) {
				if (cellTable[row+i][col] == null) 
					cellTable[row+i][col] = new Record();
				for (int j = 0; j <= cell.getInt("endcolumn") - col; j++) {
					if (cellTable[row+i][col + j] == null) 
						cellTable[row+i][col+ j] = new Record();
				}
			}
		}
	}
    
    
}
