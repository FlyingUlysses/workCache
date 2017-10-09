<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
<script src="<%=basePath %>/resources/scripts/poi/index.js"></script>
<style>
<!--
		#sheetCat_select_chzn{ width: 45%!important; float: right;}
-->
</style>
<body>
		<div class="row-fluid">
		<div class="widget blue">
			<div class="widget-title" id ="role_title" >
               	 <h4><i class="icon-align-left">Excel导出功能列表</i></h4>
               	  <div class="update-btn">
               	  	<input id="excelCode_input"  type="text" placeholder="输入编码进行搜索……" style="width: 145px;">
               	  	<input id="excelname_input"  type="text" placeholder="输入表名进行搜索……" style="width: 145px;">
               	  	<button id="findBut" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-search"></i>&nbsp;<span style="font-size: 12px;">查询</span></button>
               	  	<button id="addExcel" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">新增</span></button>
               	  	<button id="toTest" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" onclick="toTest();">跳转测试</span></button>
               	  </div>
            </div>
			<div class="widget-body">
	                <table class="table table-striped table-bordered table-hover">
		                  <thead>
		                      <tr>
		                          <th  style="width: 17%" >excel编码</th>
		                          <th style="width: 17%">数据库表名称</th>
		                          <th style="text-align: center;">备注信息</th>
		                          <th style="width: 17%; text-align: center;">创建时间</th>
		                          <th style="width: 80px; text-align: center;">操作excel</th>
		                          <th style="width: 13%;text-align: center;">模板</th>
		                          <th style="width: 120px; text-align: center;">操作模板</th>
		                      </tr>
		                 </thead>
		                 <tbody id="rowBody"></tbody>
	               </table>
	               <div class="pagination pagination-right">
	                    <ul id="pageUL"></ul>
	               </div>
			</div>
			</div>
		</div>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
  </script>
</body>	
