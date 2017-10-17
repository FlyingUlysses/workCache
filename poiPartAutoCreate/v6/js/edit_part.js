//---------------------------sql模板------------------------------------------
var SHEET_SQL_TEMPLATE=" select #id id,#name name from #tableName #joinTable #where";
var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id  #where #filter ";
var row_num=3;
var col_num=7;
var sql_test_status = 0 ;//sql语句测试状态，初始为0，sheetsql通过为1，datasql通过为2,全部通过为3
$(function() {
	part_id=$("#part_id").val();
	if (part_id && part_id != undefined) 
		loadEditPart();
	else
		reload();
});



function reload(){
	reloadCells();
}

function reloadCells(){
	var strs="";
	$("#cells_table_body").empty();
	for ( var i = 0; i < row_num; i++) {
		strs+="<tr location='tr_"+i+"'>";
			for ( var j = 0; j < col_num; j++) {
				if (i ==0) {
					if (j==0) 
						strs+="<th style='text-align:center; width:25px;height:27px;' colspan='1' rowspan='1'></th>";
					else
						strs+="<th style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1'>x"+j+"</th>";
				}
				else{
					if (j==0) {
						strs+= "<th width='25px'><input  name='rowRadio' type='checkbox' value='"+i+"'  /></th>";
					}else
						strs+="<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' isHead='Y'></td>";
				}
			}
		strs+="</tr>";
	}
	$("#cells_table_body").append(strs);
	moveMergeCell();
}

//弹出shett表格编选页
function editShettTable(){
	showModel({
		title : "sheet表格编辑",
		width : "810px",
		height : "510px",
		url : _basePath + "/poiAutoExport/editSheetTable" 
	});
}

//sheet表格编辑页调用保存sheetsql
function saveSheetTables(sql){
	$("#sheetSql_input").empty();
	$("#sheetSql_input").append(sql);
}


function choseDataTable(){
	showModel({
		title : "Data表格编辑",
		width : "1000px",
		height : "510px",
		url : _basePath + "/poiAutoExport/editDataTable" 
	});
}

var columnsMap =null;
//sheet表格编辑页调用保存sheetsql
function saveDataTables(sql,map){
	columnsMap=map;
	$("#dataSql_input").empty();
	DATA_SQL_TEMPLATE =sql;
	$("#dataSql_input").append(sql);
}

var sheetCat="categery";//sheet分类
//根据选择sheet类型确定页面展示内容
function selectSheet(){
	sheetCat = $("#sheetCat_select").val();
	columnsMap=null;
	$("#sheetName_content").val("");
	$("#sheetSql_input").empty();
	$("#dataSql_input").empty();
	if (sheetCat == "all") {
		$("#sheetName_title").show();
		$("#sheetName_content").show();
	}else{
		$("#sheetName_title").hide();
		$("#sheetName_content").hide();
		
	}
}

//清除sheetsql
function deleteSheetSql(){
	columnsMap=null;
	$("#sheetName_content").val("");
	$("#sheetSql_input").empty();
	$("#dataSql_input").empty();
}

//固定sheet模式sheet语句生成
function getAllSheet(){
    if ($("#sheetName_content").val()+""=="") {
		return;
	}
    sheet_sql_temp=SHEET_SQL_TEMPLATE;
    sheet_sql_temp=sheet_sql_temp.replace("#id", "0");
    sheet_sql_temp=sheet_sql_temp.replace("#name","'"+$("#sheetName_content").val()+"'");
    sheet_sql_temp=sheet_sql_temp.replace("from #tableName", "");
    sheet_sql_temp=sheet_sql_temp.replace("#joinTable", "");
    $("#sheetSql_input").empty();
    $("#sheetSql_input").append(sheet_sql_temp);
}

//--------------------------------------编辑cell内容------------------------------
function loadColumn(){
	var strs="<option value=''>--请选择字段--</option>";
	$.each(columnsMap,function(i,item){
		if (i == $("#data_table").val() && item.length >0) {
			$.each(item,function(j,temp){
				strs+="<option value='"+temp.column_name+"' >"+temp.column_name+"</option>";
			});
		}
	});
	$("#data_column").append(strs);
	$("#data_column").trigger("liszt:updated");
}

function loadReName(){
	$.each(columnsMap,function(i,item){
		if (i == $("#data_table").val() && item.length >0) {
			$.each(item,function(j,temp){
				if ($("#data_column").val() == temp.column_name) {
					$("#editColumn").val(temp.re_table+"."+temp.column_name);
					$("#data_reColumn").val(temp.column_name);
					$("#cell_reColumn").val(temp.remarks);
				}
			});
		}
	});
}

function saveCellContent(){
	$("td[chose='Y']").attr("tableName",$("#data_table").val());
	$("td[chose='Y']").attr("hasEdit",'Y');
	$("td[chose='Y']").attr("column",$("#editColumn").val());
	$("td[chose='Y']").attr("reName",$("#data_reColumn").val());
	$("td[chose='Y']").html($("#cell_reColumn").val());
	saveCellToSql();
}

function choseTd(e){
		$("#cells_table").find('td').removeClass('selected');
		
		$("td[chose='Y']").css("background","");
		$("td[chose='Y']").attr("chose","N");
		$(e).css("background","#adb6c3");
		$(e).attr("chose","Y");
		
		$("#data_table").empty();
		$("#data_column").empty();
		$("#data_reColumn").val("");
		$("#cell_reColumn").val("");
		
		
		$("#data_reColumn").val($(e).attr("rename"));
		$("#cell_reColumn").val($(e).html());
		var strs="<option value=''>--请选择表格--</option>";
		if(columnsMap != null){
				$.each(columnsMap,function(i,item){
					strs+="<option value='"+i+"'>"+i+"</option>";
					if ($(e).attr("tableName") && $(e).attr("tableName")!= undefined  && $(e).attr("tableName") == i) {
						strs+="<option value='"+i+"' selected='selected'>"+i+"</option>";
						var colStr="<option value=''>--请选择字段--</option>";
						$.each(item,function(j,temp){
							colStr+="<option value='"+temp.column_name+"' >"+temp.column_name+"</option>";
							if ($(e).attr("column") && $(e).attr("column")!= undefined  && $(e).attr("column") == temp.column_name) {
								colStr+="<option value='"+temp.column_name+"' selected='selected'>"+temp.column_name+"</option>";
								
							}
						});
						$("#data_column").append(colStr);
					}
				});
		}
		$("#data_table").append(strs);
		
		
		$("#editColumn").val($(e).attr("column"));
		$("#data_table").trigger("liszt:updated");
		$("#data_column").trigger("liszt:updated");
}

function saveCellToSql(){
	var strs ="";
	var tds=$("#cells_table td[hasEdit='Y']");
	$.each(tds,function(i,item){
		if ($(item).attr("column") && $(item).attr("column") != undefined && $(item).attr("column") !="") {
				if(i != tds.length-1){
					strs+=" "+$(item).attr("column")+" "+$(item).attr("rename")+", ";
					
				}else{
					strs+=" "+$(item).attr("column")+" "+$(item).attr("rename")+" ";
				}
		}
	});
	var sqlStr = DATA_SQL_TEMPLATE;
	sqlStr = sqlStr.replace("#columns", strs);
	$("#dataSql_input").empty();
	$("#dataSql_input").val(sqlStr);
}

//添加整行
function addCellTableRow_v3(){
	var strs=$("#cells_table_body").html()+" <tr>";
	for ( var j = 0; j <col_num ; j++) {
		if (j==0) 
			strs+= "<th width='25px'><input  name='rowRadio' type='checkbox' value='"+(row_num)+"'  /></th>";
		else 
			strs+="<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>";
	}
	strs+="</tr>";
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	row_num++;
	moveMergeCell();
}

//添加整列
function addCellTableCol_v3(){
	var strs="";
	for ( var i = 0; i < row_num; i++) {
		var trStr="<tr>"+$("#cells_table_body tr:eq("+i+")").html()+"";
		if (i==0) 
			trStr+="<th style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1'>x"+(col_num)+"</th>";
		else
			trStr+="<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>";
		trStr+="</tr>";
		strs+=trStr;
	}
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	col_num++;
	moveMergeCell();
}

//拆分单元格
function splitCell(){
	  var tds = $("#cells_table").find('td[colspan],td[rowspan]'), v,vc;
      if (tds.length) {
          tds.filter('[colspan]').each(function () {
              v = (parseInt($(this).attr('colspan')) || 1) - 1;
              if (v > 0) for (var i = 0; i < v; i++)
            	  $(this).after("<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>");
          }).end().filter('[rowspan]').each(function () {
              v = parseInt($(this).attr('rowspan')) || 1;
              vc = parseInt($(this).attr('colspan')) || 1;
              if (v > 1) {
                  for (var i = 1; i < v; i++) {
                      var td = $(this.parentNode.parentNode.rows[this.parentNode.rowIndex + i].cells[this.cellIndex]);
                     	for (var j = 0; j < vc; j++)
                     		td.before("<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>");
                  }
              }
          });
      }
	
	$("#cells_table td[chose='Y']").attr("rowspan","1");
	$("#cells_table td[chose='Y']").attr("colspan","1");
	moveMergeCell();
}

//删除选择行
function rmvRow(){
	$("input[name='rowRadio']:checked").each(function(){
		var row =$(this).val();
		$("#cells_table tr:eq("+$(this).val()+")").remove();
	});
	row_num --;
}


//---------------------------------保存新增---------------------------------------------------------------------
//保存前页面数据校验
function saveValidate(){
	var res ={flag:true,msg:"ok"};
	if ($("#sheetCat_select").val() == "all") {
		if($("#sheetName_content").val()+"" == ""){
			res.msg="请先输入固定sheet页名称！";
			res.flag = false;
			return res;
		}
	}
	if($("#part_sort").val()+"" == ""){
		res.msg="请先输入sheet在模板中的排序！";
		res.flag = false;
		return res;
	}
	if ($("#partName_content").val()+"" == "") {
		res.msg="模板名称不能为空！";
		res.flag = false;
		return  res ;
	}
	
	if($("#sheetSql_input").val() == ""){
		res.msg="sheetSql不能为空！";
		res.flag = false;
		return res;
	}else if($("#sheetSql_input").val().indexOf("#where")>=0) {
		res.msg="请先手动填写sheetSql中的where条件！";
		res.flag = false;
		return res;
	}
	
	if($("#dataSql_input").val() == ""){
		res.msg="dataSql不能为空！";
		res.flag = false;
		return res;
	}else if($("#dataSql_input").val().indexOf("#where")>=0) {
		res.msg="请先手动填写dataSql中的where条件！";
		res.flag = false;
		return res;
	}
	
	if (sql_test_status == 0) {
		res.msg="保存前请先测试sql！";
		res.flag = false;
		return res;
	}else if (sql_test_status == 1) {
		res.msg="保存前请先测试DataSql！";
		res.flag = false;
		return res;
	}else if (sql_test_status == 2) {
		res.msg="保存前请先测试SheetSql！";
		res.flag = false;
		return res;
	}
	
	return res;
}

//location='tr_"+i+"_td_"+j+"' 
function savePartAndCells(){
	var valiRes=saveValidate();
	if (!valiRes.flag) {
		layer.alert(valiRes.msg);
		return;
	}
	var cells=[];
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$(item);
			var	 cellName=td.text();
			if(cellName && cellName != undefined && cellName !=""){
					var  location=td.attr("location")+"";
					var	 property=td.attr("rename");
					var	 startRow=location.substring(location.indexOf("tr_"), location.indexOf("_td")).replace("tr_", "");
					var	 endRow=parseInt(startRow, 10)+parseInt(td.attr("rowspan"), 10)-1;
					var  startColumn=location.substring(location.indexOf("td_")).replace("td_", "");
					var  endColumn =parseInt(startColumn, 10)+parseInt(td.attr("colspan"), 10)-1;
					var cell={
							cellName:cellName,
							property:property,
							startRow:startRow,
							endRow:endRow,
							startColumn:startColumn,
							endColumn:endColumn
					};
					cells.push(cell);
			}
		});
		
	});
	var result={
			sheet_cat:sheetCat,
			excel_id:$("#excel_id").val(),
			part_id:$("#part_id").val(),
			template_id:$("#template_id").val(),
			part_name:$("#partName_content").val(),
			part_sort:$("#part_sort").val(),
			sheet_name:$("#sheetName_content").val(),
			sheet_sql:$("#sheetSql_input").val(),
			data_sql:$("#dataSql_input").val(),
			cells:JSON.stringify(cells)
	};
	
	var url = _basePath + "/poiAutoExport/savePartAndCells";
	$.post(url, result, function(res, status) {
		if(res.success){
			top.closeCurrentTab();
		}
		layer.alert(res.message);
	});
}

//调用窗口reloadRecord方法
function reloadRecordTab(title){
	var tab = $('.menu-tabs').tabs('getTab', title);
	var tabWin = null;
	if (tab && tab.find('iframe').length > 0) {
		tabWin = tab.find('iframe')[0].contentWindow;
		if(tabWin != null){
			tabWin.reloadRecord();
		}
	}
}


//保存后跳转编辑
function editPartAndCell(id){
	var url=_basePath + "/poiAutoExport/editPartAndCell?id="+id;
	top.addTab("partAndCell_edit","ExcelPart编辑",url);
}

//---------------------------------------part编辑--------------------------------
function loadEditPart(){
	loadEditData();
	moveMergeCell();
}

//编辑加载数据方法
var page={};
function loadEditData(){
		var url = _basePath + "/poiAutoExport/loadEditData";
		page.id=$("#part_id").val();
		$.post(url,page,function(res,status ){
			//生成表头样式
			var cellList=res;
			$("#cells_table_body").empty();
				row_num =cellList[cellList.length-1].maxrow+1;
				col_num = cellList[cellList.length-1].maxcolumn+1;
				var num_row =0;
				strs="<tr location='tr_"+num_row+"'  style='height:23px;'>";
				console.log(JSON.stringify(cellList));
				var ColumnNum_temp=0;
				$.each(cellList,function(i,item){
					if (i>0 && cellList[i].startrow != cellList[i-1].startrow) {
						if (cellList[i-1].endrow - cellList[i-1].startrow >0) {
							for ( var tempInt = 0; tempInt < (cellList[i-1].endrow - cellList[i-1].startrow); tempInt++) {
								strs += "<tr></tr>";
								ColumnNum_temp=0;
							}
						}
						num_row=cellList[i].startrow;
						strs+="<tr location='tr_"+num_row+"'  style='height:23px;'>";
					}
					for ( var j = 0; j < col_num; j++) {
						if (item.startrow==num_row && item.startcolumn==j) {
						
							if (j>0 && ColumnNum_temp == 0 && cellList[i].startcolumn > 0) {
								for ( var tmepInt = 0; tmepInt < (cellList[i].startcolumn - 0 ); tmepInt++) {
									strs +="<td></td>";
								}
							}
							ColumnNum_temp++;
							if (item.ismerge == "Y") {
								strs+="<td style='text-align:center; width:180px;height:23px'  onclick='choseTd(this);' chose='N' location='tr_"+num_row+"_td_"+j+"'  " 
								+"colspan='"+((item.endcolumn - item.startcolumn)+1)+"' rowspan='"+(1+(item.endrow-item.startrow))+"' categery='cells_td' reName='"+formatNull(item.property)+"' >"+formatNull(item.cellname)+"</td>";
								
								if (ColumnNum_temp > 0 && i< cellList.length-2 && cellList[i+1].startcolumn != (cellList[i].endcolumn+1) && cellList[i].startrow == cellList[i+1].startrow ) {
									for ( var tmepInt = 0; tmepInt < (cellList[i+1].startcolumn - cellList[i].endcolumn-1 ); tmepInt++) {
										strs +="<td></td>";
									}
								}
								
								if (ColumnNum_temp > 0 && i< cellList.length-2 && cellList[i].startrow != cellList[i+1].startrow ) {
									for ( var tmepInt = 0; tmepInt < (col_num-1 - cellList[i].endcolumn); tmepInt++) {
										strs +="<td></td>";
									}
								}
							}else if (item.ismerge == "N") {
								strs+="<td style='text-align:center; width:180px;height:23px'  onclick='choseTd(this);' chose='N' location='tr_"+num_row+"_td_"+j+"'  " 
								+"colspan='1' rowspan='1'  categery='cells_td' reName='"+formatNull(item.property)+"' >"+formatNull(item.cellname)+"</td>";
								
								if (ColumnNum_temp > 0 && i< cellList.length-2 && cellList[i+1].startcolumn != (cellList[i].startcolumn+1) && cellList[i].startrow == cellList[i+1].startrow ) {
									for ( var tmepInt = 0; tmepInt < (cellList[i+1].startcolumn - cellList[i].startcolumn-1 ); tmepInt++) {
										strs +="<td></td>";
									}
								}
								
								if (ColumnNum_temp > 0 && i< cellList.length-2 && cellList[i].startrow != cellList[i+1].startrow ) {
									for ( var tmepInt = 0; tmepInt < (col_num-1 - cellList[i].startcolumn); tmepInt++) {
										strs +="<td></td>";
									}
								}
							}
							
						}
					}
					if (item.ismerge == "Y") {
						if (item.endcolumn == col_num-1 || i == cellList.length-1) {
							if (item.endcolumn < item.maxcolumn) {
								for ( var intTemp = 0; intTemp < item.maxcolumn - item.endcolumn; intTemp++) {
									strs +="<td></td>";
								}
							}
							strs+="</tr>";
							ColumnNum_temp=0;
						}
					}else {
						if (item.startcolumn == col_num-1 || i == cellList.length-1) {
							if (item.startcolumn < item.maxcolumn) {
								for ( var intTemp = 0; intTemp < item.maxcolumn - item.startcolumn; intTemp++) {
									strs +="<td></td>";
								}
							}
							strs+="</tr>";
							ColumnNum_temp=0;
						}
					}
					
				});
				
			$("#cells_table_body").append(strs);
			$("#cells_table_div").show();
			moveMergeCell();
		});
}


function toCreate(){
	var url=_basePath + "/poiAutoExport/addPart?id="+$("#part_id").val();
	top.addTab("part_add","ExcelPart新增",url);
	top.closeTab("ExcelPart编辑");
}

/*
 * 测试sheetsql是否能执行
 */
function testSheetSql(){
	var sql =$("#sheetSql_input").val()+"";
	if (sql==""){
		layer.alert("sql语句没有不能为空！");
		return;
	} 
	if (sql.indexOf("#where") >=0){
		layer.alert("请先处理手动处理sql语句中的where条件！");
		return;
	} 
	var req={sql:sql};
	var url = _basePath + "/poiAutoExport/testSql";
	$.post(url,req,function(data,status){
		layer.alert(data.message);
		if(data.success && sql_test_status == 0)
			sql_test_status = 1;
		else if(data.success && sql_test_status == 2)
			sql_test_status = 3;
	});
}

/*
 * 测试DataSql是否能执行
 */
function testDataSql(){
	var sql =$("#dataSql_input").val()+"";
	if (sql==""){
		layer.alert("sql语句没有不能为空！");
		return;
	} 
	if (sql.indexOf("#filter") >=0)
		sql = sql.replace("#filter", "");
	if (sql.indexOf("#where") >=0){
		layer.alert("请先处理手动处理sql语句中的where条件！");
		return;
	} 
	if (sql.indexOf("#columns") >=0){
		layer.alert("请先选择字段并保存为sql！");
		return;
	} 
	if (sql.indexOf("#id") >=0){
		sql = sql.replace("#id", "1 or true");
	} 
	if (sql.indexOf("#id") >=0){
		sql = sql.replace("#id", "1 or true");
	} 
	var req={sql:sql};
	var url = _basePath + "/poiAutoExport/testSql";
	$.post(url,req,function(data,status){
		layer.alert(data.message);
		if(data.success && sql_test_status == 0)
			sql_test_status = 2;
		else if(data.success && sql_test_status == 1)
			sql_test_status = 3;
	});
}

/**
 * 测试导出
 */
function testExport(){
	var url=_basePath + "/poiAutoExport/testExportExcel?id="+$("#part_id").val()+"&excel_id="+$("#excel_id").val();
	window.location.href =url;
}

//null值处理
function formatNull(str, rep, format) {
	if (format == undefined)
		format = "";
	if (str == null || str == undefined) {
		if (rep == null || rep == undefined || rep == "")
			return "";
		else
			return rep;
	}
	return str + format;
}