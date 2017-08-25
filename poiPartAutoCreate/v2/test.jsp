<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/icon.css">
<script src="<%=basePath %>/resources/easyui/jquery.easyui.min.js"></script>
<script src="<%=basePath %>/resources/scripts/poi/test.js"></script>
<style>
<!--
		#sheetCat_select_chzn{ width: 45%!important; float: right;}
		.cannotselect{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;-khtml-user-select:none;user-select:none;}td.selected{background:#0094ff;color:#fff}td.hide{display:none}
-->
	.inline{display:inline;}
</style>
<body>
		<div id="cellsTable_menu" class="easyui-menu" style="width:120px;">
		    <div id="left_merge_cell" >left</div>
		    <div id="down_merge_cell">down</div>
		    <div id="edit_cell">edit</div>
		</div>

		<div class="row-fluid">
		<div class="widget blue">
			<div class="widget-title" id ="role_title" >
               	 <h4><i class="icon-align-left">Excel导出功能列表</i></h4>
               	  <div class="update-btn">
               	  	<button id="createDataSql" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="createDataSql();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">回显SQL</span></button>
               	  	<button id="editCellName" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="editCellName();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">编辑内容</span></button>
               	  	<button id="saveCellName" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="saveCellName();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">保存至表格</span></button>
               	  	<button id="addCellTableRow" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableRow();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">增加行</span></button>
               	  	<button id="addCellTableCow" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableCol();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">增加列</span></button>
               	  </div>
            </div>
			<div class="widget-body">
	                <table id="cells_table" class="table table-bordered table-hover" >
						<tbody id="cells_table_body"></tbody>
	               </table>
			</div>
			</div>
		</div>
	<script>
	</script>
<script src="<%=basePath %>/resources/scripts/poi/test2.js"></script>
	
</body>	
