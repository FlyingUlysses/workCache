//---------------------------sql模板------------------------------------------
var SHEET_SQL_TEMPLATE=" select #id id,#name name from #tableName #joinTable #where";
var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id  #where #filter ";
var row_num=2;
var col_num=7;
var page = { page: 1,limit: 10 };
var sheet_page = { page: 1,limit: 10 };
var sql_test_status = 0 ;//sql语句测试状态，初始为0，sheetsql通过为1，datasql通过为2,全部通过为3
$(function() {
	part_id=$("#part_id").val();
	if (part_id && part_id != undefined) 
		loadEditPart();
	else
		reload();
		
	
	$("#dataTable_name_input").keydown(function(event){
		if (event.keyCode == 13) {
			page.page = 1;
			loadDataPages();
		}
	});
	$("#dataTable_code_input").keydown(function(event){
		if (event.keyCode == 13) {
			page.page = 1;
			loadDataPages();
		}
	});
	$("#select_data_table").click(function(){
		page.page = 1;
		loadDataPages();
	});
	
	$("#sheetTable_name_input").keydown(function(event){
		if (event.keyCode == 13) {
			sheet_page.page = 1;
			loadSheetPages();
		}
	});
	$("#sheetTable_code_input").keydown(function(event){
		if (event.keyCode == 13) {
			sheet_page.page = 1;
			loadSheetPages();
		}
	});
	$("#select_sheet_table").click(function(){
		sheet_page.page = 1;
		loadSheetPages();
	});
	
	
});


function reload(){
	sheet_page.page=1;
	page.page = 1;
	loadDataPages();
	loadSheetPages();
	reloadCells();
}

function reloadCells(){
	var strs="";
	$("#cells_table_body").empty();
	for ( var i = 0; i < row_num; i++) {
		strs+="<tr location='tr_"+i+"' colspan='1' rowspan='1' style='height:23px;'>";
			for ( var j = 0; j < col_num; j++) {
				strs+="<td style='text-align:center; width:180px;height:23px' location='tr_"+i+"_td_"+j+"'  colspan='1' rowspan='1' categery='cells_td' onclick='choseTd(this);' chose='N' ><div id='paddding_div' style='margin:5px'>" 
					+"<div><input style='width: 120px;' tempType='name_input' hidden /></div>" 
					+"<div tempType='attr_input_div' ><input style='width: 80px;color: #999999;' tempType='attr_input' hidden /></div style='display:none;'>" 
					+"<div tempType='name_div' style='display:none;'></div><div style='display:none;color: #999999;' tempType='attr_div'></div>" 
					+"<div style='color: green;' tempType='nick_div'></div>" 
					+"<div style='color: green;' tempType='nick_input_div'><input style='width: 80px;color: green;' tempType='nick_input' hidden /></div>" 
					+"</div></td>";
			}
		strs+="</tr>";
	}
	$("#cells_table_body").append(strs);
	reloadCellsMenu();
	moveMergeCell();
}

function cleanSql(){
	$("#sheetSql_input").val("");
	$("#dataSql_input").val("");
	$("#sheet_table").val("");
	$("#sheet_table_id").val("");
	$("#sheet_table_name").val("");
	$("input[name='sheet_rowRadio']").attr("checked",''); 
	$("input[name='data_rowRadio']").attr("checked",''); 
	reloadCells();
	sheet_sql_temp = SHEET_SQL_TEMPLATE;
	data_sql_temp = DATA_SQL_TEMPLATE;
	sheetTableCode = "";
	tableCode = "";
	joinTables = [];
	sheetjoinTables = [];
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
		$("#sheet_base_div").attr("class","span6");
		$("#sheet_baseTables_div").hide();
		$("#data_baseTables_div").show();
		$("#sheet_column_div").hide();
	}else if(sheetCat=="categery"){
		$("#sheetName_title").hide();
		$("#sheetName_content").hide();
		$("#sheetName_content").val("");
		$("#sheet_base_div").attr("class","span5");
		$("#sheet_baseTables_div").show();
		$("#data_baseTables_div").hide();
		$("#sheet_column_div").show();
	}
}

//在分类模式跳转data编辑
function editData(){
	$("#sheet_base_div").attr("class","span6");
	$("#sheet_baseTables_div").hide();
	$("#data_baseTables_div").show();
	$("#sheet_column_div").hide();
}
//在分类模式跳转data编辑
function editSheet(){
	$("#sheet_base_div").attr("class","span5");
	$("#sheet_baseTables_div").show();
	$("#data_baseTables_div").hide();
	$("#sheet_column_div").show();
}
//清除sheetsql
function deleteSheetSql(){
	$("#sheetSql_input").empty();	
	$("#sheetColumnsRowBody").empty();	
	sheetTableCode="";
	sheetColumnArray=[];
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

//sheet主表分页
function loadSheetPages(){
	var url = _basePath + "/poiAutoExport/getPages";
	sheet_page.table_name=$("#sheetTable_name_input").val();
	sheet_page.table_code=$("#sheetTable_code_input").val();
	$.post(url, sheet_page, function(res, status) {
		$("#sheetRowBody").empty();
		renderPage("sheetPageUL",sheet_page,res.total,loadSheetPages);
		var data = res.data;
		if(data != null && data.length > 0){
			 var num =0;
			 var strs = "";
			 $.each(data,function(i,item){
				 strs += "<tr onclick='sheetPagesClick(" + num + ");'>"
					 + "<td style='text-align: center;'><input class='checkboxes' name='sheet_rowRadio' type='radio' value='sheetTable_" + num + "' /></td>"
					 + "<td style='vertical-align: middle;' >" + item.code + "</td><td style='vertical-align: middle;'>" + formatNull(item.name) + "</td>"
					 + "<td style='text-align: center;'>" + formatNull(item.create_time) + "</td>"
					 + "<td style='text-align: center;'>"
					 + 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"reloadSheetColumns('"+ item.code +"');\"><i class='icon-plus'></i></button></td></tr>";
				 num++;
			 });
				 $("#sheetRowBody").append(strs);
		 }
	});
}
function sheetPagesClick(num){
	$("input[name='sheet_rowRadio'][value='sheetTable_" + num + "']").attr("checked",'checked'); 
}

//data主表分页
function loadDataPages(){
	var url = _basePath + "/poiAutoExport/getPages";
	page.table_name=$("#dataTable_name_input").val();
	page.table_code=$("#dataTable_code_input").val();
	$.post(url, page, function(res, status) {
		$("#dataRowBody").empty();
		renderPage("dataPageUL",page,res.total,loadDataPages);
		var data = res.data;
		if(data != null && data.length > 0){
			 var num =0;
			 var strs = "";
			 $.each(data,function(i,item){
				 strs += "<tr onclick='dataPagesClick(" + num + ");'>"
					 + "<td style='text-align: center;'><input class='checkboxes' name='data_rowRadio' type='radio' value='t5_" + num + "' /></td>"
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
	$("input[name='data_rowRadio'][value='t5_" + num + "']").attr("checked",'checked'); ;
}

function reloadSheetColumns(code){
	sheetTableCode = code;
	loadSheetTable();
}

var tableCode="";//主表编码
//根据选择主表和sheet类型确定加载方法
function reloadColumns(code){
	$("#cells_table_div").show();
	tableCode=code;
	$("#dataSql_input").empty();
}

//加载sheetTable供选择sheet字段
function loadSheetTable(){
	$("#sheetSql_input").empty();
	$("#dataSql_input").empty();
	sheetjoinTables=[];
	joinTables = [];
	var url =_basePath + "/poiAutoExport/getSheetTable?table_name="+sheetTableCode;
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
var sheetjoinTables=[];
function loadSheetColumns(){
	data_sql_temp=DATA_SQL_TEMPLATE;
	var url =_basePath + "/poiAutoExport/getSheetColumns?table_name="+$("#sheet_table").val();
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
		sheet_sql_temp=sheet_sql_temp.replace("#tableName", sheetTableCode+" t ");
	});
}
//选择id
function selectSheetId(){
	sheet_sql_temp=sheet_sql_temp.replace("#id", $("#sheet_table option:selected").attr("re_table_name")+"."+$("#sheet_table_id").val());
	add_joinTable();
	$("#sheetSql_input").empty();
	$("#sheetSql_input").append(sheet_sql_temp);
}
//选择name
function selectSheetName(){
	sheet_sql_temp=sheet_sql_temp.replace("#name", $("#sheet_table option:selected").attr("re_table_name")+"."+$("#sheet_table_name").val());
	add_joinTable();
	$("#sheetSql_input").empty();
	$("#sheetSql_input").append(sheet_sql_temp);
}
//根据字段选择添加附表
function add_joinTable(){
	if ($("#sheet_table").val() !=sheetTableCode) {
		var flag =true;
		var sheet_table={
				name:$("#sheet_table").val()+"",
				re_name:$("#sheet_table option:selected").attr("re_table_name")+"",
				re_column:$("#sheet_table option:selected").attr("re_column")+"",
				column_name:$("#sheet_table option:selected").attr("column_name")+""
		};
		if (sheetjoinTables.length > 0) {
			$.each(sheetjoinTables,function(i,item){
				if (item.name == sheet_table.name) {
					flag = false;
					return ;
				}
			});
		}
		if(flag)
			sheetjoinTables.push(sheet_table);
	}
	if (sheetjoinTables.length > 0 && $("#sheet_table").val()+"" != sheetTableCode) {
		joinTableStr="";
		$.each(sheetjoinTables,function(i,item){
			joinTableStr+=" left join "+item.name+" "+item.re_name+" on "+item.re_name+"."+item.re_column+" = t."+item.column_name+" ";
		});
		sheet_sql_temp=sheet_sql_temp.replace("#joinTable", joinTableStr);
	}else{
		sheet_sql_temp=sheet_sql_temp.replace("#joinTable", "");
	}
}

//--------------------------------------编辑cell表头------------------------------
var select_cell_v3="";
var select_row_v3="";
var location_cell_v3="";
var location_row_v3="";
var tr_num_v3="";
var td_num_v3="";
var property_list_v3=[];

var chose_state = true;
//选择单元格
//function choseTd(e){
//	if (chose_state) {
//		if ($(e).attr("chose") =="N") {
//			
//		}
//		$(e).css("background","#0094ff");
//		$(e).attr("chose","Y");
//	}
//}

//页面内容刷新后绑定方法
function reloadCellsMenu(){
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
	row_num--;
}

//删除最后一列
function delete_col_v3(){
	var Maxtr=$("#cells_table tbody tr").length;
	for ( var i = 0; i < Maxtr; i++) {
		var Maxtd=$("#cells_table tbody tr:eq("+i+") td").length;
		$("#cells_table tbody tr:eq("+i+") td:eq("+(Maxtd-1)+")").remove();
	}
	col_num--;
}


//编辑名称
function editCellName_v3(){
	var celltableTemp=$("#cells_table");
	celltableTemp.find("input[tempType='name_input']").show();
	celltableTemp.find("input[tempType='attr_input']").show();
	celltableTemp.find("input[tempType='nick_input']").show();
	celltableTemp.find("div[tempType='name_div']").hide();
	celltableTemp.find("div[tempType='attr_div']").hide();
	celltableTemp.find("div[tempType='nick_div']").hide();
}


//保存名称编辑
function saveCellName_v3(){
	var celltableTemp=$("#cells_table");
	celltableTemp.find("input[tempType='name_input']").hide();
	celltableTemp.find("input[tempType='attr_input']").hide();
	celltableTemp.find("input[tempType='nick_input']").hide();
	celltableTemp.find("div[tempType='name_div']").show();
	celltableTemp.find("div[tempType='attr_div']").show();
	celltableTemp.find("div[tempType='nick_div']").show();
}

//添加整行
function addCellTableRow_v3(){
	var strs=$("#cells_table_body").html()+" <tr>";
	for ( var j = 0; j <col_num ; j++) {
		strs+="<td categery='cells_td' style='text-align:center;  width:180px;height:23px' location='tr_"+row_num+"_td_"+j+"'  colspan='1' rowspan='1' ><div id='paddding_div' style='margin:5px'><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div ><input style='width: 80px;' tempType='attr_input' hidden /></div><div tempType='name_div' ></div><div style='color: #999999;' tempType='attr_div'><div style='color: green;' tempType='nick_div'></div><div style='color: green;' tempType='nick_div'></div></div></td>";
	}
	strs+="</tr>";
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	moveMergeCell();
	row_num++;
	reloadCellsMenu();
}

//添加整列
function addCellTableCol_v3(){
	var strs="";
	for ( var i = 0; i < row_num; i++) {
		var trStr="<tr>"+$("#cells_table_body tr:eq("+i+")").html()+"";
		trStr+="<td categery='cells_td' style='text-align:center;  width:180px;height:23px' location='tr_"+i+"_td_"+col_num+"'  colspan='1' rowspan='1' ><div id='paddding_div' style='margin:5px'><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div><input style='width: 80px;' tempType='attr_input' hidden /></div><div tempType='name_div' ></div><div tempType='attr_div' style='color: #999999;'></div><div style='color: green;' tempType='nick_div'></div></div></td>";
		trStr+="</tr>";
		strs+=trStr;
	}
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	moveMergeCell();
	col_num++;
	reloadCellsMenu();
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
							var nick_name=property.column_name;
							td.find("div[tempType='attr_div']").empty();
							td.find("div[tempType='attr_div']").append(name);
							td.find("input[tempType='attr_input']").val(name);
							td.find("div[tempType='nick_div']").empty();
							td.find("div[tempType='nick_div']").append(nick_name);
							td.find("input[tempType='nick_input']").val(nick_name);
//							td.find("input").hide();
							if (jsonTable.re_table+"" != tableCode) {
								var joinTable ={
										name:jsonTable.re_table+"",
										re_name:jsonTable.re_table_name+"",
										re_column:jsonTable.re_column+"",
										column_name:jsonTable.column_name+""
								};
								if (joinTables.length>0) {
									var addFlag = true;
									$.each(joinTables,function(t,table){
										if (table.name == jsonTable.re_table+"") {
											addFlag = false;
										}
									});
									if (addFlag) 
										joinTables.push(joinTable);
								}else
									joinTables.push(joinTable);
							}
							//生成dataSql
							//var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id #where #filter ";
							data_sql_temp=DATA_SQL_TEMPLATE;
							if (sheetCat =="all") {
								data_sql_temp=data_sql_temp.replace("#sheet=#id","");
							}
							data_sql_temp=data_sql_temp.replace("#baseTable", tableCode+" t");
							var join_str ="";
							$.each(joinTables,function(t,table){
								if (table.name != tableCode) 
									join_str +=" left join "+table.name+" "+table.re_name+" on t."+table.column_name+" = "+table.re_name+"."+table.re_column;
								if (sheetCat =="categery" && table.name == sheetTableCode) 
									data_sql_temp=data_sql_temp.replace("#sheet", table.re_name+"."+$("#sheet_table_id").val());
								else if (sheetCat != "all") 
									data_sql_temp=data_sql_temp.replace("#sheet","t."+$("#sheet_table_id").val());
							});
							data_sql_temp=data_sql_temp.replace("#joinTable",join_str);
							data_sql_columns.push(name + " "+property.column_name+" ");
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
			var td=$("#cells_table tbody tr:eq("+i+") td:eq("+j+")");
			var  location=td.attr("location")+"";
			var	 cellName=td.find("div[tempType='name_div']").text()+"";
			var	 property=td.find("div[tempType='nick_div']").text()+"";
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
			top.reloadRecordTab("poi报表");
			top.closeCurrentTab();
//			editPartAndCell(res.data.id);
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
	alert(id);
}

//---------------------------------------part编辑--------------------------------
function loadEditPart(){
	page.page = 1;
	loadEditData();
	moveMergeCell();
}

//编辑加载数据方法
function loadEditData(){
		$("#sheet_baseTables_div").empty();
		$("#sheet_baseTables_div").hide();
		$("#data_baseTables_div").empty();
		$("#data_baseTables_div").hide();
		$("#sheet_column_div").empty();
		$("#sheet_column_div").hide();
		$("#create_button_div").hide();
		$("#edit_button_div").show();
		$("#sheetCat_select").prop("disabled",true).trigger('liszt:updated');
		$("#sheetCat_select").show();
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
								strs+="<td style='text-align:center; width:180px;height:23px' location='tr_"+num_row+"_td_"+j+"'  " 
								+"colspan='"+((item.endcolumn - item.startcolumn)+1)+"' rowspan='"+(1+(item.endrow-item.startrow))+"' categery='cells_td' ><div id='paddding_div' style='margin:5px'><div><input style='width: 120px;' value='"+item.cellname+"' tempType='name_input' hidden /></div>" 
								+"<div tempType='name_div' >"+formatNull(item.cellname)+"</div><div  tempType='nick_div' style='color: green;'>"+formatNull(item.property)+"</div></td></div>";
								
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
								strs+="<td style='text-align:center; width:180px;height:23px' location='tr_"+num_row+"_td_"+j+"'  " 
								+"colspan='1' rowspan='1' categery='cells_td' ><div id='paddding_div' style='margin:5px'><div><input style='width: 120px;' value='"+item.cellname+"' tempType='name_input' hidden /></div>" 
								+"<div tempType='name_div' >"+formatNull(item.cellname)+"</div><div  tempType='nick_div' style='color: green;'>"+formatNull(item.property)+"</div></td></div>";
								
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
			reloadCellsMenu();
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



