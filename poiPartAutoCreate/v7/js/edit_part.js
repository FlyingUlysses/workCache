//---------------------------sql模板------------------------------------------
var SHEET_SQL_TEMPLATE=" select #id id,#name name ";
var DATA_SQL_TEMPLATE=" select #columns \n from #baseTable #joinTable " ;
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
	loadBkColors();
}

//加载cell的颜色选择框
function loadBkColors(){
	$("#color_table").empty();
	var str="";
	for ( var int = 0; int < 7; int++) {
		str+="<tr>";
		for ( var y = 0; y < 7; y++) {
			str+="<td name='cell_color'></td>";
		}
		str+="</tr>";
	}
	$("#color_table").html(str);
	$("#color_table td").each(function(i,item){
		if(i < cell_colors.length){
			str="<div name='cell_color_div' style='width:20px;height:20px;background-color:"+cell_colors[i].code+";border: solid 1px black;' color_id='"+cell_colors[i].id+"'></div>";
			$(this).html(str);
		}
	});
	$("div[name='cell_color_div']").bind("click",function(){
		$("#cells_table td[chose='1']").css("background-color",$(this).css("background-color"));
		$("#cell_color_div").hide();
	});
	
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
		width : "1000px",
		height : "530px",
		url : _basePath + "/poiAutoExport/editSheetTable?id="+ $("#part_id").val()
	});
}

//sheet表格编辑页调用保存sheetsql
var sheetTables_str="";
function saveSheetTables(sql,tables){
	sheetTables_str=tables;
	$("#sheetSql_input").empty();
	$("#sheetSql_input").val(sql);
}


function choseDataTable(){
	showModel({
		title : "Data表格编辑",
		width : "1000px",
		height : "530px",
		url : _basePath + "/poiAutoExport/editDataTable?id="+$("#part_id").val()
	});
}

var columnsMap =null;
var tablesStr="";
var data_tables = [];
//sheet表格编辑页调用保存sheetsql
function saveDataTables(joinTable_array,map){
	tablesStr="";
	columnsMap=map;
	data_tables=joinTable_array;
	$.each(data_tables,function(i,item){
		if (item.link && item.link != undefined && item.link != "") 
			tablesStr+=item.table_name+"#"+item.re_name+"#"+item.link+",";
		else
			tablesStr+=item.table_name+"#"+item.re_name+",";
	});
	createDataSql();
}

//生成DataSql的入口
function createDataSql(){
	$("#dataSql_input").val("");
	var sql =DATA_SQL_TEMPLATE;
	sql=setDataSqlTablesLink(data_tables,sql);
	sql=saveCellToSql(sql);
	$("#dataSql_input").val(sql);
}

//生成sql表格与映射关系
function setDataSqlTablesLink(tables,sql){
	var str ="";
	if (tables && tables.length>0) {
		$.each(tables,function(i,item){
			if(i==0){
				str += " " +item.name +" "+ item.re_name +" ";
				sql=sql.replace("#baseTable", str);
				str ="";
			}else
				str +=" \n left join "+item.name +" "+item.re_name +" on "+item.link+" ";
		});
	}
	sql=sql.replace("#joinTable",str);
	return sql;
}

var sheetCat="categery";//sheet分类
//根据选择sheet类型确定页面展示内容
function selectSheet(){
	sheetCat = $("#sheetCat_select").val();
	$("#sheetName_content").val("");
	$("#sheetSql_input").val("");
	if (sheetCat == "all") {
		$("#choseShettTable").hide();
	}else{
		$("#choseShettTable").show();
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
    if ($("#sheetName_content").val()+""=="" || sheetCat == "categery") {
		return;
	}
    sheet_sql_temp=SHEET_SQL_TEMPLATE;
    sheet_sql_temp=sheet_sql_temp.replace("#id", "0");
    sheet_sql_temp=sheet_sql_temp.replace("#name","'"+$("#sheetName_content").val()+"'");
    $("#sheetSql_input").empty();
    $("#sheetSql_input").val(sheet_sql_temp);
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
					var i=1;
					var column_name_temp =temp.column_name;
					$("td").each(function(){
						var reColumnTemp = $(this).attr("rename")+"";
						if (reColumnTemp && reColumnTemp != undefined && reColumnTemp != "" && reColumnTemp ==column_name_temp ) {
							column_name_temp=temp.column_name+(i++);
						}
					});
					$("#data_reColumn").val(column_name_temp);
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
	$("td[chose='Y']").html($("#cell_reColumn").val());
	$("td[chose='Y']").attr("reName",$("#data_reColumn").val());
	createDataSql();
}

function choseTd(e){
		$("#cells_table").find('td').removeClass('selected');
		$("td[chose='1']").css("border","");
		$("td[chose='1']").attr("chose","0");
		
		$(e).attr("chose","1");
		$(e).css("border","solid 4px black");
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

function saveCellToSql(sql){
	var strs ="";
	var tds=$("#cells_table td");
	$.each(tds,function(i,item){
		if ($(this).text() && $(this).text() != undefined && $(this).text() != "") {
			if ($(item).attr("column") && $(item).attr("column") != undefined && $(item).attr("column") !="") {
				if(i != tds.length-1){
					strs+=" "+$(item).attr("column")+" "+$(item).attr("rename")+", ";
					
				}else{
					strs+=" "+$(item).attr("column")+" "+$(item).attr("rename")+" ";
				}
			}
		}
	});
	sql = sql.replace("#columns", strs);
	return sql;
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
	  var tds = $("#cells_table").find("td[chose='Y']"), v,vc;
      if (tds.length) {
    	  $("#cells_table").find('td.hide').remove();
          tds.filter('[colspan]').each(function () {
              v = (parseInt($(this).attr('colspan')) || 1) - 1;
              if (v > 0) for (var i = 0; i < v; i++)
            	  $(this).after("<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>");
          }).end().filter('[rowspan]').each(function () {
              v = parseInt($(this).attr('rowspan')) || 1;
              vc = parseInt($(this).attr('colspan')) || 1;
              if (v > 1) {
                  for (var i = 1; i < v; i++) {
                      var td = $(this.parentNode.parentNode.rows[this.parentNode.rowIndex + i].cells[this.cellIndex-1]);
                     	for (var j = 0; j < vc; j++)
                     		td.after("<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>");
                  }
              }
          });
      }
	$("#cells_table td[chose='Y']").attr("rowspan","1");
	$("#cells_table td[chose='Y']").attr("colspan","1");
	moveMergeCell();
}

//补全单元格
function addHideCell(){
	 var tds = $("#cells_table").find('td[colspan],td[rowspan]'), v,vc;
     if (tds.length) {
   	  $("#cells_table").find('td.hide').remove();
         tds.filter('[colspan]').each(function () {
             v = (parseInt($(this).attr('colspan')) || 1) - 1;
             if (v > 0) for (var i = 0; i < v; i++)
           	  $(this).after("<td class='hide' ></td>");
         }).end().filter('[rowspan]').each(function () {
             v = parseInt($(this).attr('rowspan')) || 1;
             vc = parseInt($(this).attr('colspan')) || 1;
             if (v > 1) {
                 for (var i = 1; i < v; i++) {
                     var td = $(this.parentNode.parentNode.rows[this.parentNode.rowIndex + i].cells[this.cellIndex-1]);
                    	for (var j = 0; j < vc; j++)
                    		td.after("<td class='hide' ></td>");
                 }
             }
         });
     }
}

//删除选择行
function rmvRow(){
	$("input[name='rowRadio']:checked").each(function(){
		var row =$(this).val();
		$("#cells_table tr:eq("+$(this).val()+")").remove();
	});
	row_num --;
}

//删除最后一列
function delete_col(){
	var Maxtr=$("#cells_table tbody tr").length;
	for ( var i = 0; i < Maxtr; i++) {
		if (i==0) {
			var Maxtd=$("#cells_table tbody tr:eq("+i+") th").length;
			$("#cells_table tbody tr:eq(0) th:eq("+(Maxtd-1)+")").remove();
		}else{
			var Maxtd=$("#cells_table tbody tr:eq("+i+") td").length;
			$("#cells_table tbody tr:eq("+i+") td:eq("+(Maxtd-1)+")").remove();
		}
	}
	col_num--;
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
	addHideCell();
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$(item);
			var	cellName=td.text();
			if(cellName && cellName != undefined && cellName !=""){
					var	 property=td.attr("rename");
					var  native_name=td.attr("column")+"#"+td.attr("tablename");
					var	 startRow=$(this).parent().index()-1;
					var	 endRow=$(this).parent().index()-1+parseInt(td.attr("rowspan"), 10)-1;
					var  startColumn=$(this).index()-1;
					var  endColumn =$(this).index()-1+parseInt(td.attr("colspan"), 10)-1;
					var cell={
							cellName:cellName,
							native_name:native_name,
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
	$("#cells_table").find('td.hide').remove();
	var data_sql=$("#dataSql_input").val();
	if(sheetCat == "categery")
		data_sql +=" \n where "+$("#sheetName_content").val()+"=#id  #filter ";
	else
		data_sql+=" \n where true #filter ";
	alert(data_sql);
	var result={
			sheet_cat:sheetCat,
			tablesStr:tablesStr,
			sheetTablesStr:sheetTables_str,
			excel_id:$("#excel_id").val(),
			part_id:$("#part_id").val(),
			template_id:$("#template_id").val(),
			part_name:$("#partName_content").val(),
			part_sort:$("#part_sort").val(),
			sheet_name:$("#sheetName_content").val(),
			sheet_sql:$("#sheetSql_input").val(),
			data_sql:data_sql,
			cells:JSON.stringify(cells)
	};
	
	var url = _basePath + "/poiAutoExport/savePartAndCells";
	$.post(url, result, function(res, status) {
		if(res.success){
			$("#part_id").val(res.data.id);
			$("#testExport_div").css("display","inline");
			$("#testExport_div").show();
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
			var cellList=res.cellList;
			if(res.tables && res.tables!=undefined && res.tables != ""){
				columnsMap=res.tables;
				tablesStr=res.tables_str;
			}
			//加载cell
			if (cellList && cellList.length>0) {
				$("#cells_table_body").empty();
				row_num =cellList.length;
				col_num = cellList[0].length;
				var strs ="";
				strs="<tr   style='height:23px;'>";
				for ( var j = 0; j <= col_num; j++) {
					if(j==0)
						strs+="<th style='text-align:center; width:25px;height:27px;' colspan='1' rowspan='1'></th>";
					else
						strs+="<th style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1'>x"+j+"</th>";
				}
				strs+="</tr>";
				$.each(cellList,function(i,item){
					strs+="<tr   style='height:23px;'><th width='25px'><input name='rowRadio' type='checkbox' value='"+(j++)+"'></th>";
					$.each(item,function(j,temp){
						if (temp && temp != undefined) {
							if (temp.id && temp.id != undefined) {
								if (temp.ismerge == 'Y') {
									strs+="<td style='text-align:center; width:127px;height:27px;' colspan='"+(temp.endcolumn - temp.startcolumn+1)+"' rowspan='"+(temp.endrow - temp.startrow +1)+"' categery='cells_td' onclick='choseTd(this);' chose='N' tablename='"+ formatNull( temp.table)+"' column='"+ formatNull(temp.native_column)+"' rename='"+formatNull(temp.property)+"' >"+formatNull(temp.cellname)+"</td>";
								}else{
									strs+="<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' tablename='"+ formatNull( temp.table)+"' column='"+ formatNull(temp.native_column)+"' rename='"+formatNull(temp.property)+"'  >"+temp.cellname+"</td>";
								}
							}
						}else{
							strs+="<td style='text-align:center; width:127px;height:27px;' colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ></td>";
						}
					});
					strs+="</tr>";
				});
				$("#cells_table_body").append(strs);
				$("#cells_table_div").show();
			}
			
			moveMergeCell();
			col_num++;
			row_num++;
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
	if (sql.indexOf("#criteria") >=0){
		layer.alert("请先处理手动处理sql语句中未明确的表格连接！");
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
	if (sql.indexOf("#criteria") >=0){
		layer.alert("请先处理手动处理sql语句中未明确的表格连接！");
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
	var url=_basePath + "/poiAutoExport/testExportPart?id="+$("#part_id").val()+"&excel_id="+$("#excel_id").val();
	window.location.href =url;
}

/**
 * 弹出cell颜色选择框，选择颜色
 */
function select_cellBkColor(){
	if($("#cell_color_div").css("display") == "none")
		$("#cell_color_div").show();
	else
		$("#cell_color_div").hide();
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