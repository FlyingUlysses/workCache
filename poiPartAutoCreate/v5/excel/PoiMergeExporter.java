package com.yawa.util.excel;

import java.util.List;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.jfinal.ext.kit.excel.PoiExporter;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

/**
 * 继承PoiExporter
 * 
 * @author Administrator
 * 
 */
public class PoiMergeExporter extends PoiExporter {
	private String version;
	private static CellStyle baseStyle;
	private int cellWidth = 8000;
	
	public static PoiMergeExporter exporter = null; 
	
	private PoiMergeExporter(){}
	
	public static PoiMergeExporter getInstance() {
		if(exporter != null) 
			return exporter; 
        return new PoiMergeExporter();
    }

	public PoiMergeExporter version(String version) {
        this.version = version;
        return this;
    }
	
	public PoiMergeExporter cellWidth(int cellWidth) {
		this.cellWidth = cellWidth;
		return this;
	}
	
	public void buildStyle(Workbook wb){
		baseStyle = wb.createCellStyle();
		baseStyle.setBorderTop(CellStyle.BORDER_THIN);
		baseStyle.setBorderBottom(CellStyle.BORDER_THIN);
		baseStyle.setBorderLeft(CellStyle.BORDER_THIN);
		baseStyle.setBorderRight(CellStyle.BORDER_THIN);
		baseStyle.setAlignment(CellStyle.ALIGN_CENTER);
		baseStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
		baseStyle.setWrapText(true);
	}
	
	/**
	 * 导出Excel
	 * @param busiType
	 * @param sheetFilter
	 * @param rowFilter
	 * @return
	 * @throws Exception
	 */
	public Workbook exportExcel(String busiType,String rowFilter) throws Exception {
		return exportExcel(busiType, "", rowFilter);
	}
	
	/**
	 * 
	 * @param busiType 业务类型
	 * @param dateSqlCdt 获取数据的额外限制条件
	 * @return
	 * @throws Exception
	 */
	public Workbook exportExcel(String busiType,String sheetFilter,String rowFilter) throws Exception {
		Excel excel = Excel.me.findFirst("select * from excels where busiType = ?",busiType);
		if(excel == null) 
			throw new Exception("请选择所要导出的Excel!");
		Workbook wb;
		if (VERSION_2003.equals(version))
			 wb = new HSSFWorkbook();
		else 
			 wb = new XSSFWorkbook();
		buildStyle(wb);
		List<ExcelPart> parts = ExcelPart.me.find("select * from excel_parts where state = 1"
				+ " and excel_id = ? order by sort asc",excel.getInt("id"));
		if (parts.size() == 0) 
            return wb;
		for(int i = 0;i < parts.size(); i++){
			ExcelPart pt = parts.get(i);
			List<Record> sheets = Db.find(pt.getStr("sheet_sql") + sheetFilter);
			String dataSQL = pt.getStr("data_sql");
			if(dataSQL.indexOf("#filter") != -1)
				dataSQL = dataSQL.replace("#filter", rowFilter);
			else
				dataSQL += rowFilter;
			for(Record recd: sheets){
				String id = "";
				try{ 
					id = recd.getLong("id") + ""; 
				}catch(Exception e){
					try{
						id = recd.getInt("id") + "";
					}catch(Exception ex){
						id = recd.getStr("id");
					}
				}
				int maxRow = 0; Cell cell = null;
				Sheet sheet = wb.createSheet(recd.getStr("name"));
				ExcelPartTemplate ptRela = null;
				try{
					ptRela = ExcelPartTemplate.me.findFirst("select * from excel_part_templates"
							+ " where part_id = ? and find_in_set(?,ids)", pt.getLong("id"), id );
				}catch(Exception e){}
				Integer template = ptRela == null ? pt.getInt("template") : ptRela.getInt("template");
				List<ExcelCell> cells = ExcelCell.me.find("select * from excel_cells where template = ?"
						+ " order by startRow,startColumn asc",template);
				for(ExcelCell dbCell: cells){
					Integer startRow = dbCell.getInt("startRow");
					Integer startColumn = dbCell.getInt("startColumn");
					Integer dbWidth = dbCell.getInt("width");
					if(dbWidth != null)
						sheet.setColumnWidth(startColumn,dbWidth);
					else
						sheet.setColumnWidth(startColumn,cellWidth);
					Row row = sheet.getRow(startRow);
					if(row == null)
						row = sheet.createRow(startRow);
					if(startRow > maxRow)
						maxRow = startRow;
					Integer rowHeight = dbCell.getInt("height");
					if(rowHeight != null)
						row.setHeight(rowHeight.shortValue());
					cell = row.createCell(startColumn);
					cell.setCellValue(dbCell.getStr("cellname"));
					setCellStyle(wb,cell,dbCell);
					if(dbCell.getStr("isMerge").equals("Y")){
						Integer endRow = dbCell.getInt("endRow");
						Integer endColumn = dbCell.getInt("endColumn");
						CellRangeAddress range = new CellRangeAddress(startRow,endRow,startColumn,endColumn);
					    RegionUtil.setBorderBottom(CellStyle.BORDER_THIN,range, sheet, wb);  
				        RegionUtil.setBorderLeft(CellStyle.BORDER_THIN,range, sheet, wb);  
				        RegionUtil.setBorderRight(CellStyle.BORDER_THIN,range, sheet, wb);  
				        RegionUtil.setBorderTop(CellStyle.BORDER_THIN,range, sheet, wb);  
						sheet.addMergedRegion(range);
					}
				}
				String dbSQL = dataSQL.replaceAll("#id", id);
				List<Record> dataRecods = Db.find(dbSQL);
				for(Record record: dataRecods){
					Row row = sheet.createRow(++ maxRow);
					row.setHeight(Integer.valueOf(400).shortValue());
					processAsModel(cells,row,record);
				}
			}
		}
		return wb;
	}
	
	private void setCellStyle(Workbook workbook,Cell cell, ExcelCell dbCell) {
		CellStyle style = workbook.createCellStyle();
		String border = dbCell.getStr("border");
		String autoWrap = dbCell.getStr("autoWrap");
		style.cloneStyleFrom(baseStyle);
		if(border != null && border.equals("N")){
			style.setBorderTop(CellStyle.BORDER_NONE);
			style.setBorderBottom(CellStyle.BORDER_NONE);
			style.setBorderLeft(CellStyle.BORDER_NONE);
			style.setBorderRight(CellStyle.BORDER_NONE);
		}
		if(autoWrap != null && autoWrap.equals("N")){
			baseStyle.setWrapText(false);
		}
		Integer bgColor = dbCell.getInt("bgColor");
		String fontName = dbCell.getStr("fontName");
		Integer fontColor = dbCell.getInt("fontColor");
		Integer fontSize = dbCell.getInt("fontSize");
		String fontBold = dbCell.getStr("fontBold");
		if(bgColor != null){
			 style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
			 style.setFillForegroundColor(bgColor.shortValue());
		}
		if(StringUtils.isNotEmpty(fontName) || fontColor != null
				|| fontSize != null || fontBold != null){
			HSSFFont font = (HSSFFont) workbook.createFont();
			if(StringUtils.isNotEmpty(fontName))
				font.setFontName(fontName);
			if(fontColor != null)
				font.setColor(fontColor.shortValue());
			if(fontSize != null)
				font.setFontHeightInPoints(fontSize.shortValue());
			if(StringUtils.isNotEmpty(fontBold))
				font.setBold(fontBold.equals("Y"));
			style.setFont(font);
		}
		cell.setCellStyle(style);
	}

	/**
	 * 加载数据
	 * @param dbCells
	 * @param row
	 * @param record
	 */
	private static void processAsModel(List<ExcelCell> dbCells, Row row, Record record) {
        Cell cell;
        Integer maxCol = 0;
        for(ExcelCell dbCell: dbCells){
        	Integer startColumn = dbCell.getInt("startColumn");
        	if(startColumn > maxCol){
        		for(int i = maxCol;i < startColumn;i++){
        			cell = row.createCell(i);
        			cell.setCellValue("");
        			cell.setCellStyle(baseStyle);
        		}
        		maxCol = startColumn;
        	}
        	cell = row.createCell(startColumn);
        	String property = dbCell.getStr("property");
        	if(StringUtils.isEmpty(property))
        		cell.setCellValue("");
        	else
        		cell.setCellValue(record.get(property) == null ? "" : record.get(property) + "");
            cell.setCellStyle(baseStyle);
            maxCol ++;
        }
    }
}
