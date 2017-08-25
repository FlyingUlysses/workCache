var row_num=3;
var col_num=7;
var select_cell="";
var select_row="";
var location_cell="";
var location_row="";
var tr_num="";
var td_num="";
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
		var col_span=parseInt($("#cells_table tbody tr:eq("+select_row+") td:eq("+select_cell+")").attr("colspan"),10);
		var row_span=parseInt($("#cells_table tbody tr:eq("+select_row+") td:eq("+select_cell+")").attr("rowspan"),10);
		if (select_cell == (td_num-1)) {
			alert("请求操作超过表格范围,请先添加列!");
			return;
		}
		var max_col_span=1;
		if (row_span && row_span>1) {
			//取下一列中最大colspan
			for ( var i = 0; i < row_span; i++) {
				if (max_col_span<parseInt($("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").attr("colspan"),10)) {
					max_col_span=parseInt($("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").attr("colspan"),10);
				}
			}
			for ( var i = 0; i < row_span; i++) {
				next_cols_pan=parseInt($("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").attr("colspan"),10);
				if (next_cols_pan <max_col_span) {
					for ( var j = 0; j <max_col_span; j++) {
						alert("tr_"+(location_row+i)+"_td_"+(location_cell+col_span+j));
						$("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span+j)+"']").remove();
					}
				}else{
					$("td[location='tr_"+(location_row+i)+"_td_"+(location_cell+col_span)+"']").remove();
				}
			}
		}else{
			$("td[location='tr_"+(location_row)+"_td_"+(location_cell+col_span)+"']").remove();
		}
		$("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("colspan",(col_span+max_col_span)+"");
	});

//向下合并
	$("#down_merge_cell").click(function(){
		var col_span=parseInt($("#cells_table tbody tr:eq("+select_row+") td:eq("+select_cell+")").attr("colspan"),10);
		var row_span=parseInt($("#cells_table tbody tr:eq("+select_row+") td:eq("+select_cell+")").attr("rowspan"),10);
		if (!row_span || row_span == undefined) {
			row_span=1;
		}else if ((select_row+row_span) == tr_num) {
			alert("请求操作超过表格范围,请先添加行!");
			return;
		}
		$("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").attr("rowspan",(row_span+1)+"");
		$("td[location='tr_"+(location_row+row_span)+"_td_"+(location_cell)+"']").remove();
	});
	
//编辑表格内容
	$("#edit_cell").click(function(){
		$("td[location='tr_"+(location_row)+"_td_"+(location_cell)+"']").html("测试成功");
	});
	
});


function createDataSql(){
	$("#cells_table tbody tr").each(function(i,item){
		$("#cells_table tbody tr:eq("+i+") td").each(function(j,item){
			var td=$("#cells_table tbody tr:eq("+i+") td:eq("+j+")");
			alert(td.text());
		});
	});
}

function editCellName(){
	var celltableTemp=$("#cells_table");
	celltableTemp.find("input[tempType='name_input']").show();
	celltableTemp.find("div[tempType='name_div']").hide();
	celltableTemp.find("div[tempType='attr_div']").hide();
}

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
	$("#cells_table").tableMergeCells();
}

function addCellTableRow(){
	row_num++;
	var strs=$("#cells_table_body").html()+" <tr>";
	for ( var j = 0; j <col_num ; j++) {
		strs+="<td style='text-align:center;' location='tr_"+row_num+"_td_"+j+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'>22222</div><div style='display:inline;' tempType='attr_div'></div></td>";
	}
	strs+="</tr>";
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	$("#cells_table").tableMergeCells();
}

function addCellTableCol(){
	col_num++;
	var strs="";
	$("#cells_table_body").find("tr").each(function(){
		var trStr="<tr>"+$(this).html()+"";
		trStr+="<td style='text-align:center;' location='tr_"+row_num+"_td_"+col_num+"'  colspan='1' rowspan='1' ><div><input style='width: 120px;' tempType='name_input' hidden value=''/></div>" 
		+"<div style='display:inline;'><input style='width: 80px;' tempType='attr_input' hidden /></div style='display:inline;'><div tempType='name_div' style='display:inline;'>33333333</div><div style='display:inline;' tempType='attr_div'></div></td>";
		trStr+="</tr>";
		strs+=trStr;
	});
	alert(strs);
	$("#cells_table_body").empty();
	$("#cells_table_body").append(strs);
	$("#cells_table").tableMergeCells();
}

function deleteCellTableRow(){
	row_num--;
	$("#cells_table tbody tr:eq("+row_num-1+")").remove();
}

function deleteCellTableCol(){
	row_num--;
	$("#cells_table tbody tr:eq("+row_num-1+")").remove();
}


