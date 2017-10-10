var page = { page: 1,limit: 9 };
var sheetTableCode ="";
var SHEET_SQL_TEMPLATE=" select #id id,#name name from #tableName #joinTable #where";
$(function(){
	reload();
	
	$("#sheetTable_name_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
	$("#sheetTable_code_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
	$("#select_sheet_table").click(function(){
		reload();
	});
	
});

function reload(){
	page.page =1;
	loadSheetPages();
}

//sheet主表分页
function loadSheetPages(){
	var url = _basePath + "/poiAutoExport/getPages";
	page.table_name=$("#sheetTable_name_input").val();
	page.table_code=$("#sheetTable_code_input").val();
	$.post(url, page, function(res, status) {
		$("#sheetRowBody").empty();
		renderPage("sheetPageUL",page,res.total,loadSheetPages);
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

function reloadSheetColumns(code){
	sheetTableCode = code;
	loadSheetTable();
}

//加载sheetTable供选择sheet字段
function loadSheetTable(){
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
}

//选择name
function selectSheetName(){
	sheet_sql_temp=sheet_sql_temp.replace("#name", $("#sheet_table option:selected").attr("re_table_name")+"."+$("#sheet_table_name").val());
	add_joinTable();
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

//保存
function save(){
	var res=validate();
	var index = parent.layer.getFrameIndex(window.name);
	if(res.flag){
		parent.saveSheetTables(sheet_sql_temp);
		parent.layer.close(index);
	}else{
		layer.alert(res.msg);
	}
}

//保存前校验页面数据
function validate(){
	var res={flag:true,msg:""};
	if ($("#sheet_table").val() == null || $("#sheet_table").val()+"" == "") {
		res.flag =false;
		res.msg ="请先选择sheet表格！";
		return res;
	}
	
	if ($("#sheet_table_id").val() == null || $("#sheet_table_id").val()+"" == "") {
		res.flag =false;
		res.msg ="请先选择sheetSql的ID字段！";
		return res;
	}
	
	if ($("#sheet_table_name").val() == null || $("#sheet_table_name").val()+"" == "") {
		res.flag =false;
		res.msg ="请先选择sheetSql的name字段！";
		return res;
	}
	return res;
}