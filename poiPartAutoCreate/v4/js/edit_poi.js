$(function(){
	selectSheet();
	loadCells();
});

//根据选择sheet类型，决定是否展示固定sheet名称编辑
var sheetCat="";
function selectSheet(){
	sheetCat=$("#sheetCat_select").val()+"";
	if (sheetCat == "all") {
		$("#sheetName_title").show();
		$("#sheetName_content").show();
	}else{
		$("#sheetName_content").val("");
		$("#sheetName_title").hide();
		$("#sheetName_content").hide();
	}
}

var columnNum=0;
function loadCells(){
	var url = _basePath + "/poiAutoExport/getCellArray?template_id="+$("#template_id").val();
	$.post(url,function(data, status) {
		$("#cells_content").empty();
		if(data != null && data.length > 0){
			var strs = "";
			columnNum=0;
			 $.each(data,function(i,item){
				 columnNum++;
				 strs += "<tr>"
				 + "<td style='vertical-align: middle;' > <input type='text' id='cell_name_"+i+"' style='width: 90%;' value='"+ formatNull(item.cellname) +"'/><input type='hidden' id='isMerge_"+i+"' style='width: 90%;' value='"+ formatNull(item.ismerge) +"'/></td>" 
				 + "<td style='vertical-align: middle;' > <input type='text' id='code_"+i+"' style='width: 90%;'  value='"+ formatNull(item.property) +"'/></td>" 
				 +"<td style='vertical-align: middle; width:17%;'><input type='text' style='width: 90%;' id='width_"+i+"'  value='"+formatNull(item.width)+"'/> </td>"
				 + "<td ><input type='text' style='width: 90%;' id='start_row_"+i+"' value='"+formatNull(item.startrow)+"'/></td>"
				 + "<td ><input type='text' style='width: 88%;' id='start_column_"+i+"'  value='"+formatNull(item.startcolumn)+"'/></td>"
				 + "<td ><input type='text' style='width: 88%;' id='end_row_"+i+"'  value='"+formatNull(item.endrow)+"'/></td>"
				 + "<td ><input type='text' style='width: 88%;' id='end_column_"+i+"'  value='"+formatNull(item.endcolumn)+"'/></td></tr>";
			 });
			 $("#cells_content").append(strs);
		 }
	});
}

function toAddPart(){
	var excel_id=$("#part_excel_id").val();
	var part_id=$("#part_id").val();
	var template_id=$("#template_id").val();
	var url=_basePath + "/poiAutoExport/addPart?id="+excel_id+"&part_id="+part_id+"&template_id="+template_id;
	top.addTab("part_add","ExcelPart新增",url);
	top.closeTab("ExcelPart编辑");
	
}


function savePart(){
	var cellArray=[];
	for ( var i = 0; i < columnNum; i++) {
		var cell={
				"remarks":$("#cell_name_"+i).val()+"",
				"isMerge":$("#isMerge_"+i).val()+"",
				"column_name":$("#code_"+i).val()+"",
				"start_colmun":$("#start_column_"+i).val()+"",
				"end_colmun":$("#end_column_"+i).val()+"",
				"start_row":$("#start_row_"+i).val()+"",
				"end_row":$("#end_row_"+i).val()+"",
				"width":$("#width_"+i).val()+""
		};
		cellArray.push(cell);
	}
	var excel_part= {
			"excel_id":$("#part_excel_id").val()+"",
			"part_id":$("#part_id").val()+"",
			"template_id":$("#template_id").val()+"",
			"part_sort":$("#part_sort").val()+"",
			"part_name":$("#partName_content").val()+"",
			"sheet_name":$("#sheetName_content").val()+"",
			"sheet_cat":sheetCat,
			"sheet_sql":$("#sheetSql_input").val()+"",
			"data_sql":$("#dataSql_input").val()+"",
			"cell_array":JSON.stringify(cellArray)
	};
	var url= _basePath + "/poiAutoExport/savePart";
	$.post(url, excel_part, function(data, status) {
		layer.alert(data.message,function(index){
			//parent.reload();
			layer.close(index);
			top.closeTab("ExcelPart编辑");
		});
	});
}