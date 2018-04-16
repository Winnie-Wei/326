//保护对象详情
 angular.module('myappApp')
 .controller('ProtectObjInfoCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q', '$state', 'commonFuntion', '$stateParams', 
                                function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, $state, commonFuntion, $stateParams) {
	 
	 $scope.initData = {
		currentObj:{},
		editKey: true,  //编辑标志
		nodeEditflag: true,  //编辑节点标志
		headerInfo:{},
		getOneObjectUrl: {   //根据id获取单个保护对象信息
 			url: urlPrefix + '/CassetProtectObject/#id',
 			method: 'get',
 			data: {}
 		},
 		saveObjInfoUrl: {   //保存保护对象信息
 			url: urlPrefix + '/assetProtectObject/#id?cmd=update',
 			method: 'post',
 			data: {}
 		 },
 		saveNodeUrl: {   //保存节点信息
 			url: urlPrefix + '/assetProtectNode?cmd=update',
 			method: 'post',
 			data: {}
 		 },
 		autoGetAssetUrl: {   //自动获取资产配置
 			url: urlPrefix + '/protectObj/asset/assetObjs',
 			method: 'post',
 			data: {}
 		 },
	 };	
	 
	 //初始化
	 $scope.protectInfoInit = function(){
		 $scope.initData.POid = $stateParams['POid'];
		 $scope.getCurrentObject();
	 };
	 
	 //设置头部信息
	 $scope.setHeaderInfo = function( data ){
		 $scope.initData.headerInfo = {
			"name": data.name,
			"use_flag": data.use_flag,
			"db_type": data.db_type
		 };
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
 			$scope.initData.currentObj = d;
 			$scope.setHeaderInfo(d);
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //保存保护对象信息
	 $scope.saveProtectObj = function(){
		var postData = {
			"id": $scope.initData.POid,
			"name": $scope.initData.currentObj.name,
			"use_flag": $scope.initData.currentObj.use_flag
		};
		var config = {
 			url:  $scope.initData.saveObjInfoUrl.url,
 			method: $scope.initData.saveObjInfoUrl.method,
 			data: postData
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$rootScope.msg = d.result;
 			angular.element('#J_Alert').modal('show');
 			$scope.cancelEdit();
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //保存node信息
	 $scope.saveNode = function(item){
		var postData = {
			  "id":  item.node_id,
			  "name": item.node_name,
			  "host": item.host,
			  "port": item.port,
			  "use_flag": item.node_use_flag,
		};
		var config = {
 			url:  $scope.initData.saveNodeUrl.url,
 			method: $scope.initData.saveNodeUrl.method,
 			data: postData
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$rootScope.msg = d.result;
 			angular.element('#J_Alert').modal('show');
 			
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
		item.nodeEditflag = false;
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
	 
	 //编辑
	 $scope.editProtectObj = function(){
		 $scope.initData.editKey = false;
	 };
	 
	 //取消编辑
	 $scope.cancelEdit = function(){
		 $scope.initData.editKey = true;
		 $scope.getCurrentObject();
	 };
	 
	 //节点编辑
	 $scope.editNode = function(item){
		item.nodeEditflag = true;
	 };
	 
	 //取消节点编辑
	 $scope.cancelNode = function(item){
		 item.nodeEditflag = false;
	 };
	 
	 $scope.apply = function() {
		if(!$scope.$$phase) {
			$scope.$apply();
		}
	 };

 }]);