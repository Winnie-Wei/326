angular.module('myappApp')
 .controller('AssetTabCtrl',['$scope', '$rootScope', '$http', '$timeout', '$interval', '$filter', 'urlPrefix', 'AjaxServer','Validate','$q','commonFuntion', '$stateParams', '$state',
                             function ($scope, $rootScope, $http, $timeout, $interval, $filter, urlPrefix, AjaxServer, Validate, $q, commonFuntion, $stateParams, $state) {
	 
	 $scope.zTree = {};
	 var IDMark_A = "_a";
	 
	 var setting = {
		data: {
			simpleData: {
				enable: true
			}
		},
		check: {
			enable: true,
			chkStyle: "checkbox",
			chkboxType: { "Y": "ps", "N": "ps" }
		},
		callback: {
			onClick: function( event, treeId, treeNode, clickFlag ){ $scope.clickAssetNode( event, treeId, treeNode, clickFlag )},
			onDblClick: function( event, treeId, treeNode ){ $scope.getSubAsset( event, treeId, treeNode )}
		},
		view: {
			addDiyDom: function( treeId, treeNode ){ $scope.addTreeRefresh( treeId, treeNode )}
		}
	 };
	 
	 $scope.initData = {
		headerInfo:{}, 
		tableOrder: {
			orderListKey:{},
			sortType:''
		},
	 	detailOrder: {
			orderListKey:{},
			sortType:''
		},
		assetList: {
			checkAll: false,
			checked:[]
		},
		assetDetail: {
			checkAll: false,
			checked:[] 
		},
		assetDetail_Edit: true,  //编辑资产
		asset_accurate: true,  //精确显示
		objNodeSelected: 'obj',   //资产树节点类型判断操作按钮
		conn_type: '0',  //资产集合类型 
		POid:'',
		getOneObjectUrl: {   //根据id获取单个保护对象信息
 			url: urlPrefix + '/CassetProtectObject/#id',
 			method: 'get',
 			data: {}
 		},
 		getAssetListUrl: {   //获取保护对象下的产所有资产集合列表
 			url: urlPrefix + '/protectObj/asset/assetConne',
 			method: 'get',
 			data: {}
 		},
 		getAssetNodesUrl: {   //获取保护对象的节点资产集合-get,自动获取保护对象节点下的所有资产并入库-post
 			url: urlPrefix + '/protectObj/asset/assetObjs',
 			method: 'get',
 			data: {}
 		},
 		getSubAssetUrl: {   //获取当前选中资产的子级资产
 			url: urlPrefix + '/protectObj/asset/subAsset',
 			method: 'get',
 			data: {}
 		},
 		getAssetInfoUrl: {   //获取当前选中资产的信息属性
 			url: urlPrefix + '/protectObj/asset/#id',
 			method: 'get',
 			data: {}
		 },
		 deleteAssetUrl: {   //删除资产
			url: urlPrefix + '/protectObj/asset/#id?cmd=delete',
			method: 'post',
			data: {}
		},
	 };
	 
	 $scope.cache = {
		assetList: [],
		assetDetailLists: [],
		assetDetailItem: {},
		assetObjs:{
			save_flag:1
		},   //自动获取资产配置  
		editInfo:{},
		mainItem: {}
	 };
	 
	 //资产管理初始化
	 $scope.accessInit = function(){
		$scope.initData.POid = $stateParams['POid'];
		$scope.getAssetList();
		$scope.assetDetailList();
		$scope.getCurrentObject();
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
	 
	 //获取资产集合列表
	 $scope.getAssetList = function( orderKey ){
	 	var orderListCache = commonFuntion.orderList( orderKey, $scope.initData.tableOrder.orderListKey, $scope.initData.tableOrder.sortType );
 		$scope.initData.tableOrder.orderListKey = orderListCache.orderColum;
 		$scope.initData.tableOrder.sortType = orderListCache.sortType;

 		var data = {
 			"obj_id":$scope.initData.POid,
 			"currentPage":1,
 			"pageSize":10
	
 		};
 		var config = {
 			url:  $scope.initData.getAssetListUrl.url,
 			method: $scope.initData.getAssetListUrl.method,
 			data: {}//data
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			$scope.cache.assetList = d.conns;
 			$scope.getAssetNodes( $scope.cache.assetList[0] );  //默认获取第一条数据的节点信息
 			
 			$scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //获取资产节点信息
	 $scope.getAssetNodes = function( item ){
	 	$scope.initData.objNodeSelected = 'obj'; 
		var data = {
			"obj_id": $scope.initData.POid,
			"cluster_flag": $scope.initData.headerInfo.object_type,
		};
		var config = {
 			url:  $scope.initData.getAssetNodesUrl.url,
 			method: $scope.initData.getAssetNodesUrl.method,
 			data: {} //data
 		},
 		fnSuccess = function (d){
			 var data = typeof(d)==='string' ? JSON.parse(d) : d;
			 $scope.initData.conn_type = item.conn_type;			
			 var zNodes = d;
 			 $.fn.zTree.init( $("#treeDemo"), setting, zNodes );  //生成树
			 var zTree = $.fn.zTree.getZTreeObj("treeDemo");

		     var nodes = zTree.transformToArray( zTree.getNodes() ); 
			 for (var i=0; i<nodes.length; i++) {
			 	nodes[i].nocheck = true;	//设置没有CheckBox
			 	zTree.updateNode(nodes[i]);
			 }
 			 zTree.expandAll(true);   //展开节点
			 zTree.selectNode( zTree.getNodeByParam("iconSkin", "obj") );  //选中第一个节点
			 var treeNode = zTree.getSelectedNodes();
			 $scope.getAssetInfo( treeNode[0] );
			 
 			 $scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace('#id', $scope.initData.POid );
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //双击树节点展示该节点下的子节点
	 $scope.getSubAsset = function( event, treeId, treeNode ){
		var data = {
			 "obj_id": $scope.initData.POid,
			 "asset_id": treeNode.id,
			 "asset_type": treeNode.iconSkin
		};
		var config = {
 			url:  $scope.initData.getSubAssetUrl.url,
 			method: $scope.initData.getSubAssetUrl.method,
 			data: {} //data
 		},
 		fnSuccess = function (d){
			 var data = typeof(d)==='string' ? JSON.parse(d) : d;
			 var zTree = $.fn.zTree.getZTreeObj( "treeDemo" );
			 zTree.removeChildNodes( treeNode );
			 zTree.addNodes( treeNode, d.chilrens );

			 if( $scope.initData.assetDetail_Edit ){
				var nodes = zTree.transformToArray( zTree.getNodes() ); 
				for (var i=0; i<nodes.length; i++) {
					nodes[i].nocheck = true;	//设置没有CheckBox
					zTree.updateNode(nodes[i]);
				}
			 }
			 
 			 $scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //获取当前选中资产的属性
	 $scope.getAssetInfo = function( treeNode ){
		 var data = {
			 "asset_type": treeNode.iconSkin
		 };
		 var config = {
 			url:  $scope.initData.getAssetInfoUrl.url,
 			method: $scope.initData.getAssetInfoUrl.method,
 			data: {} //data
 		},
 		fnSuccess = function (d){
			 var data = typeof(d)==='string' ? JSON.parse(d) : d;
			 $scope.cache.assetDetailItem = d;
 			 $scope.apply();
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 		config.url = config.url.replace( '#id', treeNode.id )
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail ); 
	 };
	 
	 //点击资产集合树节点
	 $scope.clickAssetNode = function( event, treeId, treeNode, clickFlag ){
		 if( treeNode.iconSkin === 'node'){
			 $scope.initData.objNodeSelected = 'node';
		 }else if( treeNode.iconSkin === 'obj' ){
			 $scope.initData.objNodeSelected = 'obj';
		 }else{
			$scope.initData.objNodeSelected = 'other';
		 }
		 $scope.getAssetInfo( treeNode );
		 $scope.apply();
	 };
	 
	 //树添加刷新事件
	 $scope.addTreeRefresh = function( treeId, treeNode ){
		if ( treeNode.parentNode && treeNode.parentNode.id!=2 ) return;
		var aObj = $("#" + treeNode.tId + IDMark_A );
		if ( treeNode.iconSkin == 'node' ) {
			var editStr = "<span class='ztreeIcon' id='J_setting_" +treeNode.id+ "' title='"+treeNode.name+"'><span class='button setting'></span></span>"
						+ "<span class='' id='J_refresh_" +treeNode.id+ "' title='"+treeNode.name+"'><span class='button refresh'></span></span>";
			aObj.after(editStr);
		};
	 };
	 
	 //自动获取配置                
	 $scope.saveAutoSetting = function( obj ){
		var postData = {
			"obj_id": $scope.initData.POid,
			"cluster_flag": $scope.initData.headerInfo.object_type,
			"username":  obj.username,
			"password": obj.password,
			"db_sid": obj.db_sid,
			"save_flag": obj.save_flag
		};
		var config = {
 			url:  $scope.initData.getAssetNodesUrl.url,
 			method: 'post',
 			data: postData
 		},
 		fnSuccess = function (d){
 			var data = typeof(d)==='string' ? JSON.parse(d) : d;
 			if( d.result === 'success' ){
 				angular.element( '#J_accessGet' ).modal( 'hide' );
 				$rootScope.msg = "表示正在扫描数据库，把数据入库，请用户稍后查看";
 	 			angular.element('#J_Alert').modal('show');
 			}
 		},
 		fnFail = function(data){
 			console.log(data.errMsg || '操作失败');
 		};
 
 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };
	 
	 //添加资产
	 $scope.addAsset = function(){
		$scope.initData.assetDetail_Edit = false;
	 };

	 //资产集合列表编辑操作
	 $scope.editAssetInfo = function(item){
		 $scope.cache.editInfo = item; 
		 $scope.modalTitle = '编辑资产';
		 $scope.noBtnKey = false;
 		 angular.element( '#J_editAssetInfo' ).modal( 'show' );
 		 angular.element( '#J_editAssetInfo' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	 });
	 };
	 
	 //资产集合详情编辑
	 $scope.assetDetail_Edit = function(){
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var nodes = zTree.transformToArray( zTree.getNodes() );
		
		for (var i=0; i<nodes.length; i++) {
			nodes[i].nocheck = false;
			zTree.updateNode(nodes[i]);
		}
		$scope.initData.assetDetail_Edit = false; 
	 };
	 
	 //资产集合详情编辑取消
	 $scope.assetDetail_Edit_Cancel = function(){
		var zTree = $.fn.zTree.getZTreeObj("treeDemo");
		var nodes = zTree.transformToArray( zTree.getNodes() );
		
		for (var i=0; i<nodes.length; i++) {
			nodes[i].nocheck = true;
			zTree.updateNode(nodes[i]);
		}
		$scope.initData.assetDetail_Edit = true; 
	 };
	 
	 //精确/全部显示切换
	 $scope.asset_accurate = function( val ){
		 $scope.initData.asset_accurate = val;
	 };
	 
	 //资产自动获取配置弹窗
 	 $scope.getAccessAuto = function(){
		 $scope.modalTitle = '资产自动获取配置';
		 $scope.noBtnKey = true;
		 $( '.J_modal-dialog' ).css( 'width', '800px' );
 		 angular.element( '#J_accessGet' ).modal( 'show' );
 		 angular.element( '#J_accessGet' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	 });
	 };
	 
	 //获取资产集合详情表格排序
	 $scope.assetDetailList = function( str ){
		 var orderListCache = commonFuntion.orderList( str, $scope.initData.detailOrder.orderListKey, $scope.initData.detailOrder.sortType );
 		 $scope.initData.detailOrder.orderListKey = orderListCache.orderColum;
 		 $scope.initData.detailOrder.sortType = orderListCache.sortType;
 		 $scope.cache.assetDetailLists = [{'id':1,'name':'type','type':'列','label':'-','level':'-','nodetype':'-'},{'id':2,'name':'catogory','type':'列','label':'-','level':'-','nodetype':'-'}];
	 };
	 
	 //导入资产
	 $scope.addAccess = function(){
		 $scope.accessStepList = [{'name':'请下载SQL脚本'},{'name':'选择导入方式'},{'name':'上传结果'}];
		 $scope.addAccessStep = 1;
		 $scope.modalTitle = '资产导入';
		 $scope.noBtnKey = true;
		 $( '.J_modal-dialog' ).css( 'width', '1000px' );
		 $( '.J_modal-content' ).css( 'height', '480px' );
 		 angular.element( '#J_accessAdd' ).modal( 'show' );
 		 angular.element( '#J_accessAdd' ).draggable({ 
 			handle: ".modal-header", 
 			cursor: 'move', 
 			refreshPositions: false 
	 	}); 
 		 
 		$scope.importMode = '0';
 		
 		$("#J_accessFileUpload").fileinput({
 			uploadUrl:"#",
 			showPreview: false,
 			browseLabel: "浏览文件",
 			removeLabel: "删除",
 			uploadLabel: "上传"
 		});
	 };

	 //删除资产方法
	 $scope.deleteAssetFunc = function( obj, item ){
		var postData = {
			"obj_id": $scope.initData.POid,
			"asset_id": JSON.stringify(item) == "{}" ?  obj.checked.join() : item.id,
			"asset_type": $scope.cache.actionType === 'connect' ? 'connection' : $scope.cache.assetDetailLists[0].type
			}
			
		var config = {
			url:  $scope.initData.deleteAssetUrl.url,
			method: $scope.initData.deleteAssetUrl.method,
			data: {}
		},
		fnSuccess = function (d){
			//var data = typeof(d)==='string' ? JSON.parse(d) : d;
			$rootScope.msg = '删除成功！'//d.result;
			angular.element('#J_Alert').modal('show');
			
			if( $scope.cache.actionType === 'delete-connect' ){
				$scope.clearCheckboxFun( $scope.initData.assetList, $scope.cache.assetList );
				console.log('1')
			}else if( $scope.cache.actionType === 'delete-subset' ){
				$scope.clearCheckboxFun( $scope.initData.assetDetail, $scope.cache.assetDetailLists );
				console.log('2')
			}
			$scope.cache.mainItem = {};	
			$scope.cache.actionType = 'normal';	
			$scope.apply();
		},
		fnFail = function(data){
			console.log(data.errMsg || '操作失败');
		};

		var postId = JSON.stringify( item ) == "{}" ?  obj.checked.join() : item.id;
		config.url = config.url.replace( '#id', postId );
		console.log(config,postData)
		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
	 };

	 //删除确认
	 $scope.deleteAsset = function( str, item ){
		if( str === 'connect' ){
			if( !$scope.checkObjIsExist( $scope.initData.assetList.checked ) ) return;
			$scope.cache.actionType = 'delete-connect';
		}else if( str === 'subset' ){
			if( !$scope.checkObjIsExist( $scope.initData.assetDetail.checked, item ) ) return;
			$scope.cache.actionType = 'delete-subset';
		}
		
		$scope.confirmCont = '确定要删除该资产吗？'

		angular.element('#J_confirm').modal('show');
	 };

	 //判断是否有选中资产集合
	 $scope.checkObjIsExist = function( checkList, item ){
		if( item ) {
			$scope.cache.mainItem = item;
			return true;
		}else{
			if( checkList.length === 0 ){
			   $rootScope.msg = '请至少选择一项！';
			   angular.element('#J_Alert').modal('show');
			   return false; 
			}else{
				return true;
			}
		} 
	};

	 //清空全选和单选checkbox
	 $scope.clearCheckboxFun = function( obj, list ) {
	 	obj.checkAll = false;
	 	obj.checked = [];
	 	list.map( commonFuntion.cancelSelectOne ); 
	 };
	 
	 //资产集合列表全选
	 $scope.assetList_selectAll = function( i, list ){
		 $scope.initData.assetList.checked = commonFuntion.selectAll( i, list );
	 };
	 
	 //资产集合列表单选
	 $scope.assetList_selectOne= function( list ){
		 commonFuntion.selectOne( list, $scope.initData.assetList );
	 };
	 
	 //资产详情列表全选
	 $scope.assetDetail_selectAll = function( i, list ){
		 $scope.initData.assetDetail.checked = commonFuntion.selectAll( i, list );
	 };
	 
	 //资产详情集合列表单选
	 $scope.assetDetail_selectOne= function( list ){
		 commonFuntion.selectOne( list, $scope.initData.assetDetail );
	 };
	 
	 //点击上一步
	 $scope.goUpStep = function(){
		 $scope.addAccessStep = $scope.addAccessStep == 1 ? $scope.addAccessStep : $scope.addAccessStep -= 1 ;
	 };
	 
	//点击上一步
	 $scope.goDownStep = function(){
		 $scope.addAccessStep = $scope.addAccessStep == $scope.accessStepList.length ? $scope.addAccessStep : $scope.addAccessStep += 1 ;
	 };
	 
	 //切换表格排序箭头
 	 $scope.orderArrowClass = function( str, order ) {
 		var arrowClass = commonFuntion.orderArrowClass( str, order.orderListKey, order.sortType );
 		return arrowClass;
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
		type = $scope.cache.actionType;
		
		switch(type){
			case 'delete-connect':
				angular.element('#J_confirm').modal('hide');
				$scope.deleteAssetFunc( $scope.initData.assetList, $scope.cache.mainItem );
			break;
			case 'delete-subset':
				angular.element('#J_confirm').modal('hide');
				$scope.deleteAssetFunc( $scope.initData.assetDetail, $scope.cache.mainItem );
		    break;
			default:
				angular.element('#J_confirm').modal('hide');
			break;
		}
	 };
	
    $scope.backToList = function(){
		$state.go('main.protectObject'); 
	};
	
	//测试数据库连接
	$scope.testJdbcLink = function(){
		$scope.testflag = true;
		$scope.linkWating('set');
	};
	//测试数据库连接
	$scope.testJdbcLink2 = function(){
		$scope.linkWating('stop');
		$scope.testflag = false;
	};
	
	$scope.testflag = true;
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
