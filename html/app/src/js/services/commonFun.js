'use strict';
/**
 * 公共方法
 */
angular.module('myappApp')
  	.service('commonFuntion', function(){

  	/*
  	 * 全选
  	 * checkAll:全选model
  	 * list:列表
  	 * */
	this.selectAll = function ( checkAll, list ) {
		var checkedArr = [];
        if( checkAll ) {
            angular.forEach( list, function (i) {
                i.checked = true;
                checkedArr.push(i.id);
            })
        }else {
            angular.forEach( list, function (i) {
                i.checked = false;
                checkedArr = [];
            })
        }
        return checkedArr;
    };

    /*
  	 * 单选
  	 * Arr:保存checkbox信息对象
  	 * list:列表
  	 * */
    this.selectOne = function ( list, Arr  ) {
        angular.forEach( list , function ( i ) {
        	
            var index = Arr.checked.indexOf( i.id );
            if( i.checked && index === -1 ) {
            	Arr.checked.push(i.id);
            } 
            else if ( !i.checked && index !== -1 ){
            	Arr.checked.splice( index, 1 );
            };
        })
        if ( list.length === Arr.checked.length ) {
        	Arr.checkAll = true;
        } 
        else {
        	Arr.checkAll = false;
        }
    };
    
    //取消表格前多选选择
    this.cancelSelectOne = function( i ){
    	if( i.checked ) {
	        i.checked = false;
	    } 
    	return i;
    };

    //箭头样式
	this.orderArrowClass = function( value, orderColum, sortType ){
		
		if( orderColum == value && sortType == 'down' ){
 			return 'order-icon-down';
 		}
		else if( orderColum == value && sortType == 'up' ){
 			return 'order-icon-up';
 		}
		else{
 			return '';
 		}
	};
	
	//切换排序方法
	this.orderList = function( orderKey, orderColum, sortType ){
		
		var oldKey = angular.copy( orderColum );
		
 		if( orderKey ){
 			if( oldKey ==  orderKey ){
 				orderColum = orderKey;
 				
 	 			if( sortType == 'down' ){
 	 				sortType = 'up';
 	 			}
 	 			else{
 	 				sortType = 'down';
 	 			}
 	 			
 	 			return {'orderColum': orderKey, 'sortType': sortType };
 			}
 			else{
 				
 				return {'orderColum': orderKey, 'sortType': 'down' };
 			}
 		}
 		else{
 			return {'orderColum': '', 'sortType': '' };
 		}
 	};
 	
 	this.initModalStyle = function(){
		 $( '.J_modal-dialog' ).removeAttr("style");
	     $( '.J_modal-content' ).removeAttr("style");
 	 };

});
