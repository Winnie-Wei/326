//添加保护对象
 angular.module('myappApp')
 .controller('AddProtectObjCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q','$state', 'commonFuntion', 
                                  function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, $state, commonFuntion) {
	 
	 $scope.initData = {
	     protectInfo: {
	    	 object_type: '1',
	    	 db_type: 'oracle'
	     },
	     scanList: {
	    	 checkAll: false,  //扫描列表全选CheckBox
			 checked:[]        //扫描列表选中项
	     },
	     nodeList: {
	    	 checkAll: false,  //节点列表全选CheckBox
			 checked:[]        //节点列表选中项
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
		acrionType: 'default',
		nodeList: [],
		nodeObj: {},
		scanObjList: []
	 };
	 
	 //初始化
	 $scope.addProtectObjInit = function(){
		
	 };
	 
	 //提交保护对象信息
	 $scope.submitNewObj = function( obj, list ){
		 commonFuntion.initModalStyle();
		 var nodes = [];  //保存选中的节点信息
		 angular.forEach( list, function( i ){
			 for( var j = 0; j < obj.checked.length; j++ ){
				 if( i.id == obj.checked[j] ){
					 nodes.push({
						 "host": i.host,
						 "port": i.port,
						 "name": i.name
					 })
				 }
			 }
		 } )
		 var postData = {
			  "obj_id": "",
			  "name": $scope.initData.protectInfo.name,
			  "object_type": $scope.initData.protectInfo.object_type,
			  "db_type": $scope.initData.protectInfo.db_type,
			  "nodes": nodes
		 };
		 console.log(postData)
		 var config = {
 			url:  $scope.initData.addObjUrl.url,
 			method: $scope.initData.addObjUrl.method,
 			data: postData
 		 },
 		 fnSuccess = function (d){
			 $rootScope.msg = d.result;
			 angular.element('#J_Alert').modal('show');
			 //$state.go('main.protectObject');
 		 },
 		 fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		 };
 		 AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //地址添加
	 $scope.addByAddress = function( obj ) {
		 if( !obj.nodeName || !obj.address ) return;
		 
		 if( !obj.address.split(':')[0] || !obj.address.split(':')[1] ) return;
		 
		 $scope.cache.nodeList.push({
			 "name": obj.nodeName,
		 	 "host": obj.address.split(':')[0],
		 	 "port": obj.address.split(':')[1],
		 	 "id": "",
			 "obj_name": "",
			 "db_type":"",
			 "version":""
		});
		var hash = {}; 
		$scope.cache.nodeList = $scope.cache.nodeList.reduce(function(item, next) {    //去除重复项
			next.checked = false;  //表格前CheckBox取消勾选
			hash[next.name] ? '' : hash[next.name] = true && item.push(next); 
			console.log(hash);
			return item ;
		}, []);
		$scope.cache.nodeObj = {};
	 };
	 
	 //扫描添加
	 $scope.addByScan = function( scanlist, obj, nodelist ) {
		 angular.forEach( scanlist, function( i ){
			 for( var j = 0; j < obj.checked.length; j++ ){
				 if( i.id == obj.checked[j] ){
					 $scope.cache.nodeList.push({
						 "id": i.id,
						 "obj_name": i.obj_name,
						 "host": i.host,
						 "port": i.port,
						 "db_type":i.db_type,
						 "version":i.version,
						 "name": i.host + ':' + i.port
					 }) 
				 }
			 }
		 });
		 var hash = {}; 
		 $scope.cache.nodeList = $scope.cache.nodeList.reduce(function(item, next) {    //去除重复项
			 next.checked = false;  //表格前CheckBox取消勾选
			 hash[next.name] ? '' : hash[next.name] = true && item.push(next); 
			 return item 
		 }, []);
		 $scope.initData.nodeList.checkAll = false;
		 $scope.initData.nodeList.checked = [];
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
	 
	 //点击弹窗确认
     $scope.clickOk = function( event ){
    	var it = $(event.target),
			type = $scope.cache.actionType;
	
    	switch(type){
    		case 'address':
    			angular.element('#J_addPORac').modal('hide');
    			$scope.addByAddress( $scope.cache.nodeObj );
    		break;
    		case 'scan':
    			angular.element('#J_addPORac_scan').modal('hide');
    			$scope.addByScan( $scope.cache.scanObjList, $scope.initData.scanList );
    		break;
			default:
				angular.element('.modal').modal('hide');
			break;
    	}
     };
	 
	 //地址段添加-弹窗
	 $scope.addNewNodes = function(){
		 commonFuntion.initModalStyle();
		 $scope.cache.nodeObj = {};
		 $scope.cache.actionType = 'address';
		 $scope.modalTitle = '地址段添加';
 		 angular.element( '#J_addPORac' ).modal( 'show' );
 		 angular.element( '#J_addPORac' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	});
	 };
	 
	 //扫描添加节点-弹窗
	 $scope.addNewNodes_scan = function(){
		 commonFuntion.initModalStyle();
		 $scope.cache.actionType = 'scan';
		 $scope.modalTitle = '扫描添加';
		 $( '.J_modal-dialog' ).css( 'width', '1000px' );
 		 angular.element( '#J_addPORac_scan' ).modal( 'show' );
 		 angular.element( '#J_addPORac_scan' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	});
	 };
	 
	 //删除节点
	 $scope.deleteNode = function( index ){
		 $scope.cache.nodeList.splice(index,1); 
	 };
	 
	 //列表全选
	 $scope.selectAll = function( i, list, str ) {
		 var checked = commonFuntion.selectAll( i, list );
		 if( str === "scan" ){
			 $scope.initData.scanList.checked = checked;
		 }else if( str === "node" ){
			 $scope.initData.nodeList.checked = checked;
		 }
	 };
	 
	 //列表单选
	 $scope.selectOne= function( list, obj ) {
		 commonFuntion.selectOne( list, obj );
	 };
	 
	 //返回至保护对象列表
	 $scope.cancleAddPO = function(){
		$state.go('main.protectObject');
	 };
	 
	 $scope.apply = function() {
 		if(!$scope.$$phase) {
 			$scope.$apply();
 		}
 	 };

 }]);