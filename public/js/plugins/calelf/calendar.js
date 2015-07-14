 define('calendar', function (require, exports, module) {

     //获取某年的天数数组
     function getDays(year) {
         var year = year ? year : new Date().getFullYear();
         var days = new Array(12);
         days[0] = 31;
         days[2] = 31;
         days[3] = 30;
         days[4] = 31;
         days[5] = 30;
         days[6] = 31;
         days[7] = 31;
         days[8] = 30;
         days[9] = 31;
         days[10] = 30;
         days[11] = 31;
         //判断是否是闰年,针对2月份的天数计算
         if (Math.round(year / 4) == year / 4) {
             days[1] = 29;
         } else {
             days[1] = 28;
         }
         return days;
     }

     //获取某年某月的分布图
     var getMonthDis = function (month, year) {
         if (!month) return;
         var year = year ? year : new Date().getFullYear();
         var arr = [];

         var date = new Date(year + '/' + month + '/01');
         var week = date.getDay(); //month月1日是周几
         if (month == 1) {
             //当是某年第一月的时候特殊处理
             var daysPrev = getDays(year - 1)[11];
         } else {
             var daysPrev = getDays(year)[month - 1 - 1];
         }
         var tmp = week;
         while (tmp != 0) {
             var obj = {
                 year: year,
                 month: month - 1,
                 day: daysPrev - tmp + 1,
                 isGray: true
             };
             if (month == 1) obj.year = year - 1;
             if (tmp == week) obj.isWeek = true;
             arr.push(obj);
             tmp--;
         }
         tmp = week;
         for (var i = 1, n = getDays(year)[month - 1]; i <= n; i++) {
             var obj = {
                 year: year,
                 month: month,
                 day: i
             };
             if (tmp == 6 || tmp == 0) {
                 obj.isWeek = true;
             }
             tmp++;
             if (tmp == 7) tmp = 0;
             arr.push(obj);
         }
         var lastWeek = new Date(year + '/' + month + '/' + getDays(year)[month - 1]).getDay(); //month月最后一天是周几
         for (var i = 0, n = 6 - lastWeek; i < n; i++) {
             var obj = {
                 year: year,
                 month: month + 1,
                 day: i + 1,
                 isGray: true
             };
             if (i + 1 == n) obj.isWeek = true;
             arr.push(obj);
         }
         return arr;
     }

     var $calendar = $('.j-calendar'); //整个calendar
     var $box = $calendar.find('.j-box'); //每日的部分
     var $title = $calendar.find('.j-title'); //标题部分
     var $monthPrev = $calendar.find('.j-monthPrev'); //切换到上一月
     var $monthNext = $calendar.find('.j-monthNext'); //切换到下一月
     var $monthNow = $calendar.find('.j-monthNow'); //切换到今天
     var $yearPrev = $calendar.find('.j-yearPrev'); //切换到上一年
     var $yearNext = $calendar.find('.j-yearNext'); //切换到下一年
     var opts;//配置信息

     //更新页面上的数据
     var updateDate = function (myDate) {
         myDate.monthDis = getMonthDis(myDate.month, myDate.year);
         $title.text(myDate.year + '年' + myDate.month + '月');
         var str = '';
         if(!opts.template){
             for (var i in myDate.monthDis) {
                 str += '<div class="item item-box' + (myDate.monthDis[i].isGray ? ' item-gray ' : '') + (myDate.monthDis[i].isWeek ? ' item-week ' : '') + '"><div class="inner"><div class="f-cb tt"><span class="f-fr">' + myDate.monthDis[i].day + '日</span></div></div></div>';
             }
             $box.html(str);
         }
         if($.isFunction(opts.callback))opts.callback(myDate,$box[0]);
     }

     var init = function (a) {
         var defaults={
            template:false,//box的模板
             callback:''//更新完之后的回调函数
         };
         opts=$.extend(defaults,a);
         var myDate = {};

         //切换上一月视图
         $monthPrev.click(function () {
             if (myDate.month == 1) {
                 myDate.year = myDate.year - 1;
                 myDate.month = 12;
             } else {
                 myDate.month = myDate.month - 1;
             }

             updateDate(myDate);
         });

         //切换下一月视图
         $monthNext.click(function () {
             if (myDate.month == 12) {
                 myDate.year = myDate.year + 1;
                 myDate.month = 1;
             } else {
                 myDate.month = myDate.month + 1;
             }

             updateDate(myDate);
         });

         //切换到今月视图
         $monthNow.click(function () {
             var nowDate = new Date();
             myDate.year = nowDate.getFullYear();
             myDate.month = nowDate.getMonth() + 1;

             updateDate(myDate);
         }).click();

         //切换到上一年视图
         $yearPrev.click(function () {
             myDate.year = myDate.year - 1;
             updateDate(myDate);
         });

         //切换到下一年视图
         $yearNext.click(function () {
             myDate.year = myDate.year + 1;
             updateDate(myDate);
         });
     }


     module.exports = {
         init: init
     }

 })