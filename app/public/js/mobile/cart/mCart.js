define('mCart',function(require, exports, module){
	var zepto=require('zepto');
    var mTools=require('mTools');
    var simpop=require('simpop');
    var template=require('template');
    var mWbmc=require('mWbmc');
//    
    template.config('openTag', '<<');
    template.config('closeTag', '>>');
    
    //数量修改函数
    function fnQuantity(a){
        var a=a||{};
		var defaults={
			contain:'.u-quantity',
			minBtn:'.min',
            addBtn:'.add'
		};
		var opts=$.extend(defaults,a);
        var $contain=$(opts.contain);
        $.each($contain,function(){
            var _this=$(this);
            var $ipt=_this.find('input');
            var $min=_this.find(opts.minBtn);
            if($ipt.val()==1){
                $min.addClass('disable');
            }
            _this.on('click',opts.minBtn,function(){
                if($(this).hasClass('disable'))return;
                var val=parseInt($ipt.val());
                $ipt.val(val-1);
                if(val==2){
                    $(this).addClass('disable');
                }
            })
            _this.on('click',opts.addBtn,function(){
                var val=parseInt($ipt.val());
                $ipt.val(val+1);
                if(val>0){
                    $min.removeClass('disable');
                }
            })
            _this.on('change','input',function(){
                var $this=$(this);
                var val=$this.val();
                if(!mTools.isNumber(val) || val==0){
                    simpop.tips({content:'请输入大于1的数字！'});
                    $this.val(1);
                    $min.addClass('disable');
                }
            })
        });
	}
    
    //规格弹窗函数
    function fnSpic(){
        var $spicTarget=$('.j-spicTarget');
        var $spicBox=$('.j-spicBox');
        var $spicCon=$spicBox.find('.con');
        var $spicClose=$spicBox.find('.close');
        var $spicFt=$spicBox.find('.j-ft');
        $spicClose.click(function(){hideSpic();});
        $spicBox.click(function(){hideSpic();});
        $spicCon.click(function(event){event.stopPropagation();});
        //弹出规格参数
        function showSpic(a){
            if(a=='order'){
                $spicFt.html('<input type="submit" class="order" value="确认" />');
            }else if(a=='cart'){
                $spicFt.html('<a class="cart j-cart">确认</a>')
            }else{
                $spicFt.html('<a class="cart j-cart">加入购物车</a><input type="submit" class="order" value="立即购买" />')
            }
            $spicBox.show();
            setTimeout(function(){$spicCon.addClass('show');},0);
        }
        //隐藏规格参数
        function hideSpic(){
            $spicCon.removeClass('show');
            setTimeout(function(){$spicBox.hide();},300);
        }
        //点击弹出规格
        $spicTarget.click(function(){
           showSpic($(this).data('type')); 
        });
    }
    //善品参数函数
    function fnCs(){
        var $target=$('.j-csTarget');
        var $Box=$('.j-csBox');
        var $con=$Box.find('.con');
        var $close=$Box.find('.close');
        $close.click(function(){hide();});
        $Box.click(function(){hide();});
        $con.click(function(event){event.stopPropagation();});
        //弹出规格参数
        function show(a){
            $Box.show();
            setTimeout(function(){$con.addClass('show');},300);
        }
        //隐藏规格参数
        function hide(){
            $con.removeClass('show');
            setTimeout(function(){$Box.hide();},300);
        }
        //点击弹出规格
        $target.click(function(){
           show(); 
        });
    }
    //邮费
    var freightFn=function(a){
        var a=a||{};
        var defaults={
            freight:''
        };
        var opts=$.extend(defaults,a);
        if(!opts.freight)return;//防没有运费模板的时候返回
        var $box=$('.j-freightBox');
        var area;
        var getFreight;
        mWbmc.wbmc({
            target:'.j-freightTarget',
            name:'area',
            pid:'0',
            select:2,
            init:function(obj){
                area=obj;
                //获取邮费
                getFreight=function(id){
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
                $box.html(template('freight',{area:area,cur:opts.cur,freight:opts.freight,getFreight:getFreight})).show();
            },
            callback:function(result){
                if(result && result.length>1){
                    $box.html(template('freight',{area:area,cur:result[1],freight:opts.freight,getFreight:getFreight}))
                }
            }
        })
    }
	
	var product=function(a){
        var a=a||{};
        var defaults={
            sales_attributes:[],//商品规格
            sales_attribute:{},//用户填写的商品规格
            cur:{name:'郑州',id:'149'},
            spic:false//是否填写了规格
        };
        var opts=$.extend(defaults,a);
        //设置邮费
        freightFn({freight:opts.freight,cur:opts.cur});
        //商品规格
        for(var i in opts.sales_attribute){
            opts.spic=true;
        }
        //初始化数量修改函数
        fnQuantity();
        //初始化商品规格弹窗函数
        fnSpic();
        //初始化商品参数弹窗函数
        fnCs();
        var $isSpic=$('.j-isSpic');
        var $spic=$('.j-spic');//规格整个大div
        var $price=$('.j-price');//价格
        var $stock=$('.j-stock');//库存
        var $spicVal=$('.j-spicVal');//规格的真值
        var $spicBox=$('.j-spicBox');
        var $orderForm=$spicBox.find('form');
        var $orderSales=$spicBox.find('.j-sales');//
        if(opts.spic)$isSpic.show();
        $price.data('defaultValue',$price.html());
        $stock.data('defaultValue',$stock.html());
        //立即购买按钮
        $orderForm.submit(function(event){
            if(opts.spic && $orderSales.val()==''){
                simpop.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            if(!mTools.isLogin()){
                mTools.getLogin();
                return false;
            }
        });
        //加入购物车
		$orderForm.on('click','.j-cart',function(){
            var salesVal=$orderSales.val();
            if(opts.spic && salesVal==''){
                simpop.tips({content:'请先选择商品规格后添加到购物车',time:2000});
                return false;
            }
            //规格部分
            mTools.request({
                url:'?m=product&c=cart&a=add',
                isLogin:true,
                type:'post',
                data:'products[0][id]='+$spicBox.find('.j-id').val()+'&products[0][quantity]='+$spicBox.find('.j-quantity').val()+'&products[0][sales]='+salesVal,
                success:function(ret){
                    if(ret.status){
                        simpop.tips({
                            content:ret.info,
                            callback:function(){
                                if(ret.url)window.location.href=ret.url;
                            }
                        })
                    }
                    else{simpop.alert({content:ret.info})}
                }
            });
		});
        var sales={};
        sales.json=[];//原始数组
        sales.findId={};//id->{}
        sales.attribute={};//需要展示的商品规格
        sales.num=0;//一共几种规格
        sales.sales_attribute_str=mTools.serialize(opts.sales_attribute);
        for(var i in opts.sales_attributes){
            var n=opts.sales_attributes[i];
            var obj={name:n.name,id:n.id,pid:0};
            sales.json.push(obj);
            sales.json=sales.json.concat(n.children);
        }
        $.each(sales.json,function(i,n){
            sales.findId[n.id]=n;
        });
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
        // console.log(sales);
        $spic.html(template('spic',sales));
        $spic.on('click','.btn1:not(.btn1-not-stock)',function(){
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
		product:product//商品详情页
	}
})