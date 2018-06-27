/**
 * Created by 10989 on 2017/9/5.
 */
var d1 = new Date();  // 获取当前系统时间 我现在的时间是 2016年4月25日 星期一
d1.getFullYear();    // 获取年信息， 2016
d1.getMonth();      // 获取月信息（从0开始 范围：0-11） 3
d1.getDate();      // 获取天信息 此处结果：25
d1.getDay();      // 获取星期信息 （0-6） 此处结果： 1
var d2 = new Date(2016, 2, 15);    // 月是从0开始计数， 需要减一
d2.getFullYear();          // 2016
d2.getMonth();            // 2
d2.getDate();            // 15
d2.toLocaleDateString();      // "2016/3/15" 证明设置正确
var d3 = new Date(2016, 3, 30);
d3.toLocaleDateString();      // "2016/4/30"
var d4 = new Date(2016, 3, 31);
d4.toLocaleDateString();      // "2016/5/1"
var d5 = new Date(2016, 3, 33);
d5.toLocaleDateString();      // "2016/5/3"
var d6 = new Date(2016, 4, 1);
d6.toLocaleDateString();      // "2016/5/1"
var d7 = new Date(2016, 4, 0);
d7.toLocaleDateString();      // "2016/4/30"
var d8 = new Date(2016, 4, -3);
d8.toLocaleDateString();      // "2016/4/27"
(function(){
    /*
     * 用于记录日期，显示的时候，根据dateObj中的日期的年月显示
     */
    var dateObj = (function(){
        var _date = new Date();    // 默认为当前系统时间
        return {
            getDate : function(){
                return _date;
            },
            setDate : function(date) {
                _date = date;
            }
        };
    })();
// 设置calendar div中的html部分
    renderHtml();
// 表格中显示日期
    showCalendarData();
// 绑定事件
    bindEvent();
    /**
     * 渲染html结构
     */
    function renderHtml() {
        var calendar = document.getElementById("calendar");
        var titleBox = document.createElement("div");  // 标题盒子 设置上一月 下一月 标题
        var bodyBox = document.createElement("div");  // 表格区 显示数据

// 设置标题盒子中的html
        titleBox.className = 'calendar-title-box';
        titleBox.innerHTML = "<span class='prev-month' id='prevMonth'></span>" +
            "<span class='calendar-title' id='calendarTitle'></span>" +
            "<span id='nextMonth' class='next-month'></span>";
        calendar.appendChild(titleBox);    // 添加到calendar div中

// 设置表格区的html结构
        bodyBox.className = 'calendar-body-box';
        var _headHtml = "<tr>" +
            "<th>日</th>" +
            "<th>一</th>" +
            "<th>二</th>" +
            "<th>三</th>" +
            "<th>四</th>" +
            "<th>五</th>" +
            "<th>六</th>" +
            "</tr>";
        var _bodyHtml = "";

// 一个月最多31天，所以一个月最多占6行表格
        for(var i = 0; i < 6; i++) {
            _bodyHtml += "<tr>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>";
        }
        bodyBox.innerHTML = "<table id='calendarTable' class='calendar-table'>" +
            _headHtml + _bodyHtml +
            "</table>";
// 添加到calendar div中
        calendar.appendChild(bodyBox);
    }

    /**
     * 表格中显示数据，并设置类名
     */
    function showCalendarData() {
        var _year = dateObj.getDate().getFullYear();
        var _month = dateObj.getDate().getMonth() + 1;
        var _dateStr = getDateStr(dateObj.getDate());

// 设置顶部标题栏中的 年、月信息
        var calendarTitle = document.getElementById("calendarTitle");
        var titleStr = _dateStr.substr(0, 4) + "年" + _dateStr.substr(4,2) + "月";
        calendarTitle.innerText = titleStr;

// 设置表格中的日期数据
        var _table = document.getElementById("calendarTable");
        var _tds = _table.getElementsByTagName("td");
        var _firstDay = new Date(_year, _month - 1, 1);  // 当前月第一天
        for(var i = 0; i < _tds.length; i++) {
            var _thisDay = new Date(_year, _month - 1, i + 1 - _firstDay.getDay());
            var _thisDayStr = getDateStr(_thisDay);
            _tds[i].innerText = _thisDay.getDate();
//_tds[i].data = _thisDayStr;
            _tds[i].setAttribute('data', _thisDayStr);
            if(_thisDayStr == getDateStr(new Date())) {    // 当前天
                _tds[i].className = 'currentDay';
            }else if(_thisDayStr.substr(0, 6) == getDateStr(_firstDay).substr(0, 6)) {
                _tds[i].className = 'currentMonth';  // 当前月
            }else {    // 其他月
                _tds[i].className = 'otherMonth';
            }
        }
    }

    /**
     * 绑定上个月下个月事件
     */
    function bindEvent() {
        var prevMonth = document.getElementById("prevMonth");
        var nextMonth = document.getElementById("nextMonth");
        addEvent(prevMonth, 'click', toPrevMonth);
        addEvent(nextMonth, 'click', toNextMonth);
    }

    /**
     * 绑定事件
     */
    function addEvent(dom, eType, func) {
        if(dom.addEventListener) {  // DOM 2.0
            dom.addEventListener(eType, function(e){
                func(e);
            });
        } else if(dom.attachEvent){  // IE5+
            dom.attachEvent('on' + eType, function(e){
                func(e);
            });
        } else {  // DOM 0
            dom['on' + eType] = function(e) {
                func(e);
            }
        }
    }

    /**
     * 点击上个月图标触发
     */
    function toPrevMonth() {
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
        showCalendarData();
    }

    /**
     * 点击下个月图标触发
     */
    function toNextMonth() {
        var date = dateObj.getDate();
        dateObj.setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
        showCalendarData();
    }

    /**
     * 日期转化为字符串， 4位年+2位月+2位日
     */
    function getDateStr(date) {
        var _year = date.getFullYear();
        var _month = date.getMonth() + 1;    // 月从0开始计数
        var _d = date.getDate();

        _month = (_month > 9) ? ("" + _month) : ("0" + _month);
        _d = (_d > 9) ? ("" + _d) : ("0" + _d);
        return _year + _month + _d;
    }
})();