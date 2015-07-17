seajs.use(['angular','aForm','aTools','simpop'],function(angular,aForm,aTools,simpop,uiRouter){
    var ionicApp=angular.module('ionicApp',['aForm','aTools']);
    ionicApp.config(function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/index");
       $stateProvider
	   .state('index',{
	       url:'/index',
           templateUrl:'index',
           controller:function($scope,$window,aForm,delivery,store,result){  
               $scope.form={};
               $scope.delivery={};
               $scope.freight={};
               $scope.disabled={};
               $scope.card={};
               var TX=true;
                $scope.$watch('jf.point',function(val){
                    $scope.form['point']=val;
                })
                $scope.$watch('delivery',function(obj){
                    if(obj && !aTools.isEmptyObject(obj)){
//                        console.log(obj);
                        var areaid=obj.areaids[1];
                        $scope.form['delivery[realname]']=obj.realname;
                        $scope.form['delivery[area]']=obj.areas;
                        $scope.form['delivery[address]']=obj.address;
                        $scope.form['delivery[mobile]']=obj.mobile;
                        $scope.form['delivery[phone]']=obj.phone;
                        $scope.form['delivery[zipcode]']=obj.zipcode;
                        $scope.form['delivery[city]']=areaid;
//                        console.log($scope.form);
                        //设置运费
                        var tmp={};
                        var reg=/^products\[(.*?)\]\[(id|quantity)\]$/i;
                        angular.forEach($scope.form,function(n,i){
                            var result=reg.exec(i);
                            if(result){
                                if(!tmp[result[1]]){
                                    tmp[result[1]]={};
                                }
                                tmp[result[1]][result[2]]=n;
                            }
                        });
//                        console.log(tmp);
                        var products={};
                        for(i in tmp){
                            if(!products[tmp[i].id]){
                                products[tmp[i].id]={};
                                products[tmp[i].id].id=tmp[i].id;
                                products[tmp[i].id].quantity=tmp[i].quantity;
                            }else{
                                products[tmp[i].id].quantity=parseInt(products[tmp[i].id].quantity)+parseInt(tmp[i].quantity)
                            }
                        }
//                        console.log(products);
                        aForm.form({
                            url:'?m=product&c=order&a=freight',
                            before:function(){TX=false;},
                            data:{products:products,areaid:areaid},
                            type:'post',
                            success:function(ret){
                                TX=true;
                                if(ret.status){
                                    var tmp=$scope.freight.freight?$scope.freight.freight:0;
                                    $scope.freight.freight=parseFloat(ret.info).toFixed(2);
                                    $scope.freight.total=(parseFloat($scope.freight.amount)-tmp+parseFloat(ret.info)).toFixed(2);
                                }
                            }
                        });
                    }
                },true)
                //获取默认地址
                delivery.get().then(function(ret){
                    if(ret.status && ret.info.length>0){
                        var def=0;
                        angular.forEach(ret.info,function(n,i){
                            if(n.default=='1'){
                                def=i;
                            }
                        })
                        $scope.delivery=ret.info[0];
                    }
                });
                //积分相关
                $scope.jf={};
                $scope.jf.isTrue=false;//是否使用积分
                $scope.jf.isComplete=false;//是否已经确定使用积分
                $scope.jf.total='';//总积分的个数
                $scope.jf.point='';//使用积分的个数
                $scope.jf.rate='';//转换率
                $scope.jf.price='';//积分兑换成人民币
                $scope.$watch('jf.isTrue',function(val){
                    if(!val)$scope.jf.point='';
                })
                $scope.jf.complete=function(){
                    var reg=/^\d*$/ig;
                    if(!$scope.jf.point){
                        simpop.tips({content:'积分不能为空!'});
                    }else if(!reg.test($scope.jf.point)){
                        simpop.tips({content:'积分必须是数字！'});
                    }else if($scope.jf.point>$scope.jf.total){
                        simpop.tips({content:'使用的积分不能多于总积分个数'});
                    }else{
                        $scope.jf.price=(parseFloat($scope.jf.point)/parseFloat($scope.jf.rate)).toFixed(2);
                        $scope.jf.isComplete=true;
                    }
                }
                $scope.jf.cancel=function(){
                    $scope.jf.point='';
                    $scope.jf.price='';
                    $scope.jf.isComplete=false;
                }
                
                //购物卡
                aForm.promise({url:'?m=financial&c=card&a=cart',isJson:true}).then(function(ret){
                    if(ret.status && ret.info && $.isArray(ret.info.infos)){
                        $scope.card.items=ret.info.infos;//总购物卡
                        $scope.card.infos={};//实际花销的购物卡
                        $scope.card.change=function(index){
                            var item=angular.copy($scope.card.items[index]);
                            item.over=parseFloat(item.over);
                            if(!item.isSel){
                                if($scope.freight.total==0){
                                    simpop.tips({content:'不能再使用购物券了'});
                                    return;
                                }
                                if($scope.freight.total>=item.over){
                                    $scope.freight.total=$scope.freight.total-item.over;
                                }else{
                                    $scope.freight.total=0;
                                    item.over=$scope.freight.total;
                                }
                                $scope.card.infos[item.no]=item;
                                $scope.card.items[index].isSel=true;
                            }else{
                                var children=$scope.card.infos[item.no];
                                $scope.freight.total=$scope.freight.total+children.over;
                                delete $scope.card.infos[item.no];
                                $scope.card.items[index].isSel=false;
                            }
                            //更新form
                            $scope.form.cards=[];
                            for(var i in $scope.card.infos){
                                $scope.form.cards.push($scope.card.infos[i].no);
                            }
                        }
                    }
                });
                
                //提交之前验证表单是否有效
                function valid(){
                    var tx=true;
                    aForm.defer({
                        url:'?m=product&c=order&a=submit',
                        type:'POST',
                        data:$scope.form,
                        success:function(ret){
                            if(!ret.status){
                                simpop.tips({content:ret.info});
                                tx=false;
                            }
                        }
                    })
                    return tx;
                }
                //提交订单
                $scope.onSubmit=function(e){
                    if(!TX){simpop.tips({content:'请稍等页面正在刷新数据！'});e.preventDefault();return false;}
                   var tx=true;
                    if($scope.status==0){simpop.tips({content:'有缺货商品！'});e.preventDefault();return false;}
                    if(!$scope.form['delivery[city]']){simpop.tips({content:'收货地址不能为空！'});e.preventDefault();return false;}
                    if(!valid()){e.preventDefault();return false;}
                    $scope.disabled.disabled=true;
                    $scope.disabled.txt='正在提交';
                }
                //恢复数据相关
                var storeData=store.getStore();
               if(storeData){
                   for(var i in storeData){
                       if(storeData[i]){
                           for(var j in storeData[i]){
                              $scope[i][j]=storeData[i][j];
                           }
                       }
                   }
               }
               $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
                    var reslutData=result.getResult();
                    if(reslutData){
                        switch (fromState.name){
                            case 'deliveryList':
                                $scope.delivery=reslutData.result;
                                break;
                        }
                    }
                })
           }
	   })
       .state('deliveryList',{
            url:'/delivery/list?id',
            templateUrl:'list',
            controller:function($scope,$state,$stateParams,$window,aForm,delivery,result){
                $scope.form={};
                delivery.get().then(function(ret){
                    if(ret.status){
                        $scope.items=ret.info;
                        angular.forEach($scope.items,function(n,i){
                            if(n.default=='1'){
                                $scope.sel=i;
                            }
                        })
                        $scope.complete=function(){
                            if($scope.sel==undefined){
                                simpop.tips({content:'请先选择地址'});
                                return false;
                            }
                            result.setResult($stateParams.id?$stateParams.id:'default',$scope.items[$scope.sel]);
                            $window.history.go(-1);
                        };
                    }
                });
            }
       })
       .state('deliveryAdd',{
           url:'/delivery/add',
           templateUrl:'add',
           controller:function($scope,$window,$state,$stateParams,aForm,delivery,classify){
               $scope.form={};
               classify.resolve({name:'area',def:['','','']}).then(function(ret){
                $scope.area=ret.data;
                $scope.vm={};
                $scope.vm.slt1='';
                $scope.vm.slt2='';
                $scope.vm.slt3='';
                $scope.$watch('vm.slt1',function(val){
                    if(val){
                        $scope.form['arg[area]']=null;
                        if(!ret.init[0]){
                            $scope.vm.slt2=null;
                            $scope.vm.slt3=null;
                        }else{
                            ret.init[0]=false;
                        }
                    }
                });
                $scope.$watch('vm.slt2',function(val){
                    if(val){
                        $scope.form['arg[area]']=null;
                        if(!ret.init[1]){
                            $scope.vm.slt3=null;
                        }else{
                            ret.init[1]=false;
                        }
                    }
                });
                $scope.$watch('vm.slt3',function(val){
                    if(val){
                        $scope.form['arg[area]']=ret.idObj[val].id;
                    }
                });
            });
               $scope.complete=function(){
                   var tx=true;
                   angular.forEach($scope.form,function(n,i){
                       if(!n){
                           simpop.tips({content:'所填写的信息不对！'});
                           tx=false;
                           return false;
                       }
                   })
                   if(tx){
                       aForm.form({
                           data:$scope.form,
                           url:'?m=member&c=delivery&a=add',
                           success:function(ret){
                                if(ret.status){
                                    simpop.tips({content:ret.info,callback:function(){$window.history.go(-1);}});
                                }else{
                                    simpop.tips({content:ret.info});
                                }
                           }
                       });
                   }
               }
           }
       })
    });
    ionicApp.factory('delivery',function(aForm){
        var fact={
                get:function(){//获取最新地址信息
                    var promise=aForm.promise({url:'?m=member&c=delivery',isJson:true});
                    return promise;
                }
            }
        return fact;
    })
})