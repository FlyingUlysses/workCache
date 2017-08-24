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
-->
</style>
<body>
		<div id="cellsTable_menu" class="easyui-menu" style="width:120px;">
		    <div id="left_merge_cell" >向右合并</div>
		    <div id="down_merge_cell" >向下合并</div>
		</div>

		<div class="row-fluid">
		<div class="widget blue">
			<div class="widget-title" id ="role_title" >
               	 <h4><i class="icon-align-left">Excel导出功能列表</i></h4>
               	  <div class="update-btn">
               	  	<button id="toTest" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;"></span></button>
               	  </div>
            </div>
			<div class="widget-body">
	                <table class="table table-striped table-bordered table-hover" id="cells_table">
		                      <tbody id="cells_table_body"></tbody>
	               </table>
	               <div class="pagination pagination-right">
	                    <ul id="pageUL"></ul>
	               </div>
			</div>
			</div>
		</div>
	<script type="text/javascript">
		$("td").click(function(e){
			$("#mm").menu("show", {
    			left: e.pageX,
    			top: e.pageY
			});
		});
		$("#mm").menu({
   	 		onClick:function(item){
   	 			alert(item);
    		}
		});
  </script>
</body>	
