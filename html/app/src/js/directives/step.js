
'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:stepDirective
 * @description
 * Controller of the myappApp
 */

 angular.module('myappApp')
.directive('stepDirective', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/step.html',
		replace: true,
		scope: {
			steplists: '=',     //步骤名称数组
			defaultstep: '=',   //默认第几步	
		},
		controller: function($scope){
			
        	$scope.stepStyle = function( index ){
        		 if( (index + 1) == $scope.defaultstep ){
        			return 'active'
        		}else if( index+1 < $scope.defaultstep ){
            		return 'on';
        		}else{
        			return ''
        		}

        	};
        	
		},
		link: function(scope, el, attr) {  
            return function( scope, el, attr ){
            	scope.steplists = scope.steplists; 
            	scope.defaultstep = scope.defaultstep;	
            }
        }
	}
});
