<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<script src="<%=basePath %>/resources/scripts/poi/edit_sheetTable.js"></script>
<style>
</style>
<body>
	<div style="display: inline;">
		 <div class="span5" id="sheet_baseTables_div"  style="width: 360px;">
					<div class="widget green" >
							<div class="widget-title" id ="role_title" >
	                      				 <h4><i class="icon-align-left">选择表格</i></h4>
	                      				 <div class="update-btn">
	                      				 		<input placeholder="输入名称……" id="sheetTable_name_input" style="width: 85px;margin-bottom: 10px">
	                      				 		<input placeholder="输入编码……" id="sheetTable_code_input" style="width: 85px;margin-bottom: 10px">
					               	  	<button id="select_sheet_table" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">搜索</span></button>
			               	  	</div>
	                   				</div>
	                      <div class="widget-body">
	                          <table class="table table-striped table-bordered table-hover" >
				                  <thead>
				                      <tr>
				                      	  <th style="width: 12px; vertical-align: middle;"></th>
				                          <th style="width: 17%" >表编码</th>
				                          <th >表名称</th>
				                          <th style="width: 80px; text-align: center;">操作</th>
				                      </tr>
				                 </thead>
				                 <tbody id="sheetRowBody"></tbody>
				               </table>
				               <div class="pagination pagination-right">
	                                <ul id="sheetPageUL"></ul>
	                            </div>
	                      </div>
	                </div>
	     </div>
	     
	     <div  style="float: right;width: 290px;margin-right: 10px">
		      <div class="widget green"  >
				   	<div class="widget-title" id ="role_title" >
						    <h4><i class="icon-align-left">sheet字段选择</i></h4>
					</div>
					<br>
			  		<div class="input-wrap">
			  			<div class="tLable"><span >sheet表名：</span></div>
			            	<select  id="sheet_table"  data-placeholder="暂无表格..." class="chzn-select" tabindex="-1" style="width: 98%" onchange="loadSheetColumns();" required>
      						</select>
				  </div>
				  <div class="input-wrap">
			  			<div class="tLable"><span >ID字段：</span></div>
				            <select  id="sheet_table_id"  data-placeholder="暂无字段..." class="chzn-select" tabindex="-1" onchange="selectSheetId();" style="width: 98%" required>
	      					</select>
				  </div>
				  <div class="input-wrap">
			  			<div class="tLable"><span >name字段：</span></div>
				            <select  id="sheet_table_name"  data-placeholder="暂无字段..." class="chzn-select" tabindex="-1"  onchange="selectSheetName();" style="width: 98%" required>
	      					</select>
				 </div>
			 </div>
			 
			 <div  style="text-align: right; margin-top: 10px;"  >
				 <button id="save" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="save();">
		    		 <i class="icon-save"></i>&nbsp;
		    		<span class="ladda-label" style="font-size: 12px;">保存</span>
		    	</button>
		    </div>
		    
		</div>
	</div>
	<input type="hidden" id="sheetSql_input" value=""/>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    </script>
</body>	
	