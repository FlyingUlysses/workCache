$(function() {
	reload();
	$("#add").click(function () {
		var url =  _basePath + "/appMenu/addGroup";
		if(menu_id != null){
			url += "?parent=" + menu_id;
		}
		showModel({
			title : "菜单组新增",
			width : "480px",
			height: "380px",
			url : url
		});
	});
	$("#addItem").click(function () {
		var url =  _basePath + "/appMenu/edit";
		if(menu_id != null){
			url += "?parent=" + menu_id;
		}
		showModel({
			title : "菜单新增",
			width : "480px",
			height: "525px",
			url : url
		});
	});
	
	$("#edit").click(function () {
		if(menu_id == "")
			showMsgModal("您当前没有选择任何菜单！");
		else{
			if (menu_id.indexOf("p")>=0) {
				showModel({
					title : "菜单组编辑",
					width : "480px",
					height: "380px",
					url : _basePath + "/appMenu/edit?id=" + menu_id
				});
			}else {
				showModel({
					title : "菜单编辑",
					width : "480px",
					height: "525px",
					url : _basePath + "/appMenu/edit?id=" + menu_id
				});
			}
		}
	});
	$("#remove").click(function () {
		if(menu_id == "")
			showMsgModal("您当前没有选择任何菜单！");
		else{
			var url = _basePath + "/appMenu/delete?id=" + menu_id;
			revRecord(url);
		}
	});
});
var menu_id = "";
function reload(){
	menu_id = "";
	$("#jstree").jstree("destroy");
	bindJsTree("jstree", _basePath + "/appMenu/getMenus", {
		"plugins" : [ "wholerow","state"]
	});
	$("#jstree").on("changed.jstree", function(e, data) {
		menu_id = data.selected+"";
		if(menu_id != null && menu_id != ""){
			getMenuRoles(menu_id);
		}
	});
}

function getMenuRoles(id){
	var url = _basePath + "/appMenu/getMenuRoles?id=" + id;
	$("#menu_role").empty();
	$.getJSON(url, function (data) {
		 if(data != null && data.length > 0){
			 var strs = "<table class='table table-bordered table-hover'><thead><tr><th>创建人</th><th>创建时间</th><th>开放状态</th><th>提醒信息</th></tr></thead>";
			 $.each(data,function(i,item){
				 strs += "<tr><td>" + item.creator_name + "</td><td>" + item.create_time + "</td><td>" + item.opened_name + "</td><td>" + formatNull(item.message) + "</td></tr>";
			 });
			 strs += "</table>";
			 $("#menu_role").append(strs);
		 }
	 });
}