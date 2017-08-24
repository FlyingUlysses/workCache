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
		<div id="menu" class="easyui-menu" style="width:120px;">
		    <div id="menu_left" >left</div>
		    <div id="menu_down">down</div>
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
	                <table id="cells_table" class="table table-bordered table-hover">
		                      <tr>
		                         <td id="test1" colspan="1">1111</td>
		                         <td id="test2" colspan="1">222</td>
		                         <td id="test3">333</td>
		                         <td id="test4">444</td>
		                      </tr>
		                      <tr>
		                         <td id="test11">555</td>
		                         <td id="test22">666</td>
		                         <td id="test33">777</td>
		                         <td id="test44">888</td>
		                      </tr>
		                      <tr>
		                         <td id="test11">555</td>
		                         <td id="test22">666</td>
		                         <td id="test33">777</td>
		                         <td id="test44">888</td>
		                      </tr>
		                      <tr>
		                         <td id="test11">555</td>
		                         <td id="test22">666</td>
		                         <td id="test33">777</td>
		                         <td id="test44">888</td>
		                      </tr>
		                      <tr>
		                         <td id="test11">555</td>
		                         <td id="test22">666</td>
		                         <td id="test33">777</td>
		                         <td id="test44">888</td>
		                      </tr>
	               </table>
			</div>
			</div>
		</div>
	<script>
</script>
<script src="<%=basePath %>/resources/scripts/poi/test2.js"></script>
</body>	
