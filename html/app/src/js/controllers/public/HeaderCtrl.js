'use strict';

/**
 * @module: myappApp
 * @controller: HeaderCtrl
 * @date: 2017-9-08 
 * @author: panhj
 * @description： 头部导航栏(默认为路由一级导航)
 */
 angular.module('myappApp')
 .controller('HeaderCtrl', ['configHeader', '$scope', '$rootScope', '$window', '$location', '$timeout', '$cookieStore', '$state', 'urlPrefix', 'AjaxServer', 'Validate', function(header, $scope, $rootScope, $window, $location, $timeout, $cookieStore, $state, urlPrefix, AjaxServer, Validate) {

	 	$scope.cache = {
            firstHeaderHrefs: [], // 缓存一级导航栏url信息
            selectedIndex: -1, // 导航栏按钮激活状态
            sysUser:'Admin',
            about:{}
        };

        // 监听路由变化；
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.addSelectedClass();
        })
        // 为导航栏按钮添加激活样式
        $scope.addSelectedClass = function() {
            var current_state = $location.path().split('/').slice(-1)[0]; // 取url
            if (!header[current_state]) {
                angular.forEach(header, function(item, name) {
                    if (item[current_state]) $scope.cache.selectedIndex = item.key;
                })
            } else {
                $scope.cache.selectedIndex = header[current_state].key;
            }
        }
        $scope.addFirstHref = function(header) {
            var _hrefs_ = [];
            angular.forEach(header, function(item, name) {
                if (item.state) {
                    _hrefs_.push(item);
                } else {
                    angular.forEach(item, function(item2, name2) {
                        if(item2.key === 0) {
                            item2.key = parseInt(item.key +''+ item2.key);
                            var obj = $.extend(true, {}, item2);
                            obj.label = item.label;
                            _hrefs_.push(obj);
                        }else if(item2.key) {
                            item2.key = parseInt(item.key +''+ item2.key);
                        }
                    })
                }
            });
            // console.log(_hrefs_);
            $scope.cache.firstHeaderHrefs = _hrefs_;
        }

        // 为导航栏按钮添加激活样式
        $scope.addSelectedClass = function() {
            var current_state = $location.path().split('/').slice(-1)[0]; // 取url
            if (!header[current_state]) {
                angular.forEach(header, function(item, name) {
                    if (item[current_state]) $scope.cache.selectedIndex = parseInt(item.key+'0');
                })
            } else {
                $scope.cache.selectedIndex = parseInt(header[current_state].key+'0');
            }
        };
        
        $scope.initHeader = function() {
            $scope.errorMsg = '';
            $scope.getUserName();
            $scope.getHeaderDate();
           // $scope.bindEvent();
            $scope.getTitleName();
            $scope.sysTitleName = '数据库安全审计系统';
            $scope.addSelectedClass();
            $scope.addFirstHref(header);
            if ($rootScope.userLogStatus && !$rootScope.skip) {
                $rootScope.skip = true;
                $state.go("main.home");
            }
            
            $scope.menuKey = false;
        }; 
        
        //获取用户名
        $scope.getUserName = function(){
        	var config = {
 	 			url:  '/capaa/user/getLoginUsername',
 	 			method: 'get',
 	 			data: {}
 	 		},
 	 		fnSuccess = function (d){
        		$scope.cache.sysUser = d.username;
 	 		},
 	 		fnFail = function(data,status){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };
        
        //获取标题名
        $scope.getTitleName = function(){
        	var config = {
 	 			url:  '/capaa/system/name',
 	 			method: 'get',
 	 			data: {}
 	 		},
 	 		fnSuccess = function (d){
        		$scope.sysTitleName = d.TrustCapaaProjectName || '数据库安全审计系统';
        		document.title = d.TrustCapaaSystemName;
 	 		},
 	 		fnFail = function(data,status){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };
        
        //获取日期
        $scope.getHeaderDate = function(){
        	var show_day = new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日'); 
            var time = new Date(); 
            var year = time.getFullYear(); 
            var month = time.getMonth() + 1; 
            var date = time.getDate(); 
            var day = time.getDay(); 
            if (month >= 1 && month <= 9) {
     			month = "0" + month;
     		}
            if (day >= 0 && day <= 9) {
     			day = "0" + day;
     		}
            $scope.headerDate = year+'/'+month+'/'+date +' '+show_day[day-1];
        };
        
        //打开关于我们弹窗
        $scope.showAboutUs = function(){
        	var config = {
 	 			url:  '/capaa/systemSurveillance/version',
 	 			method: 'get',
 	 			data: {}
 	 		},
 	 		fnSuccess = function (d){
    		    $scope.cache.about.systemVersions = d.systemVersions;
	    		$scope.cache.about.systemName = d.systemName;
	    		$scope.cache.about.systemVersionsPre = [];
	    		$scope.cache.about.systemVersionsAft = [];
	    		
	    		for( var i = 0; i< $scope.cache.about.systemVersions.length; i++ ){
	        		if( $scope.cache.about.systemVersions[i].name.toLowerCase() == 'version' || $scope.cache.about.systemVersions[i].name.toLowerCase() == 'sha1' ){
	        			$scope.cache.about.systemVersionsPre.push( $scope.cache.about.systemVersions[i] );
	        		}else{
	        			$scope.cache.about.systemVersionsAft.push( $scope.cache.about.systemVersions[i] );
	        		}
	    		}
	
	        	$scope.noBtnKey = true;
	        	$scope.modalTitle = '关于我们';
	     		angular.element('#J_aboutUs').modal('show');
 	 		},
 	 		fnFail = function(data,status){
 	 			console.log(data.errMsg || '操作失败');
 	 		};
 	 		AjaxServer.ajaxInfo( config , fnSuccess , fnFail );
        };

        $scope.bindEvent = function() {
            $('body').off('click', '.nav li');
            $('body').on('click', '.nav li', function() {
                $scope.getLocalLoginInfo();
            });
        };
        
        //下拉图标点击动画
        $scope.changeArrow = function(){
        	if( $scope.menuKey ){
                $('#J_headerSubmenu').slideUp();
                $scope.menuKey = false;
            }else{
                $('#J_headerSubmenu').slideDown();
                $scope.menuKey = true;
            }
            /*if($('#J_headerArrow').hasClass('icon-header-arrowUp')){
                $('#J_headerArrow').removeClass('icon-header-arrowUp');
                $('#J_headerSubmenu').slideUp();
            }else{
                $('#J_headerArrow').addClass('icon-header-arrowUp');
                $('#J_headerSubmenu').slideDown();
            }*/
        };

        $scope.apply = function() {
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        
        
    }]);

function ScreenSaver(settings){     
    this.settings = settings;     
    
    this.nTimeout = this.settings.timeout;     
                 
    document.body.screenSaver = this;     
    // link in to body events     
    document.body.onmousemove = ScreenSaver.prototype.onevent;     
    document.body.onmousedown = ScreenSaver.prototype.onevent;     
    document.body.onkeydown = ScreenSaver.prototype.onevent;     
    document.body.onkeypress = ScreenSaver.prototype.onevent;     
         
    var pThis = this;     
    var f = function(){pThis.timeout();}     
    this.timerID = window.setTimeout(f, this.nTimeout);     
}     
ScreenSaver.prototype.timeout = function(){     
    if ( !this.saver ){     
        window.location = '/capaa/login.jspx';     
    }     
}     
ScreenSaver.prototype.signal = function(){     
    if ( this.saver ){     
        this.saver.stop();     
    }     
         
    window.clearTimeout(this.timerID);     
         
    var pThis = this;     
    var f = function(){pThis.timeout();}     
    this.timerID = window.setTimeout(f, this.nTimeout);     
}     
    
ScreenSaver.prototype.onevent = function(e){     
    this.screenSaver.signal();     
}     

var saver;     
function initScreenSaver(){  
    saver = new ScreenSaver({timeout:900000});     
}   

window.onload = function(){     
  initScreenSaver();     
}
	