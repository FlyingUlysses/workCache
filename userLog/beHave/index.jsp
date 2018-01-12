<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/my97DatePicker/WdatePicker.js"></script>
<script src="<%=basePath%>/resources/Highcharts/highcharts.js"></script>
<script src="<%=basePath %>/resources/scripts/core/beHave.js"></script>
<style>
<!--
.widget { clear: none; }
a, a:hover {
    text-shadow: none !important;
    color: #0c4d6d;
}
-->
</style>
<body>
	<div class="span2" style="width: 265px;margin-left: 6px;">
		<div class="widget green">
			 <div class="widget-title">
			 	<h4><i class="icon-align-left"> 公司架构</i></h4>
			 </div>
             <div class="widget-body">
              		<div id="jstree"></div>
             </div>
  		</div>
     </div>
	
	<div  style="margin-left: 295px;margin-top: 5px;" >
		<div class="row-fluid">
                <div class="widget green" style="margin-right: 10px;">
                      <div class="widget-title">
                          <h4><i  class="icon-align-left"><span id="title"></span></i></h4>
                          <input type="text" id="start_date" placeholder="选择账期" value="${day}"  style="width:85px;height:18px;margin-top: 5px;" onFocus="WdatePicker({startDate:'%y-%M',dateFmt:'yyyy-MM',alwaysUseStartDate:true})"/>
                       	  <button id="clear" type="button" style="margin-top: 3px;margin-bottom: 10px;margin-left: 2px;" class="btn btn-warning"><i class="icon-rotate-left"></i>&nbsp;<span style="font-size: 12px;">重置</span></button> 
                          <button id="search" type="button" style="margin-top: 3px;margin-bottom: 10px;" class="btn btn-warning"><i class="icon-search"></i>&nbsp;<span style="font-size: 12px;">查询</span></button>
                      	  <div style="float: right;">
                      	  		<ul class="nav nav-tabs" >
									<li class="active"><a data-toggle="tab" href="#rptTable_div" onclick="changeType(null,true);" >登录统计</a></li>
									<li ><a data-toggle="tab" href="#rptTable_div" onclick="changeType(1,false);">Web菜单使用</a></li>
									<li ><a data-toggle="tab" href="#rptTable_div" onclick="changeType(2,false);">App菜单使用</a></li>
								</ul>
                      	  </div>
                      </div>
     	<div class="widget-body" style="padding-bottom: 5px;">
         	  <div >
				     <div class="bs-docs-example" style="display: inline-block;width: 100%;">
						
				        <div class="tab-content" >
					          <!-- 组织柱状图 -->
					           	<div id="rptTable_div"  class="tab-pane fade in active">
						           	<div class="widget green" style="border: 1px solid #f5f5f5;">
						           		<div class="widget-body" >
				                         	<div id="barChart" style="height: 200px;"></div>
						           		</div>
						           	</div>
						         <!-- 折线图 -->
					           		<div class="widget green" style="display: none;border: 1px solid #f5f5f5;" id="lineChart_div">
					           			<div class="widget-body" >
			                         		<div id="lineChart" style="height: 200px;"></div>
			                         	</div>
						           	</div>
						        <!-- 表格 -->
						           	 <div class="widget blue" style="display: none;" id="table_div">
					               		 <div class="widget-title">
					               		 	 <h4><i  class="icon-align-left"><span id="table_title"></span></i></h4>
					               		 </div>
						           		<div class="widget-body" >
						           		<table class="table table-striped table-bordered table-hover">
											<thead>
												<tr>
													<th style="width: 12px; vertical-align: middle;"></th>
													<th style='vertical-align: middle;'>用户名称</th>
													<th style='vertical-align: middle;'>业务类型</th>
													<th style='vertical-align: middle;'>数据操作</th>
													<th style='vertical-align: middle;'>ip地址</th>
													<th style='vertical-align: middle;'>备注</th>
													<th style="vertical-align: middle;text-align: center;">创建时间</th>
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
	                            
	                      </div>
                      </div>
                      
                     </div> 
                 </div>
                 
                 
                
				
				
		</div>
<script type="text/javascript">
</script>
</body>	
