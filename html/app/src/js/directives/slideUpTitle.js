
'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:slideuptitleDirective
 * @description
 * Controller of the myappApp
 * 格式要求：
 * showname = [{label:'名称',name:'name'}];
 * mainlist = {};
 */

 angular.module('myappApp')
.directive('slideuptitleDirective', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/slideUpTitle.html',
		replace: true,
		scope: {
			titlename: '@',  //板块名称
			showname: '=',   //需要显示的信息
			blockid: '@',    //收起的板块id 
			mainlist: '='    //被选中的列表内容
		},
		controller: function($scope,$window,$location,$anchorScroll){
			$scope.togglekey = true;
        	$scope.titleTextKey = true;

			/*$('.box').scroll( function(){
				
				var sl=-Math.max($('.box').scrollLeft());
				$(".colum-title").css('left',sl+'px');
			    
				if($('.box').scrollTop() >= 20){
					if( $('#J_sidebar').hasClass('siderbar-closeUp') ){
						$(".colum-title").addClass("colum-title-fixed-close");
					}else{
						$(".colum-title").addClass("colum-title-fixed");
					}
				}else{
					if( $('#J_sidebar').hasClass('siderbar-closeUp') ){
						$(".colum-title").removeClass("colum-title-fixed-close");
					}else{
						$(".colum-title").removeClass("colum-title-fixed");
					}
				}
			} )*/
        	
			$scope.$watch('mainlist',function(newValue, oldValue){
        		$scope.itemTemp = [];
            	$scope.itemTemp = $scope.itemTempFun( newValue , $scope.showname);
        	});
        	
        	$scope.itemTempFun = function( mainlist, showname ){
        		var itemTemp = [];
    			 
    			var mainObjTemp = angular.copy( mainlist ) || {};
    			
    			if( JSON.stringify( mainObjTemp ) == '{}' ){
    				 $scope.titleTextKey = true;
    				 return;
    			}else{
    				$scope.titleTextKey = false;
    			} 
    			
    			for( var i=0; i<showname.length; i++ ){
    				 
    				 var mainItem = showname[i];
    				 
    				 if( mainItem.ps ){
    					 for( var j = 0; j<mainItem.ps.length; j++ ){
    						 var a = mainItem.name;
    						 if( mainItem.ps[j].data == mainObjTemp[ a ]  ){
    							 mainObjTemp[ a ] = mainItem.ps[j].value;
    						 }
    					 }
    				 }
    				 
    				 itemTemp.push({'label':mainItem.label, 'value':mainObjTemp[ mainItem.name ] });
    			 }
    			
    			return itemTemp;
        	};
			
        	//收起、下拉板块方法
        	$scope.toggleTitle = function() {
			  if( $scope.togglekey ){
				 $( $scope.blockid ).slideUp(500); 
				 $scope.togglekey = false;
			  }else{
				 $( $scope.blockid ).slideDown(500); 
				 $scope.togglekey = true; 
			  }
        	};
        	
        	/*$scope.sidebarCloseClass = function(){
        		var a = $(".colum-title-slide").position().top;
        		if( $('#J_sidebar').hasClass('siderbar-closeUp') ){
        			if( a >= 20 ){
        				return 'colum-title-fixed-close';
        			}else{
        				return '';
        			}
					if( $('.colum-title-slide').hasClass( 'colum-title-fixed' ) ){
		            	$('.colum-title-slide').removeClass('colum-title-fixed');;
		                //$('.colum-title-slide').addClass('colum-title-fixed-close');
		            	return 'colum-title-fixed-close';
		            }else{
		                //$('.colum-title-slide').addClass('colum-title');
		            	return '';
		            }
				}else{
					if( a >= 20 ){
						return 'colum-title-fixed';
        			}else{
        				return '';
        			}
        			if( $('.colum-title-slide').hasClass( 'colum-title-fixed-close' ) ){
                    	$('.colum-title-slide').removeClass('colum-title-fixed-close');
                        //$('.colum-title-slide').addClass('colum-title-fixed');
                        return 'colum-title-fixed';
                    }else{
                        $('.colum-title-slide').addClass('colum-title');
                        return '';
                    }
        	};
        }*/
		},		
		link: function ($scope,$element,$attrs,$controller) { 
			/*return function(scope, iElement, iAttrs) {
            	scope.titlename = scope.titlename; 
            }*/

        }
	}
});