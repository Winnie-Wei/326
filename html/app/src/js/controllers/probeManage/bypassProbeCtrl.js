'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:dbManageCtrl
 * @description
 * @author [Xieq]
 * # UserCtrl
 * Controller of the myappApp
 */
 angular.module('myappApp')
 .controller('BypassProbeCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','commonFuntion', function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, commonFuntion) {

 	$scope.initObj = {
 		editMod:true,
 		probeList: [],
 		serverInfo: {},
 		actionType:'normal',
 		loadSign:false,
 		checked: [],
 		getProbeList: {     //获取云镜像的列表信息
 			url: urlPrefix + '/agent/mirrors',
 			method: 'get',
 			data: {}
 		},
 		getServerInfo: {    //获取服务器配置信息
 			url: urlPrefix + '/agent/mirror/servers',
 			method: 'get',
 			data: {}
 		},
 		postServerInfo: {   //保存服务器配置信息
 			url: urlPrefix + '/agent/mirror/server',
 			method: 'post',
 			data: {}
 		},
 		mirrorCert: {          //云镜像认证
 			url: urlPrefix + '/agent/mirror/cert/',
 			method: 'post',
 			data: {}
 		},
 		mirrorCerted: {          //云镜像取消认证
 			url: urlPrefix + '/agent/mirror/certed/',
 			method: 'post',
 			data: {}
 		},
 		mirrorCommand: {          //云镜像命令
 			url: urlPrefix + '/agent/mirror/command',
 			method: 'post',
 			data: {}
 		},
 		srcInfo:{
 			srcSelect:'all',
 			srcText:'',
 			orderCloum:''
 		},
 		orderListKey:'',
 		sortType: ''
 	};

 	$scope.cache = {
 		serverObj: {},
 		ertStatus: [],
 		runStatus:[],
 		certStatus:[],
 		downUrl: ''
 	};
 	$scope.pager = {};
 	$scope.pslgst = 30;
 	
 	//初始化
 	$scope.init = function(){
 		$scope.pager.curPage = 1;
 		$scope.getProbeList();
 		$scope.getServerInfo();
 		$scope.clipboard();
 		$scope.initSign();
 		//$('#J_bypassProbe').perfectScrollbar();  //滚动条
 	};
 	
 	//切换表格排序箭头
 	$scope.orderArrowClass = function( str ){
 		var arrowClass = commonFuntion.orderArrowClass( str, $scope.initObj.orderListKey, $scope.initObj.sortType );
 		return arrowClass;
 	};
 	
 	//获取云探针列表
 	$scope.getProbeList = function( orderKey ){
 		var orderListCache = commonFuntion.orderList( orderKey, $scope.initObj.orderListKey, $scope.initObj.sortType );
 		$scope.initObj.orderListKey = orderListCache.orderColum;
 		$scope.initObj.sortType = orderListCache.sortType;
 		var config = {
 			url:  $scope.initObj.getProbeList.url,
 			method: $scope.initObj.getProbeList.method,
 			data: {
 				'pageSize': parseInt($scope.pager.pageSize) || 10,
 				'pageNo': $scope.pager.curPage || 1,
 				'searchCloum': $scope.initObj.srcInfo.srcSelect || '',
 				'searchInfo': $scope.initObj.srcInfo.srcText || '',
 				'orderCloum': orderKey || '',
 				'sortType': $scope.initObj.sortType || ''
 			}
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.initObj.probeList = data.mirrors;
 			$scope.pager.total = parseInt(data.TotalItem);
 			$scope.pager.totalPage = Math.ceil( data.TotalItem / parseInt($scope.pager.pageSize) );
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};

 	//获取服务器配置信息
 	$scope.getServerInfo = function(){
 		var config = {
 			url:  $scope.initObj.getServerInfo.url,
 			method: $scope.initObj.getServerInfo.method,
 			data: {}
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.initObj.serverInfo = data; 
 			$scope.cache.downUrl = 'http://' + $scope.initObj.serverInfo.Manage_Service_Host + ':8899/afw/hb/agent/package?agent_name=dbprobe&service_host=' 
 				+ $scope.initObj.serverInfo.Manage_Service_Host 
 				+ '&agent_host=' + $scope.initObj.serverInfo.Mirror_Service_Host;
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};
 	
 	//校验提示初始化
 	$scope.initSign = function(){
 		$scope.manage_blank = false;
 		$scope.manage_ip = false;
 		$scope.manage_port = false;
 		$scope.mirror_ip = false;
 		$scope.mirror_port = false;
 	};
 	
 	//编辑服务器配置信息
 	$scope.editServerInfo = function(info){
 		$scope.cache.serverObj.Manage_Service_Host = info.Manage_Service_Host;
 		$scope.cache.serverObj.Manage_Service_Port = info.Manage_Service_Port;
 		$scope.cache.serverObj.Mirror_Service_Host = info.Mirror_Service_Host.replace('(本机)','');
 		$scope.cache.serverObj.Mirror_Service_Port = info.Mirror_Service_Port;
 		$scope.initObj.editMod = false;
 	};
 	
 	//保存服务器配置信息
 	$scope.saveServerInfo = function(){
 		if(!$scope.cache.serverObj.Manage_Service_Host || !$scope.cache.serverObj.Manage_Service_Port || !$scope.cache.serverObj.Mirror_Service_Host || !$scope.cache.serverObj.Mirror_Service_Port){
 			$scope.manage_blank = true;
 			return;
 		}else{
 			$scope.manage_blank = false;
 		}
 		if(!Validate.validIp($scope.cache.serverObj.Manage_Service_Host)){
 			$scope.manage_ip = true;
 			return;
 		}else{
 			$scope.manage_ip = false;
 		}
 		if(!Validate.validPort($scope.cache.serverObj.Manage_Service_Port)){
 			$scope.manage_port = true;
 			return;
 		}else{
 			$scope.manage_port = false;
 		}
 		if(!Validate.validIp($scope.cache.serverObj.Mirror_Service_Host)){
 			$scope.mirror_ip = true;
 			return;
 		}else{
 			$scope.mirror_ip = false;
 		}
 		if(!Validate.validPort($scope.cache.serverObj.Mirror_Service_Port)){
 			$scope.mirror_port = true;
 			return;
 		}else{
 			$scope.mirror_port = false;
 		}
 		var ServerInfo = {
 			manage_host:$scope.cache.serverObj.Manage_Service_Host,
 			manage_port:$scope.cache.serverObj.Manage_Service_Port,
 			mirror_host:$scope.cache.serverObj.Mirror_Service_Host,
 			mirror_port:$scope.cache.serverObj.Mirror_Service_Port,
 		}
 		var config = {
 			url:  $scope.initObj.postServerInfo.url,
 			method: $scope.initObj.postServerInfo.method,
 			data: ServerInfo
 		},
 		fnSuccess = function (d){
 			if(d.result == 'success'){
 				$scope.msg = '保存成功！';
				angular.element('#J_Alert').modal('show');
				$scope.getServerInfo();
				$scope.initObj.editMod = true;
 			}else if(d.result == 'fail'){
 				$scope.msg = '保存失败！';
				angular.element('#J_Alert').modal('show');
				$scope.getServerInfo();
				$scope.initObj.editMod = true;
 			}
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};
 	
 	//取消编辑
 	$scope.cancelEdit = function(){
 		$scope.initSign();
 		$scope.initObj.editMod = true;
 	};
 	
 	//云镜像认证方法
 	$scope.mirrorCertFun = function(id){
 		if(id){
 			var config = {
 	 			url:  $scope.initObj.mirrorCert.url + id,
 	 			method: $scope.initObj.mirrorCert.method,
 	 			data: {'id':id}
 	 		},
 	 		fnSuccess = function (d){
				if(d.result == 'success'){
 	 				$scope.msg = '认证成功！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}else if(d.result == 'fail'){
 					$scope.msg = '认证失败！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}
 	 			$scope.apply();
 	 		},
 	 		fnFail = function(data){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 		}else{
 			if($scope.initObj.checked.length == 0){
 				$scope.msg = '请至少选择一项！';
				angular.element('#J_Alert').modal('show');
				return;
 			}
 			var temp = true;
 	 		for(var i = 0; i<$scope.initObj.checked.length; i++){
 	 			(function(n){
 	 				if (!temp) return; 
 	 				var config = {
 		 	 			url:  $scope.initObj.mirrorCert.url + $scope.initObj.checked[i],
 		 	 			method: $scope.initObj.mirrorCert.method,
 		 	 			data: {'id':$scope.initObj.checked[i]}
 		 	 		},
 		 	 		fnSuccess = function (d){
 	 					if(d.result == 'success'){
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.checkAll = false;
 		 	 					$scope.initObj.checked = [];
 		 	 					$scope.cache.certStatus = [];
 			 	 				$scope.msg = '认证成功！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		 	 				}
 		 	 			}else if(d.result == 'fail'){
 		 	 				temp = false;
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.msg = '认证失败！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		        			}
 		 	 			}
 		 	 			$scope.apply();
 		 	 		},
 		 	 		fnFail = function(data){
 		 	 			console.log(data.errMsg || '操作失败');
 		 	 		};
 		 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	 			}(i))
 	 		}
 		}
 	};
 	
 	//云镜像认证
 	$scope.mirrorCert = function(obj){
 		if(obj){
 			if(obj.cert_status == 1){
 				$scope.msg = '选项中已经包含已认证项目！';
				angular.element('#J_Alert').modal('show');
    			return;
 			}
 			$scope.certObj = obj.id;
 		}else{
 			if($scope.initObj.checked.length == 0){
 				$scope.msg = '请至少选择一项！';
				angular.element('#J_Alert').modal('show');
				return;
 			}
 			for(var i=0;i<$scope.cache.certStatus.length;i++){
 				if($scope.cache.certStatus[i] == 1 ){
 					$scope.msg = '选项中已经包含已认证项目！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 				}
 			}
 		}
 		$scope.confirmCont = '确定要认证此探针吗？';
		angular.element('#J_confirm').modal('show');
		$scope.initObj.actionType = 'cert';
 	};
 	
 	//云镜像取消认证方法
 	$scope.mirrorCertedFun = function(id){
 		if(id){
 			var config = {
 	 			url:  $scope.initObj.mirrorCerted.url + id,
 	 			method: $scope.initObj.mirrorCerted.method,
 	 			data: {'id':id}
 	 		},
 	 		fnSuccess = function (d){
				if(d.result == 'success'){
 	 				$scope.msg = '取消认证成功！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}else if(d.result == 'fail'){
 					$scope.msg = '取消认证失败！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}
 	 			$scope.apply();
 	 		},
 	 		fnFail = function(data){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 		}
 		else{
 			var temp = true;
 	 		for(var i = 0; i<$scope.initObj.checked.length; i++){
 	 			(function(n){
 	 				if (!temp) return; 
 	 				var config = {
 		 	 			url:  $scope.initObj.mirrorCerted.url + $scope.initObj.checked[i],
 		 	 			method: $scope.initObj.mirrorCerted.method,
 		 	 			data: {'id':$scope.initObj.checked[i]}
 		 	 		},
 		 	 		fnSuccess = function (d){
 	 					if(d.result == 'success'){
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.checkAll = false;
 		 	 					$scope.initObj.checked = [];
 		 	 					$scope.cache.certStatus = [];
 			 	 				$scope.msg = '取消认证成功！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		 	 				}
 		 	 			}else if(d.result == 'fail'){
 		 	 				temp = false;
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.msg = '取消认证失败！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		        			}
 		 	 			}
 		 	 			$scope.apply();
 		 	 		},
 		 	 		fnFail = function(data){
 		 	 			console.log(data.errMsg || '操作失败');
 		 	 		};
 		 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	 			}(i))
 	 		}
 		}
 	};
 	
 	//云镜像取消认证
 	$scope.mirrorCerted = function(obj){
 		if(obj){
 			if(obj.cert_status == 0){
 				$scope.msg = '选项中已经包含未认证项目！';
				angular.element('#J_Alert').modal('show');
    			return;
 			}
 			$scope.certedObj = obj.id;
 		}else{
 			if($scope.initObj.checked.length == 0){
 				$scope.msg = '请至少选择一项！';
				angular.element('#J_Alert').modal('show');
				return;
 			}
 			for(var i=0;i<$scope.cache.certStatus.length;i++){
 				if($scope.cache.certStatus[i] == 0 ){
 					$scope.msg = '选项中已经包含未认证项目！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 				}
 			}
 		}
 		$scope.confirmCont = '确定要取消认证此探针吗？';
		angular.element('#J_confirm').modal('show');
		$scope.initObj.actionType = 'certed';
 	};
 	
 	//云镜像命令方法
 	$scope.mirrorCommandFun = function(type,id){
 		if(id){
 			var info = {
	 				id:id,
	 				command:type
	 			};
 			var config = {
	 			url:  $scope.initObj.mirrorCommand.url,
	 			method: $scope.initObj.mirrorCommand.method,
	 			data: info
	 		},
 	 		fnSuccess = function (d){
				if(d.result == 'success'){
 					$scope.checkAll = false;
 					$scope.initObj.checked = [];
 	 				$scope.msg = '操作成功，请稍后查看运行状态！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}else if(d.result == 'fail'){
 					$scope.msg = '操作失败！';
 					angular.element('#J_Alert').modal('show');
 					$scope.getProbeList();
 	 			}
 	 			$scope.apply();
 	 		},
 	 		fnFail = function(data){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 		}
 		else{
 			if($scope.initObj.checked.length == 0){
 				$scope.msg = '请至少选择一项！';
				angular.element('#J_Alert').modal('show');
				return;
 			}
 			var temp = true;
 	 		for(var i = 0; i<$scope.initObj.checked.length; i++){
 	 			(function(n){
 	 				if (!temp) return; 
 	 				var info = {
 	 						id:$scope.initObj.checked[i],
 	 		 				command:type
 	 		 		};
 	 				var config = {
 	 		 			url:  $scope.initObj.mirrorCommand.url,
 	 		 			method: $scope.initObj.mirrorCommand.method,
 	 		 			data: info
 	 		 		},
 		 	 		fnSuccess = function (d){
 	 					if(d.result == 'success'){
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.checkAll = false;
 		 	 					$scope.initObj.checked = [];
 			 	 				$scope.msg = '操作成功，请稍后查看运行状态！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		 	 				}
 		 	 			}else if(d.result == 'fail'){
 		 	 				temp = false;
 		 	 				if(n == $scope.initObj.checked.length - 1){
 		 	 					$scope.checkAll = false;
 		 	 					$scope.initObj.checked = [];
 		 	 					$scope.msg = '操作失败！';
 			 					angular.element('#J_Alert').modal('show');
 			 					$scope.getProbeList();
 		        			}
 		 	 			}
 		 	 			$scope.apply();
 		 	 		},
 		 	 		fnFail = function(data){
 		 	 			console.log(data.errMsg || '操作失败');
 		 	 		};
 		 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	 			}(i))
 	 		}
 		}
 	};
 	
 	//云镜像命令
 	$scope.mirrorCommand = function(type,obj){
 		if(obj){
 			if(type == 'start'){
 				if(obj.run_status == 'alive' ){
 					$scope.msg = '选项中已经包含已启用项目！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 	 			}
 	 			$scope.confirmCont = '确定要启用此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'start';
 	 		}
 			if(type == 'stop'){
 				if(obj.run_status == 'stop' ){
 					$scope.msg = '选项中已经包含已停用项目！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 	 			}
 	 			$scope.confirmCont = '确定要停止此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'stop';
 	 		}
 			if(type == 'restart'){
 	 			$scope.confirmCont = '确定要重启此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'restart';
 	 		}
 	 		if(type == 'reload'){
 	 			$scope.confirmCont = '确定要重载此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'reload';
 	 		}
 			$scope.comObj = obj.id;
 		}else{
 			if($scope.initObj.checked.length == 0){
 				$scope.msg = '请至少选择一项！';
				angular.element('#J_Alert').modal('show');
				return;
 			}
 			if(type == 'start'){
 				for(var i=0;i<$scope.cache.runStatus.length;i++){
 	 				if($scope.cache.runStatus[i] == 'alive' ){
 	 					$scope.msg = '选项中已经包含已启用项目！';
 	 					angular.element('#J_Alert').modal('show');
 	 	    			return;
 	 				}
 	 			}
 	 			$scope.confirmCont = '确定要启用此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'start';
 	 		}
 			if(type == 'stop'){
 				for(var i=0;i<$scope.cache.runStatus.length;i++){
 	 				if($scope.cache.runStatus[i] == 'STOP' ){
 	 					$scope.msg = '选项中已经包含已停用项目！';
 	 					angular.element('#J_Alert').modal('show');
 	 	    			return;
 	 				}
 	 			}
 	 			$scope.confirmCont = '确定要停止此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'stop';
 	 		}
 			if(type == 'restart'){
 	 			$scope.confirmCont = '确定要重启此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'restart';
 	 		}
 	 		if(type == 'reload'){
 	 			$scope.confirmCont = '确定要重载此探针吗？';
 	 			angular.element('#J_confirm').modal('show');
 	 			$scope.initObj.actionType = 'reload';
 	 		}
 		}
 	};
 	
 	//弹窗确认
 	$scope.clickOk = function(event){
    	var it = $(event.target),
    		type = $scope.initObj.actionType;
    	
    	switch(type){
    		case 'comfirm':
    			angular.element('#J_Alert').modal('hide');
    		break;
    		default:
    			angular.element('#J_Alert').modal('hide');
    		break;
    	}
    };
    
    //confirm弹框
    $scope.clickComfirm = function(event){
    	var it = $(event.target),
		type = $scope.initObj.actionType;
	
		switch(type){
			case 'cert':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCertFun($scope.certObj);
			break;
			case 'certed':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCertedFun($scope.certedObj);
			break;
			case 'start':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCommandFun($scope.initObj.actionType,$scope.comObj);
			break;
			case 'stop':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCommandFun($scope.initObj.actionType,$scope.comObj);
			break;
			case 'restart':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCommandFun($scope.initObj.actionType,$scope.comObj);
			break;
			case 'reload':
		 		angular.element('#J_confirm').modal('hide');
				$scope.mirrorCommandFun($scope.initObj.actionType,$scope.comObj);
			break;
			default:
				angular.element('#J_confirm').modal('hide');
			break;
		}
    };
    
    //下载云探针
    $scope.loadProbe = function(){
    	if(!$scope.initObj.serverInfo.Manage_Service_Host || !$scope.initObj.serverInfo.Manage_Service_Port || !$scope.initObj.serverInfo.Mirror_Service_Host || !$scope.initObj.serverInfo.Mirror_Service_Port){
    		$scope.msg = '服务器配置不完整！';
			angular.element('#J_Alert').modal('show');
 			return;
 		}else{
 	    	window.open($scope.cache.downUrl);
 		}
    };
    
    //点击复制云探针
    $scope.clipboard = function(){
    	var copyURL = new Clipboard('.copyWinUrl', {
            text: function(trigger) {
            	if(!$scope.initObj.serverInfo.Manage_Service_Host || !$scope.initObj.serverInfo.Manage_Service_Port || !$scope.initObj.serverInfo.Mirror_Service_Host || !$scope.initObj.serverInfo.Mirror_Service_Port){
            		alert('服务器配置不完整！');
         			return;
         		}else{
         			if(trigger.getAttribute('id')=='J_copyWin'){
                        return $scope.cache.downUrl;
                    }
         		}
            }
    	})
    	copyURL.on('success', function(e) {
    		//angular.element('#J_Alert').modal('show');
    		alert('复制成功')
	     });  
    	copyURL.on('error', function(e) { 
    		 alert('复制失败')
	    	 //$scope.msg = '复制失败';
			 //angular.element('#J_Alert').modal('show');  
	     });
    };
    
    //全选
	$scope.selectAll = function () {
        if($scope.checkAll) {
 			$scope.initObj.checked = [];
            angular.forEach($scope.initObj.probeList, function (i) {
                i.checked = true;
                $scope.initObj.checked.push(i.id);
                $scope.cache.certStatus.push(i.cert_status);
                $scope.cache.runStatus.push(i.run_status);
            })
        }else {
            angular.forEach($scope.initObj.probeList, function (i) {
                i.checked = false;
                $scope.initObj.checked = [];
                $scope.cache.certStatus = [];
                $scope.cache.runStatus = [];
            })
        }
    };
    //单选
    $scope.selectOne = function () {
        angular.forEach($scope.initObj.probeList, function (i) {
            var index = $scope.initObj.checked.indexOf(i.id);
            if(i.checked && index === -1) {
                $scope.initObj.checked.push(i.id);
                $scope.cache.certStatus.push(i.cert_status);
                $scope.cache.runStatus.push(i.run_status);
            } else if (!i.checked && index !== -1){
                $scope.initObj.checked.splice(index, 1);
                $scope.cache.certStatus.splice(index, 1);
                $scope.cache.runStatus.splice(index, 1);
            };
        })
        if ($scope.initObj.probeList.length === $scope.initObj.checked.length) {
            $scope.checkAll = true;
        } else {
            $scope.checkAll = false;
        }
    };

 	$scope.apply = function() {
 		if(!$scope.$$phase) {
 			$scope.$apply();
 		}
 	};

 }]);