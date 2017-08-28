<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/icon.css">
<script src="<%=basePath %>/resources/easyui/jquery.easyui.min.js"></script>
<script src="<%=basePath %>/resources/scripts/poi/edit_poiV3.js"></script>
<style>
</style>
<body>
					<input type="hidden" id="excel_id" value="${excel_id}"/>		                      
					<input type="hidden" id="part_id" value="${part_id}"/>		                      
					<input type="hidden" id="template_id" value="${template_id}"/>		                      
                    <div class="widget-body" >
                    	<div class="row-fluid" style="margin-top: 10px;">
                    	 <div class="span6" id="sheel_base_div">
			                <div class="widget blue">
	                      		<div class="widget-title" id ="role_title" >
                       				 	<h4><i class="icon-align-left">编辑模板</i></h4>
                    					</div>
			                      <div class="widget-body">
											 <div class="input-wrap">
											    	 <div class="tLable"><span style="width: 42%;">sheet类型：</span><span style="width: 46%; float: right;" id ="partName_title" >模板名称：</span></div>
											    	 <select id="sheetCat_select"  class="chzn-select" style="width: 45%;" tabindex="-1" onchange="selectSheet();">
											    	 		<option value="all">固定sheet</option>
											    	 		<option value="categery">分类sheet</option>
										            </select>
										            <input type="text" id="partName_content" placeholder="请输入模板名称……"  style=" width: 43%; float: right;" />
											</div>
											 <div class="input-wrap">
												    	 <div class="tLable"><span style="width: 42%;">sheet排序：</span><span style="width: 46%; float: right;" id ="sheetName_title" >sheet名称：</span></div>
												         <input type="text" id="part_sort" placeholder="请输入指定sheet排序……"  style=" width: 43%;"/>
												         <input type="text" id="sheetName_content"  placeholder="请输入固定sheet名称……"  style="width: 43%; float: right;" onblur="getAllSheet();" />
											</div>
											 <div class="input-wrap">
												    	 <div class="tLable"><span style="width: 42%;">excel表头名称：</span><span style="width: 46%; float: right;" id ="sheetName_title" >表头跨行：</span></div>
												         <input type="text" id="cell_head_content" placeholder="请输入excel表头名称……"  style=" width: 43%;"/>
												         <input type="text" id="cell_head_rowspan"  value="0"  style="width: 43%; float: right;"  />
											</div>
										    <div class="input-wrap">
										    	<div class="tLable">sheetSQL：</div>
										    	 <textarea id="sheetSql_input" class="txt" rows="2" style="width: 98%"></textarea>
										    </div>
										    <div class="input-wrap">
										    	 <div class="tLable">dataSQL：</div>
										    	 <textarea  id="dataSql_input"  class="txt" rows="2" style="width:98%"></textarea>
										    </div>
										    <div  style="text-align: right; margin-top: 10px;display: none;" id="sheetCat_div" >
										    	<button id=deleteSheetSql type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="deleteSheetSql();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">清除sheet</span>
										    	</button>
										    	<button id="toSheet" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="toSheet_div();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">编辑sheet</span>
										    	</button>
										    	<button id="toData" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="toData_div();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">编辑data</span>
										    	</button>
										    </div>
			                      </div>
			                 </div>
						</div>
						
				     	
				     	<div class="span6" id="data_baseTables_div" >
							<div class="widget blue" >
									<div class="widget-title" id ="role_title" >
                         				 <h4><i class="icon-align-left">选择data主表</i></h4>
                      				</div>
			                      <div class="widget-body">
			                          <table class="table table-striped table-bordered table-hover" >
						                  <thead>
						                      <tr>
						                      	  <th style="width: 12px; vertical-align: middle;"></th>
						                          <th style="width: 17%" >表编码</th>
						                          <th >表名称</th>
						                          <th style="width: 17%; text-align: center;">创建时间</th>
						                          <th style="width: 80px; text-align: center;">操作</th>
						                      </tr>
						                 </thead>
						                 <tbody id="dataRowBody"></tbody>
						               </table>
						               <div class="pagination pagination-right">
			                                <ul id="dataPageUL"></ul>
			                            </div>
			                      </div>
			                </div>
			            </div>
				     	
						
                   		</div>
                   		
                   		
                    	<div class="row-fluid" style="margin-top: 10px;">
                    		<div class="span6">
								<div class="tabbable">
												<div id="tables_columns_title">
					                            </div>
                         						<div class="tab-content" id="tables_columns_content">
			                        			</div>
	                        	</div>
			                </div>
			                
				        <div class="span6" id="temp_div" style="display: none" >
			                <div class="widget blue">
			                	 <div class="widget-title" id ="temp_title"  >
                      			</div>
			                      <div class="widget-body">
			                      		<div id="data_columns">
				                           <table class="table table-striped table-bordered table-hover" >
							                  <thead>
							                      <tr>
							                          <th style="width: 12%" >所属表名</th>
							                          <th style="width: 12%" >字段编码</th>
							                          <th style="width: 12% " >列名</th>
							                          <th style="width: 12%">开始行</th>
							                          <th style="width: 12%; ">结束行</th>
							                          <th style="width: 12%">开始列</th>
							                          <th style="width: 12%; ">结束列</th>
							                          <th style="width: 12%; ">宽度</th>
							                          <th style="width: 80px; text-align: center;">操作</th>
							                      </tr>
							                 </thead>
							                 <tbody id="excelHead"></tbody>
							               </table>
						            	</div> 
						            	  
						            	  <div id="sheet_columns" hidden>
							                <table class="table table-striped table-bordered table-hover" >
							                  <thead>
							                      <tr>
							                          <th  >所属表名</th>
							                          <th >字段名称</th>
							                          <th >别名</th>
							                          <th style="width: 80px; text-align: center;">操作</th>
							                      </tr>
							                 </thead>
							                 <tbody id="sheetColumnsRowBody"></tbody>
							               </table>
							           </div>
			                      </div>
			                 </div>
			                 <div style="text-align: right; margin-right: -6px;">
								<button id="savePart" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="savePart();">
									 <i class="icon-save"></i>&nbsp;
					    			<span class="ladda-label" style="font-size: 14px;">保存</span>
				    			</button>
				    		 </div>
						</div>
						
						
						
						<!--------------------------------------- 表头添加------------------------------------------------>		                 
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
						                <table id="cells_table" class="table table-bordered table-hover" >
											<tbody id="cells_table_body"></tbody>
						               </table>
								</div>
						  </div>
							<!-- 表头右键菜单 -->
							<div id="cellsTable_menu" class="easyui-menu" style="width:120px;">
							    <div id="left_merge_cell" onclick="left_merge_cell_v3();" >向左合并</div>
							    <div id="down_merge_cell" onclick="down_merge_cell_v3();">向下合并</div>
							    <div id="delete_row" onclick="delete_row_v3();">删除该行</div>
							    <div id="delete_col" onclick="delete_col_v3();">删除该列</div>
							    <div id="edit_property" onclick="edit_property_v3();">选择表字段</div>
							</div>						
                   </div>
            </div>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    	  initFormValid("<%=basePath%>/apppoi/poiUpdate");
    </script>
    <script src="<%=basePath %>/resources/scripts/poi/test2.js"></script>
	
</body>	
	
	
	
