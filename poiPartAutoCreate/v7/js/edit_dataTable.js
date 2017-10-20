var page = { page: 1,limit: 9 };
var DATA_SQL_TEMPLATE=" select #columns " +
		" \n from #baseTable" +
		"  #joinTable " +
		" \n where #sheet=#id  #where #filter ";
var table_name ="";
var joinTables =[];
var joinTableColumn =0;
$(function(){
	reload();
	
	$("#dataTable_name_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
	$("#dataTable_code_input").keydown(function(event){
		if (event.keyCode == 13) {
			reload();
		}
	});
	$("#select_data_table").click(function(){
		reload();
	});
	
});

function reload(){
	page.page =1;
	loadDataPages();
}

//sheet主表分页
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
					 + "<td style='text-align: center;'>"
					 + 	"<button  class='btn btn-primary' onclick=\"choseJoinTable('"+ item.code +"');\"><i class='icon-plus'></i>从</button>  "
					 +"<button  class='btn btn-primary' onclick=\"choseBaseTable('"+ item.code +"');\"><i class='icon-pencil'></i>主</button></td></tr>";
				 num++;
			 });
				 $("#dataRowBody").append(strs);
		 }
	});
}
function dataPagesClick(num){
	$("input[name='data_rowRadio'][value='t5_" + num + "']").attr("checked",'checked'); ;
}

function choseBaseTable(code){
	var url = _basePath + "/poiAutoExport/choseBaseTable";
	page.baseTable=code;
	table_name =code;
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
	if (table_name == "") {
		layer.alert("请先选定当前主表！");
		return;
	}
	if (code == table_name) {
		layer.alert("添加失败，所选表格为主表！");
		return;
	}
	if (joinTableColumn == 0) {
		$("#joinTable_div").empty();
	}
	var flag=true;
	$("input[name='joinTable_name']").each(function(){
		if ($(this).val() == code) {
			layer.alert("附表已存在，请勿重复添加！");
			flag =false;
		}
	});
	if(flag){
		var strs ="";
		joinTableColumn++;
		strs +=" <div class='input-wrap' name='join_table_columns'><div style='display: inline;margin-left: 20px;'><span>表名:</span><input name='joinTable_name' value='"+code+"' style='width: 110px;' readonly='readonly' ></div>"
		+" <div style='display: inline;'><span>别名:</span><input name='joinTable_reName' value='t"+ joinTableColumn +"' style='width: 80px;'></div>";
		$.each(joinTables,function(i,item){
			if (item.table_name == code) {
				strs+=" <div style='display: inline;' ><span>连接条件:</span><input name='joinTable_link' value='t."+item.column_name+"=t"+joinTableColumn+"."+item.re_column+"' style='width: 110px;'></div></div>";
				flag = false;
			}
		});
		if(flag)
			strs+=" <div style='display: inline;' ><span>连接条件:</span><input value='' style='width: 110px;' name='joinTable_link'></div></div>";
		$("#joinTable_div").append(strs);
	}
}

function save(){
	var flag=false;
	$("input[name='joinTable_link']").each(function(){
		if ($(this).val()==null || $(this).val() == undefined || $(this).val() == "") {
			flag=true;
		}
	});
	if (flag) {
		layer.alert("您还有表格关系未进行处理，请手动处理！");
		return;
	}
	if($("#baseTable_name").val()==""){
		layer.alert("清先选择主表！");
		return;
	}
	var index = parent.layer.getFrameIndex(window.name);
	var url=_basePath + "/poiAutoExport/getDataColumns";
	var joinTables_str="";
	var joinTables_reName="";
	$("input[name='joinTable_name']").each(function(){
		joinTables_str+=$(this).val()+",";
	});
	$("input[name='joinTable_reName']").each(function(){
		joinTables_reName+=$(this).val()+",";
	});
	var req ={
			baseTable:table_name+"",
			joinTables:joinTables_str,
			joinReName:joinTables_reName,
			baseReName:$("#baseTable_reName").val()+""
	};
	$.post(url,req,function(res,status){
		var joinTable_array=createSql();
		parent.saveDataTables(DATA_SQL_TEMPLATE,res);
		parent.layer.close(index);
	});
}


function createSql(){
	var joinTable_array =[];
	var base_table ={
			table_name:$("#baseTable_name").val(),
			re_name:$("#baseTable_reName").val()
		};
		DATA_SQL_TEMPLATE=DATA_SQL_TEMPLATE.replace("#baseTable",base_table.table_name+" "+base_table.re_name+" #noLinkJoinTable" );
		var jointable_str="";
		var noLinkJoinTable_str="";
		var noLinkFlag =true;
		$("div[name='join_table_columns']").each(function(){
			$(this).find("input[name='joinTable_link']").each(function(){
				if ($(this).val()==undefined || $(this).val() == null || $(this).val()=="") {
					noLinkFlag =false;
					return;
				}
			});
		});
		
		$("div[name='join_table_columns']").each(function(){
			var joinTable={};
			$(this).find("input[name='joinTable_name']").each(function(){
				joinTable.table_name=$(this).val();
			});
			$(this).find("input[name='joinTable_reName']").each(function(){
				joinTable.re_table=$(this).val();
			});
			$(this).find("input[name='joinTable_link']").each(function(){
				joinTable.link=$(this).val();
			});
			if (joinTable.link && joinTable.link != undefined && joinTable.link != "") 
				jointable_str += " \n left join "+joinTable.table_name+" "+joinTable.re_table+" on "+joinTable.link+" ";
			else
				jointable_str += " \n left join "+joinTable.table_name+" "+joinTable.re_table+" on #criteria ";
			joinTable_array.push(joinTable);
		});
		DATA_SQL_TEMPLATE = DATA_SQL_TEMPLATE.replace("#noLinkJoinTable", noLinkJoinTable_str);
		DATA_SQL_TEMPLATE = DATA_SQL_TEMPLATE.replace("#joinTable",jointable_str);
		return joinTable_array;
}

