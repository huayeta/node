seajs.use(['angular','aForm','aTools','simpop'],function(angular,aForm,aTools,simpop){
		var ionicApp=angular.module('ionicApp',['aForm','aTools']);
		ionicApp.controller('ajaxForm',function($scope,$window,aForm){
            $scope.items={};//储存购物车商品的信息
            $scope.total={};//储存购物车商品总价格和数量信息
            $scope.total.num=0;//总购物数量
            $scope.total.price=0;//总购物金额
            $scope.total.isSel=false;//储存购物车商品是否全选
			$scope.total.point=0;//储存购买商品总共需要多少积分
			$scope.total.givepoint=0;//储存购买商品总共赠送多少积分
            aForm.request({url:'?m=product&c=cart&a=index',isJson:true})
            .success(function(ret){
                if(ret.status){
                    $scope.items=ret.info.infos;
                    $scope.dicts=ret.info.dicts;
                    $scope.updataForm();
                }
            });
            //编辑状态显示隐藏数量的编辑
            $scope.editor=function(index){
                $scope.items[index].total.isEditor=!$scope.items[index].total.isEditor;
                if($scope.items[index].total.isEditor==true){$scope.items[index].total.editorTxt='完成'}
                else{$scope.items[index].total.editorTxt='编辑'}
            };
            //数量改变时候的函数
            $scope.modify=function(id,index,type){
                var product=$scope.items[id].products[parseInt(index)];
                var quantity=product.quantity;
                if(type=='add'){
                    quantity++;
                }else if(type=='min'){
                    if(quantity!=1){
                        quantity--
                    }
                }else{
                    if(!/^\d+$/.test(quantity)){
                        simpop.tips({content:'请输入正整数'});
                        quantity=1;
                    }
                }
                $scope.items[id].products[parseInt(index)].quantity=quantity;
                aForm.request({url:'?m=product&c=cart&a=change_quantity'+'&id='+product.id+'&v='+product.quantity})
                .success(function(ret){
                    if(!ret.status)simpop.tips({content:ret.info});
                    if(product.isSel)$scope.updataForm();
                });
            }
            //删除函数
            $scope.del=function(id,index){
                var product=$scope.items[id].products[parseInt(index)];
                simpop.alert({content:'您确定要删除此商品？',callback:function(){
                    aForm.request({url:'?m=product&c=cart&a=del&id='+product.id}).success(function(ret){
                        if(ret.status){
                            simpop.tips({content:ret.info});
                            $scope.items[id].products.splice(index,1);
                            if($scope.items[id].products.length==0){
                                delete $scope.items[id];
                            }
                            $scope.updataForm();
                        }else{simpop.alert({content:ret.info});}
                    });
                }})
            }
            //更新form提交数据
            $scope.updataForm=function(type){
                //"1":全选,"2":商家,"3":商品
//                console.log($scope.items);
//                console.log($scope.total);
                var price=0;
                var num=0;
				var point=0;
				var givepoint=0;
                var sel=true;
                angular.forEach($scope.items,function(n,i){
                    if(!$scope.items[i].total){
                        $scope.items[i].total={};
                        $scope.items[i].total.isSel=false;
                        $scope.items[i].total.isEditor=false;
                        $scope.items[i].total.editorTxt="编辑";
                    }
                    var numSel=0;
                    if(type==1){
                        //全选
                        $scope.items[i].total.isSel=$scope.total.isSel;
                    }
                    angular.forEach(n.products,function(m,j){
                        if(type==1){
                            //全选
                            $scope.items[i].products[j].isSel=$scope.total.isSel;
                        }else if(type==2){
                            //商家
                            $scope.items[i].products[j].isSel=$scope.items[i].total.isSel;
                        }else if(type==3){
                            //商品
                            if(m.isSel)numSel++;
                        }
                        m.quantity=parseInt(m.quantity);
                        m.stock=parseInt(m.stock);
                        if(m.isSel){
                            price+=parseInt(m.quantity)*parseFloat(m.price);
                            num+=parseInt(m.quantity);
                            if(m.purchase==3)point+=parseInt(m.point?m.point:0)*parseInt(m.quantity);
                            givepoint+=parseInt(m.givepoint?m.givepoint:0)*parseInt(m.quantity);
                        }
                        if(m.quantity>m.stock){$scope.items[i].products[j].status=0;}
                        else{$scope.items[i].products[j].status=1;}
                    })
                    if(type==3){
                        //商品
                        if(numSel==n.products.length){
                            $scope.items[i].total.isSel=true;
                        }else{
                            $scope.items[i].total.isSel=false;
                        }
                    }
                    if(!n.total.isSel)sel=false;
                })
                $scope.total.isSel=sel;
				$scope.total.price=price.toFixed(2);
                $scope.total.num=num;
                $scope.total.point=point;
                $scope.total.givepoint=givepoint;
            };
            //提交函数
			$scope.onSubmit=function(e){
				if($scope.total.num==0){
                    simpop.tips({content:'请先选择商品后再提交'});
                    e.preventDefault();
                    return false;
                }
				if($scope.total.mepoint<$scope.total.point){
					simpop.tips({content:'您的总'+$scope.total.pointA+'不足'});
                    e.preventDefault();
                    return false;
				}
                var tx=true;
                var purchase;
                angular.forEach($scope.items,function(n,i){
                    angular.forEach(n.products,function(m,j){
                        if(m.isSel){
                            if(!purchase){purchase=m.purchase;}
                            else{
                                if(m.purchase!=purchase){
                                    tx=false;
                                    simpop.tips({content:'请选择相同的付款方式商品再重新结算！!'});
                                }
                            }
                            if(m.status==0 && tx){
                                tx=false;
                                simpop.tips({content:'您选择的商品有缺货商品!'});
                            }
                        }
                    })
                })
                if(!tx){
                    e.preventDefault();
                    return false;
                }
			};
		});
	});