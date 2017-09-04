<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<link href="<%=basePath %>/resources/bootstrap/datepicker/datepicker.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/bootstrap/datepicker/bootstrap-datepicker.js"></script>
<script src="<%=basePath %>/resources/plugins/jquery.validate.min.js"></script>
<script src="<%=basePath %>/resources/plugins/jquery.validate.messages_cn.js"></script>
<body>
	<form id="editForm" action="#" class="form-horizontal">
		<input type="hidden" name="excel.id" value="${excel.id}" />
		<div class="input-wrap">
	    	 <div class="tLable">excel编码：</div>
	    	 <input type="text" name="excel.busiType" class="txt" value="${excel.type}" required />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable">数据表名称：</div>
	    	 <input type="text" name="excel.name" class="txt" value="${excel.name}" required />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable">备注信息：</div>
	    	 <textarea name="excel.desc"  class="txt" rows="3">${excel.desc}</textarea>
	    </div>
	    <div style="text-align: right; margin-top: 10px;">
	    	<button id="ok" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in">
	    		<span class="ladda-label" style="font-size: 12px;">保存</span>
	    	</button>
	    </div>
	</form>
    <script type="text/javascript">
    	 initFormValid("<%=basePath%>/poiAutoExport/saveExcel",parent.reload);
    	 $("#create_time").datepicker({ format: "yyyy-mm-dd" });
    </script>
</body>