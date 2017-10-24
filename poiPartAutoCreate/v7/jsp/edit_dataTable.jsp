<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<script src="<%=basePath %>/resources/scripts/poi/edit_dataTable.js"></script>
<style>
</style>
<body>
	<div style="display: inline;">
			<div class="span4" id="data_baseTables_div" style="width: 300px;">
							<div class="widget green" >
									<div class="widget-title" id ="role_title" >
                         				 <h4><i class="icon-align-left">选择表格</i></h4>
                         				 <div class="update-btn">
                         				 		<input placeholder="请输入编码……" id="dataTable_code_input" style="width: 100px;margin-bottom: 10px">
							               	  	<button id="select_data_table" type="button" style="margin-bottom: 10px;" class="btn btn-warning" ><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">搜索</span></button>
					               	  	</div>
                      				</div>
			                      <div class="widget-body">
			                          <table class="table table-striped table-bordered table-hover" >
						                  <thead>
						                      <tr>
						                      	  <th style="width: 12px; vertical-align: middle;"></th>
						                          <th style="width: 120px" >编码</th>
						                          <th style="width: 120px; text-align: center;">操作</th>
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
	     
	     <div  style="float: right;width: 660px;margin-right: 10px">
		      <div class="widget green"  >
				   	<div class="widget-title" id ="role_title" >
						    <h4><i class="icon-align-left">表格关系编辑</i></h4>
					</div>
					 <div class="widget-body">
					 	<div style="margin-bottom: 10px;">
			  				  当前主表：
			  				  <div class="input-wrap">
							  		<div style="display: inline;">
								  		<span>别名:</span>
								  		<c:choose>
									  		<c:when test="${list!=null}">
										  		<input id="baseTable_reName" value='${list.get(0).rename}' placeholder="请选择表格.." style="width: 120px;">
									  		</c:when>
									  		<c:otherwise>
									  			<input id="baseTable_reName" value='' placeholder="请选择表格.." style="width: 120px;">
									  		</c:otherwise>
								  		</c:choose>
								  	</div>
							  		<div style="display: inline;">
								  		<span>表名:</span>
								  			<c:choose>
									  		<c:when test="${list!=null}">
										  		<input id="baseTable_name" value='${list.get(0).name }'  placeholder="请选择表格.." style="width: 220px;" >
									  		</c:when>
									  		<c:otherwise>
									  			<input id="baseTable_name"  placeholder="请选择表格.." style="width: 220px;" >
									  		</c:otherwise>
								  		</c:choose>
								  	</div>
							 </div>
						</div>
						 附属表格：
							 <div class="input-wrap" id="joinTable_div">
							 	<c:choose>
							 		<c:when test="${list!=null}">
							 			<c:forEach items="${list }" begin="1" var="item">
							 				<div name="join_table_columns" style="margin-top: 3px;"><div style="display: inline-block;"><span>别名:</span><input value="${item.rename }" name="joinTable_reName" placeholder="请输入别名.." style="width: 60px;"></div><div style="display: inline-block;margin-left:3px;"><span>表名:</span><input value="${item.name }" placeholder="请输入表名.." name="joinTable_name" style="width: 185px;"></div> <div style="display: inline-block;margin-left:3px;"><span>连接条件:</span><input name="joinTable_link" value="${item.link }" placeholder="请输入连接条件.." style="width: 185px;"></div><div style="display: inline-block;margin-left:6px;"><button type="button" onclick="rmvLink(this);"><i class="icon-minus"></i></button></div></div>
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
	