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
</style>
<body>
		<div id="cellsTable_menu" class="easyui-menu" style="width:120px;">
		    <div id="left_merge_cell" >left</div>
		    <div id="down_merge_cell">down</div>
		    <div id="delete_row">删除该行</div>
		    <div id="delete_col">删除该列</div>
		    <div id="edit_property" >选择表字段</div>
		</div>

		<div class="row-fluid">
		<div class="widget blue">
			<div class="widget-title" id ="role_title" >
               	 <h4><i class="icon-align-left">Excel导出功能列表</i></h4>
               	  <div class="update-btn">
               	  	<button id="createDataSql" type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="createDataSql();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">回显SQL</span></button>
               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="editCellName_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">编辑内容</span></button>
               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="saveCellName_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">保存至表格</span></button>
               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableRow_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">增加行</span></button>
               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableCol_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">增加列</span></button>
               	  </div>
            </div>
			<div class="widget-body">
			<input id="propertyList"  type="hidden" value="${property_list }"/>
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
