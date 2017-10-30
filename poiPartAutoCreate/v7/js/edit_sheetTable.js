var page = { page: 1,limit: 9 };
var sheetTableCode ="";
var SHEET_SQL_TEMPLATE=" select #id id,#name name \n from #tableName #joinTable ";
var sql =SHEET_SQL_TEMPLATE;
var joinTables =[];
var joinTableColumn =0;
var columns=[{name:"id",code:"",table:""},{name:"name",code:"",table:""}];
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
				 + "<td style='text-align: center;'>"
				 + 	"<button  class='btn btn-primary' onclick=\"choseJoinTable('"+ item.code +"');\"><i class='icon-plus'></i>从</button>  "
				 +"<button  class='btn btn-primary' onclick=\"choseBaseTable('"+ item.code +"');\"><i class='icon-pencil'></i>主</button></td></tr>";
				 num++;
			 });
				 $("#sheetRowBody").append(strs);
		 }
	});
}
function sheetPagesClick(num){
	$("input[name='sheet_rowRadio'][value='sheetTable_" + num + "']").attr("checked",'checked'); 
}

function choseBaseTable(code){
	var url = _basePath + "/poiAutoExport/choseBaseTable";
	page.baseTable=code;
	sheetTableCode =code;
	joinTables = [];
	joinTableColumn = 0;
	$("#joinTable_div").empty();
	$("#baseTable_name").val(code);
	$("#baseTable_reName").val("t");
	$.post(url, page, function(data, status) {
		if (data !=null && data.length>0) {
			$.each(data,function(i,item){
				var table ={table_name:item.re_table,
						column_name:item.column_name,
						re_column:item.re_column};
				joinTables.push(table);
			});
		}
	});
}

function choseJoinTable(code){
	joinTableColumn = $("div[name='join_table_columns']").length;
	if (joinTableColumn == 0) {
		$("#joinTable_div").empty();
	}
	var flag=true;
	var strs ="";
	joinTableColumn++;
	strs +=" <div class='input-wrap' name='join_table_columns'><div style='display: inline;margin-left: 20px;'><span>表名:</span><input name='joinTable_name' value='"+formatNull(code)+"' style='width: 110px;'  ></div>"
	+" <div style='display: inline;margin-left:3px;'><span>别名:</span><input name='joinTable_reName' value='t"+ joinTableColumn +"' style='width: 80px;'></div>";
	$.each(joinTables,function(i,item){
		if (item.table_name == code) {
			strs+=" <div style='display: inline;' ><span>连接条件:</span><input name='joinTable_link' value='t."+formatNull(item.column_name)+"=t"+joinTableColumn+"."+formatNull(item.re_column)+"' style='width: 110px;'></div>";
			flag = false;
		}
	});
	if(flag)
		strs+=" <div style='display: inline;' ><span>连接条件:</span><input value='' style='width: 110px;' name='joinTable_link'></div>";
	strs+="<div style='display: inline-block;margin-left:6px;' ><button  type='button' onclick='rmvLink(this);'><i class='icon-minus'></i></button></div></div>";
	$("#joinTable_div").append(strs);
}

//保存表格映射关系
function saveTable(){
	var flag =false;
	$("input[name='joinTable_link']").each(function(){
		if ($(this).val()==null || $(this).val() == undefined || $(this).val() == "") {
			flag=true;
		}
	});
	if (flag) {
		layer.alert("您还有表格关系未进行处理，请手动处理！");
		return;
	}
	sql =SHEET_SQL_TEMPLATE;
	joinTables=[];
	var table ={
		name:$("#baseTable_name").val(),
		re_name:$("#baseTable_reName").val()
	};
	joinTables.push(table);
	sql = sql.replace("#tableName", " "+table.name+" "+table.re_name+" ");
	var linkStrs ="";
	$("div[name='join_table_columns']").each(function(i){
		 table={
			name:$(this).find("input[name='joinTable_name']").val(),
			re_name:$(this).find("input[name='joinTable_reName']").val(),
			link:$(this).find("input[name='joinTable_link']").val()
		};
		joinTables.push(table);
		if (table.link && table.link != undefined && table.link != "") {
			linkStrs+= " \n left join "+table.name+" "+table.re_name +" on "+table.link+" ";
		}else{
			linkStrs+=" \n left join "+table.name+" "+table.re_name +" on #criteria ";
		}
	});
	sql = sql.replace("#joinTable",linkStrs);
	if (joinTables.length && joinTables.length >0) {
		var strs="<option value=''> 请选择表格...<option>";
		$.each(joinTables,function(i,item){
			strs+="<option  value='"+formatNull(item.name)+"' >"+formatNull(item.name)+"</option>";
		});
		
		$("#id_table").empty();
		$("#id_table").append(strs);
		$("#id_table").trigger("liszt:updated");
		$("#name_table").empty();
		$("#name_table").append(strs);
		$("#name_table").trigger("liszt:updated");
	}
}


//根据选择sheettable查询该表字段
var sheetTableCode="";
function loadSheetColumns(e){
	var tableName = $("#id_table").val() || $("#name_table").val();
	var url =_basePath + "/poiAutoExport/getSheetColumns?table_name="+tableName;
	$.post(url, function(data, status) {
		var strs="<option value=''> 请选择字段...<option>";
		if (data && data.length>0) {
			$.each(data,function(i,item){
				strs+="<option value='"+formatNull(item.name)+"' >"+formatNull(item.name)+"</option>";
			});
		}
		if ($(e).attr("id") == "id_table") {
			$("#sheet_table_id").empty();
			$("#sheet_table_id").append(strs);
			$("#sheet_table_id").trigger("liszt:updated");
		}else{
			$("#sheet_table_name").empty();
			$("#sheet_table_name").append(strs);
			$("#sheet_table_name").trigger("liszt:updated");
		}
	});
}

//选择id
function selectSheetId(){
	$.each(joinTables,function(i,item){
		if (item.name == $("#id_table").val()) 
			sql=sql.replace("#id", item.re_name+"."+$("#sheet_table_id").val());
	});
}

//选择name
function selectSheetName(){
	$.each(joinTables,function(i,item){
		if (item.name == $("#name_table").val()) 
			sql=sql.replace("#name", item.re_name+"."+$("#sheet_table_name").val());
	});
}


//保存
function save(){
	var res=validate();
	var index = parent.layer.getFrameIndex(window.name);
	if(res.flag){
		var tables_str=$("#baseTable_name").val()+"#"+$("#baseTable_reName").val()+",";
		$("div[name='join_table_columns']").each(function(){
			tables_str+=$(this).find("input[name='joinTable_name']").val()+"#"+$(this).find("input[name='joinTable_reName']").val()+"#"+$(this).find("input[name='joinTable_link']").val()+",";
		});
		parent.saveSheetTables(sql,tables_str);
		parent.layer.close(index);
	}else{
		layer.alert(res.msg);
	}
}

//保存前校验页面数据
function validate(){
	var res={flag:true,msg:""};
	
	if ($("#baseTable_name").val() == null || $("#sheet_table").val()+"" == "") {
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

//删除指定附属关系表
function rmvLink(e){
	layer.confirm('是否删除该附属表格?',{
		btn:["删除","取消"]
	},function(){
		$(e).parent().parent().remove();
		layer.closeAll('dialog');
	});
	joinTableColumn--;
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