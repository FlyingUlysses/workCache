package com.yawa.util.autoPoi;

import java.util.Date;


import org.apache.commons.lang.StringUtils;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.yawa.util.excel.Excel;
import com.yawa.util.excel.ExcelPart;
import com.yawa.util.model.ResponseData;

/**
 *@Title:poi报表模块自动生成
 *@Description:
 *@Author:WangYong
 *@Since:2017-8-15
 *@Version:1.1.0
 */
public class PoiAutoExportController extends Controller{
    
    
    
    
    
    /**
     * 跳转首页
     * @Description:
     */
    public void index(){
        render("index_v2.jsp");
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
                excel.set("state", 0)
                     .update();
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
     * 删除选定excel
     * @Description:
     */
    public void rmvPart(){
        Integer id = getParaToInt("id");
        if (id!=null) {
            try {
                ExcelPart part = ExcelPart.me.findById(id);
                part.set("state", 0)
                     .update();
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
        renderJsp("edit_partV3.jsp");
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
        if (excelId!=null) {
            try {
                ExcelPart part = new ExcelPart();
                if (partId!=null && templateId!=null) {
                    part = ExcelPart.me.findById(partId);
                    part.set("update_time", new Date());
                    Db.update("delete from excel_cells where template =?",templateId);
                    
                }else{
                    templateId = Db.queryInt("SELECT MAX(template) FROM excel_parts where state =1")+1;
                    part .set("template", templateId)
                    .set("create_time", new Date());
               }
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
                .set("sort", partSort)
                .save();
                String sql="INSERT INTO excel_cells (  `template`, `cellname`, `width`, `startRow`, `startColumn`, `isMerge`, `endRow`, `endColumn`,`property`) VALUES ";
                for (int i = 0; i < cellArray.size(); i++) {
                    JSONObject cell =(JSONObject) cellArray.get(i);
                    String remarks = null;
                    Integer width = 4000;
                    Integer startRow = null;
                    Integer startColmun =null;
                    Integer endRow = null;
                    Integer endColmun = null;
                    String columnName = null;
                    String isMerge="N";
                    try {remarks= cell.getString("remarks");} catch (Exception e) {}
                    try {startRow = cell.getInteger("start_row");} catch (Exception e) {}
                    try {startColmun = cell.getInteger("start_colmun");} catch (Exception e) {}
                    try {endRow = cell.getInteger("end_row");} catch (Exception e) {}
                    try {endColmun = cell.getInteger("end_colmun");} catch (Exception e) {}
                    try {columnName = cell.getString("column_name");} catch (Exception e) {}
                    sql+="("+templateId+",'"+remarks+"',"+width+","+startRow+","+startColmun+",'"+isMerge+"',"+endRow+","+endColmun+",'"+columnName+"')";
                    if (i<cellArray.size()-1) {
                        sql+=",";
                    }
                }
                Db.update(sql);
            } catch (Exception e) {
                renderJson(new ResponseData(false,"保存发生异常，异常操作如下: " + e.getMessage()));  
                return;
            }
        }
        renderJson(new ResponseData(true,"添加模板成功!"));
    }
    
  
    
    
}
