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
					<input type="hidden" id="part_id" value="${part.id}"/>		                      
					<input type="hidden" id="template_id" value="${part.template}"/>		                      
                    	<div class="row-fluid" style="margin-top: 10px;">
                    	
                    	 <c:choose>
				         	<c:when test="${part.isFixed ==1 }">
                    			 <div class="span6" id="sheet_base_div">
				         	</c:when>
				         	<c:when test="${isEdit !=null && isEdit ==1 }">
                    			 <div class="span12" id="sheet_base_div">
				         	</c:when>
				         	<c:otherwise>
                    			 <div class="span5" id="sheet_base_div">
				         	</c:otherwise>
				        </c:choose>
			                <div class="widget blue">
	                      		<div class="widget-title" id ="role_title" >
                       				 	<h4><i class="icon-align-left">编辑模板</i></h4>
                    					</div>
			                      <div class="widget-body">
											 <div class="input-wrap">
											    	 <div class="tLable"><span style="width: 42%;">sheet类型：</span><span style="width: 46%; float: right;" id ="partName_title" >模板名称：</span></div>
											    	 <select id="sheetCat_select"  class="chzn-select" style="width: 45%;"   onchange="selectSheet();">
											    	 		<c:choose>
											    	 			<c:when test="${part.isFixed ==1 }">
												    	 			<option value="categery" >分类sheet</optdion>
												    	 			<option value="all" selected="selected">固定sheet</option>
											    	 			</c:when>
											    	 			<c:otherwise>
												    	 			<option value="categery" selected="selected">分类sheet</option>
												    	 			<option value="all">固定sheet</option>
											    	 			</c:otherwise>
											    	 		</c:choose>
										            </select>
										            <input type="text" id="partName_content" placeholder="请输入模板名称……" value="${part.name }" style=" width: 43%; float: right;" />
											</div>
											 <div class="input-wrap">
												         <c:choose>
												         	<c:when test="${part.isFixed ==1 }">
														    	 <div class="tLable"><span style="width: 42%;">sheet排序：</span><span style="width: 46%; float: right;" id ="sheetName_title" >sheet名称：</span></div>
														         <input type="number" id="part_sort" placeholder="请输入指定sheet排序……" value="${part.sort }" style=" width: 43%;"/>
												         		<input type="text" id="sheetName_content"  placeholder="请输入固定sheet名称……" value="${part.sheet }" style="width: 43%; float: right;" onblur="getAllSheet();"  />
												         	</c:when>
												         	<c:otherwise>
														    	 <div class="tLable"><span style="width: 42%;">sheet排序：</span><span style="width: 46%; float: right; display: none" id ="sheetName_title" >sheet名称：</span></div>
														         <input type="number" id="part_sort" placeholder="请输入指定sheet排序……" value="${part.sort }" style=" width: 43%;"/>
												         		 <input type="text" id="sheetName_content"  placeholder="请输入固定sheet名称……" value="${part.sheet }" style="width: 43%; float: right;display:none;"  onblur="getAllSheet();"  />
												         	</c:otherwise>
												         </c:choose>
											</div>
										    <div class="input-wrap">
										    	<div class="tLable">sheetSQL：
										    		<div style="float: right">
											    	 		<button id="test_sheetSql" type="button" style="text-align: right;margin-bottom: 5px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testSheetSql();">
												    		 <i class="icon-save"></i>&nbsp;
												    		<span class="ladda-label" style="font-size: 10px;">测试Sql</span>
												    		</button>
												    	</div>
										    	</div>
										    	 <textarea id="sheetSql_input" class="txt" rows="2" style="width: 98%">${part.sheet_sql }</textarea>
										    </div>
										    <div class="input-wrap">
										    	 <div class="tLable">dataSQL：
										    	 		<div style="float: right">
											    	 		<button id="test_dataSql" type="button" style="text-align: right;margin-bottom: 5px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testDataSql();">
												    		 <i class="icon-save"></i>&nbsp;
												    		<span class="ladda-label" style="font-size: 10px;">测试Sql</span>
												    		</button>
												    	</div>
											    </div>
										    	 <textarea  id="dataSql_input"  class="txt" rows="3" style="width:98%">${part.data_sql }</textarea>
										    </div>
										    <div  style="text-align: right; margin-top: 10px;" id="create_button_div" >
											    <div  style="margin-top: 10px;display: inline" id="edit_status_div" >
											    	<button id="editSheet" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="editSheet();">
											    		 <i class="icon-save"></i>&nbsp;
											    		<span class="ladda-label" style="font-size: 12px;">编辑sheetSql</span>
											    	</button>
											    	<button id="editData" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="editData();">
											    		 <i class="icon-save"></i>&nbsp;
											    		<span class="ladda-label" style="font-size: 12px;">编辑dataSql</span>
											    	</button>
											    </div>
											    <button id="cleanSql" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="cleanSql();">
											    		 <i class="icon-save"></i>&nbsp;
											    		<span class="ladda-label" style="font-size: 12px;">清除Sql</span>
											    </button>
										    	<button id="saveAll" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="savePartAndCells();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">保存</span>
										    	</button>
										   </div>
										    <div  style="text-align: right; margin-top: 10px;display: none" id="edit_button_div" >
										    	<button id="testExport" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testExport();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">测试导出</span>
										    	</button>
										    	<button id="saveAll" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="toCreate();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">重构</span>
										    	</button>
										    	<button id="saveAll" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="savePartAndCells();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">保存</span>
										    	</button>
										   </div>
			                      </div>
			                 </div>
						</div>
						
						
				     <div class="span5" id="sheet_baseTables_div" >
							<div class="widget blue" >
									<div class="widget-title" id ="role_title" >
                         				 <h4><i class="icon-align-left">选择sheet主表</i></h4>
                         				 <div class="update-btn">
                         				 		<input placeholder="请输入表名称……" id="sheetTable_name_input" style="width: 105px;margin-bottom: 10px">
                         				 		<input placeholder="请输入表编码……" id="sheetTable_code_input" style="width: 105px;margin-bottom: 10px">
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
						                          <th style="width: 17%; text-align: center;">创建时间</th>
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
						
						
						
     			
			            	
			           <c:choose>
				         	<c:when test="${part.isFixed ==1 }">
					         	<div   id="sheet_column_div"  style="display: none" >
				         	</c:when>
				         	<c:otherwise>
					         	<div  class="span2" id="sheet_column_div" >
				         	</c:otherwise>
				        </c:choose>
								  <div class="widget blue"  >
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
							</div>
			            
                	</div>
				
			<!--------------------------------------- 表头添加 ------------------------------------------------>		                 
					     <div class="widget blue" id="cells_table_div"  style="display: none">
								<div class="widget-title" id ="role_title" >
					               	 <h4><i class="icon-align-left">Excel导出功能列表</i></h4>
					               	  <div class="update-btn">
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="editCellName_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">编辑内容</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="saveCellName_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;" ">保存至表格</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableRow_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">增加行</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableCol_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">增加列</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="delete_row_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">删除最后行</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="delete_col_v3();"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">删除最后列</span></button>
					               	  </div>
					            </div>
								<div class="widget-body">
						                <table id="cells_table" class="table table-bordered table-hover" >
											<tbody id="cells_table_body"></tbody>
						               </table>
								</div>
						  </div>
			<!------------------------------------------------- 表头右键菜单----------------------------------------- -->
						<div id="cellsTable_menu" class="easyui-menu" style="width:120px;">
						    <div id="left_merge_cell" onclick="left_merge_cell_v3();" >向右合并</div>
						    <div id="down_merge_cell" onclick="down_merge_cell_v3();">向下合并</div>
						    <div id="edit_property" >选择表字段</div>
						</div>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    	  initFormValid("<%=basePath%>/apppoi/poiUpdate");
    </script>
    <script src="<%=basePath %>/resources/scripts/poi/moveMergeCell.js"></script>
	
</body>	
	
	
	
