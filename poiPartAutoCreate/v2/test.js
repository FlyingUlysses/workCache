var row_num=5;
var col_num=7;
var select_cell="";
var select_row="";
var location_cell="";
var location_row="";
var tr_num="";
var td_num="";
var property_list=[];
$(function(){
	var strs="";
	$("#cells_table_body").empty();
	for ( var i = 0; i < row_num; i++) {
		strs+="<tr location='tr_"+i+"' colspan='1' rowspan='1' style='height:23px;'>";
			for ( var j = 0; j < col_num; j++) {
				strs+="<td style='text-align:center;' location='tr_"+i+"_td_"+j+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value='22'/></div>" 
					+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'></div><div style='display:inline;' tempType='attr_div'></div></td>";
			}
		strs+="</tr>";
	}
	$("#cells_table_body").append(strs);
	reload();
	
});

//页面内容刷新后绑定方法
function reload(){
	showPropertyList();
	
	
	$("#cells_table").tableMergeCells();
	$("td").click(function(e){
		var location=$(this).attr("location")+"";
		location_row=parseInt(location.substring(location.indexOf("tr_"), location.indexOf("_td")).replace("tr_", ""), 10);
		location_cell=parseInt(location.substring( location.indexOf("td_")).replace("td_", ""), 10);
		select_row=$(this).parent().index();
		select_cell=$(this).index();
		td_num=$("#cells_table tbody tr:eq("+select_row+") td").length;
		tr_num=$("#cells_table tbody tr").length;
		$("#cellsTable_menu").menu("show",{
			left:e.pageX,
			top:e.pageY
		});
	});
	
	
//向右合并
	$("#left_merge_cell").click(function(){
		if (select_cell == (td_num-1)) {
			alert("请求操作超过表格范围,请先添加列!");
			return;
		}
		var col_span=parseInt($("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("colspan"),10);
		var row_span=parseInt($("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("rowspan"),10);
		var max_col_span=1;
		if (row_span && row_span>1) {
			//取下一列中最大colspan
			for ( var i = 0; i < row_span; i++) {
				if (max_col_span<parseInt($("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").attr("colspan"),10)) {
					max_col_span=parseInt($("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").attr("colspan"),10);
				}
			}
			for ( var i = 0; i < row_span; i++) {
				for ( var j = 0; j <max_col_span; j++) {
					$("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span+j)+"']").remove();
				}
			}
		}else{
			$("td[location='tr_"+(location_row)+"_td_"+(location_cell+col_span)+"']").remove();
		}
		$("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("colspan",(col_span+max_col_span)+"");
	});

//向下合并
	$("#down_merge_cell").click(function(){
		var col_span=parseInt($("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("colspan"),10);
		var row_span=parseInt($("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("rowspan"),10);
		if (!row_span || row_span == undefined) {
			row_span=1;
		}else if ((select_row+row_span) == tr_num) {
			alert("请求操作超过表格范围,请先添加行!");
			return;
		}
		var max_row_span=1;//向下合并涉及单元格的最大跨行
		if (col_span && col_span>1) {
			for ( var i = 0; i < col_span; i++) {
				if (max_row_span < parseInt($("td[location='tr_"+(location_row+row_span)+"_td_"+(location_cell+i)+"']").attr("rowspan"),10)) {
					max_row_span=parseInt($("td[location='tr_"+(location_row+row_span)+"_td_"+(location_cell+i)+"']").attr("rowspan"),10);
				}
			}
			for ( var i = 0; i < col_span; i++) {
				for ( var j = 0; j <max_row_span; j++) {
					$("td[location='tr_"+(location_row+row_span+j)+"_td_"+(location_cell+i)+"']").remove();
				}
			}
		}else{
			$("td[location='tr_"+(location_row+row_span)+"_td_"+(location_cell)+"']").remove();
		}
		$("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("rowspan",(row_span+max_row_span)+"");
	});
	
//删除选择行
	$("#delete_row").click(function(){
		$("#cells_table tbody tr:eq("+select_row+")").remove();
		row_num--;
	});
	
	
//删除选择列
	$("#delete_col").click(function(){
		for ( var i = 0; i < row_num; i++) {
			
		}
		col_num--;
	});
}




//根据表头生成datasql
function createDataSql(){
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$("#cells_table tbody tr:eq("+i+") td:eq("+j+")");
		});
	});
}

//编辑名称
function editCellName(){
	var celltableTemp=$("#cells_table");
	celltableTemp.find("input[tempType='name_input']").show();
	celltableTemp.find("div[tempType='name_div']").hide();
	celltableTemp.find("div[tempType='attr_div']").hide();
}


//保存名称编辑
function saveCellName(){
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
	reload();
}

//添加整行
function addCellTableRow(){
	var strs=$("#cells_table_body").html()+" <tr>";
	for ( var j = 0; j <col_num ; j++) {
		strs+="<td style='text-align:center;' location='tr_"+row_num+"_td_"+j+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'>hhhhh</div><div style='display:inline;' tempType='attr_div'></div></td>";
	}
	strs+="</tr>";
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	$("#cells_table").tableMergeCells();
	row_num++;
	reload();
}

//添加整列
function addCellTableCol(){
	var strs="";
	for ( var i = 0; i < row_num; i++) {
		var trStr="<tr>"+$("#cells_table_body tr:eq("+i+")").html()+"";
		trStr+="<td style='text-align:center;' location='tr_"+i+"_td_"+col_num+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'>llll</div><div style='display:inline;' tempType='attr_div'></div></td>";
		trStr+="</tr>";
		strs+=trStr;
	}
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	$("#cells_table").tableMergeCells();
	col_num++;
	reload();
}


//展示所有字段供选择
function showPropertyList(){
	var url = _basePath + "/poiAutoExport/getPropertyList?table=roles";
	$.post(url, function(data, status) {
		 $.each(data,function(i,item){
			 $("#cellsTable_menu").menu("appendItem", {
					parent: $("#cellsTable_menu").menu("findItem", "选择表字段").target,  
					text: ""+i
				});
			 $.each(item,function(p,property){
				 $("#cellsTable_menu").menu("appendItem", {
						parent: $("#cellsTable_menu").menu("findItem", ""+i).target, 
						text: ""+property.column_name
					});
			 });
		 });
	});
}