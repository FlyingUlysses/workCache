<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="../../include/include.jsp"%>
<style>
<!--
	.table th, .table td { padding: 7px !important; }
-->
</style>
<link href="<%=basePath%>/resources/jsTree/themes/default/style.min.css" rel="stylesheet" />
<script src="<%=basePath %>/resources/jsTree/jstree.min.js"></script>
<script src="<%=basePath %>/resources/scripts/core/appMenu.js"></script>
<body>
	<div class="container-fluid">
		<div class="row-fluid">
			<div class="span7">
				<div class="widget green">
                      <div class="widget-title">
                          <h4><i class="icon-align-left"></i>手机菜单</h4>
                          <div class="actions sm-btn-position">
		                      <a class="btn btn-inverse btn-mini" onclick="reload();"><i class="icon-refresh"></i>&nbsp;&nbsp;刷新</a>
		                  </div>
                      </div>
                      <div class="widget-body">
                      	  <div style="margin-bottom: 10px;">
                      	  	<button id="add" type="button" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">新增菜单组</span></button>
                      	  	<button id="addItem" type="button" class="btn btn-warning"><i class="icon-plus"></i>&nbsp;<span style="font-size: 12px;">新增菜单</span></button>
                      	  	<button id="edit" type="button" class="btn  btn-primary"><i class="icon-pencil"></i>&nbsp;<span class="ladda-label" style="font-size: 12px;">修改</span></button>
                      	  	<button id="remove" type="button" class="btn btn-danger ladda-button" data-style="zoom-in"><i class="icon-minus"></i>&nbsp;<span style="font-size: 12px;">删除</span></button>
                      	  </div>
                          <div id="jstree"></div>
                      </div>
                 </div>
			</div>
			<div class="span5">
				<div class="widget green">
                      <div class="widget-title" id="menu_title">
                          <h4><i class="icon-align-left" hiden></i>菜单详情</h4>
                      </div>
                       <div class="widget-title" id ="group_title">
                          <h4><i class="icon-align-left"></i>菜单组详情</h4>
                      </div>
                      <div id="menu_role" class="widget-body"></div>
                 </div>
			</div>
		</div>
	</div>
</body>	
