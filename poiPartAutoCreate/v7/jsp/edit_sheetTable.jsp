<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<script src="<%=basePath %>/resources/scripts/poi/edit_sheetTable.js"></script>
<style>
</style>
<body>
	<div style="display: inline;">
		 <div class="span5" id="sheet_baseTables_div"  style="width: 410px;">
					<div class="widget green" >
							<div class="widget-title" id ="role_title" >
	                      				 <h4><i class="icon-align-left">选择表格</i></h4>
	                      				 <div class="update-btn">
	                      				 		<input placeholder="请输入名称……" id="sheetTable_name_input" style="width: 110px;margin-bottom: 10px">
	                      				 		<input placeholder="请输入编码……" id="sheetTable_code_input" style="width: 110px;margin-bottom: 10px">
					               	  	<button id="select_sheet_table" type="button" style="margin-bottom: 10px;" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">搜索</span></button>
			               	  	</div>
	                   				</div>
	                      <div class="widget-body">
	                          <table class="table table-striped table-bordered table-hover" >
				                  <thead>
				                      <tr>
			                      	 	 <th style="width: 12px; vertical-align: middle;"></th>
					                          <th style="width: 120px" >编码</th>
					                          <th >表名称</th>
					                          <th style="width: 120	px; text-align: center;">操作</th>
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
	     
	     
	       <div  style="float: right;width: 550px;margin-right: 10px">
		      <div class="widget green"  >
					 <div class="widget-body">
					 	<div style="margin-bottom: 10px;">
			  				  当前主表：
			  				  <div class="input-wrap">
							  		<div style="display: inline;margin-left: 20px;">
								  		<span>表名:</span>
								  		<c:choose>
									  		<c:when test="${list!=null}">
										  		<input id="baseTable_name" value='${list.get(0).name}' placeholder="请选择表格.." style="width: 120px;" >
									  		</c:when>
									  		<c:otherwise>
										  		<input id="baseTable_name" placeholder="请选择表格.." style="width: 120px;" >
									  		</c:otherwise>
								  		</c:choose>
								  	</div>
							  		<div style="display: inline;">
								  		<span>别名:</span>
								  		<c:choose>
									  		<c:when test="${list!=null}">
								  				<input id="baseTable_reName" value="${list.get(0).rename }" placeholder="请选择表格.." style="width: 120px;">
									  		</c:when>
									  		<c:otherwise>
								  				<input id="baseTable_reName" value="t" placeholder="请选择表格.." style="width: 120px;">
									  		</c:otherwise>
									  	</c:choose>
								  	</div>
							 </div>
						</div>
						 附属表格：
						 <div id="joinTable_div">
						 	<c:choose>
							 		<c:when test="${list!=null}">
							 			<c:forEach items="${list }" begin="1" var="item">
							 				<div class="input-wrap" name="join_table_columns"><div style="display: inline;margin-left: 20px;"><span>表名:</span><input name="joinTable_name" value="${item.name }" style="width: 110px;"></div> <div style="display: inline;margin-left:3px;"><span>别名:</span><input name="joinTable_reName" value="${item.rename }" style="width: 80px;"></div> <div style="display: inline;"><span>连接条件:</span><input value="${item.link }" style="width: 110px;" name="joinTable_link"></div><div style="display: inline-block;margin-left:6px;"><button type="button" onclick="rmvLink(this);"><i class="icon-minus"></i></button></div></div>
							 			</c:forEach>
							 		</c:when>
							 </c:choose>
						 </div>
						  <div  style="text-align: center;margin-top:3px;"  >
							 	 <button  type="button" class="btn btn-success ladda-button" data-style="zoom-in" onclick="choseJoinTable();">
			    		 			<i class="icon-plus"></i>
			    				 </button>
		    			</div>
					</div>
			      	<div  style="text-align: right; margin-top: 10px;"  >
						 <button id="save" type="button" style="margin-right: 6px;margin-bottom: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="saveTable();">
				    		<span class="ladda-label" style="font-size: 12px;">确定</span>
				    	</button>
				    </div>
			 </div>
		</div>
	     
	     
	     <div  style="float: right;width: 550px;margin-right: 10px">
		      <div class="widget green"  >
		      		 <div class="widget-body">
					<table>
			  			<tr><td>sheet表名：</td>
			            	<td width="150px">
				            	<select  id="id_table"  data-placeholder="请先确定表格关系..." class="chzn-select" tabindex="-1" style="width: 98%" onchange="loadSheetColumns(this);" required>
	      						</select>
      						</td>
      						<td ><div style="margin-left: 25px">id字段：</div></td>
				  			<td width="150px">
					            <select  id="sheet_table_id"  data-placeholder="清先选择表格..." class="chzn-select" tabindex="-1" onchange="selectSheetId();" style="width: 98%" required>
		      					</select>
		      				</td>
      					</tr>
      					
				  		<tr><td>sheet表名：</td>
				            	<td width="150px">
					            	<select  id="name_table"  data-placeholder="请先确定表格关系..." class="chzn-select" tabindex="-1" style="width: 98%" onchange="loadSheetColumns(this);" required>
		      						</select>
	      						</td>
				  				<td><div style="margin-left: 25px">name字段：</div></td>
				  				<td width="150px">
						            <select  id="sheet_table_name"  data-placeholder="清先选择表格..." class="chzn-select" tabindex="-1"  onchange="selectSheetName();" style="width: 98%" required>
			      					</select>
			      				</td>
			      		</tr>
				 </table>
			 </div>
		 </div>
			 
			 
		 <div  style="text-align: right; margin-top: 10px;"  >
			 <button id="save" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in" onclick="save();">
	    		 <i class="icon-save"></i>&nbsp;
	    		<span class="ladda-label" style="font-size: 12px;">保存</span>
	    	</button>
	    </div>
	    
	</div>
	<input type="hidden" id="sheetSql_input" value=""/>
	<script type="text/javascript">
    	  $(".chzn-select").chosen();
    </script>
</body>	
	