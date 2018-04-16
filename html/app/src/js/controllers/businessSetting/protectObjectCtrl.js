'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:ProtectObjectCtrl
 * @description
 * @author 
 * Controller of the myappApp
 */
 angular.module('myappApp')
 .controller('ProtectObjectCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q','commonFuntion', '$state', 
                                  function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, commonFuntion, $state) { 	

	 $scope.initData = {
		tableOrder: {
			orderListKey:'', //保护对象列表选中项
			sortType:''
		},
		protectList: {
			checkAll: false,  //保护对象列表全选CheckBox
			checked:[]        //保护对象列表选中项			
		},
 		srcInfo: {
 			srcSelect: 'all',
 			srcText:''
 		},
 		pager: {}, 
		ProtectObjUrl: {   //获取保护对象列表
 			url: urlPrefix + '/assetProtectObject',
 			method: 'get',
 			data: {}
 		},
 		setStatusUrl: {   //启禁用保护对象
 			url: urlPrefix + '/asset/database/#id/#status?cmd=set',
 			method: 'post',
 			data: {}
 		},
 		deleteObjUrl: {   //删除保护对象
 			url: urlPrefix + '/asset/database/#id?cmd=delete',
 			method: 'post',
 			data: {}
 		}
	 };
	 
	 $scope.cache = { 
		actionType: 'default',
		actionInfo: '',
		mainItem:{}
	 };
	 
	 
	 //初始化
	 $scope.init = function(){
		 $scope.getProtectList();
	 };

	 $scope.alertA = function(a){
		 var b = a.replace(/\ +/g,"").replace(/[\r\n]/g,"").split(';')
		 console.log(b)
	 };
	 
	 //判断是否有选中保护对象
	 $scope.checkObjIsExist = function( checkList, item ){
		 if( item ) {
			 $scope.cache.mainItem = item;
			 return true;
		 }else{
			 if( $scope.initData.protectList.checked.length == 0 ){
				$rootScope.msg = '请至少选择一个保护对象！';
				angular.element('#J_Alert').modal('show');
				return false; 
			 }else{
				 return true;
			 }
		 } 
	 };
	 
	 //启用/禁用按钮操作
	 $scope.setStatusAction = function( status, item ){
		 commonFuntion.initModalStyle();
		 if( !$scope.checkObjIsExist( $scope.initData.protectList.checked, item ) ) return;
		 
		 for( var i = 0; i<$scope.objList.length; i++  ){
			 for( var j = 0; j<$scope.initData.protectList.checked.length; j++ ){
				 if( $scope.objList[i].id == $scope.initData.protectList.checked[j] && $scope.objList[i].use_flag == status ){
					 if( status == '1' ){
						 $rootScope.msg = '选项中已经包含已启用对象！';
					 }else if( status == '0' ){
						 $rootScope.msg = '选项中已经包含已禁用对象！';
					 }
					 angular.element('#J_Alert').modal('show');
	    			 return; 
				 }
			 }
		 }
		 
		 if( status == '1' ){
			 $scope.confirmCont = '确定要启用保护对象吗？';
		 }else if( status == '0' ){
			 $scope.confirmCont = '确定要禁用保护对象吗？';
		 }
		 
		 $scope.cache.actionInfo = status;
		 $scope.cache.actionType = 'set';
		 angular.element('#J_confirm').modal('show');
	 };
	 
	 //启禁用方法
	 $scope.setStatusFunc = function( status, item ){
		 var config = {
 			url:  $scope.initData.setStatusUrl.url,
 			method: $scope.initData.setStatusUrl.method,
 			data: {}
 		 },
 		 fnSuccess = function (d){
			 $scope.cache.actionType = 'default';
			 if( d == '200' ){
				 $rootScope.msg = '操作成功';
			 }else if( d == '421' ){
				 $rootScope.msg = '参数异常';
			 }else if( d == '202' ){
				 $rootScope.msg = '操作失败';
			 }
			 $scope.cache.mainItem = {};
			 $scope.clearCheckboxFun();
			 angular.element('#J_Alert').modal('show');
 		 },
 		 fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		 };
 		 
 		 var postId = item.id || $scope.initData.protectList.checked.join();
		 config.url = config.url.replace('#id', postId );
		 config.url = config.url.replace('#status', status );
 		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //删除保护对象确认
	 $scope.deletObj = function( item ) {
		 commonFuntion.initModalStyle();
		 if( !$scope.checkObjIsExist( $scope.initData.protectList.checked, item ) ) return;
		 
		 $scope.confirmCont = '确定要删除保护对象吗？'
		 $scope.cache.actionType = 'delete';
		 angular.element('#J_confirm').modal('show');
	 };
	 
	 //删除保护对象方法
	 $scope.deleteObjFunc = function( item ) {
		 var config = {
 			url:  $scope.initData.deleteObjUrl.url,
 			method: $scope.initData.deleteObjUrl.method,
 			data: {}
 		 },
 		 fnSuccess = function (d){
			 $scope.cache.actionType = 'default';
			 if( d == '200' ){
				 $rootScope.msg = '操作成功';
			 }else if( d == '421' ){
				 $rootScope.msg = '参数异常';
			 }else if( d == '202' ){
				 $rootScope.msg = '操作失败';
			 }
			 $scope.cache.mainItem = {};
			 $scope.clearCheckboxFun();
			 angular.element('#J_Alert').modal('show');
 		 },
 		 fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		 };
 		 
 		 var postId = item.id || $scope.initData.protectList.checked.join();
		 config.url = config.url.replace('#id', postId );
 		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //获取保护对象列表
	 $scope.getProtectList = function( orderKey ){
	 	var orderListCache = commonFuntion.orderList( orderKey, $scope.initData.tableOrder.orderListKey, $scope.initData.tableOrder.sortType );
 		$scope.initData.tableOrder.orderListKey = orderListCache.orderColum;
 		$scope.initData.tableOrder.sortType = orderListCache.sortType;
 		
 		var postData = {
			'currentPage': $scope.initData.pager.curPage || 1,
			'pageSize': parseInt($scope.initData.pager.pageSize) || 10,
			'paged': true,
			'searchField': $scope.initData.srcInfo.srcSelect || '',
			'searchParam': $scope.initData.srcInfo.srcText || '',
			'orderField': orderKey || ''
		};
 		
 		var config = {
 			url:  $scope.initData.ProtectObjUrl.url,
 			method: $scope.initData.ProtectObjUrl.method,
 			data: postData
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.objList = data.items;
 			$scope.initData.pager.total = parseInt(data.totalCount);
 			$scope.initData.pager.totalPage = Math.ceil( data.totalCount / parseInt($scope.initData.pager.pageSize) );

 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	
	 $scope.ale = function(i){
		$scope.mainObj = i;		
		$scope.showItemName = [{label:'名称',name:'name'},{label:'状态',name:'status','ps':[{data:0,value:'启用'},{data:1,value:'禁用'}] },{label:'数据库类型',name:'dbtype'},{label:'服务器地址配置串',name:'hostname'}];

	 };
	 
	//点击弹窗确认
    $scope.clickOk = function( event ){
    	var it = $(event.target),
			type = $scope.cache.actionType;
	
    	switch(type){
			default:
				angular.element('.modal').modal('hide');
			break;
    	}
     };
     
     //confirm弹框
    $scope.clickComfirm = function(event){
     	var it = $(event.target),
 		type = $scope.cache.actionType;
     	
     	switch(type){
	     	case 'set':
		 		angular.element('#J_confirm').modal('hide');
		 		$scope.setStatusFunc( $scope.cache.actionInfo, $scope.cache.mainItem );
			break;
	     	case 'delete':
		 		angular.element('#J_confirm').modal('hide');
		 		$scope.deleteObjFunc( $scope.cache.mainItem );
			break;
 			default:
 				angular.element('#J_confirm').modal('hide');
 			break;
 		}
     };
	 
	 //保护对象列表全选
	 $scope.protectList_selectAll = function( i, list ) {
		 $scope.initData.protectList.checked = commonFuntion.selectAll( i, list );
	 };
	 
	 //保护对象列表单选
	 $scope.protectList_selectOne= function( i, list ) {
		 commonFuntion.selectOne( list, $scope.initData.protectList );
	 };
	 
	 //清空全选和单选checkbox
	 $scope.clearCheckboxFun = function() {
		 $scope.initData.protectList.checkAll = false;
		 $scope.initData.protectList.checked = [];
		 $scope.objList.map( commonFuntion.cancelSelectOne ); 
	 };

 	 //切换表格排序箭头
 	 $scope.orderArrowClass = function( str, order ) {
 		var arrowClass = commonFuntion.orderArrowClass( str, order.orderListKey, order.sortType );
 		return arrowClass;
 	 };
 	 
	 //添加保护对象
	 $scope.addProtectObj = function() {
		 $state.go("main.addProtectObj")
	 };
	 
	 //智能添加跳转
	 $scope.autoAddObj = function() {
		 $state.go("main.autoAddObj");
	 };
	 
	 //进入管理页面
	 $scope.manageObj = function(item) {
		 $state.go("main.protectObjInfo", {POid: item.id});
	 };
    
 	 $scope.apply = function() {
 		if(!$scope.$$phase) {
 			$scope.$apply();
 		}
 	 };
 }]);


 
 