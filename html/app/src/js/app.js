'use strict';

/**
 * @ngdoc overview
 * @name myappApp
 * @description
 * # myappApp
 *
 * Main module of the application.
 * version: 1.5.0
 */
angular
  .module('myappApp', [
    'ngCookies',
    'ui.router',
    'myappApp.services',
    'ngMessages'
  ])
  .constant('urlPrefix', '/capaa')
  .config(function ($stateProvider, $urlRouterProvider, configModulesProvider, configHeaderProvider) {
    	$urlRouterProvider
    	//.when("", "/login")
    	//.when('/', "/login")
		.when('/500', '500.html')
	    .when('/400', '400.html')
		.when('/404', '404.html')
		.when('/402', 'authError.html')
		//.otherwise('/login');


		/*$stateProvider
		.state("main.table", {
			url: "/table",
			templateUrl: "/capaa/accesscontrol/accesscontrol_info.do",
			controller: "DbManageCtrl"
		})*/

        /*
			解析provider
        */
        var states = configModulesProvider.$get();
        function _$handlerRouter(states, prefix, ortherRoutes) {
        	var states_cp = [];
        	angular.forEach(states, function(route, i) {
        		route.state = 'main.' + route.state;
        		states_cp.push(route);
        	})
        	if(ortherRoutes) {
        		angular.forEach(ortherRoutes, function(route, i) {
	        		states_cp.push(route);
	        	})
        	}
        	var _routeArr_ = [];
        	angular.forEach(states_cp, function(route, i) {
	        	if(route.multiple) {
	        		var arr = _$handlerRouter(route.children, route.folder || '');
	        		for(var k=0; k<arr.length; k++) {
	        			_routeArr_.push(arr[k]);
	        		}
	        	} else {

	        		if(!route.state) throw new Error(' Missing Parameters *state*!');
	        		var urls = route.state.split('.');
	        		var obj = {
	        			state: route.state,
	        			url: '/' + urls.slice(-1)[0] + joinParams(route.params),
	        			templateUrl: 'views/' 
		        			+ (prefix? prefix + '/' : '') 
		        			+ urls.slice(-1).join('/') + '.html',
	        			controller: urls.slice(-1)[0][0].toUpperCase() + urls.slice(-1)[0].slice(1) + 'Ctrl'
	        		}

	        		_routeArr_.push(obj);
	        	}

	        })
	        return _routeArr_;

        }
        
        function joinParams(param){
        	if(!param) {
        		return "";
        	}
        	if(typeof param === 'string') {
        		return ['/:', param].join("");
        	}
        	
        	if( typeof param === 'array' ) {
        		var paramStr = '';
        		for( var i = 0; i < param.length; i++ ){
        			var patemp = ['/:', param[i]].join("");
        			paramStr += patemp;
        		}
        		return paramStr;
        	}
        	
        };

        function _$handlerHeader(states, prefix) {
        	var _header_ = {};
        	angular.forEach(states, function(route, i) {
	        	if(route.multiple) {
	        		var arr = _$handlerHeader(route.children);
	        		arr['label'] = route.label;
	        		arr['key'] = i;
	        		_header_[route.folder] = arr;

	        	} else {
	        		if(!route.state) throw new Error(' Missing Parameters *state*!');
	        		var urls = route.state.split('.');
	        		var obj = {
	        			state: ['main', route.state].join('.'),
	        			url: '#/main/' + urls.slice(-1)[0] + joinParams(route.params),
	        			label: route.label,
	        			key: i, // 对排序有特殊要求的地方
	        			hide: route.hide || false //是否显示
	        		}
	        		_header_[route.state] = obj;
	        	}

	        })
	        return _header_;
        }
        // 配置菜单栏
        var header = _$handlerHeader(states);
        configHeaderProvider.setHeader(header);

        // 默认路由
        var default_routes = [{
			state: 'login',
		},
		{
			state: 'main',
		}];
        var routeArr = _$handlerRouter(states, '', default_routes);
        (function routeGen(routes) {
        	angular.forEach(routes, function(route, i) {
       			$stateProvider.state(route.state, route);
       		})
       	}(routeArr))
  });


angular.module('myappApp').config(['$httpProvider', function($httpProvider) {
	  //initialize get if not there
	  if (!$httpProvider.defaults.headers.get) {
	    $httpProvider.defaults.headers.get = {};
	  }
	  // Answer edited to include suggestions from comments
	  // because previous version of code introduced browser-related errors
	  //disable IE ajax request caching
	  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
	  // extra
	  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
	  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
	}]);
