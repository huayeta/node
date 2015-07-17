define('aUpload',function(require, exports, module){
	require('uiRouter');
    var simpop=require('simpop');
	var angular=require('angular');
	var aForm=require('aForm');
    require('ngTouch');
	var uploaderApp=angular.module('aUpload',['ngTouch','ui.router','aForm']);
    uploaderApp.factory('imageGlobal',function(){
        return{
            returnData:{},//保存选中图片json
            data:false,//是否已经存在了数据，如果为真则存的是已存在的数据
            page:1,//当前的页码
            uploadSize:0//上传了多少个
        }
    });
    uploaderApp.factory('fileGlobal',function(){
        return{
            returnData:{},//保存选中file的json
            data:false,//是否已经存在了数据，如果为真则存的是已存在的数据
            page:1,//当前的页码
            uploadSize:0//上传了多少个
        }
    });
	uploaderApp.config(function($stateProvider,$urlRouterProvider){
//		$urlRouterProvider.otherwise("/index");
		$stateProvider
//		.state('index',{
//			url:'/index?id&size&isProduct&isPhoto&url&isadmin'
//		})
		.state('uploadImage',{
			url:'/upload/image?id&size&isProduct&isPhoto&url&isadmin&returnResult',
			templateUrl:'?m=attachment&c=images&a=dialog&debug=mobile',
			controller:function($scope,$state,$stateParams,$rootScope,$window,aForm,imageGlobal,result){
				//点击选择相关
				var SIZE=1;//是否可以多选
				var PAGESIZE=12;//每页多少个
				if($stateParams.size)SIZE=$stateParams.size;
				$scope.items=[];
				//点击加载相关
				var clickIsLoading=false;//当前加载是否完成
				var clickPage=0;//当前页码
				var clickCom=false;//是否全部加载
                $scope.clickTxt='点击加载更多';
                $scope.clickIsTxt=true;
				$scope.clickItems=function(){
					if(!clickIsLoading && !clickCom){
                        clickPage+=1;
                        clickIsLoading=true;
                        $scope.clickTxt='正在加载中...';
                        aForm.request({method:'GET',url:'?m=attachment&c=images&a=document&page='+clickPage,isJson:true})
                        .success(function(ret){
                            clickIsLoading=false;
                            if(ret.status){
                                var info=ret.info;
                                if(info.length){
                                    $scope.clickTxt='点击加载更多';
									//表示加载完了
									if(info.length<PAGESIZE){
										$scope.clickTxt='已经全部加载';
										scrollCom=true;
										$scope.clickIsTxt=false;
										if(clickPage!=1)simpop.tips({content:'已经全部加载'});
									}
                                    if(info.length>imageGlobal.uploadSize){
                                        info.length=info.length-imageGlobal.uploadSize;
                                        imageGlobal.uploadSize=0;
                                        $scope.items=$scope.items.concat(info);
                                        imageGlobal.data=$scope.items;
                                    }else{
                                        imageGlobal.uploadSize=imageGlobal.uploadSize-info.length;
                                        $scope.clickItems();
                                    }
                                }else{
                                    $scope.clickTxt='已经全部加载';
                                    scrollCom=true;
                                    $scope.clickIsTxt=false;
                                    simpop.tips({content:'已经全部加载'});
                                }
                            }else{
                                simpop.tips({content:ret.info});
                            }
                        })
					}
				};
				//初始化数据
				if(imageGlobal.data){
					$scope.items=imageGlobal.data;
					angular.forEach($scope.items,function(n,i){
						n.isSel=false;
					});
				}else{
//					aForm.request({method:'GET',url:'?m=attachment&c=images&a=document',isJson:true})
//					.success(function(ret){
//						var info=ret.info;
//						$scope.items=$scope.items.concat(info);
//                        imageGlobal.data=$scope.items;
//					});
					//加载第一页的图片
					$scope.clickItems();
				}
				$scope.changeClass=function(index){
                    if(!$scope.items[index].isProgress){
                        $scope.items[index].isSel=!$scope.items[index].isSel;
                        if(SIZE=='1'){
                            angular.forEach($scope.items,function(n,i){
                                if(i!=index){
                                    n.isSel=false;
                                }
                            });
                        }
                    }else{
                        simpop.tips({content:'请先等待图片上传完成后再选择'});
                        return false;
                    }
				};
				$scope.complete=function(){
                    imageGlobal.returnData[$stateParams.id]=[];
                    angular.forEach($scope.items,function(n,i){
                        if(n.isSel){
                            imageGlobal.returnData[$stateParams.id].push(n);
                        }
                    })
                    if($stateParams.isProduct || $stateParams.isPhoto){
						var _url='';
						if($stateParams.isProduct)_url='index.php?m=attachment&c=images&a=thumb&thumb=2';
						if($stateParams.isPhoto)_url='index.php?m=attachment&c=images&a=thumb&thumb=1';
						if(parseInt($stateParams.isadmin)==1){_url+='&isadmin=1'}
						angular.forEach(imageGlobal.returnData[$stateParams.id],function(n,i){
							_url+='&path='+encodeURIComponent(n.filepath);
							aForm.request({url:_url,method:'GET',isJson:true}).success(function(ret){
                                if(!ret.status)simpop.tips({content:ret.info});
                            });
						})
					}
					if(!$stateParams.returnResult){
						$rootScope.$broadcast('uploadData.updata',imageGlobal.returnData);
						$state.go('index');
					}else{
						result.setResult($stateParams.id,imageGlobal.returnData[$stateParams.id]);
						$window.history.go(-1);
					}
				};
				$scope.back=function(){
					if(!$stateParams.returnResult){
						imageGlobal.returnData={};
						$state.go('index');
					}else{
						$window.history.go(-1);
					}
				};
				//上传相关
				require.async(['webuploader'],function(webuploader){
					var serverUrl='?m=attachment&c=images&a=upload';
					if($stateParams.isProduct)serverUrl='?m=attachment&c=images&a=upload&thumb=2';
					if($stateParams.isPhoto)serverUrl='?m=attachment&c=images&a=upload&thumb=1';
					if($stateParams.url)serverUrl=$stateParams.url;
					if($stateParams.isadmin)serverUrl+='&isadmin='+$stateParams.isadmin;
					var uploader = WebUploader.create({
						pick:'#picker',

						accept: {
							title: 'Images',
							extensions: 'gif,jpg,jpeg,bmp,png',
							mimeTypes: 'image/*'
						},
						auto:true,//自动上传
						chunked: false,//是否允许分片上传
//						chunkSize:102400,//100K
//						chunkRetry:10,//如果某个分片由于网络问题出错，允许自动重传多少次？
						server: serverUrl,
						fileNumLimit: 300,
						fileSizeLimit: 500 * 1024 * 1024,    // 500 M
						fileSingleSizeLimit: 20 * 1024 * 1024,    // 10 M
						compress: null,
						thumb:{
							width:200,
							height:200,
							quality: 70,
							allowMagnify: true,
							crop: true,
						}
					});
					// 当有文件添加进来的时候
					uploader.on( 'fileQueued', function( file ) {
                        var w=h=200
						uploader.makeThumb( file, function( error, src ) {
							if ( error ) {
								simpop.tips({content:'不能预览'});
								return;
							}else{
								$scope.items.unshift({
                                    fileId:file.id,
                                    thumb:src,
                                    isProgress:true,
                                    css:{'width':0.1*100+'%'}
                                });
                                imageGlobal.uploadSize+=1;
                                $scope.$apply();
							}
						},w,h);
					});
					// 文件上传过程中创建进度条实时显示
					uploader.on( 'uploadProgress', function( file, percentage ) {
						angular.forEach($scope.items,function(n,i){
							if(n.fileId==file.id){
								$scope.items[i].css={'width':percentage*100+'%'};
								$scope.$apply();
                                return false;
							}
						})
					});
					// 文件上传成功。
					uploader.on( 'uploadSuccess', function( file,ret) {
						if(ret.status){
							angular.forEach($scope.items,function(n,i){
								if(n.fileId==file.id){
                                    $scope.items[i]=angular.extend($scope.items[i],ret.info);
                                    $scope.items[i].isSel=true;
                                    $scope.items[i].isProgress=false;
                                    var maxW=file._info.width;
                                    var maxH=file._info.height;
                                    var w=200;
                                    var h=w*(maxH/maxW);
                                    uploader.makeThumb( file, function( error, src ) {
                                        if ( error ) {
                                            $scope.items[i].thumb=ret.filepath
                                        }else{
                                            $scope.items[i].thumb=src
                                        }
                                    },w,h);
								}else{
                                    $scope.items[i].isSel=false;
                                }
							});
							$scope.$apply();
						}else{
							angular.forEach($scope.items,function(n,i){
								if(n && n.fileId==file.id){
									$scope.items.splice(i,1);
                                    simpop.alert({content:ret.info});
                                    imageGlobal.uploadSize-=1;
									$scope.$apply();
                                    return false;
								}
							})
						}
					});
					// 文件上传失败，显示上传出错。
					uploader.on( 'uploadError', function( file ) {
						angular.forEach($scope.items,function(n,i){
							if(n.fileId==file.id){
								$scope.items.splice(i,1);
                                simpop.tips({content:'上传失败'});
                                imageGlobal.uploadSize-=1;
								$scope.$apply();
                                return false;
							}
						})
					});
					//错误代码的提示
					uploader.onError = function( code ) {
						switch (code){
							case 'Q_EXCEED_NUM_LIMIT':
                                simpop.alert({content:'添加的文件数量超出'});
								break;
							case 'Q_EXCEED_SIZE_LIMIT':
                                simpop.alert({content:'添加的文件总大小超出'});
								break;
							case 'Q_TYPE_DENIED':
                                simpop.alert({content:'文件类型不对'});
								break;
							case 'F_DUPLICATE':
                                simpop.alert({content:'不能重复选择相同的文件'});
								break;
							case 'F_EXCEED_SIZE':
                                simpop.alert({content:'单个文件大小超出'});
								break;
							default:
                                simpop.alert({content:'error ：'+code});
						}
					};
				});
			}
		})
        .state('uploadFile',{
			url:'/upload/file?id&size&url&isadmin&returnResult',
			templateUrl:'?m=attachment&c=attachment&a=dialog&debug=mobile',
			controller:function($scope,$state,$stateParams,$rootScope,$window,aForm,fileGlobal,result){
				//点击选择相关
				var SIZE=1;//是否可以多选
				var PAGESIZE=7;//每页多少个
				if($stateParams.size)SIZE=$stateParams.size;
				$scope.items=[];
				//点击加载相关
				var clickIsLoading=false;//当前加载是否完成
				var clickPage=0;//当前页码
				var clickCom=false;//是否全部加载
                $scope.clickTxt='点击加载更多';
                $scope.clickIsTxt=true;
				$scope.clickItems=function(){
					if(!clickIsLoading && !clickCom){
                        clickPage+=1;
                        clickIsLoading=true;
                        $scope.clickTxt='正在加载中...';
                        aForm.request({method:'GET',url:'?m=attachment&c=images&a=document&page='+clickPage,isJson:true})
                        .success(function(ret){
                            clickIsLoading=false;
                            if(ret.status){
                                var info=ret.info;
                                if(info.length){
                                    $scope.clickTxt='点击加载更多';
									//判断是否加载完全
									if(info.length<PAGESIZE){
										$scope.clickTxt='已经全部加载';
										scrollCom=true;
										$scope.clickIsTxt=false;
										if(clickPage!=1)simpop.tips({content:'已经全部加载'});
									}
                                    if(info.length>fileGlobal.uploadSize){
                                        info.length=info.length-fileGlobal.uploadSize;
                                        fileGlobal.uploadSize=0;
                                        $scope.items=$scope.items.concat(info);
                                        fileGlobal.data=$scope.items;
                                    }else{
                                        fileGlobal.uploadSize=fileGlobal.uploadSize-info.length;
                                        $scope.clickItems();
                                    }
                                }else{
                                    $scope.clickTxt='已经全部加载';
                                    scrollCom=true;
                                    $scope.clickIsTxt=false;
                                    simpop.tips({content:'已经全部加载'});
                                }
                            }else{
                                simpop.tips({content:ret.info});
                            }
                        })
					}
				};
				if(fileGlobal.data){
					$scope.items=fileGlobal.data;
				}else{
//					aForm.request({method:'GET',url:'?m=attachment&c=attachment&a=document',isJson:true})
//					.success(function(ret){
//						var info=ret.info;
//						$scope.items=$scope.items.concat(info);
//                        fileGlobal.data=$scope.items;
//					});
					//加载第一屏
					$scope.clickItems();
				}
				$scope.changeClass=function(index){
                    if(!$scope.items[index].isProgress){
                        $scope.items[index].isSel=!$scope.items[index].isSel;
                        if(SIZE=='1'){
                            angular.forEach($scope.items,function(n,i){
                                if(i!=index){
                                    n.isSel=false;
                                }
                            });
                        }
                    }else{
                        simpop.tips({content:'请先等待文件上传完成后再选择'});
                        return false;
                    }
				};
				$scope.complete=function(){
                    fileGlobal.returnData[$stateParams.id]=[];
                    angular.forEach($scope.items,function(n,i){
                        if(n.isSel){
                            fileGlobal.returnData[$stateParams.id].push(n);
                        }
                    })
					if(!$stateParams.returnResult){
						$rootScope.$broadcast('uploadFileData.updata',fileGlobal.returnData);
						$state.go('index');
					}else{
						result.setResult($stateParams.id,fileGlobal.returnData[$stateParams.id]);
						$window.history.go(-1);
					}
				};
				$scope.back=function(){
					if(!$stateParams.returnResult){
						fileGlobal.returnData={};
						$state.go('index');
					}else{
						$window.history.go(-1);
					}
				};
				
				//上传相关
				require.async(['jquery','webuploader'],function($,webuploader){
					var serverUrl='?m=attachment&c=attachment&a=upload';
					if($stateParams.url)serverUrl=$stateParams.url;
					if($stateParams.isadmin)serverUrl+='&isadmin='+$stateParams.isadmin;
					var uploader = WebUploader.create({

                        // 文件接收服务端。
                        server: serverUrl,

                        // 选择文件的按钮。可选。
                        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                        pick: '#picker',
                        auto:true,//自动上传
						chunked: false,//是否允许分片上传
//						chunkSize:102400,//100K
//						chunkRetry:10,//如果某个分片由于网络问题出错，允许自动重传多少次？
                        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                        resize: false,
                        accept: {
                                title: 'Files',
                                extensions: 'jpg,png,jpeg,gif,bmp,doc,docx,xls,xlsx,ppt,rar,zip,7z,tar,gz,txt,mp3',
                        },
                        fileNumLimit: 300,
                        fileSizeLimit: 50000 * 1024 * 1024,    // 5000 M
                        fileSingleSizeLimit: 5000 * 1024 * 1024    // 10 M
					});
					// 当有文件添加进来的时候
					uploader.on( 'fileQueued', function( file ) {
						$scope.items.unshift({
                            fileId:file.id,
                            isProgress:true,
                            css:{width:0.1*100+'%'}
                        });
                        fileGlobal.uploadSize+=1;
                        $scope.$apply();
					});
					// 文件上传过程中创建进度条实时显示
					uploader.on( 'uploadProgress', function( file, percentage ) {
						angular.forEach($scope.items,function(n,i){
							if(n && n.fileId==file.id){
								$scope.items[i].css={width:percentage*100+'%'};
                                $scope.$apply();
                                return false;
							}
						})
					});
					// 文件上传成功。
					uploader.on( 'uploadSuccess', function( file,ret) {
						if(ret.status){
							angular.forEach($scope.items,function(n,i){
								if(n.fileId==file.id){
									$scope.items[i]=angular.extend($scope.items[i],ret.info);
                                    $scope.items[i].isSel=true;
                                    $scope.items[i].isProgress=false;
								}else{
                                    $scope.items[i].isSel=false;
                                }
							});
							$scope.$apply();
						}else{
							angular.forEach($scope.items,function(n,i){
								if(n && n.fileId==file.id){
									$scope.items.splice(i,1);
                                    simpop.tips({content:ret.info});
                                    fileGlobal.uploadSize-=1;
									$scope.$apply();
                                    return false;
								}
							})
						}
					});
					// 文件上传失败，显示上传出错。
					uploader.on( 'uploadError', function( file ) {
						angular.forEach($scope.items,function(n,i){
							if(n && n.fileId==file.id){
                                $scope.items.splice(i,1);
                                simpop.tips({content:'上传失败'});
                                fileGlobal.uploadSize-=1;
                                $scope.$apply();
								return false;
							}
						})	
					});
					//错误代码的提示
					uploader.onError = function( code ) {
						switch (code){
							case 'Q_EXCEED_NUM_LIMIT':
                                simpop.alert({content:'添加的文件数量超出'});
								break;
							case 'Q_EXCEED_SIZE_LIMIT':
                                simpop.alert({content:'添加的文件总大小超出'});
								break;
							case 'Q_TYPE_DENIED':
                                simpop.alert({content:'文件类型不对'});
								break;
							case 'F_DUPLICATE':
                                simpop.alert({content:'不能重复选择相同的文件'});
								break;
							case 'F_EXCEED_SIZE':
                                simpop.alert({content:'单个文件大小超出'});
								break;
							default:
                                simpop.alert({content:'error ：'+code});
						}
					};
				});
			}
		});
	});
	return uploaderApp;
});