<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/default/easyui.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>/resources/easyui/themes/icon.css">
<script src="<%=basePath %>/resources/easyui/jquery.easyui.min.js"></script>
<script src="<%=basePath %>/resources/scripts/poi/edit_part.js"></script>
<style>
	.cannotselect{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;-khtml-user-select:none;user-select:none;}td.selected{background:#0094ff;color:#fff}td.hide{display:none}
</style>
<body>
					<input type="hidden" id="excel_id" value="${excel_id}"/>		                      
					<input type="hidden" id="part_id" value="${part.id}"/>		                      
					<input type="hidden" id="template_id" value="${part.template}"/>		                      
                 <div class="row-fluid" style="margin-top: 10px;">
                     <div class="span12" id="sheet_base_div">
			                <div class="widget blue">
	                      		<div class="widget-title" id ="role_title" >
                       				 	<h4><i class="icon-align-left">编辑模板</i></h4>
                    					</div>
			                      <div class="widget-body">
											 <div class="input-wrap">
											    	 <div class="tLable"><span style="width: 40%;">sheet类型：</span><span style="width: 42%; float: right;" id ="partName_title" >模板名称：</span></div>
											    	 <select id="sheetCat_select"  class="chzn-select" style="width: 41.5%;"   onchange="selectSheet();">
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
										            <input type="text" id="partName_content" placeholder="请输入模板名称……" value="${part.name }" style=" width: 41%; float: right;" />
											</div>
											 <div class="input-wrap">
												         <c:choose>
												         	<c:when test="${part.isFixed ==1 }">
														    	 <div class="tLable"><span style="width: 40%;">sheet排序：</span><span style="width: 40%; float: right;" id ="sheetName_title" >sheet名称：</span></div>
														         <input type="number" id="part_sort" placeholder="请输入指定sheet排序……" value="${part.sort }" style=" width: 40%;"/>
												         		<input type="text" id="sheetName_content"  placeholder="请输入固定sheet名称……" value="${part.sheet }" style="width: 41%; float: right;" onblur="getAllSheet();"  />
												         	</c:when>
												         	<c:otherwise>
														    	 <div class="tLable"><span style="width:40%;">sheet排序：</span><span style="width: 42%; float: right; display: none" id ="sheetName_title" >sheet名称：</span></div>
														         <input type="number" id="part_sort" placeholder="请输入指定sheet排序……" value="${part.sort }" style=" width: 40%;"/>
												         		 <input type="text" id="sheetName_content"  placeholder="请输入固定sheet名称……" value="${part.sheet }" style="width: 41%; float: right;display:none;"  onblur="getAllSheet();"  />
												         	</c:otherwise>
												         </c:choose>
											</div>
											<div  class="input-wrap">
											    <div class="" style="display:inline-block;width:40%;margin-right:18%;">
											    	<div class="tLable">sheetSQL：
											    		<div style="float: right">
											    				<c:choose>
												    	 			<c:when test="${part.isFixed ==1 }">
											    							<button id="choseShettTable" type="button" style="margin-right: 6px;display:none;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="editShettTable();">
												    	 			</c:when>
												    	 			<c:otherwise>
											    							<button id="choseShettTable" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="editShettTable();">
												    	 			</c:otherwise>
											    	 			</c:choose>
												    				<span class="ladda-label" style="font-size: 12px;">选择数据表</span>
												    			</button>
												    	 		<button id="test_sheetSql" type="button" style="text-align: right;margin-bottom: 5px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testSheetSql();">
													    		<span class="ladda-label" style="font-size: 10px;">测试Sql</span>
													    		</button>
													    	</div>
											    	</div>
											    	 <textarea id="sheetSql_input" class="txt" rows="8" style="width: 98%">${part.sheet_sql }</textarea>
											    </div>
											    <div class="" style="display:inline-block;width:41%;">
											    	 <div class="tLable">dataSQL：
											    	 		<div style="float: right">
											    	 			<button id="choseDataTable" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="choseDataTable();">
												    				<span class="ladda-label" style="font-size: 12px;">选择数据表</span>
												    			</button>
												    	 		<button id="test_dataSql" type="button" style="text-align: right;margin-bottom: 5px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testDataSql();">
													    		<span class="ladda-label" style="font-size: 10px;">测试Sql</span>
													    		</button>
													    	</div>
												    </div>
											    	 <textarea  id="dataSql_input"  class="txt" rows="8" style="width:98%">${part.data_sql }</textarea>
											    </div>
											 </div>
										    <div  style="text-align: right; margin-top: 10px;" id="create_button_div" >
										    <c:choose>
											    <c:when test="${isEdit ==1 }">
											    	<div id="testExport_div" style="display: inline;">
											    </c:when>
											    <c:otherwise>
											   	    <div id="testExport_div" style="display: none;">
											    </c:otherwise>
										    </c:choose>
												    <button id="testExport" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="testExport();">
												    	 <i class="icon-save"></i>&nbsp;
											    		<span class="ladda-label" style="font-size: 12px;">测试导出</span>
											    	</button>
											    </div>
										    	<button id="saveAll" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="savePartAndCells();">
										    		 <i class="icon-save"></i>&nbsp;
										    		<span class="ladda-label" style="font-size: 12px;">保存</span>
										    	</button>
										   </div>
			                      </div>
			                 </div>
						</div>
					</div>		
			            	
			<!--------------------------------------- 表头添加 ------------------------------------------------>		                 
			      <div class="row-fluid" style="margin-top: 10px;display: inline;">		 
					 <div class="span9" style="width: 1030px;" >
					     <div class="widget blue" id="cells_table_div" >
								<div class="widget-title" id ="role_title" >
					               	 <h4><i class="icon-align-left">Excel表头编辑</i></h4>
					               	  <div class="update-btn">
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableRow_v3();"></i>&nbsp;<span style="font-size: 12px;">增加行</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="addCellTableCol_v3();"></i>&nbsp;<span style="font-size: 12px;">增加列</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" id="mergeCellButton"></i>&nbsp;<span style="font-size: 12px;">合并单元格</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="splitCell();"></i>&nbsp;<span style="font-size: 12px;">拆分</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="rmvRow();"></i>&nbsp;<span style="font-size: 12px;">删除选中行</span></button>
					               	  	<button  type="button" style="margin-bottom: 10px;" class="btn btn-warning" onclick="delete_col();"></i>&nbsp;<span style="font-size: 12px;">删除尾列</span></button>
					               	  </div>
					            </div>
								<div class="widget-body">
										<table id="cells_table" class="table table-bordered" style="">
											<tbody id="cells_table_body"></tbody>
						               </table>
								</div>
						  </div>
					</div>
			<!------------------------------------------------- 表头右侧选框菜单----------------------------------------- -->
					 <div  style="float: right;width: 260px;margin-right: 10px;display: inline;">
					      <div class="widget green"  >
							   	<div class="widget-title" id ="role_title" >
									    <h4><i class="icon-align-left">字段编辑</i></h4>
								</div>
								 <div class="widget-body">
								 	<table>
										  <tr>
									  			<td >单元格：</td>
										        <td><input id="cell_reColumn" placeholder="请输入单元格名称..." type="text" style="width:140px"></td>
										 </tr>
									  	 <tr>
									  			<td style="width: 65px">表格：</td>
									            <td>
									            	<select  id="data_table"  data-placeholder="暂无表格..." class="chzn-select" tabindex="-1" style="width: 150px" onchange="loadColumn();" required>
						      						</select>
						      					</td>
										  </tr>
										  <tr>
									  				<td >字段选择：</td>
									  				<td>
											            <select  id="data_column"  data-placeholder="暂无字段..." class="chzn-select" tabindex="-1" onchange="loadReName();" style="width: 150px" required>
								      					</select>
							      					</td>
										  </tr>
										  <tr>
									  			<td><span >字段编辑：</span></td>
										        <td><input id="editColumn" placeholder="请输入伪列或编辑字段..." type="text" style="width: 140px"></td>
										  </tr>
										  <tr>
									  			<td >字段别名：</td>
										        <td><input id="data_reColumn" placeholder="请输入别名..." type="text" style="width: 140px"></td>
										 </tr>
									</table>
										 <div  style="text-align: right; margin-top: 10px;"  >
											 <button id="save" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="saveCellContent();">
									    		 <i class="icon-save"></i>&nbsp;
									    		<span class="ladda-label" style="font-size: 12px;">保存</span>
									    	</button>
									    </div>
								</div>
						 </div>
					</div>
					
		</div>	
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    </script>
    <script src="<%=basePath %>/resources/scripts/poi/moveMergeCell.js"></script>
	
</body>	
	
	
	
