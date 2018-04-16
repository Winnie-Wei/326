
//打开关于
function openAboutInfo() {
	// $scope.openAboutInfo = function(){
	$('#view_version').jqm({
		trigger : 'a[href="#view_version"]',
		overlay : 0,
		modal : true,
		onShow : function(h) {
			getVersion();
			h.w.show();
		},
		onHide : function(h) {
			h.o.remove();
			h.w.fadeOut(0);
		}
	})/* .jqDrag('.move'); */
	$('#view_version').jqmShow();
}

// 关闭关于
function closeAboutInfo() {
	$("#view_version").jqmHide();
}

function getVersion() {
	// $scope.getVersion = function(){
	var url = "/capaa/version/getVersion.do";
	var info;
	$
			.ajax({
				type : "post",
				async : false,
				url : url,
				data : info,
				success : function(data, textStatus) {
					var myJson = data;

					var result_msg = document
							.getElementById("result_msg_banner");
					var str1 = "<th align='left'>模块类型 </th><th align='left'>模块名称</th><th align='left'>模块版本号</th><th align='left'>模块版本的MD5</th><th align='left'>模块描述</th><th align='left'>MD5是否一致</th>";
					var str2 = "";
					for ( var i in myJson.list) {
						var strtmp = "";
						for ( var f in myJson.list[i]) {
							// if(i==0){
							// str1=str1+"<td>"+f+"</td>";
							// }
							strtmp = strtmp + "<td>" + myJson.list[i][f]
									+ "</td>";
						}
						str1 = "<tr class='level-normal1'>" + str1 + "</tr>";
						if (i % 2 == 1 && i == 0) {
							str2 = "<tr class='level-normal2'>" + strtmp
									+ "</tr>";
						} else if (i % 2 == 1 && i != 0) {
							str2 = str2 + "<tr class='level-normal1'>" + strtmp
									+ "</tr>";
						} else {
							str2 = str2 + "<tr class='level-normal2'>" + strtmp
									+ "</tr>";
						}
					}
					result_msg.innerHTML = "<table border='0' class='new-list-table' style='width:100%;'>"
							+ str1 + str2 + "</table>";
				}
			});
}

/*
 * 重启服务 start
 * ***************************************************************************
 */
/**
 * 关闭/重启服务tab切换 gr
 */
function reStart(ev) {
	var it;
	if (!!ev) {
		it = $(ev);
	} else {
		it = $("#J_service");
	}
	// 设置选中项
	var key = it.attr("id");
	it.parent().find("li").removeClass("mtabon").addClass("mtab");
	it.parent().find("li").find("a").removeClass("on");
	it.addClass("mtabon");
	it.find("a").addClass("on");

	// 设置界面
	if (key == "J_host") {// 主机
		getHost();
	} else if (key == "J_service") {// 服务
		getServer();
	}
}
/**
 * 打开重启主机的界面 gr
 */
function getHost() {
	var service_msg = document.getElementById("service_msg_banner");
	service_msg.innerHTML = "<div class='reStart-host'><input name='input' type='submit' id='J_host_reStart' class='form-button' value='重启主机' onclick='reStartHost(this)' style='margin:20px;'><input name='input' type='submit' id='J_host_stop' class='form-button' value='关闭主机' onclick='reStartHost(this)' style='margin:20px;'></div>";
}
/**
 * 执行重启/关闭主机操作 gr
 */
function reStartHost(ev) {
	var it = $(ev);
	var key = it.attr("id");
	if (key == "J_host_reStart") {// 主机
		key = 'restart';
	} else if (key == "J_host_stop") {// 服务
		key = 'stop';
	}
	$.ajax({
		type : "post",
		async : false,
		url : '/capaa/monitor/host/switch?action=' + key,
		success : function(data) {
			console.log("重启/关闭主机成功，返回" + data);
		},
		error : function() {
			myAlert("网络问题，请刷新页面重试！");
		}
	});
}

function getServer() {
	$.ajax({
		type : "get",
		async : false,
		url : baseUrl,
		data : {},
		success : function(data, textStatus) {
			creat(data);
		},
		error : function() {
			myAlert("网络问题，请刷新页面重试！");
		}
	});
}

function getWarn(service, method) {
	var warn_msg = document.getElementById("warn_msg_banner");
	var stopWarn = document.getElementById("stopWarn");
	var str = "";
	if (service == '所有服务' || (service == 'tomcat' && method == '重启')) {
		stopWarn.innerHTML = '该操作将使服务暂时不可使用，确认继续吗？';
	} else if (method == '停止' && service == 'tomcat') {
		stopWarn.innerHTML = '该操作将关闭服务，需要重启服务器，确认继续吗？';
	} else {
		stopWarn.innerHTML = '';
	}
	if (service == 'tomcat') {
		service += '和mysql';
	}
	str = str + "确认要" + method + service + "吗？";
	warn_msg.innerHTML = str;
}

function ajax() {
	if (methods == '重启' && services == '所有服务') {
		setAll();
	} else if (methods == '重启') {
		reset(services);
	}
	if (methods == '停止') {
		stop(services);
	}
	if (methods == '启动') {
		startOn(services);
	}
}

function reset(service) {
	var num = 0;
	$.ajax({
		type : "post",
		async : false,
		url : baseUrl + "/" + service + "?cmd=restart",
		timeout : 30000,
		data : {},
		beforeSend : function() {
			$('.confirmInfo').css('display', 'none');
			$('#J_confirmBotton').css('display', 'none');
			$('#J_serverProgress').css('display', 'block');
		},
		complete : function(data) {
			$('.confirmInfo').css('display', 'block');
			$('#J_confirmBotton').css('display', 'block');
			$('#J_serverProgress').css('display', 'none');
		},
		success : function(data, textStatus) {
			creat(data);
			closeConfirm();
		},
		error : function() {
			num++;
			if (num == 1) {
				closeConfirm();
				closeServerInfo();
				if (service == 'tomcat') {
					myAlert("服务已经重启，请稍后重新登录系统");
				} else {
					myAlert("网络问题，请刷新页面重试！");
				}
			}
		}
	});
}
function startOn(service) {
	var num = 0;
	$.ajax({
		type : "post",
		async : false,
		url : baseUrl + "/" + service + "?cmd=start",
		data : {},
		beforeSend : function() {
			$('.confirmInfo').css('display', 'none');
			$('#J_confirmBotton').css('display', 'none');
			$('#J_serverProgress').css('display', 'block');
		},
		complete : function(data) {
			$('.confirmInfo').css('display', 'block');
			$('#J_confirmBotton').css('display', 'block');
			$('#J_serverProgress').css('display', 'none');
		},
		success : function(data, textStatus) {
			creat(data);
			closeConfirm();
		},
		error : function() {
			num++;
			if (num == 1) {
				closeConfirm();
				closeServerInfo();
				myAlert("网络问题，请刷新页面重试！");
			}
		}
	})
}
function stop(service) {
	var num = 0;
	$.ajax({
		type : "post",
		async : false,
		url : baseUrl + "/" + service + "?cmd=stop",
		timeout : 30000,
		data : {},
		beforeSend : function() {
			$('.confirmInfo').css('display', 'none');
			$('#J_confirmBotton').css('display', 'none');
			$('#J_serverProgress').css('display', 'block');
		},
		complete : function(data) {
			$('.confirmInfo').css('display', 'block');
			$('#J_confirmBotton').css('display', 'block');
			$('#J_serverProgress').css('display', 'none');
		},
		success : function(data, textStatus) {
			creat(data);
			closeConfirm();
			if (service == 'tomcat') {
				closeServerInfo();
			}
		},
		error : function() {
			num++;
			if (num == 1) {
				closeConfirm();
				closeServerInfo();
				if (service == 'tomcat') {
					myAlert("服务器已关闭，请重启服务器");
				} else {
					myAlert("网络问题，请刷新页面重试！");
				}
			}
		}
	})
}
function setAll() {
	var num = 0;
	$.ajax({
		type : "post",
		async : false,
		url : baseUrl + "/all?cmd=restart",
		timeout : 30000,
		data : {},
		beforeSend : function() {
			$('.confirmInfo').css('display', 'none');
			$('#J_confirmBotton').css('display', 'none');
			$('#J_serverProgress').css('display', 'block');
		},
		complete : function(data) {
			$('.confirmInfo').css('display', 'block');
			$('#J_confirmBotton').css('display', 'block');
			$('#J_serverProgress').css('display', 'none');
		},
		success : function(data, textStatus) {
			creat(data);
			closeConfirm();
			closeServerInfo();
		},
		error : function() {
			closeConfirm();
			closeServerInfo();
			num++;
			if (num == 1) {
				myAlert("服务已经重启，请稍后重新登录系统");
			}
		}
	});

}

var services, methods;

function openConfirm(service, method) {
	if (method == 'reset') {
		method = '重启';
	}
	if (method == 'start') {
		method = '启动';
	}
	if (method == 'stop') {
		method = '停止';
	}
	if (service == 'all') {
		service = '所有服务';
	}
	$('#confirm_version').jqm({
		trigger : 'a[href="#confirm_version"]',
		overlay : 0,
		modal : true,
		onShow : function(h) {
			getWarn(service, method);
			h.w.show();
		},
		onHide : function(h) {
			h.o.remove();
			h.w.fadeOut(0);
		}
	})/* .jqDrag('.move'); */
	$('#confirm_version').jqmShow();
	services = service;
	methods = method;

}
function closeConfirm() {
	$("#confirm_version").jqmHide();
}

function trans(status) {
	if (status == 1) {
		return "运行中";
	}
	if (status == 0) {
		return "已停止";
	}
}

var baseUrl = '/capaa/auditsession/systemService';

function creat(data) {
	var service_msg = document.getElementById("service_msg_banner");
	var str1 = "<tr class='level-normal1'><th style='text-align:center;'>服务名称 </th><th style='text-align:center;'>运行状态</th><th style='text-align:center;'>运行时间</th><th style='text-align:center;'>操作</th><th style='text-align:center;'>操作结果</th></tr>";
	var str2 = "", duce = "", strtmp = "";
	for ( var i in data) {
		data[i].status = trans(data[i].status);
		if (data[i].service == 'tomcat') {
			duce = duce + "<a onclick=\"openConfirm('" + data[i].service
					+ "','reset')\">重启</a>";
			duce = duce + " <a onclick=\"openConfirm('" + data[i].service
					+ "','stop')\">停止</a>";
			str2 = str2 + "<td>" + data[i].displayName + "</td>";
			str2 = str2 + "<td>" + data[i].status + "</td>";
			str2 = str2 + "<td>" + data[i].runTime + "</td>";
			str2 = str2 + "<td rowspan='2'>" + duce + "</td>";
			str2 = str2 + "<td>" + data[i].result + "</td>";
			str2 = "<tr class='level-normal1' align='center'>" + str2 + "</tr>";
			strtmp += str2;
			str2 = "";
			duce = "";
		}
	}
	for ( var i in data) {
		if (data[i].service == 'mysql') {
			str2 = str2 + "<td>" + data[i].displayName + "</td>";
			str2 = str2 + "<td>" + data[i].status + "</td>";
			str2 = str2 + "<td>" + data[i].runTime + "</td>";
			str2 = str2 + "<td>" + data[i].result + "</td>";
			str2 = "<tr class='level-normal1' align='center'>" + str2 + "</tr>";
			strtmp += str2;
			str2 = "";
		}
	}
	for ( var i in data) {
		if (data[i].service != 'tomcat' && data[i].service != 'mysql') {
			if (data[i].status == "运行中") {
				duce = duce + "<a onclick=\"openConfirm('" + data[i].service
						+ "','reset')\">重启</a>";
				duce = duce + " <a onclick=\"openConfirm('" + data[i].service
						+ "','stop')\">停止</a>";
			}
			if (data[i].status == "已停止") {
				duce = duce + "<a onclick=\"openConfirm('" + data[i].service
						+ "','start')\">启动</a>";
			}
			if (data[i].runTime == null) {
				data[i].runTime = "";
			}
			data[i].duce = duce;
			str2 = str2 + "<td>" + data[i].displayName + "</td>";
			str2 = str2 + "<td>" + data[i].status + "</td>";
			str2 = str2 + "<td>" + data[i].runTime + "</td>";
			str2 = str2 + "<td>" + data[i].duce + "</td>";
			str2 = str2 + "<td>" + data[i].result + "</td>";
			str2 = "<tr class='level-normal1' align='center'>" + str2 + "</tr>";
			strtmp += str2;
			str2 = "";
			duce = "";
		}
	}
	var str0 = "<div class='reStart-all-service'><input name='input' type='submit' id='J_host_stop' class='form-button' value='重启所有服务' onclick='openConfirm(\"all\",\"reset\")'></div>";
	service_msg.innerHTML = str0
			+ "<table border='0' class='new-list-table' style='width:100%;'>"
			+ str1 + strtmp + "</table>";
}

function openServerInfo() {
	$('#server_version').jqm({
		trigger : 'a[href="#server_version"]',
		overlay : 0,
		modal : true,
		onShow : function(h) {
			reStart(null);
			h.w.show();
		},
		onHide : function(h) {
			h.o.remove();
			h.w.fadeOut(0);
		}
	})/* .jqDrag('.move'); */
	$('#server_version').jqmShow();
}
function closeServerInfo() {
	$("#server_version").jqmHide();
}
/*
 * 重启服务 end
 * ***************************************************************************
 */
// 退出
function logout_now() {
	document.getElementById("formFlag").submit();
}