'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:ProtectObjCtrl
 * @description
 * @author 
 * Controller of the myappApp
 */
 angular.module('myappApp')
 .controller('ProtectObjCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q', function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate,$q) {

 	$scope.Obj = {
 		init: {
 			objInfo:{},
 			racObj:{},
 			actionType:'delete'
 		},
 		ProtectObjUrl: {
 			url: '/capaa/asset/database',
 			method: 'get',
 			data: {}
 		},
 		isOnly: {
 			url: '/capaa/asset/database?cmd=isonly',
 			method: 'post',
 			data: {}
 		}
 	};
 	$scope.cache = {
 		ObjList:{},
 		Objdetail:{},
 		racList:[],
 		racCache:{},
 		objPwd:'',
 		objStatus: [],
 		editRacCache:{}
 	};
 	$scope.pager = {};
 	$scope.pslgst = 30;

 	//初始化
 	$scope.init = function(){
 		$scope.getProtectObjs();  //获取保护对象列表
 		$scope.initSign();
 		$scope.pager.curPage = 1;
 		$scope.racFlag = false;  
 		$scope.testflag = true;
 		$scope.blockFlag = 0;
 		//$scope.dbTypeDisable = false;
 		$scope.testjdbcErr  = false;
 		$scope.editKey = 'add';
 		$scope.checked = [];
 	};
 	
 	//提示信息初始化
 	$scope.initSign = function(){
 		$scope.infoName_blank = false;
 		$scope.infoName_Err = false;
 		$scope.infoType_blank = false;
 		$scope.infoIP_blank = false;
 		$scope.infoIP_val = false;
 		$scope.infoPort_blank = false;
 		$scope.infoPort_val = false;
 		$scope.sidVal = false;
 		$scope.sidVal_db2 = false;
 		$scope.dbUser = false;
 		$scope.dbUserErr = false;

 		$scope.rac_ip_blank = false;
 		$scope.rac_ip_val = false;
 		$scope.rac_port_blank = false;
 		$scope.rac_port_val = false;
 		$scope.rac_sid_blank = false;
 		$scope.rac_info_exist = false;

 		$scope.rac_ip_blank_e = false;
 		$scope.rac_ip_val_e = false;
 		$scope.rac_port_blank_e = false;
 		$scope.rac_port_val_e = false;
 		$scope.rac_sid_blank_e = false;
 		$scope.rac_info_exist_e = false;
 		
 	};
 	
 	//获取保护对象列表
 	$scope.getProtectObjs = function(){
 		var config = {
 			url:  $scope.Obj.ProtectObjUrl.url,
 			method: $scope.Obj.ProtectObjUrl.method,
 			data: {
 				'currentPage': $scope.pager.curPage || 1,
 				'pageSize': parseInt($scope.pager.pageSize) || 10,
 				'paged': true
 			}
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.cache.ObjList = data.items;
 			$scope.pager.total = parseInt(data.totalCount);
 			$scope.pager.totalPage = Math.ceil( data.totalCount / parseInt($scope.pager.pageSize) );
 			angular.forEach($scope.cache.ObjList , function (i) {
 				$scope.changeDbType(i.dbtype,i);
 	        })
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};
 	
 	//id获取保护对象
 	$scope.getOneProtectObj = function(id){
		var config = {
 			url:  $scope.Obj.ProtectObjUrl.url + '/' + id,
 			method: $scope.Obj.ProtectObjUrl.method,
 			data: {}
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.cache.Objdetail = data;
 			$scope.cache.racList = data.raclist;
 			$scope.changeDbType($scope.cache.Objdetail.dbtype,$scope.cache.Objdetail);
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 		
 	};
 	
 	//数据库类型显示转换
 	$scope.changeDbType = function(db,obj){
 		if(db == 'Oracle' || db =='Oracle_Audit'){
 			obj.dbtypeView = 'Oracle';
 		}/*else if(db == 'sqlserver'){
 			obj.dbtypeView = 'SQL Server';
 		}else if(db == 'mysql'){
 			obj.dbtypeView = 'MySQL';
 		}else if(db == 'sybase'){
 			obj.dbtypeView = 'Sybase';
 		}else if(db == 'db2'){
 			obj.dbtypeView = 'DB2';
 		}else if(db == 'postgresql'){
 			obj.dbtypeView = 'PostgreSQL';
 		}*/else{
 			obj.dbtypeView =db;
 		}
 	};
 	
 	//获取保护对象详细信息
 	$scope.objDetail = function(id){
 		$scope.getOneProtectObj(id);
 		$scope.blockFlag = 2;
 		$scope.apply();
 	};
 	
 	//配置保护对象
 	$scope.editObj = function(sign,item){
 		if(sign == 'edit'){  //编辑
 			$scope.Obj.init.objInfo.userDealWay = item.userDealWay;
 			$scope.Obj.init.objInfo.dbid = item.dbid;
 			$scope.Obj.init.objInfo.dbname = item.name;
 			$scope.Obj.init.objInfo.dbtype = item.dbtype;
 			$scope.Obj.init.objInfo.dbtypeShow = item.dbtype.toLowerCase().replace(/\s/g,"");
 			$scope.Obj.init.objInfo.ip = item.hostname;
 			$scope.Obj.init.objInfo.port = item.port;
 			$scope.Obj.init.objInfo.sid = item.service;
 			$scope.Obj.init.objInfo.servicename = item.serviceName;
 			$scope.Obj.init.objInfo.sysname = item.userName;
 			$scope.Obj.init.objInfo.syspass = item.password;
 			$scope.cache.objPwd = item.password;
 			//$scope.changeRac(item.raclist,$scope.Obj.init.objInfo)
 			if($scope.Obj.init.objInfo.dbtypeShow == 'oracle' || $scope.Obj.init.objInfo.dbtypeShow == 'oracle_audit'){
 				$scope.cache.racList = item.raclist;
 				$scope.racFlag = true;
 			}else{
 				$scope.racFlag = false;
 			}
 			//$scope.dbTypeDisable = true;
 			$scope.editKey = 'edit';
 	 		$scope.blockFlag = 1;
 		}
 		else if(sign == 'add'){  //新增
 			$scope.Obj.init.objInfo = {};
 			$scope.cache.racList = [];
 	 		$scope.Obj.init.objInfo.userDealWay = 0;
 			//$scope.dbTypeDisable = false;
 			$scope.racFlag = false;
 			$scope.blockFlag = 1;
 			$scope.editKey = 'add';
 		}
 		
 	};
 	
 	//测试唯一性
 	$scope.isOnly = function(){
 		var typeCache;
 		if($scope.editKey == 'edit'){
 			typeCache = $scope.Obj.init.objInfo.dbtype;
 		}else if($scope.editKey == 'add'){
 			typeCache = $scope.Obj.init.objInfo.dbtypeShow;
 		}
 		var testOnlyObj = {
			"dbid":$scope.Obj.init.objInfo.dbid || '',
			"dbname":$scope.Obj.init.objInfo.dbname || '',
			"dbtype":typeCache,
			"ip":$scope.Obj.init.objInfo.ip || '',
			"port":$scope.Obj.init.objInfo.port || '',
			"sid":$scope.Obj.init.objInfo.sid || '',
			"servicename":$scope.Obj.init.objInfo.servicename || ''
 		}

 		var deferred = $q.defer();
        $http.post($scope.Obj.isOnly.url,testOnlyObj)
            .success(function(d){
            	if(d != 'success'){
            		$scope.msg = d;
     				angular.element('#J_Alert').modal('show');
     				saveFlag = false;
     				return;
            	}
                deferred.resolve(d);
            });
        return deferred.promise;
 	};
 	
 	//密码加密
 	var defer = $q.defer();
 	$scope.encryptPass = defer.promise;
 	$scope.encryptPass = function(pwd){
 		var config = {
	 			url: '/capaa/js/encrypt/encrypt.json',
	 			method: 'get',
	 			data: {}
	 		},
	 	fnSuccess = function (data){
 			if(pwd){
 				var publicKey = data.publicKey;
 	    		var encrypt = new JSEncrypt();
 	    		encrypt.setPublicKey(publicKey);
 	    		pwd = encrypt.encrypt(pwd);
 	    		pwd=encodeURI(pwd).replace(/\+/g, '%2B');
 	    		$scope.Obj.init.objInfo.syspass = 'js-' + pwd;
 	    		$scope.cache.objPwd = $scope.Obj.init.objInfo.syspass;
 			}else{
 				$scope.Obj.init.objInfo.syspass = '';
 			}
 			
	 		$scope.apply();
	 	},
	 	fnFail = function(data){
	 		console.log(data.errMsg || '操作失败');
	 	};
	 	return AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};
 	
 	//保存提交方法
 	$scope.submitFun = function(url,obj){
		var config = {
	 			url: url,
	 			method: 'post',
	 			data: {
		 				"dbname":obj.dbname || '',
		 				"dbtype":obj.dbtypeShow || '',
		 				"ip":obj.ip || '',
		 				"port":obj.port || '',
		 				"sid":obj.sid || '',
		 				"servicename":obj.servicename || '',
		 				"sysname":obj.sysname || '',
		 				"syspass":obj.syspass || '',
		 				"userDealWay":obj.userDealWay + '',
		 				"dataFrom":obj.dataFrom || '',
		 				"racIps":obj.racIps || '',
		 				"racPorts":obj.racPorts || '',
		 				"racSids":obj.racSids || '',
		 				"racStatus":obj.racStatus || ''
	 				}

	 		},
	 	fnSuccess = function (d){
			if(d.regist == 'OK'){
				saveFlag = false;
				$scope.msg = '操作成功！';
				angular.element('#J_Alert').modal('show');
		 		$scope.Obj.init.actionType = 'normal';
				$scope.init();
			}else{
				saveFlag = false;
				$scope.msg = d.regist;
				angular.element('#J_Alert').modal('show');
				$scope.Obj.init.actionType = 'normal';
				return;
			}
	 		$scope.apply();
	 	},
	 	fnFail = function(data){
	 		$scope.msg = '操作失败';
			angular.element('#J_Alert').modal('show');
			$scope.Obj.init.actionType = 'normal';
	 		console.log(data.errMsg || '操作失败');
	 	};
	 	AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 		
 	}
 	
 	//保存修改信息方法
 	$scope.editSubmitFun = function(url,obj){
 		var config = {
	 			url: url,
	 			method: 'post',
	 			data: {
	 				"dbname":obj.dbname || '',
	 				"dbtype":obj.dbtypeShow || '',//obj.dbtype
	 				"ip":obj.ip || '',
	 				"port":obj.port || '',
	 				"sid":obj.sid || '',
	 				"servicename":obj.servicename || '',
	 				"sysname":obj.sysname || '',
	 				"syspass":obj.syspass || '',
	 				"userDealWay":obj.userDealWay,
	 				"dataFrom":obj.dataFrom || '',
	 				"racIps":obj.racIps || '',
	 				"racPorts":obj.racPorts || '',
	 				"racSids":obj.racSids || '',
	 				"racStatus":obj.racStatus || ''
 				}
	 		},
	 	fnSuccess = function (d){
			if(d.update == 'OK'){
				saveFlag = false;
				$scope.msg = '操作成功！';
				angular.element('#J_Alert').modal('show');
		 		$scope.Obj.init.actionType = 'normal';
				$scope.init();
			}else{
				saveFlag = false;
				$scope.msg = d.update;
				angular.element('#J_Alert').modal('show');
				$scope.Obj.init.actionType = 'normal';
				return;
			}
	 		$scope.apply();
	 	},
	 	fnFail = function(data){
	 		$scope.msg = '操作失败';
			angular.element('#J_Alert').modal('show');
			$scope.Obj.init.actionType = 'normal';
	 		console.log(data.errMsg || '操作失败');
	 	};
	 	AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
 	};
 	
 	//提交验证
 	$scope.submitValidate = function(){
 		if(!Validate.validEmpty($scope.Obj.init.objInfo.dbname)){
 			$scope.infoName_blank = true;
 			return 1;
 		}else{
 			$scope.infoName_blank = false;
 			var regdbname = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,15}$/;
 	 		if(!regdbname.test($scope.Obj.init.objInfo.dbname)){
 	 			$scope.infoName_Err = true;
 	 			return 1;
 	 		}else{
 	 			$scope.infoName_Err = false;
 	 		}
 		}
 		if(!Validate.validEmpty($scope.Obj.init.objInfo.dbtypeShow)){
 			$scope.infoType_blank = true;
 			return 1;
 		}else{
 			$scope.infoType_blank = false;
 		}
 		if(!Validate.validEmpty($scope.Obj.init.objInfo.ip)){
 			$scope.infoIP_blank = true;
 			return 1;
 		}else{
 			$scope.infoIP_blank = false;
 			var flag = true;
			var regNum = /^[a-zA-Z]/;
			if(regNum.test($scope.Obj.init.objInfo.ip)){
				if(!Validate.validcom($scope.Obj.init.objInfo.ip)){
					flag = false;
				}
			}else{
				if(!Validate.validIp($scope.Obj.init.objInfo.ip)){
					flag = false;
				}
			} 
			if(flag == false){
				$scope.infoIP_val = true;
				return 1;
			}else{
				$scope.infoIP_val = false;
			}
 		}
 		if(!Validate.validEmpty($scope.Obj.init.objInfo.port)){
 			$scope.infoPort_blank = true;
 			return 1;
 		}else{
 			$scope.infoPort_blank = false;
 			if(!Validate.validPort($scope.Obj.init.objInfo.port)){
 				$scope.infoPort_val = true;
 				return 1;
			}else{
				$scope.infoPort_val = false;
			}
 		}
 	};
 	
 	//去除数组中空元素 
 	function removeEmptyArrayEle(arr){    
	   for(var i = 0; i < arr.length; i++) {
		   if(!arr[i]) {
			   arr.splice(i,1);
			   i = i - 1;
		   }
	   }
	   return arr;
	};
 	
 	//保存提交信息
 	var saveFlag = false;
 	var dbtypeCache = $scope.Obj.init.objInfo.dbtypeShow;
 	$scope.saveEditInfo = function(){
 		$scope.changeRac($scope.cache.racList,$scope.Obj.init.objInfo); //转换rac信息
 		if($scope.submitValidate() == 1) {   //提交验证
 			return;
 		} 
 		if($scope.Obj.init.objInfo.dbtypeShow == 'oracle'){ //校验实例名或服务名不为空
			if(!$scope.Obj.init.objInfo.sid && !$scope.Obj.init.objInfo.servicename){
 		 		$scope.sidVal = true;
 		 		return false;
 			}else{
 				$scope.sidVal = false;
 			}
		}
 		if($scope.Obj.init.objInfo.dbtypeShow == 'db2'){ //校验db2数据库名不为空
			if(!$scope.Obj.init.objInfo.sid){
 		 		$scope.sidVal_db2 = true;
 		 		return false;
 			}else{
 				$scope.sidVal_db2 = false;
 			}
		}
 		//校验rac信息完整
 		if( !$scope.Obj.init.objInfo.racIps && !$scope.Obj.init.objInfo.racPorts && !$scope.Obj.init.objInfo.racSids && !$scope.Obj.init.objInfo.racStatus){
 			$scope.racVal = false;
 		}else{
 			var racip = removeEmptyArrayEle($scope.Obj.init.objInfo.racIps.split(',')),
				racPorts = removeEmptyArrayEle($scope.Obj.init.objInfo.racPorts.split(',')),
				racSids = removeEmptyArrayEle($scope.Obj.init.objInfo.racSids.split(',')),
				racStatus = removeEmptyArrayEle($scope.Obj.init.objInfo.racStatus.split(','));
			if( racip.length != racPorts.length || racip.length != racSids.length || racip.length != racStatus.length){
				$scope.racVal = true;
				return;
			}else{
				$scope.racVal = false;
			}
 		}
 		if($scope.valAccount() == 1){   //数据库账户校验
			return;
		}else{
			if($scope.Obj.init.objInfo.syspass && $scope.Obj.init.objInfo.sysname){
				if($scope.testjdbcErr){
		 			$scope.dbUserErr = true; 
		 			return;
		 		}
			}else{
				$scope.dbUserErr = false; 
			}
		}
 		
 		if(saveFlag) return;  //防止重复提交
 		saveFlag = true;
 		$scope.isOnly().then(function(){ // 唯一性
 			if($scope.editKey == 'edit'){   //编辑
 	 			var editSaveUrl = $scope.Obj.ProtectObjUrl.url + '/' + $scope.Obj.init.objInfo.dbid + '?cmd=update';
 	 			
 	 			if(!$scope.Obj.init.objInfo.syspass){
 	 				$scope.editSubmitFun(editSaveUrl,$scope.Obj.init.objInfo);
 	 			}else{
 	 				if($scope.Obj.init.objInfo.syspass.replace('njs-','') == $scope.cache.objPwd){     //密码未修改
 	 					if($scope.Obj.init.objInfo.syspass.indexOf('js-') != -1){
 	 						$scope.editSubmitFun(editSaveUrl,$scope.Obj.init.objInfo);
 	 					}else{
 	 						$scope.Obj.init.objInfo.syspass = 'njs-' + $scope.Obj.init.objInfo.syspass.replace('njs-','');
 	 	 	 				$scope.editSubmitFun(editSaveUrl,$scope.Obj.init.objInfo);
 	 					}
 	 	 			}else{    //有修改密码                                                      
 	 	 				$scope.encryptPass($scope.Obj.init.objInfo.syspass).then(function(){
 	 	 	 				$scope.editSubmitFun(editSaveUrl,$scope.Obj.init.objInfo);
 	 	 	 			});
 	 	 			}
 	 			}
 	 		}else if($scope.editKey == 'add'){     //新增
 	 			if($scope.Obj.init.objInfo.syspass){
 	 				if($scope.Obj.init.objInfo.syspass.indexOf('js-') != -1){
 	 	 				$scope.submitFun($scope.Obj.ProtectObjUrl.url,$scope.Obj.init.objInfo);
 	 				}else{
 	 					$scope.encryptPass($scope.Obj.init.objInfo.syspass).then(function(){
 	 		 	 			$scope.submitFun($scope.Obj.ProtectObjUrl.url,$scope.Obj.init.objInfo);
 	 		 			})
 	 				}
 	 			}else{
 	 				$scope.submitFun($scope.Obj.ProtectObjUrl.url,$scope.Obj.init.objInfo);
 	 			}
 	 			
 	 		}
 		});
 	};
 	
 	//禁用/启用保护对象方法
 	$scope.setStatusFun = function(status,id){
 		var cacheID = id;
 		var config = {
	 			url:  $scope.Obj.ProtectObjUrl.url + '/' + id + '/' + status + '?cmd=set',
	 			method: 'post',
	 			data: {}
	 		},
	 	fnSuccess = function (d){
 			if(d == 421){
 				$scope.msg = '参数异常！';
 	 			angular.element('#J_Alert').modal('show');
 			}else if(d == 202){
 				$scope.msg = '操作失败！';
 	 			angular.element('#J_Alert').modal('show');
 			}else if(d == 200){
 				$scope.msg = '操作成功！';
 	 			angular.element('#J_Alert').modal('show');
 			}
 			
 			$scope.checked = [];
	 		$scope.checkAll = false;
	 		$scope.cache.objStatus = [];
	 		if($scope.blockFlag == 0){
	 			$scope.getProtectObjs()
	 		}else if($scope.blockFlag == 2){
	 			$scope.getOneProtectObj(cacheID);
	 		}
	 		$scope.apply();
	 	},
	 	fnFail = function(data){
	 		console.log(data.errMsg || '操作失败');
	 	};
	 	AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 		
 	};
 	
 	//禁用/启用保护对象
 	$scope.setStatus = function(status,dbid,istatus){
 		if(dbid){
 			$scope.setDbid = dbid;
 		}else{
 			if($scope.checked.length == 0){
 	 			$scope.msg = '请至少选择一个保护对象！';
				angular.element('#J_Alert').modal('show');
				return;
 	 		}
 			$scope.setDbid = $scope.checked.join();
 		}
 		$scope.setStatu = status;
 		if(status == 0){
 			if(istatus == 0){
 				$scope.msg = '此项为已禁用对象！';
				angular.element('#J_Alert').modal('show');
    			return;	
 			}
 			for(var i=0;i<$scope.cache.objStatus.length;i++){
 				if($scope.cache.objStatus[i] == 0 ){
 					$scope.msg = '选项中已经包含已禁用对象！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 				}
 			}
 			$scope.confirmCont = '确定要禁用保护对象吗？';
 		}else if(status == 1){
 			if(istatus == 1){
 				$scope.msg = '此项为已启用对象！';
				angular.element('#J_Alert').modal('show');
    			return;	
 			}
 			for(var i=0;i<$scope.cache.objStatus.length;i++){
 				if($scope.cache.objStatus[i] == 1 ){
 					$scope.msg = '选项中已经包含已启用对象！';
 					angular.element('#J_Alert').modal('show');
 	    			return;
 				}
 			}
 			$scope.confirmCont = '确定要启用保护对象吗？';
 		}
 		angular.element('#J_confirm').modal('show');
 		$scope.Obj.init.actionType = 'set';
 	};
 	
 	//删除保护对象方法
 	$scope.deleteObjFun = function(id){
 		var config = {
		 	url:  $scope.Obj.ProtectObjUrl.url + '/' + id + '?cmd=delete',
		 	method: 'post',
		 	data: {}
		 },
		 fnSuccess = function (d){
 			if(d == 421){
 				$scope.msg = '参数异常！';
 	 			angular.element('#J_Alert').modal('show');
 	 			$scope.blockFlag = 0;
 	 			$scope.getProtectObjs();
 			}else if(d == 202){
 				$scope.msg = '操作失败！';
 	 			angular.element('#J_Alert').modal('show');
 	 			$scope.blockFlag = 0;
 	 			$scope.getProtectObjs();
 			}else if(d == 200){
 				$scope.msg = '操作成功！';
 	 			angular.element('#J_Alert').modal('show');
 	 			$scope.blockFlag = 0;
 	 			$scope.getProtectObjs();
 			}
 			$scope.apply();
		 },
		 fnFail = function(data){
		 	console.log(data.errMsg || '操作失败');
		 };
		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
 	};
 	
 	//删除保护对象
 	$scope.deletObj = function(dbid){
 		if(dbid){
 			$scope.deleteID = dbid;
 		}else{
 			if($scope.checked.length == 0){
 	 			$scope.msg = '请至少选择一个保护对象！';
 				angular.element('#J_Alert').modal('show');
 				return;
 	 		}
 	 		$scope.deleteID = $scope.checked.join();  		
 		}
		
		$scope.confirmCont = '确定要删除保护对象吗？';
		angular.element('#J_confirm').modal('show');
		$scope.Obj.init.actionType = 'delete';
 	};
 	
 	
 	//选择oracle出现rac配置
 	$scope.chooseDbType = function(item){
 		if(item == 'oracle'){
 			$scope.racFlag = true;
 		}else{
 			$scope.racFlag = false;
 		}
 	};
 	
 	//重置rac配置提示语
 	$scope.resetRac = function(){
 		$scope.rac_ip_blank = false;
 		$scope.rac_port_blank = false;
 		$scope.rac_ip_blank = false;
 		$scope.rac_info_exist = false;
 		$scope.rac_ip_blank_e = false;
 		$scope.rac_port_blank_e = false;
 		$scope.rac_ip_blank_e = false;
 		$scope.rac_info_exist_e = false;
 	};

 	//添加rac节点弹窗
 	$scope.addRACPop = function(){
 		$scope.resetRac();
 		$scope.Obj.init.racObj = {};
 		$scope.Obj.init.objInfo.racIps = [];
		$scope.Obj.init.objInfo.racPorts = [];
		$scope.Obj.init.objInfo.racSids = [];
		$scope.Obj.init.objInfo.racStatus = [];
 		$scope.Obj.init.actionType = 'addRac';
 		$scope.modalTitle = 'RAC节点添加';
 		angular.element('#J_addRAC').modal('show');
 		angular.element('#J_addRAC').draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
 		})
 	};
 	
 	//rac对象属性转化
 	$scope.changeRac = function(list,obj){
 		obj.racIps = [];
 		obj.racPorts = [];
 		obj.racSids = [];
 		obj.racStatus = [];
 		angular.forEach(list, function (i) {
			obj.racIps.push(i.racIp);
			obj.racPorts.push(i.racPort);
			obj.racSids.push(i.racSid);
			obj.racStatus.push(i.status);
        })

 		obj.racIps = obj.racIps.join();
 		obj.racPorts = obj.racPorts.join();
 		obj.racSids = obj.racSids.join();
 		obj.racStatus = obj.racStatus.join();
 	};
 	
 	//判断rac信息是否相同
 	$scope.checkRacInfoEquel = function(obj,arr){
 		var newRac = Object.getOwnPropertyNames(obj);
 		if(newRac.length > 3){
 			newRac = ["racIp","racPort","racSid"];
 		}
 		for(var i = 0; i < arr.length; i++){
 			var matchObj = {"racIp":arr[i].racIp,"racPort":arr[i].racPort,"racSid":arr[i].racSid};
 			var matchRac = Object.getOwnPropertyNames(matchObj);
 			
 			if (newRac.length != matchRac.length) {
 	            return false;
 	        }
 			
           var propName1 = newRac[0],
           	   propName2 = newRac[1],
           	   propName3 = newRac[2];
           
            if (obj[propName1] == matchObj[propName1] && obj[propName2] == matchObj[propName2] && obj[propName3] == matchObj[propName3] ) {
                return false;
            }
 		}
 		return true;
 	};
 	
 	//添加rac弹窗
 	$scope.AddRac = function(){
 		if(!$scope.Obj.init.racObj.racIp){
 			$scope.rac_ip_blank = true;
 			return;
 		}else{
 			$scope.rac_ip_blank = false;
 			var flag = true;
 			var regNum = /^[a-zA-Z]/;
			if(regNum.test($scope.Obj.init.racObj.racIp)){
				if(!Validate.validcom($scope.Obj.init.racObj.racIp)){
					flag = false;
				}
			}else{
				if(!Validate.validIp($scope.Obj.init.racObj.racIp)){
					flag = false;
				}
			} 
			if(flag == false){
				$scope.rac_ip_val = true;
				return;
			}else{
				$scope.rac_ip_val = false;
			}
 		}
 		if(!$scope.Obj.init.racObj.racPort){
 			$scope.rac_port_blank = true;
 			return;
 		}else{
 			$scope.rac_port_blank = false;
 			if(!Validate.validPort($scope.Obj.init.racObj.racPort)){
 				$scope.rac_port_val = true;
 				return;
 			}else{
 				$scope.rac_port_val = false;
 			}
 		}
 		if(!$scope.Obj.init.racObj.racSid){
 			$scope.rac_sid_blank = true;
 			return;
 		}else{
 			$scope.rac_sid_blank = false;
 		}
 		
 		if(!$scope.checkRacInfoEquel($scope.Obj.init.racObj,$scope.cache.racList)){
 			$scope.rac_info_exist = true;
 			return;
 		}else{
 			$scope.rac_info_exist = false;
 		}
 		
		$scope.Obj.init.racObj.status = '1';
		$scope.cache.racList.push($scope.Obj.init.racObj);
		$scope.changeRac($scope.cache.racList,$scope.Obj.init.objInfo)
		angular.element('#J_addRAC').modal('hide');
 	};
 	
 	//编辑rac
 	$scope.EditRac = function(){
 		if(!$scope.cache.racCache.racIp){
 			$scope.rac_ip_blank_e = true;
 			return;
 		}else{
 			$scope.rac_ip_blank_e = false;
 			var flag = true;
 			var regNum = /^[a-zA-Z]/;
			if(regNum.test($scope.cache.racCache.racIp)){
				if(!Validate.validcom($scope.cache.racCache.racIp)){
					flag = false;
				}
			}else{
				if(!Validate.validIp($scope.cache.racCache.racIp)){
					flag = false;
				}
			} 
			if(flag == false){
				$scope.rac_ip_val_e = true;
				return;
			}else{
				$scope.rac_ip_val_e = false;
			}
 		}
 		if(!$scope.cache.racCache.racPort){
 			$scope.rac_port_blank_e = true;
 			return;
 		}else{
 			$scope.rac_port_blank_e = false;
 			if(!Validate.validPort($scope.cache.racCache.racPort)){
 				$scope.rac_port_val_e = true;
 				return;
 			}else{
 				$scope.rac_port_val_e = false;
 			}
 		}
 		if(!$scope.cache.racCache.racSid){
 			$scope.rac_sid_blank_e = true;
 			return;
 		}else{
 			$scope.rac_sid_blank_e = false;
 		}
 		
 		raclist.splice(idx,1);
 		if(!$scope.checkRacInfoEquel($scope.cache.racCache,raclist)){
	 		$scope.rac_info_exist_e = true;
			return;
		}else{
			$scope.rac_info_exist_e = false;
		}
 		
 		$scope.cache.racList[idx] = $scope.cache.racCache;
		$scope.changeRac($scope.cache.racList,$scope.Obj.init.objInfo)
		angular.element('#J_editRAC').modal('hide');
 	};
 	
 	//点击弹窗确认
    $scope.clickOk = function(event){
    	var it = $(event.target),
    		type = $scope.Obj.init.actionType;
    	
    	switch(type){
    		case 'addRac':
    			$scope.AddRac();
    		break;
    		case 'editRac':
    			$scope.EditRac();
    		break;
    		default:
    			angular.element('.modal').modal('hide');
    		break;
    	}
    };
    
    //confirm弹框
    $scope.clickComfirm = function(event){
    	var it = $(event.target),
		type = $scope.Obj.init.actionType;
    	
    	switch(type){
			case 'set':
		 		angular.element('#J_confirm').modal('hide');
		 		$scope.setStatusFun($scope.setStatu,$scope.setDbid);
			break;
			case 'delete':
		 		angular.element('#J_confirm').modal('hide');
		 		$scope.deleteObjFun($scope.deleteID);
			break;
			default:
				angular.element('#J_confirm').modal('hide');
			break;
		}
    };
    
    //弹窗取消
    $scope.cancelFun = function(){
    	var type = $scope.Obj.init.actionType;
    	switch(type){
	    	case 'editRac':
	    		$scope.cache.racList[idx] = rac;
			break;
			default:
				angular.element('.modal').modal('hide');
			break;
    	}
    };
    
    //编辑rac
    var idx = -1,
    	rac = {},
    	raclist = [];
    $scope.editRac = function($index,item){
    	$scope.resetRac();
    	$scope.Obj.init.actionType = 'editRac';
    	$scope.cache.racCache = $scope.cache.racList[$index];
    	rac = angular.copy($scope.cache.racCache);
    	raclist = angular.copy($scope.cache.racList);
    	idx = $index;
    	$scope.modalTitle = 'RAC节点编辑';
 		angular.element('#J_editRAC').modal('show');
 		angular.element('#J_editRAC').draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
 		})
    };
    
    //禁用/启用Rac
    $scope.setRacStatus = function(type,$index){
    	$scope.cache.racList[$index].status = type;
    };
    
    //删除rac
    $scope.deleteRac = function(index){
    	$scope.cache.racList.splice(index,1);
    };
 	
 	//测试服务弹窗
 	$scope.testLinkServer = function(){
 		if($scope.submitValidate() == 1){
 			return;
 		};
 		$scope.modalTitle = '测试服务';
 		angular.element('#J_testLink').modal('show');
 		angular.element('#J_testLink').draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
 		})
 		$scope.Obj.init.actionType = 'normal';
 		$scope.testflag = true;
 		$scope.testResult = 0;
 		$scope.linkWating('set');
 		var config = {
 			 url:  $scope.Obj.ProtectObjUrl.url + '?cmd=testservice',
 			 method: 'post',
 			 data: {
 				 'ip':$scope.Obj.init.objInfo.ip || '',
 				 'port':$scope.Obj.init.objInfo.port || ''
 			 }
 		},
 		fnSuccess = function (d){
 			if(d == 421){
 				$scope.testLinkMsg = '参数异常!';
 				$timeout(function(){
					$scope.testflag = false;
		 	 		$scope.linkWating('stop');
		 	 		$scope.testResult = 2;
 			   },2000);
 			}else if(d == 110){
 				$scope.testLinkMsg = '当前接口仅限于linux环境下执行!';
 				$timeout(function(){
					$scope.testflag = false;
		 	 		$scope.linkWating('stop');
		 	 		$scope.testResult = 2;
 			   },2000);
 			}else if(d == 202){
 				$scope.testLinkMsg = '操作失败!';
 				$timeout(function(){
					$scope.testflag = false;
		 	 		$scope.linkWating('stop');
		 	 		$scope.testResult = 2;
 			   },2000);
 			}else if(d == 200){
 				$scope.testLinkMsg = '操作成功!';
 				$timeout(function(){
					$scope.testflag = false;
		 	 		$scope.linkWating('stop');
		 	 		$scope.testResult = 1;
 			   },2000);
 			}
	 		$scope.apply();
 		},
 		fnFail = function(data){
 			 console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 		
 		
 	};
 	
 	$scope.testJdbcFun = function(){
 		var typeCache;
 		if($scope.editKey == 'edit'){
 			typeCache = $scope.Obj.init.objInfo.dbtype;
 		}else if($scope.editKey == 'add'){
 			typeCache = $scope.Obj.init.objInfo.dbtypeShow;
 		}
 		var config = {
 			 url:  $scope.Obj.ProtectObjUrl.url + '?cmd=testjdbc',
 			 method: 'post',
 			 data: {
 				"dbtype":typeCache,
 				"ip":$scope.Obj.init.objInfo.ip || '',
 				"port":$scope.Obj.init.objInfo.port || '',
 				"sid":$scope.Obj.init.objInfo.sid || '',
 				"servicename":$scope.Obj.init.objInfo.servicename || '',
 				"sysname":$scope.Obj.init.objInfo.sysname || '',
 				"syspass":$scope.Obj.init.objInfo.syspass || '',
 				"userDealWay":$scope.Obj.init.objInfo.userDealWay
 				}

 	 		},
 	 		fnSuccess = function (d){
 	 			if(d == 101){
 	 				$timeout(function(){
	 	 				$scope.testjdbcInfo = '数据库账号与密码正确，连接成功！';
	 	 				$scope.testjdbcErr = false;
	 	 				$scope.testflag = false;
	 	 	 	 		$scope.linkWating('stop');
	 	 	 	 		$scope.testResult = 1;
 	 				},2000)
 	 			}else if(d == 421){
 	 				$timeout(function(){
	 	 				$scope.testjdbcInfo = '参数格式错误，校验失败！';
	 	 				$scope.testflag = false;
	 	 	 	 		$scope.linkWating('stop');
	 	 	 	 		$scope.testResult = 2;
	 	 	 	 		$scope.testjdbcErr = true;
 	 				},2000)
 	 			}else if(d == 102){
 	 				$timeout(function(){
	 	 				$scope.testjdbcInfo = '数据库账号或密码错误，连接失败！';
	 	 				$scope.testflag = false;
	 	 	 	 		$scope.linkWating('stop');
	 	 	 	 		$scope.testResult = 2;
	 	 	 	 		$scope.testjdbcErr = true;
 	 				},2000)
 	 			}else if(d == 103){
 	 				$timeout(function(){
	 	 				$scope.testjdbcInfo = '数据库账号与密码正确，但是没有SYSDBA权限，注册时无法通过该账户创建最小权限账户！';
	 	 				$scope.testflag = false;
	 	 	 	 		$scope.linkWating('stop');
	 	 	 	 		$scope.testResult = 2;
	 	 	 	 		$scope.testjdbcErr = true;
 	 				},2000)
 	 			}
 		 		$scope.apply();
 	 		},
 	 		fnFail = function(data){
 	 			 console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
 	};
 	
 	$scope.valAccount = function(){
 		if($scope.Obj.init.objInfo.sysname && !$scope.Obj.init.objInfo.syspass){
 			$scope.dbUser = true;
 			return 1;
 		}else if(!$scope.Obj.init.objInfo.sysname && $scope.Obj.init.objInfo.syspass){
 			$scope.dbUser = true;
 			return 1;
 		}else{
 			$scope.dbUser = false;
 		}
 	};
 	
 	//测试数据库链接
 	$scope.testLinkjdbc = function(){
 		if($scope.submitValidate() == 1){
 			return;
 		}
 		if(!$scope.Obj.init.objInfo.sysname || !$scope.Obj.init.objInfo.syspass){
 			$scope.dbUser = true;
 			return;
 		}else{
 			if($scope.valAccount() == 1){
 				return;
 			}
 			$scope.dbUser = false;
 		}
 		//$scope.isOnly();
 		$scope.isOnly().then(function(){
 			$scope.modalTitle = '测试数据库服务';
 	 		angular.element('#J_testjdbc').modal('show');
 	 		angular.element('#J_testjdbc').draggable({ 
 	 			handle: ".modal-header", 
 	 			cursor: 'move', 
 	 			refreshPositions: false 
 	 		})
 	 		$scope.Obj.init.actionType = 'normal';
 	 		$scope.testflag = true;
 	 		$scope.testResult = 0;
 	 		$scope.linkWating('set');
 	 		
 	 		
 	 		if($scope.Obj.init.objInfo.syspass.replace('njs-','') == $scope.cache.objPwd){     //密码未修改
 	 			if($scope.Obj.init.objInfo.syspass.indexOf('js-') != -1){
 	 				$scope.testJdbcFun();
 	 			}else{
 	 				$scope.Obj.init.objInfo.syspass = 'njs-' + $scope.Obj.init.objInfo.syspass.replace('njs-','');
 	 	 	 		$scope.testJdbcFun();
 	 			}
 			}else{    //有修改密码                                                      
 				$scope.encryptPass($scope.Obj.init.objInfo.syspass).then(function(){
 	 	 			$scope.testJdbcFun();
 	 	 		})
 			}
 		})
 	};

 	//测试等待动画
 	$scope.linkWating = function(key){
 		if(key == 'set'){
 			var marginLeft = 0;
 			$scope.set = $interval(function(){
 				marginLeft += 10 ;
 				if(marginLeft >= 405){
 					marginLeft = -70;
 					$('.testLink-line-block').css('margin-left',marginLeft + 'px');
 				}else{
 					$('.testLink-line-block').css('margin-left',marginLeft + 'px');
 				}

 			},20)
 		}else if(key == 'stop'){
 			$interval.cancel($scope.set);
 		}
 	};
 	
 	//全选
	$scope.selectAll = function () {
        if($scope.checkAll) {
 			$scope.checked = [];
            angular.forEach($scope.cache.ObjList, function (i) {
                i.checked = true;
                $scope.checked.push(i.id);
                $scope.cache.objStatus.push(i.status);
            })
        }else {
            angular.forEach($scope.cache.ObjList, function (i) {
                i.checked = false;
                $scope.checked = [];
                $scope.cache.objStatus = [];
            })
        }
    };
    //单选
    $scope.selectOne = function () {
        angular.forEach($scope.cache.ObjList , function (i) {
            var index = $scope.checked.indexOf(i.id);
            if(i.checked && index === -1) {
                $scope.checked.push(i.id);
                $scope.cache.objStatus.push(i.status);
            } else if (!i.checked && index !== -1){
                $scope.checked.splice(index, 1);
                $scope.cache.objStatus.splice(index, 1);
            };
        })
        if ($scope.cache.ObjList.length === $scope.checked.length) {
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

