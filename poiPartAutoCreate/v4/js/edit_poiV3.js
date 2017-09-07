//---------------------------sql模板------------------------------------------
var SHEET_SQL_TEMPLATE=" select #id id,#name name from #tableName #where";
var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id #where #filter ";
var page = { page: 1,limit: 10 };
$(function() {
	part_id=$("#part_id").val();
	if (part_id && part_id != undefined) 
		loadEditPart();
	else
		reload();
		
	
	$("#table_name_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
	$("#table_code_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
});

function reload(){
	page.page = 1;
	loadDataPages();
	reloadCells();
}
function reloadCells(){
	var strs="";
	$("#cells_table_body").empty();
	for ( var i = 0; i < row_num_v3; i++) {
		strs+="<tr location='tr_"+i+"' colspan='1' rowspan='1' style='height:23px;'>";
			for ( var j = 0; j < col_num_v3; j++) {
				strs+="<td style='text-align:center; width:180px;height:23px' location='tr_"+i+"_td_"+j+"'  colspan='1' rowspan='1' categery='cells_td' ><div><input style='width: 120px;' tempType='name_input' hidden /></div>" 
					+"<div style='display:none;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:none;'><div tempType='name_div' style='display:none;'></div><div style='display:none;' tempType='attr_div'></div></td>";
			}
		strs+="</tr>";
	}
	$("#cells_table_body").append(strs);
	reloadCells_v3();
	moveMergeCell();
}

//----------------------------sheetSql生成------------------------------------------------------------------------
var sheetCat="categery";//sheet分类
//根据选择sheet类型确定页面展示内容
function selectSheet(){
	sheetCat=$("#sheetCat_select").val()+"";
	$("#sheetSql_input").empty();	
	$("#sheet_table").empty();	
	$("input[name='rowRadio']").each(function(i){
		$(this).attr("checked",false);
	});
	joinTables =[];
	data_sql_columns=[];
	$("#cells_table_div").hide();
	reload();
	if (sheetCat=="all") {
		$("#sheetName_title").show();
		$("#sheetName_content").show();
		$("#sheet_column_div").hide();
		$("#sheet_column_div").attr("class","span0");
		$("#sheel_base_div").attr("class","span6");
		$("#data_baseTables_div").attr("class","span6");
	}else if(sheetCat=="categery"){
		$("#sheetName_title").hide();
		$("#sheetName_content").hide();
		$("#sheetName_content").val("");
		$("#sheel_base_div").attr("class","span5");
		$("#data_baseTables_div").attr("class","span5");
		$("#sheet_column_div").attr("class","span2");
		$("#sheet_column_div").show();
	}
}

//固定sheet模式sheet语句生成
function getAllSheet(){
    if ($("#sheetName_content").val()+""=="") {
		return;
	}
    sheet_sql_temp=SHEET_SQL_TEMPLATE;
    sheet_sql_temp=sheet_sql_temp.replace("#id", "0");
    sheet_sql_temp=sheet_sql_temp.replace("#name",$("#sheetName_content").val());
    sheet_sql_temp=sheet_sql_temp.replace("from #tableName", "");
    $("#sheetSql_input").empty();
    $("#sheetSql_input").append(sheet_sql_temp);
}

//data主表分页
function loadDataPages(){
	var url = _basePath + "/poiAutoExport/getPages";
	page.table_name=$("#table_name_input").val();
	page.table_code=$("#table_code_input").val();
	$.post(url, page, function(res, status) {
		$("#dataRowBody").empty();
		renderPage("dataPageUL",page,res.total,loadDataPages);
		var data = res.data;
		if(data != null && data.length > 0){
			 var num =0;
			 var strs = "";
			 $.each(data,function(i,item){
				 strs += "<tr onclick='dataPagesClick(" + num + ");'>"
					 + "<td style='text-align: center;'><input class='checkboxes' name='rowRadio' type='radio' value='t5_" + num + "' /></td>"
					 + "<td style='vertical-align: middle;' >" + item.code + "</td><td style='vertical-align: middle;'>" + formatNull(item.name) + "</td>"
					 + "<td style='text-align: center;'>" + formatNull(item.create_time) + "</td>"
					 + "<td style='text-align: center;'>"
					 + 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"reloadColumns('"+ item.code +"');\"><i class='icon-plus'></i></button></td></tr>";
				 num++;
			 });
				 $("#dataRowBody").append(strs);
		 }
	});
}
function dataPagesClick(num){
	$("input[name='rowRadio'][value='t5_" + num + "']").attr("checked",'checked'); ;
}

var tableCode="";//主表编码
//根据选择主表和sheet类型确定加载方法
function reloadColumns(code){
	$("#cells_table_div").show();
	tableCode=code;
	$("#dataSql_input").empty();
	reloadCells();
	var strs="";
	var url="";
	if (  sheetCat =="categery") {
		loadSheetTable();
		loadColumns();
	}else{
		loadColumns();
	}
}

//加载sheetTable供选择sheet字段
function loadSheetTable(){
	var url =_basePath + "/poiAutoExport/getSheetTable?table_name="+tableCode;
	$.post(url, function(data, status) {
		$("#sheet_table").empty();
		var strs="<option value=''> 请选择表格...<option>";
		if (data && data.length>0) {
			$.each(data,function(i,item){
				strs+="<option  value='"+formatNull(item.re_table)+"' column_name='"+formatNull(item.column_name)+"' re_column='"+formatNull(item.re_column)+"' re_table_name="+formatNull(item.re_table_name)+">"+formatNull(item.re_table)+"</option>";
			});
		}
		$("#sheet_table").append(strs);
		$("#sheet_table").trigger("liszt:updated");
	});
}

//根据选择sheettable查询该表字段
var sheet_sql_temp="";//sheet sql 全局字段
var sheetTableCode="";
function loadSheetColumns(){
	sheetTableCode=$("#sheet_table").val();
	joinTables=[];
	$("#sheetSql_input").empty();
	$("#dataSql_input").empty();
	data_sql_temp=DATA_SQL_TEMPLATE;
	if (sheetTableCode !=tableCode) {
		var sheet_table={
				name:$("#sheet_table").val()+"",
				re_name:$("#sheet_table option:selected").attr("re_table_name")+"",
				re_column:$("#sheet_table option:selected").attr("re_column")+"",
				column_name:$("#sheet_table option:selected").attr("column_name")+""
		};
		joinTables.push(sheet_table);
	}
	var url =_basePath + "/poiAutoExport/getSheetColumns?table_name="+sheetTableCode;
	$.post(url, function(data, status) {
		$("#sheet_table_id").empty();
		$("#sheet_table_name").empty();
		var strs="<option value=''> 请选择字段...<option>";
		if (data && data.length>0) {
			$.each(data,function(i,item){
				strs+="<option value='"+formatNull(item.column_name)+"' remarks='"+formatNull(item.remarks)+"'>"+formatNull(item.column_name)+"</option>";
			});
		}
		$("#sheet_table_id").append(strs);
		$("#sheet_table_name").append(strs);
		$("#sheet_table_id").trigger("liszt:updated");
		$("#sheet_table_name").trigger("liszt:updated");
		sheet_sql_temp=SHEET_SQL_TEMPLATE;
		sheet_sql_temp=sheet_sql_temp.replace("#tableName", sheetTableCode);
		$("#sheetSql_input").empty();
		$("#sheetSql_input").append(sheet_sql_temp);
		
	});
}
//选择id
function selectSheetId(){
	sheet_sql_temp=sheet_sql_temp.replace("#id", $("#sheet_table_id").val());
	$("#sheetSql_input").empty();
	$("#sheetSql_input").append(sheet_sql_temp);
}
//选择name
function selectSheetName(){
	sheet_sql_temp=sheet_sql_temp.replace("#name", $("#sheet_table_name").val());
	$("#sheetSql_input").empty();
	$("#sheetSql_input").append(sheet_sql_temp);
}

//--------------------------------------编辑cell表头------------------------------
var row_num_v3=2;
var col_num_v3=7;
var select_cell_v3="";
var select_row_v3="";
var location_cell_v3="";
var location_row_v3="";
var tr_num_v3="";
var td_num_v3="";
var property_list_v3=[];



//页面内容刷新后绑定方法
function reloadCells_v3(){
	edit_property_v3();
	//禁用浏览器右键
	$("td[categery='cells_td']").bind("contextmenu", function(){
		return false;
	});
	$("td[categery='cells_td']").bind("contextmenu",function(e){
		var location=$(this).attr("location")+"";
		location_row_v3=parseInt(location.substring(location.indexOf("tr_"), location.indexOf("_td")).replace("tr_", ""), 10);
		location_cell_v3=parseInt(location.substring( location.indexOf("td_")).replace("td_", ""), 10);
		select_row_v3=$(this).parent().index();
		select_cell_v3=$(this).index();
		td_num_v3=$("#cells_table tbody tr:eq("+select_row_v3+") td").length;
		tr_num_v3=$("#cells_table tbody tr").length;
		$("#cellsTable_menu").menu("show",{
			left:e.pageX,
			top:e.pageY
		});
	});
}

//向右合并
function left_merge_cell_v3(){
	if (select_cell_v3 == (td_num_v3-1)) {
		alert("请求操作超过表格范围,请先添加列!");
		return;
	}
	var col_span=parseInt($("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("colspan"),10);
	var row_span=parseInt($("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("rowspan"),10);
	var max_col_span=1;
	if (row_span && row_span>1) {
		//取下一列中最大colspan
		for ( var i = 0; i < row_span; i++) {
			if (max_col_span<parseInt($("td[location='tr_"+(location_row_v3+i)+"_td_"+(location_cell_v3+col_span)+"']").attr("colspan"),10)) {
				max_col_span=parseInt($("td[location='tr_"+(location_row_v3+i)+"_td_"+(location_cell_v3+col_span)+"']").attr("colspan"),10);
			}
		}
		for ( var i = 0; i < row_span; i++) {
			for ( var j = 0; j <max_col_span; j++) {
				$("td[location='tr_"+(location_row_v3+i)+"_td_"+(location_cell_v3+col_span+j)+"']").remove();
			}
		}
	}else{
		$("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3+col_span)+"']").remove();
	}
	$("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("colspan",(col_span+max_col_span)+"");
}


//向下合并
function down_merge_cell_v3(){
	var col_span=parseInt($("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("colspan"),10);
	var row_span=parseInt($("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("rowspan"),10);
	if (!row_span || row_span == undefined) {
		row_span=1;
	}else if ((select_row_v3+row_span) == tr_num_v3) {
		alert("请求操作超过表格范围,请先添加行!");
		return;
	}
	var max_row_span=1;//向下合并涉及单元格的最大跨行
	if (col_span && col_span>1) {
		for ( var i = 0; i < col_span; i++) {
			if (max_row_span < parseInt($("td[location='tr_"+(location_row_v3+row_span)+"_td_"+(location_cell_v3+i)+"']").attr("rowspan"),10)) {
				max_row_span=parseInt($("td[location='tr_"+(location_row_v3+row_span)+"_td_"+(location_cell_v3+i)+"']").attr("rowspan"),10);
			}
		}
		for ( var i = 0; i < col_span; i++) {
			for ( var j = 0; j <max_row_span; j++) {
				$("td[location='tr_"+(location_row_v3+row_span+j)+"_td_"+(location_cell_v3+i)+"']").remove();
			}
		}
	}else{
		$("td[location='tr_"+(location_row_v3+row_span)+"_td_"+(location_cell_v3)+"']").remove();
	}
	$("td[location='tr_"+(location_row_v3)+"_td_"+(location_cell_v3)+"']").attr("rowspan",(row_span+max_row_span)+"");
}

//删除最后一行
function delete_row_v3(){
	var Maxtr=$("#cells_table tbody tr").length;
	$("#cells_table tbody tr:eq("+(Maxtr-1)+")").remove();
	row_num_v3--;
}

//删除最后一列
function delete_col_v3(){
	var Maxtr=$("#cells_table tbody tr").length;
	for ( var i = 0; i < Maxtr; i++) {
		var Maxtd=$("#cells_table tbody tr:eq("+i+") td").length;
		$("#cells_table tbody tr:eq("+i+") td:eq("+(Maxtd-1)+")").remove();
	}
	col_num_v3--;
}


//编辑名称
function editCellName_v3(){
	var celltableTemp=$("#cells_table");
	celltableTemp.find("input[tempType='name_input']").show();
	celltableTemp.find("div[tempType='name_div']").hide();
}


//保存名称编辑
function saveCellName_v3(){
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$("#cells_table tbody tr:eq("+i+") td:eq("+j+")");
			var name=td.find("input[tempType='name_input']").val()+"";
			td.find("div[tempType='name_div']").empty();
			td.find("div[tempType='name_div']").append(name);
			td.find("div[tempType='name_div']").show();
			td.find("input").hide();
		});
	});
	reloadCells_v3();
}

//添加整行
function addCellTableRow_v3(){
	var strs=$("#cells_table_body").html()+" <tr>";
	for ( var j = 0; j <col_num_v3 ; j++) {
		strs+="<td categery='cells_td' style='text-align:center;  width:180px;height:23px' location='tr_"+row_num_v3+"_td_"+j+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'></div><div style='display:inline;' tempType='attr_div'></div></td>";
	}
	strs+="</tr>";
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	moveMergeCell();
	row_num_v3++;
	reloadCells_v3();
}

//添加整列
function addCellTableCol_v3(){
	var strs="";
	for ( var i = 0; i < row_num_v3; i++) {
		var trStr="<tr>"+$("#cells_table_body tr:eq("+i+")").html()+"";
		trStr+="<td categery='cells_td' style='text-align:center;  width:180px;height:23px' location='tr_"+i+"_td_"+col_num_v3+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'></div><div style='display:inline;' tempType='attr_div'></div></td>";
		trStr+="</tr>";
		strs+=trStr;
	}
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	moveMergeCell();
	col_num_v3++;
	reloadCells_v3();
}

//展示所有字段供选择
var joinTables=[];
var data_sql_temp =DATA_SQL_TEMPLATE;
var data_sql_columns=[];
function edit_property_v3(){
	var url = _basePath + "/poiAutoExport/getPropertyList?table="+tableCode;
	 var thisMenu=$('#edit_property').menu('destroy');
	 $("#cellsTable_menu").menu("appendItem", {
			text: "选择表字段",
			id:"edit_property"
		});
	$.post(url, function(data, status) {
		 $.each(data,function(i,item){
			 var jsonTable = $.parseJSON(i);
			 $("#cellsTable_menu").menu("appendItem", {
					parent: $("#cellsTable_menu").menu("findItem", "选择表字段").target,  
					text:jsonTable.re_table+""
				});
			 $.each(item,function(p,property){
				 $("#cellsTable_menu").menu("appendItem", {
						parent: $("#cellsTable_menu").menu("findItem", ""+jsonTable.re_table).target, 
						text: ""+property.column_name,

						
						onclick:function(){
							var td=$("#cells_table tbody tr:eq("+select_row_v3+") td:eq("+select_cell_v3+")");
							var name=property.re_table_name+"."+property.column_name;
							td.find("div[tempType='attr_div']").empty();
							td.find("div[tempType='attr_div']").append(name);
							td.find("div[tempType='attr_div']").show();
							td.find("input").hide();
							if (jsonTable.re_table+"" != tableCode) {
								if (joinTables.length>0) {
									$.each(joinTables,function(t,table){
										if (table.name != jsonTable.re_table+"") {
											var joinTable ={
													name:jsonTable.re_table+"",
													re_name:jsonTable.re_table_name+"",
													re_column:jsonTable.re_column+"",
													column_name:jsonTable.column_name+""
											};
											joinTables.push(joinTable);
										}
									});
								}else{
									var joinTable ={
											name:jsonTable.re_table+"",
											re_name:jsonTable.re_table_name+"",
											re_column:jsonTable.re_column+"",
											column_name:jsonTable.column_name+""
									};
									joinTables.push(joinTable);
								}
							}
							//生成dataSql
							//var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id #where #filter ";
							data_sql_temp=DATA_SQL_TEMPLATE;
							if (sheetCat =="all") {
								data_sql_temp=data_sql_temp.replace("#sheet=#id","");
							}
							data_sql_temp=data_sql_temp.replace("#baseTable", tableCode+" t");
							$.each(joinTables,function(t,table){
								if (table.name != tableCode) {
									data_sql_temp=data_sql_temp.replace("#joinTable", " left join "+table.name+" "+table.re_name+" on t."+table.column_name+" = "+table.re_name+"."+table.re_column);
								}
								if (sheetCat =="categery" && table.name == sheetTableCode) {
									data_sql_temp=data_sql_temp.replace("#sheet", table.re_name+"."+$("#sheet_table_id").val());
								}else if (sheetCat != "all") {
									data_sql_temp=data_sql_temp.replace("#sheet","t."+$("#sheet_table_id").val());
								}
							});
							data_sql_columns.push(name);
							var column_str="";
							$.each(data_sql_columns,function(c,column){
								if (c==(data_sql_columns.length-1)) {
									column_str+=column+" ";
								}else{
									column_str+=column+", ";
									
								}
							});
							data_sql_temp=data_sql_temp.replace("#columns", column_str);
							$("#dataSql_input").empty();
							$("#dataSql_input").append(data_sql_temp);
						}
				 
				 
					});
			 });
		 });
	});
}

//---------------------------------保存新增---------------------------------------------------------------------
//location='tr_"+i+"_td_"+j+"' 
function savePartAndCells(){
	var cells=[];
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$("#cells_table tbody tr:eq("+i+") td:eq("+j+")");
			var  location=td.attr("location")+"";
			var	 cellName=td.find("input[tempType='name_input']").val()+"";
			var	 property=td.find("div[tempType='attr_div']").html()+"";
			var	 startRow=location.substring(location.indexOf("tr_"), location.indexOf("_td")).replace("tr_", "");
			var	 endRow=parseInt(startRow, 10)+parseInt(td.attr("rowspan"), 10);
			var  startColumn=location.substring(location.indexOf("td_")).replace("td_", "");
			var  endColumn =parseInt(startColumn, 10)+parseInt(td.attr("colspan"), 10);
			var cell={
					cellName:cellName,
					property:property,
					startRow:startRow,
					endRow:endRow,
					startColumn:startColumn,
					endColumn:endColumn
			};
			cells.push(cell);
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
		layer.alert(data.message,function(index){
			if(data.success)
				top.reloadTab("报表生成");
			layer.close(index);
			top.closeTab("ExcelPart新增");
		});
	});
}

//---------------------------------------part编辑--------------------------------
function loadEditPart(){
	page.page = 1;
	loadEditData();
	moveMergeCell();
}

//编辑加载数据方法
function loadEditData(){
		sheetCat=$("#sheetCat_select").val()+"";
		if (sheetCat=="all") {
			$("#sheetName_title").show();
			$("#sheetName_content").show();
			$("#sheet_column_div").hide();
			$("#sheet_column_div").attr("class","span0");
			$("#sheel_base_div").attr("class","span6");
			$("#data_baseTables_div").attr("class","span6");
		}
		var url = _basePath + "/poiAutoExport/loadEditData";
		page.id=$("#part_id").val();
		$.post(url,page,function(result,status ){
			
			//跳转选定主表
			$("#dataRowBody").empty();
			var resPage=result.page;
			var pageNum=result.page_num;
			tableCode=result.base_table;
			page.page=pageNum;
			renderPage("dataPageUL",page,resPage.total,loadDataPages);
			var data = resPage.data;
			if(data != null && data.length > 0){
				 var num =0;
				 var baseTable_num=0;
				 var strs = "";
				 $.each(data,function(i,item){
					 if (tableCode==item.code) {
						 baseTable_num=num;
					 }
					 strs += "<tr onclick='dataPagesClick(" + num + ");'>"
						 + "<td style='text-align: center;'><input class='checkboxes' name='rowRadio' type='radio' value='t5_" + num + "' /></td>"
						 + "<td style='vertical-align: middle;' >" + item.code + "</td><td style='vertical-align: middle;'>" + formatNull(item.name) + "</td>"
						 + "<td style='text-align: center;'>" + formatNull(item.create_time) + "</td>"
						 + "<td style='text-align: center;'>"
						 + 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"reloadColumns('"+ item.code +"');\"><i class='icon-plus'></i></button></td></tr>";
					 num++;
				 });
					 $("#dataRowBody").append(strs);
					 dataPagesClick(baseTable_num);
			 }
			
			
			//生成表头样式
			var cellList=result.cell_list;
			$("#cells_table_body").empty();
			row_num_v3 =(cellList[cellList.length-1].startrow-cellList[0].startrow)+1;
			col_num_v3 = (cellList[cellList.length-1].startcolumn-cellList[0].startcolumn)+1;
			alert("row:"+row_num_v3+"   col:"+col_num_v3);
				var num_row =0;
				strs="<tr location='tr_"+num_row+"'  style='height:23px;'>";
				$.each(cellList,function(i,item){
					if (i>0 && cellList[i].startrow != cellList[i-1].startrow) {
						num_row++;
						strs+="<tr location='tr_"+num_row+"'  style='height:23px;'>";
					}
					for ( var j = 0; j < col_num_v3; j++) {
						if (item.startrow==num_row && item.startcolumn==j) {
							strs+="<td style='text-align:center; width:180px;height:23px' location='tr_"+num_row+"_td_"+j+"'  " 
								+"colspan='"+(1+(item.endcolumn - item.startcolumn))+"' rowspan='"+(1+(item.endrow-item.startrow))+"' categery='cells_td' ><div><input style='width: 120px;' value='"+item.cellname+"' tempType='name_input' hidden /></div>" 
								+"<div tempType='name_div' >"+item.cellname+"</div><div  tempType='attr_div' style='color: #999999;'>"+item.property+"</div></td>";
						}
					}
					if (item.endcolumn ==col_num_v3-1) {
						strs+="</tr>";
					}
				});
				
			$("#cells_table_body").append(strs);
			$("#cells_table_div").show();
			reloadCells_v3();
			moveMergeCell();
			
		});
}
