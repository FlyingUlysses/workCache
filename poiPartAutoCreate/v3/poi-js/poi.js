var page = { page: 1,limit: 11 };
var SHEET_SQL_TEMPLATE=" select #id id,#name name from #tableName #where";//sheet语句模板
var DATA_SQL_TEMPLATE=" select #columns from #baseTable #joinTable where #sheet=#id #where #filter ";//data语句模板
$(function() {
		reload();
});

function reload(){
	page.page = 1;
	loadDataPages();
	

}

//--------------------------------------------------sheetSql生成------------------------------------------------------------------------
var sheetCat="";//sheet分类
//根据选择sheet类型确定页面展示内容
function selectSheet(){
	sheetCat=$("#sheetCat_select").val()+"";
	$("#sheetSql_input").empty();	
	$("#sheetColumnsRowBody").empty();	
	$("#tables_columns_content").empty();	
	$("#tables_columns_title").empty();	
	sheetTableCode="";
	sheetColumnArray=[];
	if (sheetCat=="all") {
		$("#sheetName_title").show();
		$("#sheetName_content").show();
		$("#sheetCat_div").hide();
	}else if(sheetCat=="categery"){
		$("#sheetName_title").hide();
		$("#sheetName_content").hide();
		$("#sheetName_content").val("");
		$("#sheetCat_div").show("");
	}
}

//固定sheet模式sheet语句生成
function getAllSheet(){
    if ($("#sheetName_content").val()+""=="") {
		return;
	}
    var sheet_sql_tmep=SHEET_SQL_TEMPLATE;
    sheet_sql_tmep=sheet_sql_tmep.replace("#id", "0");
    sheet_sql_tmep=sheet_sql_tmep.replace("#name",$("#sheetName_content").val());
    sheet_sql_tmep=sheet_sql_tmep.replace("from #tableName", "");
    $("#sheetSql_input").empty();
    $("#sheetSql_input").append(sheet_sql_tmep);
    DATA_SQL_TEMPLATE=DATA_SQL_TEMPLATE.replace("#sheet=#id","");
    dataJoinTableArray.push(sheetTableCode);
}

//data主表分页
function loadDataPages(){
	var url = _basePath + "/poiAutoExport/getPages";
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



//在分类模式跳转data编辑
function toData_div(){
	sheetSelectType="data";
	$("#sheetName_content").val("");
	$("#sheetName_title").hide();
	$("#sheetName_content").hide();
	$("#data_baseTables_div").show();
	$("#sheet_columns").hide();
	$("#data_columns").show();
	reloadColumns(tableCode);
}
//在分类模式跳转data编辑
function toSheet_div(){
	sheetSelectType="sheet";
	$("#sheetName_content").val("");
	$("#sheetName_title").hide();
	$("#sheetName_content").hide();
	$("#data_baseTables_div").show();
	$("#sheet_columns").show();
	$("#data_columns").hide();
	reloadColumns(tableCode);
}
//清除sheetsql
function deleteSheetSql(){
	$("#sheetSql_input").empty();	
	$("#sheetColumnsRowBody").empty();	
	sheetTableCode="";
	sheetColumnArray=[];
}

//----------------------------------------------------dataSql与template生成-----------------------------------------------------
var tableCode="";//data主表编码
var sheetSelectType="sheet";//在sheet分类模式下sheet选择状态   data为选择data状态，sheet为选择sheet状态
//点击data主表调用方法，根据sheet类型和sheet状态确定columnsDiv的展示
function reloadColumns(code){
	tableCode=code;
	$("#temp_title").empty();
	$("#dataSql_input").empty();
	var strs="";
	var url="";
	if (sheetSelectType=="sheet" && sheetCat =="categery") {
		strs+="<h4><i class='icon-align-left' >sheet字段</i></h4>";
		 url = _basePath + "/poiAutoExport/getSheetColumns?table_name="+code;
		$("data_columns").hide();
		$("sheet_columns").show();
	}else{
		strs+="<h4><i class='icon-align-left' >模板样式</i></h4>";
		 url = _basePath + "/poiAutoExport/getColumns?table_name="+code;
		$("data_columns").show();
		$("sheet_columns").hide();
	}
	if (code) {
		loadColumns(url,code);
	}
	$("#temp_title").append(strs);
	$("#temp_div").show();
}


//根据选择data主表加载主表和有外键关联的从表所有字段供选择
function loadColumns(url,code){
	$.post(url,  function(map, status) {
		reloadTablesColumns(map);
	});
}

//抽出字段生成方法，供增删使用
var mapArray;
function reloadTablesColumns(map,column_name,cell){
	$("#tables_columns_title").empty();
	$("#tables_columns_content").empty();
	 var titleStr = "<ul class='nav nav-tabs' style='height: 38px;'>";
	 var contentStr="";
	 var num=1;
	 $.each(map,function(i,data){
		 if (num==1) {
			 titleStr+="<li class='active'><a href='#widget_tab"+num+"' data-toggle='tab'>"+i+"</a></li>";
			 contentStr+="<div class='tab-pane active' id='widget_tab"+num+"'>";
		 }else{
			 titleStr+="<li><a href='#widget_tab"+num+"' data-toggle='tab'>"+i+"</a></li>";
			 contentStr+="<div class='tab-pane' id='widget_tab"+num+"'>";
		 }
		 		
		 contentStr+= "<table class='table table-striped table-bordered table-hover'><thead> <tr>"
                    + "     <th style='width: 17%' >表格名称</th> "
                    + "     <th style='width: 17%'>字段名称</th> "
                    + "     <th >字段备注</th> "
                    + "     <th style='width: 80px; text-align: center;'>操作</th> "
                    +  "</tr></thead> <tbody>";
		 $.each(data,function(j,item){
			 if(data != null && data.length > 0){
				if (column_name && item.column_name == column_name) {
					data[j]="";
				}else if(item==""){
					if (cell){
						item=data[j]=cell;
						 contentStr += "<tr>"
							 + "<td style='vertical-align: middle;' >" + item.table_name + "</td><td style='vertical-align: middle;'>" + formatNull(item.column_name) + "</td>"
							 + "<td >" + formatNull(item.remarks) + "<input hidden value='" + formatNull(item.re_column) + "'/><input hidden value='" + formatNull(item.native_column) + "'/></td>"
							 + "<td style='text-align: center;'>"
							 + "<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"reloadTenp_div('"+ item.table_name +"','"+ item.column_name +"','"+ item.remarks +"','"+ item.re_column +"','"+ item.native_column +"','"+item.re_table_name+"');\"><i class='icon-plus'></i></button></td></tr>";
						 cell=null;
					}
				}else{
					 contentStr += "<tr>"
					 + "<td style='vertical-align: middle;' >" + item.table_name + "</td><td style='vertical-align: middle;'>" + formatNull(item.column_name) + "</td>"
					 + "<td >" + formatNull(item.remarks) + "<input hidden value='" + formatNull(item.re_column) + "'/><input hidden value='" + formatNull(item.native_column) + "'/></td>"
					 + "<td style='text-align: center;'>"
					 + "<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"reloadTenp_div('"+ item.table_name +"','"+ item.column_name +"','"+ item.remarks +"','"+ item.re_column +"','"+ item.native_column +"','"+item.re_table_name+"');\"><i class='icon-plus'></i></button></td></tr>";
				}
			 }
		 });
		 mapArray=map;
		 contentStr+="</tbody></table></div>";
		 num++;
	 });
	 titleStr+="</ul>";
	 $("#tables_columns_title").append(titleStr);
	 $("#tables_columns_content").append(contentStr);
}


//根据sheet类型和sheet进行状态判断Temp_div的展示
function reloadTenp_div(table_name,column_name,remarks,re_column,native_column,re_table_name){
	if (sheetCat=="categery" && sheetSelectType=="sheet") {
		reloadSheetColumns(table_name,column_name,re_column,native_column,re_table_name);
	}else{
		reloadCells(table_name,column_name,remarks,re_column,native_column,re_table_name);
	}
}

var sheetTableCode="";
var sheetColumnArray=[];
//加载sheetsql的字段表
function reloadSheetColumns(table_name,column_name,re_column,native_column,re_table_name){
	if (sheetColumnArray.length==2) {
		alert("sheetSQL字段只允许id、name两种，请检查您的选择！");
		return reloadSheetColumns;
	}
	sheetTableCode=table_name;
	var reCode="id";
	var strs = "333333333";
	if (tableCode && tableCode != sheetTableCode) {
		for ( var i = 0; i < 2; i++) {
			if (i==1) 
				reCode="name";
			strs += "<tr>"
				+ "<td style='vertical-align: middle;' > <input type='text' id='s_table_"+i+"' style='width: 90%;' disabled='disabled'  value='"+ table_name +"'/></td>" 
				+ "<td style='vertical-align: middle;' > <input type='text' id='s_code_"+i+"' style='width: 90%;'  value='t."+reCode +"'/></td>" 
				+ "<td style='vertical-align: middle;' > <input type='text' id='s_reCode_"+i+"' style='width: 90%;' disabled='disabled' value='"+ reCode +"'/></td>" 
				+ "<td style='text-align: center;'></td></tr>";
			sheetColumnArray.push(reCode);
			getCatSheet(i,"t."+reCode,re_column,re_table_name,native_column);
		}
	}else{
		var sheetColumnNum=sheetColumnArray.length;
		column_name="t."+column_name;
		if (sheetColumnNum==0) {
			 reCode="id";
		}else {
			 reCode="name";
		}
		 strs += "<tr>"
			 + "<td style='vertical-align: middle;' > <input type='text' id='s_table_"+sheetColumnNum+"' style='width: 90%;' disabled='disabled'  value='"+ table_name +"'/></td>" 
			 + "<td style='vertical-align: middle;' > <input type='text' id='s_code_"+sheetColumnNum+"' style='width: 90%;'  value='"+ column_name +"'/></td>" 
			 + "<td style='vertical-align: middle;' > <input type='text' id='s_reCode_"+sheetColumnNum+"' style='width: 90%;' disabled='disabled' value='"+ reCode +"'/></td>" 
			 + "<td style='text-align: center;'></td></tr>";
		 sheetColumnArray.push(column_name);
		 getCatSheet(sheetColumnNum,column_name,re_column,re_table_name,native_column);
	}
	 $("#sheetColumnsRowBody").append(strs);
}

//分类模式下shett生成
function getCatSheet(sheetColumnNum,column_name,re_column,re_table_name,native_column){
		var sheet_sql="";
		if ($("#sheetSql_input").val()) {
			sheet_sql=$("#sheetSql_input").val()+"";
		}else {
			sheet_sql=SHEET_SQL_TEMPLATE;
		}
		$("#sheetSql_input").empty();
	    if (sheetColumnNum ==0) {
	    	sheet_sql=sheet_sql.replace("#id", column_name);
		}else {
			sheet_sql=sheet_sql.replace("#name",column_name);
		}
	    sheet_sql=sheet_sql.replace("#tableName", sheetTableCode+" t ");
	    $("#sheetSql_input").append(sheet_sql);
	    DATA_SQL_TEMPLATE=DATA_SQL_TEMPLATE.replace("#sheet",re_table_name+"."+column_name);
	    var table={
    			"table_name":sheetTableCode,	
    			"re_table_name":re_table_name,	
    			"native_column":native_column,	
    			"re_column":re_column
    	};
	    dataJoinTableArray.push(table);
}



var dataColumnArray =new Array();//选择字段中转数组
var start_row=0;//字段在excel中的开始行
var start_colmun=0;//字段在excel中的开始列
//根据选择字段生成字段表格信息和data数据
function reloadCells(table_name,column_name,remarks,re_column,native_column,re_table_name){
	var colmunNum=dataColumnArray.length;
	start_colmun++;
	start_row++;
	var native_column_name=column_name;
	column_name=re_table_name+"."+column_name;
	var cell={
			"table_name":table_name,
			"re_column":re_column,
			"native_column":native_column,
			"re_table_name":re_table_name,
			"column_name":native_column_name,
			"remarks":remarks,
			"start_row":start_row,
			"end_row":start_row,
			"start_colmun":start_colmun,
			"end_colmun":start_colmun,
			"width":4500,
			"isMerge":"N"
	};
	dataColumnArray.push(cell);
	var strs = "";
	 strs += "<tr>"
	 + "<td style='vertical-align: middle;' > <input type='text' id='t3_table_"+colmunNum+"' style='width: 90%;' disabled='disabled'  value='"+ table_name +"'/></td>" 
	 + "<td style='vertical-align: middle;' > <input type='text' id='t3_code_"+colmunNum+"' style='width: 90%;' disabled='disabled' value='"+ native_column_name +"'/></td>" 
	 +"<td style='vertical-align: middle; width:17%;'><input type='text' style='width: 90%;' id='t3_remarks_"+colmunNum+"' placeholder='请输入列名……'  value='"+formatNull(remarks)+"'/> </td>"
	 + "<td ><input type='text' style='width: 90%;' id='t3_startColumn_"+colmunNum+"' value='"+start_row+"'/></td>"
	 + "<td ><input type='text' style='width: 88%;' id='t3_endColumn_"+colmunNum+"' placeholder='请输入结束行……' value='"+start_row+"'/></td>"
	 + "<td ><input type='text' style='width: 90%;' id='t3_startRow_"+colmunNum+"' value='"+start_colmun+"'/></td>"
	 + "<td ><input type='text' style='width: 88%;' id='t3_endRow_"+colmunNum+"' placeholder='请输入结束列……' value='"+start_colmun+"'/></td>"
	 + "<td ><input type='text' style='width: 90%;' id='t3_width_"+colmunNum+"' value='4500'/></td>"
	 + "<td style='text-align: center;'>"
	 + 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"removeHead("+colmunNum+");\"><i class='icon-minus'></i></button></td></tr>";
	 $("#excelHead").append(strs);
	 getDataSql(table_name,column_name,re_column,native_column,re_table_name);
	 reloadTablesColumns(mapArray,native_column_name);
}




var dataJoinTableArray=[];//data从表数组
//生成data语句
function getDataSql(table_name,column_name,re_column,native_column,re_table_name){
	$("#dataSql_input").empty();
    var data_sql_tmep=DATA_SQL_TEMPLATE;
	    data_sql_tmep=data_sql_tmep.replace("#baseTable",tableCode+" t ");
    	var datacolumnStr ="";
    	$.each(dataColumnArray,function(i,item){
    		if (i!=dataColumnArray.length-1) {
    			datacolumnStr+=item.column_name+",";
    		}
		 });
    	datacolumnStr+=column_name+" ";
    	data_sql_tmep=data_sql_tmep.replace("#columns",datacolumnStr);
    	var dataJoinTableStr="";
    		$.each(dataJoinTableArray,function(i,item){
	    			if (item.table_name==table_name) {
	    				dataJoinTableArray.remove(item);
	    			}else{
	    				dataJoinTableStr+=" left join "+item.table_name +" "+item.re_table_name+" on "+item.re_table_name+"."+item.native_column+" = "+item.re_table_name+"."+item.re_column+" ";
	    			}
    		});
    		if (table_name != tableCode) {
	    		dataJoinTableStr+=" left join "+table_name +" "+re_table_name+" on "+re_table_name+"."+native_column+" = "+re_table_name+"."+re_column+" ";
	    		var table={
	    			"table_name":table_name,	
	    			"re_table_name":re_table_name,	
	    			"native_column":native_column,	
	    			"re_column":re_column
	    		};
	    		dataJoinTableArray.push(table);
    		}
    	data_sql_tmep=data_sql_tmep.replace("#joinTable",dataJoinTableStr);
    $("#dataSql_input").append(data_sql_tmep);
}

//删除选择的表头同时生成新data语句
function removeHead(num){
	reloadColumnArray(num);
	$("#excelHead").empty();
	var strs = "";
	for ( var j = 0; j < dataColumnArray.length; j++) {
		strs += "<tr>"
		+ "<td style='vertical-align: middle;' > <input type='text' id='t3_table_"+j+"' style='width: 90%;' disabled='disabled' value='"+ dataColumnArray[j].table_name +"'/></td>" 
		+ "<td style='vertical-align: middle;' > <input type='text' id='t3_code_"+j+"' style='width: 90%;' disabled='disabled' value='"+ dataColumnArray[j].column_name +"'/></td>" 
		+"<td style='vertical-align: middle; width:17%;'><input type='text' style='width: 90%;' id='t3_remarks_"+j+"' placeholder='请输入列名……'  value='"+dataColumnArray[j].remarks+"'/> </td>"
		+ "<td ><input type='text' style='width: 90%;' id='t3_startRow_"+j+"' value='"+dataColumnArray[j].start_row+"'/></td>"
		 + "<td ><input type='text' style='width: 88%;' id='t3_endRow_"+j+"' placeholder='请输入结束行……' value='"+dataColumnArray[j].end_row+"'/></td>"
		+ "<td ><input type='text' style='width: 90%;' id='t3_startColumn_"+j+"' value='"+dataColumnArray[j].start_colmun+"'/></td>"
		+ "<td ><input type='text' style='width: 88%;' id='t3_endColumn_"+j+"' placeholder='请输入结束列……' value='"+dataColumnArray[j].start_colmun+"'/></td>"
		+ "<td ><input type='text' style='width: 90%;' id='t3_width_"+j+"' value='"+dataColumnArray[j].width+"'/></td>"
		+ "<td style='text-align: center;'>"
		+ 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"removeHead("+j+");\"><i class='icon-minus'></i></button></td></tr>";
		getDataSql(dataColumnArray[j].table_name, dataColumnArray[j].column_name, dataColumnArray[j].re_column, dataColumnArray[j].native_column, dataColumnArray[j].re_table_name);
	}
	$("#excelHead").append(strs);
}

//根据页面更改从新加载data的样式数组
function reloadColumnArray(num){
	var cell=null;
	if (num) {
		cell={
				"table_name":dataColumnArray[num].table_name,
				"re_column":dataColumnArray[num].re_column,
				"native_column":dataColumnArray[num].native_column,
				"re_table_name":dataColumnArray[num].re_table_name,
				"column_name":dataColumnArray[num].column_name.substring(dataColumnArray[num].column_name.indexOf(".")+1),
				"remarks":dataColumnArray[num].remarks
		};
	}
	for ( var i = 0; i <dataColumnArray.length; i++) {
		if (i==num) {
			dataColumnArray.remove(dataColumnArray[i]);
			continue;
		}
		dataColumnArray[i].remarks=$("#t3_remarks_"+i).val()+"";
		dataColumnArray[i].start_colmun=$("#t3_startColumn_"+i).val()+"";
		dataColumnArray[i].end_colmun=$("#t3_endColumn_"+i).val()+"";
		dataColumnArray[i].start_row=$("#t3_startRow_"+i).val()+"";
		dataColumnArray[i].end_row=$("#t3_endRow_"+i).val()+"";
		dataColumnArray[i].width=$("#t3_width_"+i).val()+"";
	}
	reloadTablesColumns(mapArray, null, cell);
}

//保存
function savePart(){
	reloadColumnArray();
	reloadCellHead();
	var excel_part= {
			"excel_id":$("#excel_id").val()+"",
			"part_id":$("#part_id").val()+"",
			"template_id":$("#template_id").val()+"",
			"part_sort":$("#part_sort").val()+"",
			"part_name":$("#partName_content").val()+"",
			"sheet_name":$("#sheetName_content").val()+"",
			"sheet_cat":sheetCat,
			"sheet_sql":$("#sheetSql_input").val()+"",
			"data_sql":$("#dataSql_input").val()+"",
			"cell_array":JSON.stringify(resultCellArray)
	};
	var url= _basePath + "/poiAutoExport/savePart";
	$.post(url, excel_part, function(data, status) {
		layer.alert(data.message,function(index){
			if(data.success)
				top.reloadTab("报表生成");
			layer.close(index);
			top.closeTab("ExcelPart新增");
		});
	});
}

//在保存之前给cell数组加载表头
var resultCellArray=[];
function reloadCellHead(){
	var cellHead={
			"remarks":$("#cell_head_content").val(),
			"column_name":"",
			"start_row":0,
			"end_row":$("#cell_head_rowspan").val(),
			"start_colmun":0,
			"end_colmun":dataColumnArray[dataColumnArray.length-1].end_colmun,
			"isMerge":"Y"
	};
	resultCellArray.push(cellHead);
	$.each(dataColumnArray,function(i,item){
		resultCellArray.push(item);
	});
}

