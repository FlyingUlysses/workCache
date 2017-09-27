var page = { page: 1,limit: 12 };
var tableCodeTemp="";
$(function() {
	$("#toTest").click(function(){
		var url=_basePath + "/poiAutoExport/toTest";
		top.addTab("part_Test","测试页",url);
		
	});
	
	
		reload();
		
		$("#addExcel").click(function(){
			var url=_basePath + "/poiAutoExport/editExcel";
			showModel({
				title : "新增Excel",
				width : "480px",
				height: "380px",
				url : url
			});
		});
		$("#findBut").click(function(){
			reload();
		});
		$("#excelCode_input").keydown(function(event) {    
	        if (event.keyCode == 13) { 
	        	reload();
	        }   
	    }); 
		$("#excelname_input").keydown(function(event) {    
			if (event.keyCode == 13) { 
				reload();
			}   
		});
		
		
		
});

function reload(){
	page.page = 1;
	reloadRecord();
}


function reloadRecord(){
	var url = _basePath + "/poiAutoExport/getExcelPages";
	page.excel_code=$("#excelCode_input").val();
	page.excel_name=$("#excelname_input").val();
	$.post(url, page, function(res, status) {
		$("#rowBody").empty();
		renderPage("pageUL",page,res.total,reloadRecord);
		var data = res.data;
		if(data != null && data.length > 0){
			 var strs = "";
			 var row=1;
			 var type="";
			 $.each(data,function(i,item){
				 	row=1;
				 	type="";
				 	if (item.type=="") 
						type="hidden";
				 	if (i== data.length-1) 
						row ++;
					for ( var j = i+1; j < data.length; j++) {
							if(item.type!=data[j].type){
								row++;
								break;
							}else if(item.type==data[j].type) {
								row++;
								data[j].type="";
								data[j].name="";
								data[j].create_time="";
								data[j].desc="";
							}
					}
				 strs += "<tr >"
					 + "<td rowspan='"+row+"' "+type+"  style='vertical-align: middle;' >" + item.type + "</td><td rowspan='"+row+"' "+type+" style='vertical-align: middle;'>" + formatNull(item.name) + "</td>"
					 + "<td rowspan='"+row+"' "+type+" style='vertical-align: middle;'>" + formatNull(item.desc) + "</td>"
					 + "<td rowspan='"+row+"' "+type+" style='vertical-align: middle;text-align: center;' >" + formatNull(item.create_time) + "</td>"
					 +"<td rowspan='"+row+"' "+type+" style='vertical-align: middle;' ><button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"editExcel('"+ item.id +"');\"><i class='icon-pencil'></i></button>  "
					 +"<button style='padding: 1px 12px;' class='btn btn-primary'  onclick='revRecord(\"" + _basePath + "/poiAutoExport/rmvExcel?id=" + item.id + "\");'><i class='icon-trash'></i></button></td>"
					 + "<td  style='text-align: center;'>" + formatNull(item.part_name) + "</td>"
					 + "<td style='text-align: center;'>"
					 +"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"editPart('"+ item.id +"');\"><i class='icon-plus'></i></button>    "
					 + 		"<button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"editPartAndCell('"+ item.part_id +"');\"><i class='icon-pencil'></i></button>  " 
					 + 		"  <button id='rvBtn_" + item.id + "' style='padding: 1px 12px;' class='btn btn-danger ladda-button' data-style='zoom-in'"
					 + 			" onclick='revPart(\"" + _basePath + "/poiAutoExport/rmvPart?id=" + item.part_id + "\");'><i class='icon-trash'></i></button></td></tr>";
				 
				 if ((i<data.length -1 && item.type!=data[i+1].type && data[i+1].type != "") || i==data.length-1) {
					strs += "<tr><td hidden></td><td hidden></td><td hidden></td><td hidden></td><td hidden></td>" 
						 +"<td style='text-align: center;'><button style='padding: 1px 12px;' class='btn btn-primary' onclick=\"editPart('"+ item.id +"');\"><i class='icon-plus'></i></button></td>" 
						 +"<td ></td></tr>";
				 }
			 });
			 $("#rowBody").append(strs);
		 }
	});
}

function rowClick(id){
	$("input[name='rowRadio'][value='t1_" + id + "']").attr("checked",'checked');
	
}

function editExcel(id){
	var url=_basePath + "/poiAutoExport/editExcel?id="+id;
	showModel({
		title : "Excel编辑",
		width : "480px",
		height: "380px",
		url : url
	});
}

function editPart(id){
	var url=_basePath + "/poiAutoExport/addPart?id="+id;
	top.addTab("part_add","ExcelPart新增",url);
}

function editPartAndCell(id){
	var url=_basePath + "/poiAutoExport/editPartAndCell?id="+id;
	top.addTab("partAndCell_edit","ExcelPart编辑",url);
}

function revPart(url){
	$.post(url,function(data,status){
		layer.alert(data.message);
		reloadRecord();
	});
}
