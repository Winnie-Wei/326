angular.module('myappApp')
 .controller('SelectAuditCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q','commonFuntion', '$stateParams', '$state',
                                function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, commonFuntion, $stateParams, $state) {
	 
	 $scope.initData = {
		tableOrder: {
			orderListKey: {},
			sortType:''
		},
		addAuditOrder: {
			orderListKey: {},
			sortType:''
		},
		headerInfo: {},
		POid: '',
		auditList: {
			checkAll: false,
			checked:[]
		},
		addAuditList: {
			checkAll: false,
			checked:[]
		},
		getOneObjectUrl: {   //根据id获取单个保护对象信息
			url: urlPrefix + '/CassetProtectObject/#id',
			method: 'get',
			data: {}
		},
		getSensAssetListUrl: {   //获取当前保护对象下的敏感资产集合列表
			url: urlPrefix + '/protectObj/sensAsset/list/#id',
			method: 'get',
			data: {}
		},
		getunSensAssetListUrl: {   //获取当前保护对象下的敏感资产集合列表
			url: urlPrefix + '/protectObj/unsensAsset/list/#id',
			method: 'get',
			data: {}
		},
		deleteItemUrl: {   //根据集合ID 把集合从选择性审计列表中删除
			url: urlPrefix + '/protectObj/sensAsset/list/#id/#c_id?cmd=del',
			method: 'post',
			data: {}
		},
		addAssetUrl: {   //添加集合
			url: urlPrefix + '/protectObj/sensAsset/list/#id/#c_id?cmd=add',
			method: 'post',
			data: {}
		}		
	 };

	 $scope.cache = {
		actionType: '',
		mainItem: {},
		senseAssetList: [],
		unSenseAssetList: []
	 };
	 
	 //初始化
	 $scope.auditInit = function(){
		 $scope.initData.POid = $stateParams['POid'];
		 $scope.getSensAssetList();
		 $scope.getCurrentObject();
	 };

	 //获取当前id的保护对象信息
	 $scope.getCurrentObject = function(){
		var config = {
 			url:  $scope.initData.getOneObjectUrl.url,
 			method: $scope.initData.getOneObjectUrl.method,
 			data: {}
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.setHeaderInfo(d);
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };

	 //设置头部信息
	 $scope.setHeaderInfo = function( data ){
		$scope.initData.headerInfo = {
		   "name": data.name,
		   "use_flag": data.use_flag,
		   "db_type": data.db_type,
		   "object_type": data.object_type
		};
	 };
	 
	 //获取资产集合列表
	 $scope.getSensAssetList = function( orderKey ){
		var orderListCache = commonFuntion.orderList( orderKey, $scope.initData.tableOrder.orderListKey, $scope.initData.tableOrder.sortType );
		$scope.initData.tableOrder.orderListKey = orderListCache.orderColum;
		$scope.initData.tableOrder.sortType = orderListCache.sortType;

		 var config = {
		 	url:  $scope.initData.getSensAssetListUrl.url,
		 	method: $scope.initData.getSensAssetListUrl.method,
		 	data: {}//data
		 },
		 fnSuccess = function (d){
		 	var data = typeof(d)==='string' ? JSON.parse(d) : d;
		 	$scope.cache.senseAssetList = d.conns;
		 	$scope.apply();
		 },
		 fnFail = function(data){
		 	console.log(data.errMsg || '操作失败');
		 };
		 config.url = config.url.replace('#id', $scope.initData.POid );
 
		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };

	 //获取当前保护对象下的非敏感资产集合列表
	 $scope.getunSensAssetList = function( orderKey ){
         var orderListCache = commonFuntion.orderList( orderKey, $scope.initData.addAuditOrder.orderListKey, $scope.initData.addAuditOrder.sortType );
         $scope.initData.addAuditOrder.orderListKey = orderListCache.orderColum;
         $scope.initData.addAuditOrder.sortType = orderListCache.sortType;

		 var config = {
		 	url:  $scope.initData.getunSensAssetListUrl.url,
		 	method: $scope.initData.getunSensAssetListUrl.method,
		 	data: {}
		 },
		 fnSuccess = function (d){
		 	var data = typeof(d)==='string' ? JSON.parse(d) : d;
		 	$scope.cache.unSenseAssetList = d.conns;
		 	$scope.apply();
		 },
		 fnFail = function(data){
		 	console.log(data.errMsg || '操作失败');
		 };
		 config.url = config.url.replace('#id', $scope.initData.POid );
 
		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };	 

	 //集合从选择性审计列表中删除
	 $scope.deleteConnFunc = function( item ){
		var config = {
			url:  $scope.initData.deleteItemUrl.url,
			method: $scope.initData.deleteItemUrl.method,
			data: {}
		},
		fnSuccess = function (d){
			//var data = typeof(d)==='string' ? JSON.parse(d) : d;
			$rootScope.msg = '删除成功！'//d.result;
			angular.element('#J_Alert').modal('show');
			$scope.cache.mainItem = {};
			$scope.clearCheckboxFun( $scope.initData.auditList, $scope.cache.senseAssetList );		
			$scope.cache.actionType = 'normal';	
			$scope.apply();
		},
		fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		};

		var postId = item.id || $scope.initData.auditList.checked.join();
		config.url = config.url.replace('#id', $scope.initData.POid );
		config.url = config.url.replace('#c_id', postId );
		
		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };

	 //删除确认
	 $scope.deleteComfirm = function( item ){
		if( !$scope.checkObjIsExist( $scope.initData.auditList.checked, item ) ) return;
		$scope.confirmCont = '确定要删除该集合吗？'
		$scope.cache.actionType = 'delete';
		angular.element('#J_confirm').modal('show');
	 };

	 //添加集合
	 $scope.addAssetFunc = function( item ){
		var config = {
			url:  $scope.initData.addAssetUrl.url,
			method: $scope.initData.addAssetUrl.method,
			data: {}
		},
		fnSuccess = function (d){
			//var data = typeof(d)==='string' ? JSON.parse(d) : d;
			$rootScope.msg = '添加成功！'//d.result;
			angular.element('#J_Alert').modal('show');
			$scope.clearCheckboxFun( $scope.initData.addAuditList, $scope.cache.unSenseAssetList );			
			$scope.apply();
		},
		fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		};

		var postId = item.id || $scope.initData.addAuditList.checked.join();
		config.url = config.url.replace('#id', $scope.initData.POid );
		config.url = config.url.replace('#c_id', postId );
		console.log(config)
		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //资产自动获取配置弹窗
	 $scope.addSelectAudit = function(){
		$scope.modalTitle = '添加选择性审计';
		$( '.J_modal-dialog' ).css( 'width', '1000px' );
		 angular.element( '#J_addSelectAudit' ).modal( 'show' );
		 angular.element( '#J_addSelectAudit' ).draggable({ 
			handle: ".modal-header", 
			cursor: 'move', 
			refreshPositions: false 
		 });
		$scope.getunSensAssetList();
		$scope.cache.actionType = 'add';
	};

	 //confirm弹框
	 $scope.clickComfirm = function(event){
		var it = $(event.target),
		type = $scope.cache.actionType;
		
		switch(type){
			case 'delete':
				angular.element('#J_confirm').modal('hide');
				$scope.deleteConnFunc( $scope.cache.mainItem );
		    break;
			default:
				angular.element('#J_confirm').modal('hide');
			break;
		}
	 };

	 //modal弹框
	 $scope.clickOk = function(event){
		var it = $(event.target),
		type = $scope.cache.actionType;
		
		switch(type){
			case 'add':
				angular.element('#J_addSelectAudit').modal('hide');
				$scope.addAssetFunc( $scope.cache.mainItem );
		    break;
			default:
				angular.element('.modal').modal('hide');
			break;
		}
	 };

	 //判断是否有选中资产集合
	 $scope.checkObjIsExist = function( checkList, item ){
		if( item ) {
			$scope.cache.mainItem = item;
			return true;
		}else{
			if( $scope.initData.auditList.checked.length === 0 ){
			   $rootScope.msg = '请至少选择一项！';
			   angular.element('#J_Alert').modal('show');
			   return false; 
			}else{
				return true;
			}
		} 
	};

	 //选择性审计列表全选
	 $scope.auditList_selectAll = function( i, list ){
		$scope.initData.auditList.checked = commonFuntion.selectAll( i, list );
	 };
	
	 //选择性审计列表单选
	 $scope.auditList_selectOne= function( list ){
		 commonFuntion.selectOne( list, $scope.initData.auditList );
		 console.log($scope.initData.auditList.checked)
	 };

	 //添加选择性审计列表全选
	 $scope.addAuditList_selectAll = function( i, list ){
		$scope.initData.addAuditList.checked = commonFuntion.selectAll( i, list );
	 };
	
	 //添加选择性审计列表单选
	 $scope.addAuditList_selectOne = function( list ){
	 	commonFuntion.selectOne( list, $scope.initData.addAuditList );
	 };
	 
	 //清空全选和单选checkbox
	 $scope.clearCheckboxFun = function( obj, list ) {
		obj.checkAll = false;
		obj.checked = [];
		list.map( commonFuntion.cancelSelectOne ); 
	};

	 //切换表格排序箭头
	 $scope.orderArrowClass = function( str, order ) {
		var arrowClass = commonFuntion.orderArrowClass( str, order.orderListKey, order.sortType );
		return arrowClass;
	 };

	 //返回
	 $scope.backToList = function(){
		$state.go('main.protectObject'); 
	 };
	 
	 $scope.closeSubPanel = function(){
		 if( $('#J_btnOfsubPanel').hasClass('sub-close-show') ){
			 $('#J_btnOfsubPanel').removeClass('sub-close-show');
			 $('.sub-sidebar').css({'left':'-150px','overflow':'visible'});
			 $('.sub-panel-content').css({'left':'0'});
			 $('.sub-close-up').css({'left':'150px'});
		 }else{
			 $('#J_btnOfsubPanel').addClass('sub-close-show');
			 $('.sub-sidebar').css({'left':'0','overflow':'hidden'});
			 $('.sub-panel-content').css({'left':'150px'});
			 $('.sub-close-up').removeAttr("style");
		 }
	 };

	 $scope.apply = function() {
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	 };
 }]);