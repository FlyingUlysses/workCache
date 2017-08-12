<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<script src="<%=basePath %>/resources/plugins/jquery.validate.min.js"></script>
<script src="<%=basePath %>/resources/plugins/jquery.validate.messages_cn.js"></script>
<body>
	<form id="editForm" action="#" class="form-horizontal">
		<input type="hidden" name="dict.id" value="${dict.id}" />
		<input type="hidden" name="dict.type" value="I" />
		<div class="input-wrap">
	    	 <div class="tLable">菜单组名称：</div>
	    	 <input type="text" name="dict.name" class="txt" value="${dict.name}" required />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable">菜单编码：</div>
	    	 <input type="text" name="dict.code" class="txt" value="${dict.code}" required />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable">菜单组排序：</div>
	    	 <input type="text" name="dict.thesort" class="txt" value="${dict.thesort}" required />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable">备注信息：</div>
	    	 <textarea name="dict.remarks" value="${dict.remarks}" class="txt" rows="3">${dict.remarks}</textarea>
	    </div>
	    <div style="text-align: right; margin-top: 10px;">
	    	<button id="ok" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in">
	    		<span class="ladda-label" style="font-size: 12px;">保存</span>
	    	</button>
	    </div>
	</form>
    <script type="text/javascript">
    	 initFormValid("<%=basePath%>/appMenu/parentUpdate");
    </script>
</body>