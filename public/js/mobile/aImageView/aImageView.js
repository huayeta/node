/*
    图片浏览插件
*/
define('aImageView',function(require, exports, module){
	require('uiRouter');
	var angular=require('angular');
    var aForm=require('aForm')
    var uiRouter=require('uiRouter');
    var mBox=require('mBox');
    var mTools=require('mTools');
	var aImageView=angular.module('aImageView',['ui.router','aForm']);
	aImageView.factory('aImageViewData',function(){
		var obj=[];
		obj.data;
        obj.get=function(){
            return obj.data;
        }
		obj.set=function(arr){
			obj.data=arr;
		}
        obj.opts={};
		return obj;
	});
	aImageView.config(function($stateProvider,$urlRouterProvider){
		$stateProvider
		.state('imageView',{
			url:'/imageView?id',
			resolve:{
				DATA:function($window,aImageViewData){
					if(!aImageViewData.get())$window.history.go(-1);
				}
			},
			templateUrl:'js/mobile/aImageView/aImageView.htm',
			controller:function($scope,$state,$window,$stateParams,aImageViewData,result){
				$scope.items=aImageViewData.get();
                var returnData=$scope.items;
                $scope.swiper={};
                $scope.btn={};
                var mySwiper;
                $scope.$on('ngRepeatFinished',function(){
                    mBox.swiper({
                        callback:function(Swiper){
                            mySwiper=new Swiper('.m-imageView .imageView-container',{
                                direction:'horizontal',
                                wrapperClass:'bd',
                                slideClass:'item',
                                initialSlide:aImageViewData.opts.activeIndex?aImageViewData.opts.activeIndex:0,
                                onInit:function(swiper){
                                    init(swiper);
                                },
                                onSlideChangeStart:function(swiper){
                                    init(swiper);
                                }
                            });
                            $scope.btn.menu=function(){
                                mTools.showBtn({isTarget:false,isDelect:aImageViewData.opts.isDelect,delect:del});
                            }
                        }
                    });
                });
                function init(swiper){
                    var $activeObj=$(swiper.slides[swiper.activeIndex]);
                    $activeObj.css({'background-image':('url('+$activeObj.data('background-image')+')')});
                    $scope.swiper.activeIndex=swiper.slides.length!=0?(parseInt(swiper.activeIndex)+1):0;
                    $scope.swiper.length=swiper.slides.length;
                    $scope.$apply();
                }
                function del(){
                    var activeIndex=mySwiper.activeIndex;
                    mySwiper.removeSlide(activeIndex);
                    init(mySwiper);
                    returnData.splice(activeIndex,1);
                }
                $scope.btn.complate=function(){
                    result.setResult($stateParams.id?$stateParams.id:'default',returnData);
                    $window.history.go(-1);
                }
			}
		})
	});
	return aImageView;
});