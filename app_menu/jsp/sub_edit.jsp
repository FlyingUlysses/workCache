<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<script src="<%=basePath %>/resources/plugins/jquery.validate.min.js"></script>
<script src="<%=basePath %>/resources/plugins/jquery.validate.messages_cn.js"></script>
<style>
<!--
		#opened_select_chzn{ width: 207px;float: right !important;}
-->
</style>
<body>
	<form id="editForm" action="#" class="form-horizontal">
		<input type="hidden" name="menu.id" value="${menu.id}">
			    <div class="input-wrap">
	    	 <div class="tLable"><span style="width: 42%;">菜单名称：</span><span style="width: 46%; float: right;">菜单编码：</span></div>
	    	 <input type="text" name="menu.name" class="txt" value="${menu.name}" style="width: 42%;" />
	    	 <input type="text" name="menu.code" class="txt" value="${menu.code}" style="width: 42%; float: right;" />
	    </div>
	    <div class="input-wrap">
	    	 <div class="tLable"><span style="width: 42%;">菜单图片：</span><span style="width: 46%; float: right;">菜单排序：</span></div>
	    	 <input type="text" name="menu.image" class="txt" value="${menu.image}" style="width: 42%;" />
	    	 <input type="text" name="menu.sort" class="txt" value="${menu.sort}" style="width: 42%; float: right;" />
	    </div>
	   
	    
	    <div class="input-wrap">
	    	<div class="tLable"><span style="width: 42%;">上级菜单：</span><span style="width: 46%; float: right;">开放状态：</span></div>
	    	<select id="category_select" name="menu.category" class="chzn-select" style="width: 45%;" tabindex="-1">
                     <option value=""></option>
                     <c:forEach items="${roots}" var="item">
                     		<c:choose>
                     			<c:when test="${!empty menu.category && menu.category == item.code}">
                     				<option value="${item.code}" selected="selected">${item.name}</option>
                     			</c:when>
                     			<c:otherwise>
									<option value="${item.code}">${item.name}</option>                               			
                     			</c:otherwise>
                     		</c:choose>
                     </c:forEach>
            </select>
            <select name="menu.opened" class="chzn-select" style="width: 45%; margin-right: 10px; float: right;" tabindex="-1" id="opened_select" onchange="set_message();">
	    	 	 <option value=""></option>
	    	     <c:choose>
                      <c:when test="${!empty menu.opened && menu.opened == 1}">
                          <option value="1" selected="selected">开放</option>
                          <option value="0">未开放</option>
                      </c:when>
                      <c:when test="${!empty menu.opened && menu.opened == 0}">
                     	  <option value="1">开放</option>
                          <option value="0" selected="selected">未开放</option>
                      </c:when>
                      <c:otherwise>
                      	 <option value="1">开放</option>
                  		 <option value="0">未开放</option>	
                      </c:otherwise>
                  </c:choose>
            </select>
	    </div>
	    
	     <div class="input-wrap">
	    	 <div class="tLable">菜单路径：</div>
	    	 <input type="text" name="menu.url" class="txt" value="${menu.url}" />
	    </div>
	    
	
	      <div class="input-wrap" id="message_div" hidden>
	    	 <div class="tLable">提醒信息：</div>
	    	 <textarea name="menu.message" value="${menu.message}" class="txt" rows="3">${menu.message}</textarea>
	    </div>
	    <div style="text-align: right; margin-top: 10px;">
	    	<button id="ok" type="button" style="margin-right: 6px;" class="btn btn-success ladda-button" data-style="zoom-in">
	    		<span class="ladda-label" style="font-size: 12px;">保存</span>
	    	</button>
	    </div>
	</form>
    <script type="text/javascript">
    	  $(".chzn-select").chosen();
    	  initFormValid("<%=basePath%>/appMenu/subUpdate");
    	  
    	  
      $(function() {
    	  	set_message();
    	  });
    	  function set_message(){
    	  	if($("#opened_select").val()==0){
    	  		$("#message_div").show();
    	  	}else if($("#opened_select").val()==1) {
    	  		$("#message_div").hide();
    	  	}
    	  } 
    </script>
</body>