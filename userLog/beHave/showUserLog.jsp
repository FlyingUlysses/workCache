<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<style>
</style>
<body>
	<div style="padding-top: 15px;padding-right: 15px;padding-left: 15px">
	     <table class="table table-striped table-bordered table-hover">
			<thead>
				<tr>
					<th style="width: 12px; vertical-align: middle;"></th>
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

<script type="text/javascript">
	var page={page:1,limit:9};
	$(function(){
		reloadTable();
	});
	function reloadTable(){
		page.oid = "${oid}";
		page.uid = "${uid}";
		page.start_day = "${start_day}";
		page.isLoging = "${isLoging}";
		var url = _basePath + "/beHave/reloadTable";
		$.post(url,page,function(res,status){
			$("#rowBody").empty();
			renderPage("pageUL",page,res.total,reloadTable);
			var data = res.data;
			if(data != null && data.length > 0){
				 var strs = "";
				 $.each(data,function(i,item){
					 strs += "<tr onclick='rowClick(" + item.id + ");'>"
						 + "<td style='text-align: center;'><input class='checkboxes' name='rowRadio' type='radio' value='" + item.id + "' /></td>"
						 + "<td style='vertical-align: middle;'>" + formatNull(item.busi_name) + "</td>"
						 + "<td style='vertical-align: middle;'>" + formatNull(item.action) + "</td>"
						 + "<td style='vertical-align: middle;'>" + formatNull(item.ipaddress) + "</td>"
						 + "<td style='vertical-align: middle;'>" + formatNull(item.remarks) + "</td>"
						 + "<td style='vertical-align: middle;text-align: center;'>" + formatNull(item.create_time) + "</td>"
						 + " </tr>";
				 });
				 $("#rowBody").append(strs);
			 }
		});
	}
</script>
</body>