package com.yawa.util.autoPoi;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateFormatUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.render.RenderException;
import com.yawa.util.excel.Excel;
import com.yawa.util.excel.ExcelPart;
import com.yawa.util.excel.PoiMergeExporter;
import com.yawa.util.model.ResponseData;

/**
 *@Title:poi报表模块自动生成
 *@Description:
 *@Author:WangYong
 *@Since:2017-8-22
 *@Version:1.1.0
 */
public class PoiAutoExportController extends Controller{
    
	  /**
     * 跳转测试
     * @Description:
     */
    public void toTest(){
        render("toTest.jsp");
    }
    
    
    
    /**
     * 跳转首页
     * @Description:
     */
    public void index(){
        render("index.jsp");
    }
    
    /**
     * 获取分页信息
     * @Description:
     */
    public void getPages(){
        renderJson(PoiAutoExport.me.getPages(getParaToInt("page"),getParaToInt("limit"),getPara("table_name"),getPara("table_code")));
    }
    
    
    /**
     * 根据主表字段查询关联表信息
     * @Description:
     */
    public void getSheetTable(){
        renderJson(PoiAutoExport.me.getSheetTable(getPara("table_name")));
    }
    
    /**
     * 根据选择sheetTable查询该表下字段
     * @Description:
     */
    public void getSheetColumns(){
        renderJson(PoiAutoExport.me.getSheetColumns(getPara("table_name")));
    }
    
  
    
    /**
     * 获取excel功能列表分页信息
     * @Description:
     */
    public void getExcelPages(){
        renderJson(Excel.me.getPages(getPara("excel_code"),getPara("excel_name"),getParaToInt("page"),getParaToInt("limit")));
    }
    
    
    /**
     * 编辑excels表信息
     * @Description:
     */
    public void editExcel(){
        setAttr("excel", Excel.me.findFirst("select id, busiType type,name,DATE_FORMAT(create_time,'%Y-%m-%d') create_time,t.desc from excels t where state =1 and id =?",getParaToInt("id")));
        renderJsp("edit_excel.jsp");
    }
    
    /**
     * 删除选定excel
     * @Description:
     */
    public void rmvExcel(){
        Integer id = getParaToInt("id");
        if (id!=null) {
            try {
                Excel excel = Excel.me.findById(id);
                List<Record> partList = Db.find("select * from excel_parts where excel_id =?",excel.getInt("id"));
                for (Record part : partList) {
					Db.update("delete from excel_cells where template = ?",part.getInt("template"));
				}
                Db.update("delete from excel_parts where excel_id =? ",excel.getInt("id"));
                excel.delete();
            } catch (Exception e) {
                renderJson(new ResponseData(false,"删除失败!失败原因:"+e.toString()));
                return;
            }
        }
        renderJson(new ResponseData(true,"删除数据成功"));
    }
    
    /**
     * 保存excel
     * @Description:
     */
    public void saveExcel(){
        try {
            Excel model = getModel(Excel.class,"excel");
            if (model!=null) {
                if (model.getInt("id")==null) {
                    model.set("create_time", new Date())
                         .set("state", 1)
                         .save();
                    renderJson(new ResponseData(true,"excel新增成功！"));
                }else{
                    model.update();
                    renderJson(new ResponseData(true,"excel修改成功！"));
                }
            }
        } catch (Exception e) {
            renderJson(new ResponseData(false, "保存发生异常，异常操作如下: " + e.getMessage()));
        }
    }
    
    /**
     * 删除选定part
     * @Description:
     */
    public void rmvPart(){
        Integer id = getParaToInt("id");
        if (id!=null) {
            try {
                ExcelPart part = ExcelPart.me.findById(id);
                Db.update("DELETE  FROM excel_cells WHERE template =? ",part.getInt("template"));
                part.delete();
            } catch (Exception e) {
                renderJson(new ResponseData(false,"删除失败!失败原因:"+e.toString()));
                return;
            }
        }
        renderJson(new ResponseData(true,"删除数据成功"));
    }
    
    /**
     * 新增excel模板信息
     * @Description:
     */
    public void addPart(){
        setAttr("excel_id", getParaToInt("id"));
        setAttr("part_id", getParaToInt("part_id"));
        setAttr("template_id", getParaToInt("template_id"));
        renderJsp("edit_part.jsp");
    }
    
    /**
     * 获取cell表的property选项
     * @Description:
     */
    public void getPropertyList(){
        renderJson(PoiAutoExport.me.gtPropertyList(getPara("table")));
    }
    
    /**
     * 保存excelpart表信息和excelTemplate表信息
     * @Description:
     */
    public void savePartAndCells(){
        Integer excelId = getParaToInt("excel_id");
        Integer partId = getParaToInt("part_id");
        Integer templateId = getParaToInt("template_id");
        Integer partSort = getParaToInt("part_sort");
        String partName = getPara("part_name");
        String sheetName = getPara("sheet_name");
        String sheetCat = getPara("sheet_cat");
        String sheetSql = getPara("sheet_sql");
        String dataSql = getPara("data_sql");
        JSONArray cellArray = JSON.parseArray(getPara("cells"));
        ExcelPart part = new ExcelPart();
            try {
                Integer isFixed =1;
                if (StringUtils.isNotBlank(sheetCat) && sheetCat.equals("categery")) {
                    isFixed=0;
                }
                part.set("excel_id", excelId)
                .set("sheet_sql", sheetSql)
                .set("name", partName)
                .set("sheet", sheetName)
                .set("data_sql", dataSql)
                .set("update_time", new Date())
                .set("state", 1)
                .set("isFixed", isFixed)
                .set("sort", partSort);
                if (partId!=null && templateId!=null) {
                    part = ExcelPart.me.findById(partId);
                    part.set("update_time", new Date());
                    part.update();
                    
                }else{
                    templateId = Db.queryInt("SELECT MAX(template) FROM excel_parts where state =1")+1;
                    part .set("template", templateId)
                    .set("create_time", new Date());
                    part.save();
               }
                String sql="INSERT INTO excel_cells (  `template`, `cellname`, `width`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`,`property`) VALUES ";
                for (int i = 0; i < cellArray.size(); i++) {
                    JSONObject cell =(JSONObject) cellArray.get(i);
                    String cellName = null;
                    Integer width = 4500;
                    Integer startRow = null;
                    Integer startColmun =null;
                    Integer endRow = null;
                    Integer endColmun = null;
                    String property = null;
                    String isMerge="N";
                    try {cellName= cell.getString("cellName");} catch (Exception e) {}
                    try {startRow = cell.getInteger("startRow");} catch (Exception e) {}
                    try {startColmun = cell.getInteger("startColumn");} catch (Exception e) {}
                    try {endRow = cell.getInteger("endRow");} catch (Exception e) {}
                    try {endColmun = cell.getInteger("endColumn");} catch (Exception e) {}
                    try {property = cell.getString("property");} catch (Exception e) {}
                    if (startRow != endRow || startColmun != endColmun) {
                    	isMerge= "Y";
                    }
                    sql+="("+templateId+",'"+cellName+"',"+width+","+startRow+","+startColmun+",'"+isMerge+"',"+endRow+","+endColmun+",'"+property+"')";
                    if (i<cellArray.size()-1) {
                        sql+=",";
                    }
                }
                Db.update("delete FROM excel_cells where template = ?",part.getInt("template"));
                Db.update(sql);	
            } catch (Exception e) {
                renderJson(new ResponseData(false,"保存发生异常，异常操作如下: " + e.getMessage()));  
                return;
            }
            JSONObject data = new JSONObject();
            data.put("id", part.getNumber("id").intValue());
            ResponseData res = new ResponseData(true,"添加模板成功!",data);
        renderJson(res);;
    }
    
    /*
     * 跳转编辑part或者cell
     */
    public void editPartAndCell(){
        Integer part_id = getParaToInt("id");
        if (part_id!=null) {
            ExcelPart part = ExcelPart.me.findById(part_id);
            setAttr("part", part);
            setAttr("excel_id", part.getInt("excel_id"));
        }
        setAttr("isEdit", 1);
        renderJsp("edit_part.jsp");
    }
    
    /*
     * 获取编辑页面需要的数据
     */
    public void loadEditData(){
        renderJson(PoiAutoExport.me.loadEditData(getParaToInt("id"),getParaToInt("limit")));
    }
    
    
    /**
     * 测试表格生成
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void testExportPart()  {
		try {
			String fileName = java.net.URLEncoder.encode(DateFormatUtils.format(new Date(), "yyyyMMddHHmmss")+"测试导出.xls", "utf-8");
			getResponse().reset();
			getResponse().setHeader("Content-disposition","attachment; filename=" + fileName);
			getResponse().setContentType("application/msexcel;charset=UTF-8");
			OutputStream os = null;
			try {
				os = getResponse().getOutputStream();
				PoiMergeExporter.getInstance().version("2003").cellWidth(2200).exportPart(getParaToInt("id")).write(os);
			} catch (Exception e) {
				throw new RenderException(e);
			} finally {
				try {
					if (os != null) {
						os.flush();
						os.close();
					}
				} catch (IOException e) {}
			}
	} catch (Exception e) {
		e.printStackTrace();
	}
	renderNull();
	}
	
	/**
     * 测试sql
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void testSql()  {
		String sql = getPara("sql");
		try {
			Db.find(sql);
		} catch (Exception e) {
			renderJson(new ResponseData(false, "sql错误："+e.toString()));
			return;
		}
		renderJson(new ResponseData(true,"测试成功！sql正常运行。"));
	}
	
	/**
     * 跳转sheetSql编辑页
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void editSheetTable(){
		render("edit_sheetTable.jsp");
	}
	
	/**
     * 跳转dataSql编辑页
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void editDataTable(){
		render("edit_dataTable.jsp");
	}
	
	/**
     * 跳转dataSql编辑页
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void choseBaseTable(){
		String baseTable = getPara("baseTable");
		List<Record> joinTables = PoiAutoExport.me.getJoinTables(baseTable);
		renderJson(joinTables);
	}
	
	/**
     * 根据表名查询字段
     * @param partId
     * @return
     * @throws Exception 
     * @Description:
     */
	public void getDataColumns(){
		String joinTables = getPara("joinTables");
		String reNamestr = getPara("joinReName");
		ArrayList<String> tables = new ArrayList<>();
		tables.addAll(Arrays.asList(joinTables.split(",")));
		ArrayList<String> reNames = new ArrayList<>();
		reNames.addAll(Arrays.asList(reNamestr.split(",")));
		tables.add(0, getPara("baseTable"));
		reNames.add(0, getPara("baseReName"));
		renderJson(PoiAutoExport.me.getDataColumns(tables,reNames));
	}
	
}
