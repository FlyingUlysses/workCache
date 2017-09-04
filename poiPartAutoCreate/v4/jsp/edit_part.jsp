<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
<script src="<%=basePath %>/resources/scripts/poi/edit_poi.js"></script>
<style>
<!--

-->
</style>
<body>
	<input type="hidden" id="part_id" value="${part.id}"/>		                      
	<input type="hidden" id="part_excel_id" value="${part.excel_id}"/>		                      
	<input type="hidden" id="template_id" value="${part.template}"/>		                      
	<div class="widget-body" >
	    <div class="row-fluid" style="margin-top: 10px;">
	    	 <div class="span4" >
	                <div class="widget blue">
                     		<div class="widget-title" id ="role_title" >
                     				 	<h4><i class="icon-align-left">编辑模板</i></h4>
                  					</div>
	                      <div class="widget-body">
									 <div class="input-wrap">
									    	 <div class="tLable"><span style="width: 42%;">sheet类型：</span><span style="width: 46%; float: right;" id ="partName_title" >模板名称：</span></div>
									    	 <select id="sheetCat_select"  class="chzn-select" style="width: 45%;" tabindex="-1" onchange="selectSheet();">
									    	 		<c:choose>
									    	 			<c:when test="${part.isFixed!=null && part.isFixed==1 }">
											    	 		<option value="all" selected="selected">固定sheet</option>
											    	 		<option value="categery">分类sheet</option>
									    	 			</c:when>
									    	 			<c:otherwise>
									    	 				<option value="all" >固定sheet</option>
											    	 		<option value="categery" selected="selected">分类sheet</option>
									    	 			</c:otherwise>
									    	 		</c:choose>
								            </select>
								            <input type="text" id="partName_content" placeholder="请输入模板名称……" value="${part.name }" style=" width: 43%; float: right;" />
									</div>
									 <div class="input-wrap">
										    	 <div class="tLable"><span style="width: 42%;">sheet排序：</span><span style="width: 46%; float: right;" id ="sheetName_title" hidden>sheet名称：</span></div>
										         <input type="text" id="part_sort" value="${part.sort }" placeholder="请输入指定sheet排序……"  style=" width: 43%;"/>
								            	<input type="text" id="sheetName_content" value="${part.sheet}" placeholder="请输入固定sheet名称……"  style="display:none; width: 43%; float: right;" />
									</div>
								      <div class="input-wrap" id="sheet_content">
								     </div>
								    <div class="input-wrap">
								    	<div class="tLable">sheetSQL：</div>
								    	 <textarea id="sheetSql_input"  class="txt" rows="3" style="width: 98%">${part.sheet_sql }</textarea>
								    </div>
								    <div class="input-wrap">
								    	 <div class="tLable">dataSQL：</div>
								    	 <textarea  id="dataSql_input"  class="txt" rows="6" style="width:98%">${part.data_sql }</textarea>
								    </div>
								    
								     <div style="text-align: right; margin-right: -6px;">
										<button id="toAddPart" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="toAddPart();">
							 			<i class="icon-pencil"></i>&nbsp;<span class="ladda-label" style="font-size: 14px;">重制模板</span></button>
		    						 </div>
	                      </div>
					</div>
	    	 </div>
	    	 
	    	 <div class="span8">
	                <div class="widget blue">
	                	 <div class="widget-title" id ="role_title" >
                       				 <h4><i class="icon-align-left">编辑cell</i></h4>
                    			</div>
	                      <div class="widget-body">
	                           <table class="table table-striped table-bordered table-hover">
				                  <thead>
				                      <tr>
				                          <th style="width: 12%" >列名</th>
				                          <th style="width: 12%" >编码</th>
				                          <th style="width: 12% " >宽度</th>
				                          <th style="width: 12%; ">开始行</th>
				                          <th style="width: 12%; ">开始列</th>
				                          <th style="width: 12%; ">结束行</th>
				                          <th style="width: 12%; ">结束列</th>
				                      </tr>
				                 </thead>
				                 <tbody id="cells_content"></tbody>
				               </table>
	                      </div>
	                 </div>
	                 <div style="text-align: right; margin-right: -6px;">
						<button id="savePart" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="savePart();">
							 <i class="icon-save"></i>&nbsp;
			    			<span class="ladda-label" style="font-size: 14px;">保存</span>
		    			</button>
		    		 </div>
			</div>
	    </div>         	
	</div>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    	  initFormValid("<%=basePath%>/poiAutoExport/saveExcel");
    </script>
</body>	
