angular.module('myappApp')
 .controller('AutoAddObjCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q','commonFuntion', '$stateParams', '$state',
                                function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, commonFuntion, $stateParams, $state) {
	 
	 $scope.initData = {
		 protectInfo: {
		 	object_type: '1',
		 	db_type: 'oracle'
		 },
		 scanList: {
		 	checkAll: false,  //扫描列表全选CheckBox
		 	checked:[]        //扫描列表选中项
		 },
		 pager: {}, 
		 ProtectObjUrl: {   //获取保护对象列表
			url: urlPrefix + '/assetProtectObject',
			method: 'get',
			data: {}
		 },
		 protectInfo: {
		 	object_type: '1',
		 	db_type: 'oracle'
		 },
		 addObjUrl: {   //添加保护对象
			url: urlPrefix + '/assetProtectObject',
			method: 'post',
			data: {}
		 },
		 scanAddressUrl: {   //智能扫描IP段
			url: urlPrefix + '/protectObj/asset/hosts?cmd=scan',
			method: 'post',
			data: {}
		 }
	 };

	 $scope.cache = {
		actionType: 'normal',
		nodeObj: {},
		scanObjList: [],
		objList: [],
		existObjId: '',
	 };
	 $scope.pager = {};
	 
	 //初始化
	 $scope.AutoAddObjsInit = function(){
	 };

	 //提交保护对象信息
	 $scope.submitNewObj = function( obj, list ){
		var nodes = [];  //保存选中的节点信息
		angular.forEach( list, function( i ){
			for( var j = 0; j < obj.checked.length; j++ ){
				if( i.id == obj.checked[j] ){
					nodes.push({
						"host": i.host,
						"port": i.port,
						"name": i.host + ':' + i.port
					})
				}
			}
		} );
		var postData = {};
		if( $scope.cache.actionType === 'new' ){
			postData = {
				"obj_id": "",
				"name": $scope.initData.protectInfo.name,
				"object_type": $scope.initData.protectInfo.object_type,
				"db_type": $scope.initData.protectInfo.db_type,
				"nodes": nodes
		   };
		}
		else if( $scope.cache.actionType === 'exist' ){
			angular.forEach( $scope.cache.objList, function( i ){
				if( i.id == $scope.cache.existObjId ){
					postData = {
						"obj_id": "",
						"name": i.name,
						"object_type": i.object_type,
						"db_type": i.db_type,
						"nodes": nodes
				   };
				}
			} );
		}
		console.log(postData)
		var config = {
			url:  $scope.initData.addObjUrl.url,
			method: $scope.initData.addObjUrl.method,
			data: postData
		 },
		 fnSuccess = function (d){
			$scope.cache.actionType = 'normal';
			$rootScope.msg = d.result;
			angular.element('#J_Alert').modal('show');
			//$state.go('main.protectObject');
		 },
		 fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		 };
		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	};
	 
	 //智能扫描IP段
	 $scope.scanIPFunc = function(){
		var postData = $scope.cache.nodeObj.scanAddress;
		var config = {
			url:  $scope.initData.scanAddressUrl.url,
			method: $scope.initData.scanAddressUrl.method,
			data: postData
		 },
		 fnSuccess = function (d){
			$scope.cache.scanObjList = d;
		 },
		 fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		 };
		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //切换表格排序箭头
 	//  $scope.orderArrowClass = function( str, order ){
 	// 	var arrowClass = commonFuntion.orderArrowClass( str, order.orderListKey, order.sortType );
 	// 	return arrowClass;
 	//  };
	 
	 //新建保护对象性
	 $scope.NewObj = function(){
		 if( !$scope.checkObjIsExist( $scope.initData.scanList ) ) return;
		 $scope.cache.actionType = 'new';
		 $( '.J_modal-dialog' ).css( 'width', '600px' );
		 $scope.modalTitle = '新增保护对象';
 		 angular.element( '#J_autoNewObj' ).modal( 'show' );
 		 angular.element( '#J_autoNewObj' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	 }); 
	 };
	 
	 //添加到现有保护对象性
	 $scope.NewExistObj = function(){
		 if( !$scope.checkObjIsExist( $scope.initData.scanList ) ) return;
		 $scope.cache.actionType = 'exist';
		 $scope.modalTitle = '新增保护对象';
		 $( '.J_modal-dialog' ).css( 'width', '1000px' );
 		 angular.element( '#J_autoExistObj' ).modal( 'show' );
 		 angular.element( '#J_autoExistObj' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
		  }); 
		  $scope.getProtectList();
	 };

	 //获取保护对象列表
	 $scope.getProtectList = function( orderKey ){
		// var orderListCache = commonFuntion.orderList( orderKey, $scope.initData.tableOrder.orderListKey, $scope.initData.tableOrder.sortType );
		// $scope.initData.tableOrder.orderListKey = orderListCache.orderColum;
		// $scope.initData.tableOrder.sortType = orderListCache.sortType;
		
	// 	var postData = {
	// 	   'currentPage': $scope.initData.pager.curPage || 1,
	// 	   'pageSize': parseInt($scope.initData.pager.pageSize) || 10,
	// 	   'paged': true,
	// 	   'searchField': $scope.initData.srcInfo.srcSelect || '',
	// 	   'searchParam': $scope.initData.srcInfo.srcText || '',
	// 	   'orderField': orderKey || ''
	//    };
		
		var config = {
			url:  $scope.initData.ProtectObjUrl.url,
			method: $scope.initData.ProtectObjUrl.method,
			data: {}//postData
		},
		fnSuccess = function (d){
			var data = typeof(d)==='string' ? JSON.parse(d) : d;
			$scope.cache.objList = data.items;
			$scope.apply();
		},
		fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		};
		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };

	 //判断是否有选中资产集合
	 $scope.checkObjIsExist = function( obj ){
		if( obj.checked.length === 0 ){
			 $rootScope.msg = '请至少选择一个保护对象！';
			 angular.element('#J_Alert').modal('show');
			 return false;
		}else{
			return true;
		}
	 };

	 //点击弹窗确认
     $scope.clickOk = function( event ){
    	var it = $(event.target),
			type = $scope.cache.actionType;
	
    	switch(type){
    		case 'new':
    			angular.element('#J_autoNewObj').modal('hide');
    			$scope.submitNewObj( $scope.initData.scanList, $scope.cache.scanObjList );
			break;
			case 'exist':
    			angular.element('#J_autoExistObj').modal('hide');
    			$scope.submitNewObj( $scope.initData.scanList, $scope.cache.scanObjList );
    		break;
			default:
				angular.element('.modal').modal('hide');
			break;
    	}
     };

	 //保护对象列表全选
	 $scope.selectAll = function( i, list ) {
		$scope.initData.scanList.checked = commonFuntion.selectAll( i, list );
	 };
	 
	 //保护对象列表单选
	 $scope.selectOne= function( list, obj ) {
	 	commonFuntion.selectOne( list, obj );
	 };
	 
	 //清空全选和单选checkbox
	 $scope.clearCheckboxFun = function() {
	 	$scope.initData.protectList.checkAll = false;
	 	$scope.initData.protectList.checked = [];
	 	$scope.objList.map( commonFuntion.cancelSelectOne ); 
	 };
	 
	 $scope.backToList = function(){
		$state.go('main.protectObject'); 
	 };
	 
 	 $scope.apply = function() {
  		if(!$scope.$$phase) {
  			$scope.$apply();
  		}
  	};
 }]);