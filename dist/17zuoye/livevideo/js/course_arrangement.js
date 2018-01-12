"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function getPageVisibility() {
        var prefixSupport,
            keyWithPrefix = function keyWithPrefix(prefix, key) {
            if (prefix !== "") {
                // 首字母大写
                return prefix + key.slice(0, 1).toUpperCase() + key.slice(1);
            }
            return key;
        },
            isPageVisibilitySupport = function () {
            var support = false;
            if (typeof window.screenX === "number") {
                ["webkit", "moz", "ms", "o", ""].forEach(function (prefix) {
                    if (support == false && document[keyWithPrefix(prefix, "hidden")] != undefined) {
                        prefixSupport = prefix;
                        support = true;
                    }
                });
            }
            return support;
        }(),
            isHidden = function isHidden() {
            return isPageVisibilitySupport ? document[keyWithPrefix(prefixSupport, "hidden")] : undefined;
        },
            visibilityState = function visibilityState() {
            return isPageVisibilitySupport ? document[keyWithPrefix(prefixSupport, "visibilityState")] : undefined;
        };

        return {
            hidden: isHidden(),
            visibilityState: visibilityState(),
            onVisibilityChange: function onVisibilityChange(fn) {
                if (isPageVisibilitySupport && typeof fn === "function") {
                    return document.addEventListener(prefixSupport + "visibilitychange", function (evt) {
                        this.hidden = isHidden();
                        this.visibilityState = visibilityState();
                        fn.call(this, evt);
                    }.bind(this), false);
                }
                return undefined;
            }
        };
    }
    function onPageVisibilityChange() {
        var onPageVisible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var onPageHidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        var pageVisibility = getPageVisibility();

        pageVisibility.onVisibilityChange(function () {
            pageVisibility.visibilityState === 'visible' && onPageVisible();
            pageVisibility.visibilityState === 'hidden' && onPageHidden();
        });
    }
    function consoleLog() {
        console.log.apply(console, arguments);
    }
    function pad(num, n) {
        if (n) {
            var len = num.toString().length;
            while (len < n) {
                num = "0" + num;
                len++;
            }
        }
        return num;
    }
    /*
     * 功能:
     * 1. 防止连击(选择时机使用 resetRun)
     * 2. 只执行一次(不使用 resetRun)
     */
    var _prevent_repeat_run_ = {};
    function preventRepeatRun(id) {
        var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var func2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        if (!id) {
            alert('preventRepeatRun 方法缺少 id 参数');
        } else {
            var resetRun = function resetRun() {
                _prevent_repeat_run_[id] = false;
            };

            if (!_prevent_repeat_run_[id]) {
                _prevent_repeat_run_[id] = true;

                func(resetRun);
            } else {
                func2(resetRun);
            }
        }
    }

    //S 公司内部用
    var windowExternal = window.external || {};
    function isExistMethod(methodName) {
        return windowExternal[methodName] ? true : false;
    }
    function doMethod(methodName, params) {
        if (isExistMethod(methodName)) {
            var res = params == undefined ? windowExternal[methodName]() : windowExternal[methodName](params);
            return res || true;
        } else {
            console.error("\u672A\u627E\u5230 " + methodName + " \u65B9\u6CD5");
            return false;
        }
    }

    function openSecondWebView(url) {
        "use strict";

        if (isExistMethod('openSecondWebview')) {
            return doMethod('openSecondWebview', JSON.stringify({ url: url }));
        } else {
            location.href = url;
        }
    }

    var Popup = function () {
        function Popup() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Popup);

            var self = this;

            var conf = self.conf = {
                mask: '', // popup 遮罩（推荐传入 id）
                popup: '', // popup 内容（推荐传入 id）
                openBtn: '', // 打开弹窗按钮（推荐传入 class）
                closeBtn: '', // 关闭弹窗按钮（推荐传入 class）
                toggleBtn: '', // 打开/关闭按钮（推荐传入 class）
                duration: 0, // 动画时长
                closeOnClickMask: false, // 点击遮罩时是否关闭弹窗
                closeOthersOnOpen: true, // 打开一个弹窗时是否关闭其它弹窗
                popupStatus: '-popup-visible-', // 标识弹窗的状态
                activeToggleBtn: '-active-trigger-btn-', // 多个 toggle btn 情况

                // 回调会在动画结束之后调用
                onOpen: function onOpen() {},
                // 打开回调
                onClose: function onClose() {}
            };

            if (!window.$) {
                console.error('[Popup warn]: 该模块依赖 jQuery 库！');
                return;
            }

            $.extend(conf, options);

            var popup = $(conf.popup);

            if (!popup.length) {
                console.error("[Popup warn]: \u672A\u627E\u5230 " + conf.popup + " \u5143\u7D20\uFF01");
            }

            self.id = "popup_" + Popup.instances.length;
            Popup.instances.push(self);

            // 兼容对同一个 DOM 重复实例化（强烈不推荐）
            if (!popup.hasClass('-popup-created-')) {
                popup.addClass('-popup-created-');
                self.initEvents();
            }
        }

        _createClass(Popup, [{
            key: "initEvents",
            value: function initEvents() {
                var self = this,
                    conf = self.conf;


                if (conf.openBtn) {
                    $(document).on('click', conf.openBtn, function (e) {
                        e.stopPropagation();
                        self.event = e;
                        self.open();
                    });
                }

                if (conf.closeBtn) {
                    $(document).on('click', conf.closeBtn, function (e) {
                        e.stopPropagation();
                        self.event = e;
                        self.close();
                    });
                }

                if (conf.closeOnClickMask) {
                    $(document).on('click', conf.mask, function (e) {
                        e.stopPropagation();
                        self.event = e;
                        self.close();
                    });
                }

                // 此处的 toggle 第一次点击总是打开
                if (conf.toggleBtn) {
                    $(document).on('click', conf.toggleBtn, function (e) {
                        e.stopPropagation();
                        self.event = e;

                        var $this = $(this);
                        if ($this.hasClass(conf.activeToggleBtn)) {
                            self.toggle();
                        } else {
                            self.open();
                            $(conf.activeToggleBtn).removeClass(conf.activeToggleBtn);
                            $this.addClass(conf.activeToggleBtn);
                        }
                    });
                }

                $(document).on('click', conf.popup, function (e) {
                    e.stopPropagation();
                    self.event = e;
                });
            }
        }, {
            key: "closeOthersOnOpen",
            value: function closeOthersOnOpen() {
                var self = this,
                    conf = self.conf;


                if (conf.closeOthersOnOpen) {
                    Popup.instances.forEach(function (instance) {
                        if (instance !== self) {
                            instance.close();
                        }
                    });
                }
            }
        }, {
            key: "open",
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
            }
        }, {
            key: "close",
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
            }
        }, {
            key: "toggle",
            value: function toggle() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var onClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
                var self = this,
                    conf = self.conf;


                var popup = $(conf.popup);

                popup.hasClass(conf.popupStatus) ? self.close(onClose) : self.open(onOpen);
            }
        }]);

        return Popup;
    }();

    Popup.instances = [];

    /*
     * deps: ['jquery']
     *
     * 使用示例:
     * // 实例化
     * var panel = new SlideUpPanel({
     *      maskId: '#mask',
     *      popupId: '#popup',
     *      triggerBtnClass: '.trigger-btn',
     *      animateTime: 300,
     *
     *      onOpen: function(conf){
     *          // 打开 panel 时回调, conf 是配置项
     *      },
     *      onClose: function(conf){
     *          // 关闭 panel 时回调, conf 是配置项
     *      }
     * });
     *
     * panel.open(function(conf){
     *      // 打开 panel 时回调, conf 是配置项
     * });
     * panel.close(function(conf){
     *      // 关闭 panel 时回调, conf 是配置项
     * });
     *
     */

    var SlideUpPanel = function (_Popup) {
        _inherits(SlideUpPanel, _Popup);

        function SlideUpPanel(config) {
            _classCallCheck(this, SlideUpPanel);

            var _this = _possibleConstructorReturn(this, (SlideUpPanel.__proto__ || Object.getPrototypeOf(SlideUpPanel)).call(this, config));

            var self = _this;

            self.firstInit = true;
            return _this;
        }

        _createClass(SlideUpPanel, [{
            key: "init",
            value: function init(force) {
                var self = this,
                    conf = self.conf,
                    panel = $(conf.popupId),
                    panelHeight = panel.outerHeight();

                if (force || panelHeight < Math.abs(parseFloat(panel.css('bottom')))) {
                    panel.css({
                        // 对于会出现加载延迟的dom，比如image，务必固定占位高度，否则 outerHeight 拿不到最终高度(加载渲染完毕)
                        bottom: -panel.outerHeight()
                    });
                }

                self.firstInit = false;
            }
        }, {
            key: "open",
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;

                self.closeOthersOnOpen();

                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (!panel.hasClass(conf.panelStatusClass)) {
                    self.init(self.firstInit);

                    mask.fadeIn(conf.animateTime);
                    panel.show().addClass(conf.panelStatusClass).stop(true).clearQueue().fadeIn(0).animate({
                        bottom: 0
                    }, conf.animateTime);

                    conf.onOpen();

                    onOpen(conf);
                }
            }
        }, {
            key: "close",
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;

                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (panel.hasClass(conf.panelStatusClass)) {
                    mask.fadeOut(conf.animateTime);
                    panel.show().removeClass(conf.panelStatusClass).stop(true).clearQueue().animate({
                        bottom: -panel.outerHeight()
                    }, conf.animateTime, function () {
                        self.reinit = true;
                        panel.fadeOut(conf.animateTime);

                        onClose(conf);
                    });

                    conf.onClose();
                }
            }
        }]);

        return SlideUpPanel;
    }(Popup);

    var NormalPopup = function (_Popup2) {
        _inherits(NormalPopup, _Popup2);

        function NormalPopup() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, NormalPopup);

            return _possibleConstructorReturn(this, (NormalPopup.__proto__ || Object.getPrototypeOf(NormalPopup)).call(this, options));
        }

        _createClass(NormalPopup, [{
            key: "open",
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var self = this,
                    conf = self.conf;


                self.closeOthersOnOpen();

                /*
                 * 回调总是在打开/关闭动画结束之后被调用的，但是某些阻塞页面渲染的
                 * 操作（比如 window.alert）可能会阻止弹窗显现，导致看上去回调
                 * 像是在打开/关闭动画之前执行的。如果想避免这种情况，可在回调中使
                 * 用 setTimeout 延迟执行这些阻塞操作。
                 */
                function openCallback() {
                    conf.onOpen.call(self);
                    onOpen.call(self);
                }

                var popup = $(conf.popup),
                    mask = $(conf.mask);
                if (!popup.hasClass(conf.popupStatus)) {
                    mask.stop(true).clearQueue().fadeIn(conf.duration);
                    popup.stop(true).clearQueue().fadeIn(conf.duration, openCallback);
                    popup.addClass(conf.popupStatus);
                }

                return self;
            }
        }, {
            key: "close",
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var self = this,
                    conf = self.conf;


                function closeCallback() {
                    conf.onClose.call(self);
                    onClose.call(self);
                }

                var popup = $(conf.popup),
                    mask = $(conf.mask);
                if (popup.hasClass(conf.popupStatus)) {
                    mask.stop(true).clearQueue().fadeOut(conf.duration);
                    popup.stop(true).clearQueue().fadeOut(conf.duration, closeCallback);
                    popup.removeClass(conf.popupStatus);
                }

                return self;
            }
        }]);

        return NormalPopup;
    }(Popup);

    var URL = {
        index: '/studentMobile/babyeagle/index.vpage',
        priceInfo: '/wonderland/order/appproducts.vpage',
        pay: 'http://www.test.17zuoye.net/api/1.0/afenti/order/submit.vpage?hideTopTitle=true',
        rank: '/studentMobile/babyeagle/rank.vpage',
        giveLike: '/studentMobile/babyeagle/givegood.vpage',
        likeList: '/studentMobile/babyeagle/goodlist.vpage',
        courseArrangement: '/studentMobile/babyeagle/course/index.vpage',
        timeTable: '/studentMobile/babyeagle/course/classhoursinfo.vpage',
        entry: '/studentMobile/babyeagle/course/entry.vpage',
        buy: '/studentMobile/babyeagle/course/buy.vpage',
        receive: '/studentMobile/babyeagle/course/receive.vpage'
    };

    var base = 'http://hello.com:8686//views/17zuoye/livevideo/';
    var suffix = '.html';
    var getPageUrl = function getPageUrl(filename) {
        return base + filename + suffix;
    };

    require(['jquery', 'swiper', 'vue', 'fastclick', 'lazyload', 'init_mock'], function ($, Swiper, Vue, FastClick) {
        FastClick.attach(document.body);

        /*--Price Panel--*/
        var pricePanel = new SlideUpPanel({
            popupId: '#price-panel',
            maskId: '#price-panel-mask',
            openBtnClass: '.open-price-panel',
            closeBtnClass: '.close-price-panel'
        });

        var timetablePopup = new NormalPopup({
            popupId: '#timetable-popup',
            openBtnClass: '.open-timetable-popup',
            closeBtnClass: '.close-timetable-popup'
        });

        var confirmPopup = new NormalPopup({
            popupId: '#confirm-popup',
            openBtnClass: '.open-confirm-popup',
            closeBtnClass: '.close-confirm-popup'
        });

        var giftPopup = new NormalPopup({
            popupId: '#gift-popup',
            openBtnClass: '.open-gift-popup',
            closeBtnClass: '.close-gift-popup'
        });

        new Vue({
            el: '#index',
            data: {
                error: false,
                errorInfo: '',

                /*--Price Panel--*/
                productList: [],
                giftInfo: {
                    "8": { integral: 0, mathPower: 0, englishPower: 0, chinesePower: 0 },
                    "20": { integral: 20, mathPower: 10, englishPower: 10, chinesePower: 10 },
                    "90": { integral: 120, mathPower: 60, englishPower: 60, chinesePower: 60 },
                    "120": { integral: 200, mathPower: 100, englishPower: 100, chinesePower: 100 }
                },
                sampleSackPurchased: false,

                // 直播时间表
                activeItem: {
                    classHoursTime: []
                },

                // 确认弹窗
                confirmPopup: {
                    success: false
                },

                // 领取礼包弹窗
                giftPopup: {},

                server: {
                    success: false,
                    recordList: []
                }
            },
            methods: {
                getPageUrl: getPageUrl,
                openSecondWebView: openSecondWebView,

                /*--Price Panel--*/
                getTimesCardPresell: function getTimesCardPresell() {
                    var vm = this;

                    $.get('/wonderland/activity/timescardpresell.vpage', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            vm.sampleSackPurchased = res.sampleSackPurchased;
                        } else {
                            vm.errorInfo = res.info || '数据获取失败！';
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                },
                getSelectedProduct: function getSelectedProduct() {
                    var self = this;
                    for (var i = 0; i < self.productList.length; i++) {
                        if (self.productList[i].checked) {
                            return self.productList[i];
                        }
                    }
                    return {};
                },
                periodBtn: function periodBtn(item) {
                    var self = this;
                    for (var i = 0; i < self.productList.length; i++) {
                        self.productList[i].checked = item.id == self.productList[i].id;
                    }
                },
                buyBtn: function buyBtn() {
                    var self = this;
                    var param = {
                        productId: self.getSelectedProduct().id,
                        refer: 330029
                    };
                    setTimeout(function () {
                        location.href = URL.pay + '&' + $.param(param);
                    }, 200);
                },
                getPriceInfo: function getPriceInfo() {
                    var vm = this;

                    // $.get(URL.priceInfo, {appKey: 'ValueAddedLiveTimesCard'}, function(res){
                    $.get(URL.priceInfo, function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            for (var i = 0; i < res.products.length; i++) {
                                res.products[i].checked = res.products[i].price == 90;
                            }

                            vm.productList = res.products;

                            vm.$nextTick(function () {});
                        } else {

                            vm.errorInfo = res.info || '数据获取失败！';
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                },

                // 倒计时
                countDown: function countDown() {
                    var vm = this,
                        cd = false,
                        oneDay = 24 * 60 * 60 * 1000,
                        courses = vm.server.coursesInfo;

                    for (var i = 0; i < courses.length; ++i) {
                        var item = courses[i];

                        if (item.courseStatus === "WAIT") {
                            var leftSeconds = Math.floor(item.remainingTime / 1000),
                                leftMinutes = Math.floor(leftSeconds / 60),
                                leftHours = Math.floor(leftMinutes / 60),
                                leftDays = Math.floor(leftHours / 24);
                            var s = leftSeconds % 60,
                                m = leftMinutes % 60,
                                h = leftMinutes % 24,
                                d = leftDays % 365;

                            if (item.remainingTime <= 0 || item.cd.d > 0 && d === 0) {
                                vm.initData();
                                cd = false;
                                break;
                            } else {
                                if (item.remainingTime >= 1000) {
                                    item.remainingTime -= 1000;
                                } else {
                                    item.remainingTime = 0;
                                }
                                cd = true;
                            }

                            item.cd = {
                                s: s,
                                seconds: pad(s, 2).toString().split(''),
                                m: m,
                                minutes: pad(m, 2).toString().split(''),
                                h: h,
                                hours: pad(h, 2).toString().split(''),
                                d: d,
                                days: pad(d, 3).toString().split('')
                            };
                        }
                    }

                    if (cd) {
                        setTimeout(function () {
                            vm.countDown();
                        }, 1000);
                    }
                },
                // 直播时间表
                checkoutTimeTable: function checkoutTimeTable(item) {
                    var vm = this;

                    vm.activeItem = item;

                    if (!item.classHoursTime.length) {
                        $.get(URL.timeTable, function (res) {
                            res = typeof res === 'string' ? JSON.parse(res) : res;
                            vm.error = !res.success;

                            if (res.success) {
                                consoleLog('直播时间表 数据获取成功%o', JSON.parse(JSON.stringify(res)));

                                res.classHoursTime.maxLength = 0;
                                res.classHoursTime.forEach(function (course) {
                                    course.weekName = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][course.week - 1];
                                    res.classHoursTime.maxLength = Math.max(res.classHoursTime.maxLength, course.timeList.length);
                                });

                                item.classHoursTime = res.classHoursTime;

                                vm.$nextTick(function () {});
                            } else {
                                vm.errorInfo = res.info || '数据获取失败！';
                            }
                        }).fail(function () {
                            vm.error = true;
                            vm.errorInfo = '网络请求失败！';
                        });
                    }
                },
                forwardHonorName: function forwardHonorName() {
                    var vm = this;
                    var res = {
                        myLearnedCourseTotal: vm.server.myLearnedCourseTotal,
                        nextGradeNeedCount: vm.server.nextGradeNeedCount,
                        level: vm.server.currentGrade
                    };
                    openSecondWebView(getPageUrl('honor_name') + '?res=' + encodeURIComponent(JSON.stringify(res)));
                    // openSecondWebView('http://open.talk-fun.com/play/ODU6PjhsKG4hJA.html?st=hkPgRNyKBvFYRY3bioOxHA&e=1507117584&from=cms100859&reload=0.37881897933312025');
                },
                // 进入直播
                clickOpen: function clickOpen(item) {
                    var vm = this;

                    consoleLog(item.courseStatus);
                    if (item.courseStatus === 'WAIT') {
                        // TODO toast
                        alert('滚犊子');
                    } else {
                        $.get(URL.entry, function (res) {
                            res = typeof res === 'string' ? JSON.parse(res) : res;

                            if (res.success) {
                                consoleLog('进入直播 数据获取成功%o', JSON.parse(JSON.stringify(res)));

                                vm.confirmPopup = res;

                                if (res.canPlay) {
                                    if (res.playUrl) {
                                        openSecondWebView(res.playUrl);
                                    } else {
                                        vm.confirmPopup = {
                                            success: false,
                                            info: '视频无法播放！'
                                        };

                                        confirmPopup.open();
                                    }
                                } else {
                                    confirmPopup.open();
                                }
                            } else {
                                vm.confirmPopup = {
                                    success: false,
                                    info: res.info
                                };
                                confirmPopup.open();
                            }
                        }).fail(function () {
                            vm.error = true;
                            vm.errorInfo = '网络请求失败！';
                        });
                    }
                },
                // 购买课程
                buy: function buy() {
                    var vm = this;

                    preventRepeatRun('buy', function (resetRun) {
                        $.get(URL.buy, function (res) {
                            resetRun();

                            res = typeof res === 'string' ? JSON.parse(res) : res;
                            vm.error = !res.success;

                            if (res.success) {
                                consoleLog('购买课程 数据获取成功%o', JSON.parse(JSON.stringify(res)));

                                if (res.playUrl) {
                                    openSecondWebView(res.playUrl);
                                } else {
                                    vm.confirmPopup = {
                                        success: false,
                                        info: '视频无法播放！'
                                    };

                                    confirmPopup.open();
                                }
                            } else {
                                vm.errorInfo = res.info || '数据获取失败！';
                            }
                        }).fail(function () {
                            resetRun();

                            vm.error = true;
                            vm.errorInfo = '网络请求失败！';
                        });
                    });
                },
                // 领取奖励
                receive: function receive(item) {
                    var vm = this;

                    // $.post(URL.receive, {courseId: item.courseId}, function(res){
                    $.get(URL.receive, function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            vm.giftPopup = res;

                            vm.initData();

                            vm.$nextTick(function () {
                                giftPopup.open();
                            });
                        } else {

                            vm.errorInfo = res.info || '数据获取失败！';
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                },
                initData: function initData() {
                    var vm = this;

                    // $.get(URL.courseArrangement, {subjectType: getQuery('subject')}, function(res){
                    $.get(URL.courseArrangement, function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            switch (res.currentGrade) {
                                case 'LV1':
                                    res.iconClass = 'tp01';
                                    res.levelName = '见习';
                                    break;
                                case 'LV2':
                                    res.iconClass = 'tp02';
                                    res.levelName = '学徒';
                                    break;
                                case 'LV3':
                                    res.iconClass = 'tp03';
                                    res.levelName = '资深';
                                    break;
                                case 'LV4':
                                    res.iconClass = 'tp04';
                                    res.levelName = '精英';
                                    break;
                            }

                            res.coursesInfo.forEach(function (item) {
                                switch (item.courseStatus) {
                                    case 'WAIT':
                                        item.courseStatusName = '未开始';
                                        item.courseStatusIcon = 'state01';

                                        item.remainingTime = item.endTime - item.currentTime;
                                        item.cd = {};
                                        item.classHoursTime = [];
                                        break;
                                    case 'PLAY':
                                        item.courseStatusName = '正在直播';
                                        item.courseStatusIcon = 'state04';
                                        break;
                                    case 'OVER':
                                        item.courseStatusName = '看回放';
                                        item.courseStatusIcon = 'state03';
                                        break;
                                    case 'FINISH':
                                        item.courseStatusName = '已完成';
                                        item.courseStatusIcon = 'state02';
                                        break;
                                }
                            });

                            vm.server = res;

                            // vm.checkoutTimeTable(vm.server.coursesInfo[0]);
                            // vm.countDown();

                            vm.$nextTick(function () {});
                        } else {

                            vm.errorInfo = res.info || '数据获取失败！';
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                }
            },
            watch: {
                error: function error(newValue) {}
            },
            created: function created() {
                var vm = this;
                vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();

                /*--Price Panel--*/
                vm.getPriceInfo();
                vm.getTimesCardPresell();

                onPageVisibilityChange(function () {
                    vm.initData();
                });
            },
            mounted: function mounted() {}
        });
    });
})();