define('cart',function(require, exports, module){
	var $=require('jquery');
	var dialog=require('fnDialog');
	var tools=require('tools');
    var template=require('template');
    var box=require('box');
    var wbmc=require('wbmc');
    
    template.config('openTag', '<<');
    template.config('closeTag', '>>');
	
	var $bind=$('[data-bind]');
	
	function updata(arr){
		var num=0;
		var amount=0;
		var point=0;
        var givepoint=0;
		for(var i in arr){
			num+=parseInt(arr[i]['quantity']);
			amount+=parseInt(arr[i]['quantity'])*parseFloat(arr[i]['price']);
			point+=parseInt(arr[i]['quantity'])*parseInt(arr[i]['point']);
			givepoint+=parseInt(arr[i]['quantity'])*parseInt(arr[i]['givepoint']);
		}
		$.each($bind,function(i,n){
			var _this=$(n);
			var bind=_this.data('bind');
			if(bind=='num')_this.text(num);
			if(bind=='amount')_this.text(amount.toFixed(2));
			if(bind=='total'){
				var parent_tag=$('[data-unit]').data('unit');
				var unit=_this.closest(parent_tag).find('[data-unit]');
				_this.text((parseInt(unit.data('quantity'))*parseFloat(unit.data('price'))).toFixed(2));
			}
            if(bind=='point'){
                _this.text(parseInt(point));
            }
			if(bind=='givepoint'){
                _this.text(parseInt(givepoint));
            }
			if(bind=='isPoint'){
				if(parseInt(point)>0){_this.show();}else{_this.hide()}
			}
		})
	}
	
	var arrData=function(a){
		var defaults={
			contain:document
		}
		var opts=$.extend(defaults,a);
		var arr=[];
        var $unit=$('[data-unit]:checked',opts.contain);
		$.each($unit,function(i,n){
			var _this=$(n);
			var obj={};
			obj.id=_this.data('id');
			obj.price=_this.data('price');
			obj.quantity=_this.data('quantity');
			obj.status=_this.data('status');
			obj.point=_this.data('point')?_this.data('point'):0;
			obj.givepoint=_this.data('givepoint')?_this.data('givepoint'):0;
            obj.purchase=_this.data('purchase');
			arr[obj.id]=obj;
		})
		updata(arr);
		return arr;
	}
	
	var modifyQuantify=function(a){
		require.async(['validForm'],function(validForm){
			var defaults={
				num:'',
				url:'?m=product&c=cart&a=change_quantity',
				id:'',
				success:''
			}
			var opts=$.extend(defaults,a);
			validForm.request({
				url:opts.url+'&id='+opts.id+'&v='+opts.num,
				before:function(){
					if(opts.num<=0)return false;
				},
				success:function(ret){
					if($.isFunction(opts.success))opts.success(ret);
				}
			});
		});
	}
	
	var fnQuantity=function(a){
		var defaults={
			contain:'.u-quantity',
			btn:'[data-quantity-btn]',
			txt:'[data-quantity-val]',
			id:'',
			isajax:true,
			success:''
		};
		var opts=$.extend(defaults,a);
		var id=opts.id;
		$(document).delegate(opts.btn,'click',function(){
			var sx=opts.btn.substring(1,opts.btn.length-1);
			var _this=$(this);
			var parent=_this.closest(opts.contain);
			var txt=$(opts.txt,parent);
			var val=parseInt(txt.val());
			if(!id)id=txt.data('id');
			var new_val;
			if(_this.attr(sx)=='add'){new_val=val+1;txt.val(new_val);}
			if(_this.attr(sx)=='min'){
				if(val==1){
					require.async(['fnDialog'],function(dialog){
						dialog.tips({content:'最少一个'});
					});
				}
				else{new_val=val-1;txt.val(new_val);}
			}
			if(opts.isajax){
				modifyQuantify({id:id,num:new_val});
			};
			if($.isFunction(opts.success))opts.success(txt[0],new_val);
		});
		$(document).delegate(opts.txt,'change',function(){
			var _this=$(this);
			var id=_this.data('id');
			var val=_this.val();
			if(val<1){
				_this.val(1);
				require.async(['fnDialog'],function(dialog){
					dialog.tips({content:'最少一个'});
				});
			}else{
				if(opts.isajax)modifyQuantify({id:id,num:val});
				if($.isFunction(opts.success))opts.success(this,val);
			}
		});
	}
	
	var  cart=function(){
		var arr;
		var parent_tag=$('[data-unit]').data('unit');
        arr=arrData();
		require.async(['tools'],function(tools){
			tools.del({target:'[data-malldel]',checkval:'data-check-mallval',content:'是否确认删除此商品',success:function(ret,obj){
				if(ret.status){
                    var _this=$(obj);
					if(!_this.attr('data-check')){
                        var parent=_this.closest(parent_tag);
                        parent.remove();
                    }else{
                        var $val=tools.checkObj('data-check-mallval');
                        var parent=$val.closest(parent_tag);
                        parent.remove();
                    }
					arr=arrData();
				}else{
                    dialog.alert({content:ret.info});
                }
			}});
			tools.checkSel({btn:'[data-check-mallbtn]',val:'[data-check-mallval]',change:function(){
				arr=arrData();
			}});
		});
		fnQuantity({success:function(obj,val){
			$(obj).closest(parent_tag).find('[data-unit]').data('quantity',val);
			arr=arrData();
		}});
		
		$('[data-submit-btn]').prop('disabled',false);
		
		var mepointObj,pointObj,pointAObj,mepoint,pointA;
		$.each($bind,function(i,n){
			var _this=$(n);
			var bind=_this.data('bind');
			if(bind=='mepoint')mepointObj=_this;
			if(bind=='point')pointObj=_this;
			if(bind=='pointA')pointAObj=_this;
		});
		if(mepointObj)mepoint=mepointObj.text()?parseInt(mepointObj.text()):0;
		if(pointAObj)pointA=pointAObj.text();
		
		$('#formCart').submit(function(){
			if(mepoint && pointAObj && mepoint<(pointObj.text()?parseInt(pointObj.text()):0)){
				dialog.tips({content:pointA+'不足',time:2500});
				return false;
			}
            var purchase;
            var num=0;
            for(var i in arr){
                if(arr[i].status==0){
                    dialog.alert({content:'有缺货的商品，请重新选择！',time:2500});
                    return false;
                }
                if(num==0){purchase=arr[i].purchase;}
                else{
                    if(arr[i].purchase!=purchase){
                        dialog.alert({content:'请选择相同的付款方式商品再重新结算！',time:2500});
                        return false;   
                    }
                }
                num++;
            }
            if(num==0){
				dialog.alert({content:'请先选择商品再结算！',time:2500});
				return false;
			}
		});
	}
	var init=function(){
        arrData();
    }
    
    //邮费
    var freightFn=function(a){
        var a=a||{};
        var defaults={
            freight:''
        }
        var opts=$.extend(defaults,a);
        if(!opts.freight)return;//防没有运费模板的时候返回
        var $box=$('.j-freightBox');
//        console.log(opts.freight);
        wbmc({name:'area',init:function(area){
//            console.log(area);
            //获取邮费
            function getFreight(id){
                if(!id)return '';
                //卖家承担运费
                if(opts.freight.type=='1'){
                    return '免运费';
                }
                //买家自提
                if(opts.freight.type=='2'){
                    return '买家自提：'+area.getName(area.getId(opts.freight.area))+' '+opts.freight.address;
                }
                //如果自定义运费
                if(opts.freight.type=='0'){
                    var detail=opts.freight.detail;
                    //如果只有默认邮费时
                    if(detail.length==1){
                        return '快递：'+detail[0].postage;
                    }
                    //判断该id或其省份id是否在特殊运费里面
                    for(var i in detail){
                        if(i>0){
                            var tmp=','+detail[i].area+',';
                            if(tmp.indexOf(','+id+',')!=-1 || tmp.indexOf(','+area.findIdObj[id]+',')!=-1){
                                return '快递：'+detail[i].postage;
                            }
                        }
                    }
                    //最后返回默认邮费
                    return '快递：'+detail[0].postage;
                }
                return '';
            }
            $box.html(template('freight',{area:area,freight:opts.freight,getFreight:getFreight})).show();
            var $target=$box.find('.j-freightTarget');
            var $Txt=$box.find('.j-freightTxt');
            var $content=$box.find('.j-freightContent');
            var $close=$box.find('.j-freightClose');
            var $first=$content.find('li.first');
            var $city;//储存市的jquery对象
            $target.click(function(){
                if($content.is(':hidden')){$content.show();}
                else{$content.hide();}
            });
            $close.click(function(){$content.hide();});
            //点击省份的时候
            $first.delegate('a','click',function(){
                var _this=$(this).closest('li.first');
                var index=$first.index(_this);
                var m=parseInt(index/6);//整数部分
                var n=index%6;//小数部分
                $(this).addClass('sel');
                _this.siblings('li.first').find('a').removeClass('sel');
                if($city)$city.remove();
                $city=getCity(_this.data('id'));
                if($first.size()>(6*m+5)){
                    $first.eq(6*m+5).after($city);
                }else{
                    $first.filter(':last').after($city);
                }
            });
            //点击市的时候
            $content.delegate('li.cur a','click',function(){
                var _this=$(this).closest('li');
                $Txt.html(getFreight(_this.data('id')));
                $close.click();
                $target.html($(this).text()+'<i class="addr-icon"></i>');
            })
            //获取市部分的html
            function getCity(id){
                if(!id)return '';
                var tpl='<li class="cur"><ul>';
                for(var i in area.data[id]){
                    tpl+='<li class="f-toe" data-id="'+area.data[id][i].id+'"><a>'+area.data[id][i].name+'</a></li>'
                }
                tpl+='</ul></li>';
                return $(tpl);
            }
        }})
    }
    
	var product=function(a){
        var a=a||{};
        var defaults={
            sales_attributes:[],//商品规格
            sales_attribute:{},//用户填写的商品规格
            spic:false,//是否填写了规格
            freight:''
        };
        var opts=$.extend(defaults,a);
        //设置邮费
        freightFn({freight:opts.freight});
        //商品规格
        var $spic=$('.j-spic');//商品规格jquery对象
        var $price=$('.j-price');//商品价格jquery对象
        var $stock=$('.j-stock');//商品库存的jquery对象
        $price.data('defaultValue',$price.html());
        $stock.data('defaultValue',$stock.html());
        for(var i in opts.sales_attribute){
            opts.spic=true;
        }
        // console.log(opts);
        //恢复立即购买按钮
        var $order=$('.j-order');
        var $orderForm=$order.closest('form');
        var $orderSales=$orderForm.find('.j-sales');
        $order.prop('disabled',false);
        $orderForm.submit(function(event){
            if(opts.spic && $orderSales.val()==''){
                dialog.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            if(!box.isLogin()){
                box.getLogin();
                return false;
            }
        });
        //调节商品数目
		fnQuantity({
			contain:'[data-q-box]',
			btn:'[data-q-btn]',
			txt:'[data-q-val]',
			isajax:false
		});
        //加入购物车
		$('[data-cart-add]').click(function(){
			var _this=$(this);
			var parent=_this.closest('form');
			var bind=parent.find('[data-bind]');
			var id,quantity;
			$.each(bind,function(i,n){
				var _this=$(n);
				var bindval=_this.data('bind');
				if(bindval=='id')id=_this.val();
				if(bindval=='quantity')quantity=_this.val();
			});
            var salesVal=$orderSales.val();
            if(opts.spic && salesVal==''){
                dialog.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            //规格部分
			require.async(['fnDialog','validForm'],function(dialog,validForm){
				validForm.request({
					url:'?m=product&c=cart&a=add',
                    isLogin:true,
					type:'post',
					data:'products[0][id]='+id+'&products[0][quantity]='+quantity+'&products[0][sales]='+salesVal,
					success:function(ret){
						if(ret.status){
                            dialog.tips({
                                content:ret.info,
                                callback:function(){
                                    if(ret.url)window.location.href=ret.url;
                                }
                            })
                        }
                        else{dialog.alert({content:ret.info})}
					}
				});
			});
		});
        //j-spic
        template.helper('filterSel', function (id,arr) {
            var str='';
//            if(arr){
//                var value=tools.serialize(arr);
////                console.log(value);
//                var reg=new RegExp(id+'\:');
//                var tx=reg.test(value);
//                tx?str='checked':'';
//            }
            return str;
        });
        var sales={};
        sales.json=[];//原始数组
//        sales.data={};//重新排列后的json数据
        sales.findId={};//id->{}
        sales.attribute={};//需要展示的商品规格
        sales.num=0;//一共几种规格
        sales.sales_attribute_str=tools.serialize(opts.sales_attribute);
        for(var i in opts.sales_attributes){
            var n=opts.sales_attributes[i];
            var obj={name:n.name,id:n.id,pid:0};
            sales.json.push(obj);
            sales.json=sales.json.concat(n.children);
        }
        $.each(sales.json,function(i,n){
            sales.findId[n.id]=n;
        });
//        console.log(opts.sales_attribute);//客户选择的
//        console.log(opts.sales_attributes);//规定出来的
//        console.log(sales.sales_attribute_str);//规定出来的
        for(var i in opts.sales_attributes){
            //循环应该出来的商品规格
            for(var j in opts.sales_attributes[i].children){
                if(sales.sales_attribute_str.indexOf(opts.sales_attributes[i].children[j].id+':{')!=-1){
                    if(!sales.attribute[opts.sales_attributes[i].id]){
                        sales.attribute[opts.sales_attributes[i].id]={name:opts.sales_attributes[i].name,id:opts.sales_attributes[i].id,children:{}};
                    }
                    sales.attribute[opts.sales_attributes[i].id].children[opts.sales_attributes[i].children[j].id]=opts.sales_attributes[i].children[j];
                }
            }
        }
        for(var i in sales.attribute){
            sales.num++;
        }
        $spic.html(template('spic',sales));
        $spic.delegate('.btn1:not(.btn1-not-stock)','mouseover',function(){
            $(this).addClass('btn1-hover');
        }).delegate('.btn1:not(.btn1-not-stock)','mouseout',function(){
            $(this).removeClass('btn1-hover');
        }).delegate('.btn1:not(.btn1-not-stock)','click',function(){
            var _this=$(this);
            var spic=_this.data('spic').split(',');
            if(_this.hasClass('btn1-active')){
                sales.attribute[spic[0]].isSel=false;
                sales.attribute[spic[0]].children[spic[1]].isSel=false;
                sales.attribute[spic[0]].sel=false;
            }else{
                sales.attribute[spic[0]].isSel=true;
                sales.attribute[spic[0]].sel=spic[1];
                sales.attribute[spic[0]].children[spic[1]].isSel=true;
                for(var i in sales.attribute[spic[0]].children){
                    if(i!=spic[1]){
                        sales.attribute[spic[0]].children[i].isSel=false;
                    }
                }
            }
            updataSpic();
        })
        //更新规格
        function updataSpic(){
            var arr=[];
            var result=false;
            for(var i in sales.attribute){
                if(sales.attribute[i].isSel){
                    arr.push(sales.attribute[i].sel);
                }
            }
            //返回结果
            if(arr.length==sales.num){
                var tpl=[];
                for(var i in arr){
                    tpl.push('['+arr[i]+']');
                }
                result=eval('opts.sales_attribute'+tpl.join(''));
                if(result){
                    //当匹配出规格的时候
                    $price.html('￥<b>'+result.price+'</b>');
                    $stock.html('库存'+result.stock+'件');
                    $orderSales.val(arr.join(','));
                }else{
                    //出现没匹配到的问题
                   $price.html($price.data('defaultValue'));
                    $stock.html('库存0件');
                    $orderSales.val('');
                }
            }else{
                $price.html($price.data('defaultValue'));
                $stock.html('');
                $orderSales.val('');
            }
            $spic.html(template('spic',sales));
            return {arr:arr,result:result};
        }
	}
	
	module.exports={
		fnQuantity:fnQuantity,//点击增改变商品个数
        cart:cart,//购物车的初始函数
        init:init,//再次刷新购物车函数
		product:product//商品详情页
	}
})