'use strict';

/**
 * @module: myappApp
 * @controller: SideBarCtrl
 * @date: 2017-9-08 
 * @author: panhj
 * @description: 侧边导航栏(默认为路由二级导航)
 */

angular.module('myappApp')
    .controller('SideBarCtrl', ['configHeader', '$scope', '$rootScope', '$location', '$cookieStore', '$state', 'urlPrefix', 'AjaxServer', function(header, $scope, $rootScope, $location, $cookieStore, $state, urlPrefix, AjaxServer) {
    $scope.cache = {
        sideBarHrefs: [], // 缓存侧边导航栏url信息
        selectedIndex: -1 // 侧边栏按钮激活状态
    };
    $scope.init = function() {
        $scope.addSideBarHref(header);
        $scope.addSelectedClass();
        $scope.current_state = '';
        $scope.TelAndQrcode = true;
        $scope.OP_Toggle = true;
    };

    // 监听路由变化；
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $scope.addSideBarHref(header);
        $scope.addSelectedClass();
    });
    /*
      	默认添加为二级路由导航
      	如需添加为一级导航侧边栏可按照 HeaderCtrl {function} addFirstHref()配置
    */
    $scope.addSideBarHref = function(header) {
        var _hrefs_ = [];
        var secondConfig = [];
        var current_state = $location.path().split('/').slice(2,3);
        if (!header[current_state]) {
            angular.forEach(header, function(item, name) {
                if (item[current_state]) secondConfig = item;
            })
        } else {
            secondConfig = header[current_state]
        }
        angular.forEach(secondConfig, function(item, name) {
            if (item.state) {
                _hrefs_.push(item);
            }
        });
        $scope.cache.sideBarHrefs = _hrefs_;
    };
    // 为侧边栏按钮添加激活样式
    $scope.addSelectedClass = function() {
        $scope.current_state = $location.path().split('/').slice(-1)[0]; // 取url
        angular.forEach($scope.cache.sideBarHrefs, function(item, index) {
            if($scope.current_state == item.state.split('.')[1]) $scope.cache.selectedIndex = item.key;
        })
    };
    
    //侧边栏伸缩
    $scope.toggleSideBar = function(){
        if($('#J_sidebar').hasClass('siderbar-closeUp')){ //还原
            $('#J_sidebar').removeClass('siderbar-closeUp');
            $('.main-content').removeClass('sidebar-close-state').addClass('sidebar-normal-state');
            //$('.main-content').css('padding-left','180px');
            /*if( $('.colum-title-slide').hasClass( 'colum-title-fixed-close' ) ){
            	$('.colum-title-slide').removeClass('colum-title-fixed-close');
                $('.colum-title-slide').addClass('colum-title-fixed');
            }else{
                $('.colum-title-slide').addClass('colum-title');
            }
            if( $('.J-tab-class').hasClass( 'tab-panel-fixed-close' ) ){
            	$('.J-tab-class').removeClass('tab-panel-fixed-close');
                $('.J-tab-class').addClass('tab-panel-fixed');
            }else{
            	$('.J-tab-class').addClass('tab-panel');
            }*/
            //$('#main').css('margin-left','180px');
            $scope.TelAndQrcode = true;
        }
        else{										    //收缩
            $('#J_sidebar').addClass('siderbar-closeUp');
            $('.main-content').removeClass('sidebar-normal-state').addClass('sidebar-close-state');
            //$('.main-content').css('padding-left','50px');
           /* if( $('.colum-title-slide').hasClass( 'colum-title-fixed' ) ){
            	$('.colum-title-slide').removeClass('colum-title-fixed');;
                $('.colum-title-slide').addClass('colum-title-fixed-close');
            }else{
                $('.colum-title-slide').addClass('colum-title');
            }
            if( $('.J-tab-class').hasClass( 'tab-panel-fixed' ) ){
                $('.J-tab-class').removeClass('tab-panel-fixed');
                $('.J-tab-class').addClass('tab-panel-fixed-close');
            }else{
                $('.J-tab-class').addClass('tab-panel');
            }*/
            //$('#main').css('margin-left','50px');
            $scope.TelAndQrcode = false;
        }
    };
    
    //获取用户名
    $scope.getUserName = function(){
    	var config = {
	 			url:  '/capaa/user/getLoginUsername',
	 			method: 'get',
	 			data: {}
	 		},
	 		fnSuccess = function (d,status){},
	 		fnFail = function(data,status){
	 			console.log(data.errMsg || '操作失败');
    		window.location.href="/capaa/login.jspx";
	 		};
	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
    };
    
    //验证侧边栏伸缩情况（后期可去除）
    $scope.keepMargin = function(key){
    	$scope.getUserName();
    	//$('#J_sidebar').removeClass('siderbar-closeUp');
    	if($('#J_sidebar').hasClass('siderbar-closeUp')){
    		$('.main-content').css('padding-left','50px');
            $('#main').css('margin-left','50px');
        }else{

            $('.main-content').css('padding-left','180px');
            $('#main').css('margin-left','180px'); 
        }
    };
    
    //二级菜单收缩
    $scope.toggleSubMenu = function(){
    	if( $scope.OP_Toggle ){
        	$('#J_OP_Toggle').slideUp();
    		$scope.OP_Toggle = false;
    	}else{
    		$('#J_OP_Toggle').slideDown();
    		$scope.OP_Toggle = true;
    	}
    };
    
    //侧边栏高亮
    $scope.classActive = function(key){
    	if($scope.cache.selectedIndex == key){
    		return 'active';
    	}
    	else{//规则管理和表格访问 （审计2期,后期可去除）
    		if($scope.current_state == 'ruleMapped' || $scope.current_state == 'ruleManage'){
    			$('#sideItem2').addClass('active')
    		}else{
    			$('#sideItem2').removeClass('active')
    		}
    	}
    };
    
    //显示电话和二维码
    $scope.showTelAndQrcode = function( str ){
    	if( str == 'on' ){
        	$('#J_detailTelAndQrcode').css({ 'bottom': '0' });
    	}else if( str == 'out' ){
    		$('#J_detailTelAndQrcode').css({ 'bottom': '-280px' });
    	}
    };
    
}])