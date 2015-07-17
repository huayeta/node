define('mTime',function(require, exports, module){
	require('zepto');
	require('touch');
	require('iscroll');
	require('seajsCss');

	seajs.use('/js/mobile/plugins/mSelect/zepto.mtimer.css');

    var mTime = function(opts){
		var defaults = {
			target:'.j-mTime',
            def:'',
			dateStart : new Date(),
			dateNum : 10,
			timeStart : 9,
			timeNum : 12,
			callback : null,
			cancel : null,
		};
		var option = $.extend(defaults, opts);
		var itemHeight = 48;
		var picker = {
			init : function(obj){
				opts.click(opts);
				var _this = this;

				_this.renderHTML();

				var container = $('.mt_poppanel'),
					mpDate = $('.mt_date', container),
					mpTime = $('.mt_time', container);
				//初始化date
				var dateStr = '',
					dateStart = option.dateStart,
					sYear = dateStart.getFullYear(),
					sMonth = dateStart.getMonth(),
					sDate = dateStart.getDate();
				for(var i=0; i<option.dateNum; i++){
					var nextDate = new Date(sYear, sMonth, sDate+i),
						y=nextDate.getFullYear(),
						m = _this.getZero(nextDate.getMonth()+1),
						d = _this.getZero(nextDate.getDate()),
						da = _this.getZero(nextDate.getDay()),
						w = '日一二三四五六'.charAt(nextDate.getDay()),
						sel = i == 0 ? 'selected' : '';
					dateStr += '<li class="'+sel+'" data-date="'+y+'-'+m+'-'+d+'">'+y+'.'+m+'.'+d+'&nbsp;周'+w+'</li>';
				}
				dateStr += '<li></li><li></li>';
				mpDate.find('ul').append(dateStr);

				//初始化time
				var timeStr = '';
				for(var j=0; j<option.timeNum; j++){
					var t = option.timeStart + j,
						sel = j == 0 ? 'selected' : '';
					timeStr += '<li class="'+sel+'" data-time="'+_this.getZero(t)+':00:00">'+_this.getZero(t)+':00</li><li data-time="'+_this.getZero(t)+':30:00">'+_this.getZero(t)+':30</li>';
					if(j==option.timeNum - 1){
						timeStr += '<li data-time="'+_this.getZero(t+1)+':00:00">'+_this.getZero(t+1)+':00:00</li>';
					}
				}
				timeStr += '<li></li><li></li>';
				mpTime.find('ul').append(timeStr);

				//初始化scroll
				var elHeight = itemHeight;
				var dateScroll = new IScroll('.mt_date', {
					snap : 'li',
					probeType : 2,
					tap : true
				});
				// dateScroll.on('scroll', function(){
				// 	_this.updateSelected(mpDate, this);
				// });
				dateScroll.on('scrollEnd', function(){
					_this.updateSelected(mpDate, this);
				});
				var timeScroll = new IScroll('.mt_time', {
					snap : 'li',
					probeType : 2,
					tap : true
				});
				// timeScroll.on('scroll', function(){
				// 	_this.updateSelected(mpTime, this);
				// });
				timeScroll.on('scrollEnd', function(){
					_this.updateSelected(mpTime, this);
				});

				this.dateScroll = dateScroll;
				this.timeScroll = timeScroll;

				//初始化点击input事件
				// $target.on('tap', function(){
				// 	if(container.hasClass('show')){
				// 		_this.hidePanel();
				// 	}
				// 	else{
				// 		_this.showPanel();
				// 	}
				// });

				//初始化点击li
//				mpDate.find('li').on('tap', function(){
//					_this.checkDate($(this));
//				});
//				mpTime.find('li').on('tap', function(){
//					_this.checkTime($(this));
//				});

				//初始化点击事件
				$('.mt_ok', container).on('tap', function(){
					var date = mpDate.find('.selected').data('date');
					var time = mpTime.find('.selected').data('time');
					_this.hidePanel();
					option.callback && typeof option.callback=='function' && option.callback(date + ' ' + time);
				});
				$('.mt_cancel', container).on('tap', function(){
					_this.hidePanel();
					option.cancel && typeof option.cancel=='function' && option.cancel();
				});
				$('.mt_mask').on('tap', function(){
					_this.hidePanel();
				});

				//初始化原有的数据
				this.setValue();
				_this.showPanel();
			},
			renderHTML : function(){
				var stime = option.timeStart + ':00';
				var etime = option.timeStart + option.timeNum + ':00';
				var html = '<div class="mt_mask"></div><div class="mt_poppanel"><div class="mt_panel"><h3 class="mt_title">请选择时间</h3><div class="mt_body"><div class="box"><div class="mt_date"><ul><li class="mt_note">上下滚动选取时间</li><li></li></ul></div><div class="mt_time"><ul><li class="mt_note">可选时间：'+stime+'-'+etime+'</li><li></li></ul></div></div><div class="mt_indicate"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok">确定</a> <a href="javascript:void(0);" class="mt_cancel">取消</a></div></div></div>';
				$(document.body).append(html);
			},
			updateSelected : function(container, iscroll){
				var index = (-iscroll.y) / itemHeight + 2;
				var current = container.find('li').eq(index);
				current.addClass('selected').siblings().removeClass('selected');
			},
			showPanel : function(container){
				$('.mt_poppanel, .mt_mask').addClass('show');
			},
			hidePanel : function(){
				$('.mt_poppanel, .mt_mask').removeClass('show');
                setTimeout(function(){$('.mt_poppanel, .mt_mask').remove()},300);
			},
			setValue : function(){
				// console.log(opts.def);
                if(!opts.def)return;
				var value = opts.def;
				var dateArr = value.split(' '),
					date = dateArr[0],
					time = dateArr[1],
                    dateItem = $('.mt_date li[data-date="'+date+'"]'),
					timeItem = $('.mt_time li[data-time="'+time+'"]');
				this.checkDate(dateItem);
				this.checkTime(timeItem);
				
			},
			checkDate : function(el){
				if(el.size()==0)return;
				var target = el.prev('li').prev('li');
				if(target.size()>0)this.dateScroll.scrollToElement(target[0]);
			},
			checkTime : function(el){
				if(el.size()==0)return;
				var target = el.prev('li').prev('li');
				if(target.size()>0)this.timeScroll.scrollToElement(target[0]);
			},
            getZero:function(val){
                return val>9?val:('0'+val);
            }
		}
		$(opts.target).on('click',function(){
            picker.init();
        })
	}

    module.exports={
        mTime:mTime
    }
});