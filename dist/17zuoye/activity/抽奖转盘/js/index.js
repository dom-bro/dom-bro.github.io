"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function isIOS() {
        return (/iphone|ipad|ipod/.test(ua)
        );
    }
    function getQuery(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"),
            res = window.location.search.substr(1).match(reg);
        return res != null ? decodeURIComponent(res[2]) : null;
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

    /*
     * deps: ['jqeury', 'Vue']
     * 将 Vue 封装一层的目的是把每次实例化 Vue 时都要用到的配置项提出来(主要是错误反馈和 ajax 请求)
     * 增加的 methods:
     *  onError: 错误出现时的处理方法(比如弹窗提示)，newError 会调用 onError
     *  newError: 显式抛出一条错误
     *  ajax: 在 jquery ajax 的基础上封装了一些常用的业务逻辑
     */
    function newVue(conf) {
        conf = $.extend(true, {
            el: '#index',
            data: {
                errorInfo: ''
            },
            methods: {
                onError: function onError() {
                    var vm = this;

                    alert(vm.errorInfo);
                },
                newError: function newError() {
                    var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unknown Error!';

                    var vm = this;
                    vm.errorInfo = info;
                    vm.onError();
                },

                /*
                 * 在 jquery ajax 方法原有配置项的基础上新增了一些常用的可配置项
                 *  id: (可选, 但如果想要使用 preventRepeatRun, 则必须提供一个 unique id)给 ajax 一个 unique id
                 *  errorOnResponseFalse: (可选，默认true)是否在返回的数据有错误时显式抛出一条错误 newError
                 *  preventRepeatRun: (可选，默认false)是否防止连续点击(在第一次请求返回结果后才可以发送第二次请求)
                 */
                ajax: function ajax(opts) {
                    var vm = this;
                    // 可配置项默认值
                    opts = $.extend({
                        id: '',
                        errorOnResponseFalse: true,
                        preventRepeatRun: false,
                        type: 'GET',
                        url: '',
                        data: {},
                        success: function success(res) {},
                        error: function error() {},
                        complete: function complete() {}
                    }, opts);

                    var ajaxConfig = {
                        type: opts.type,
                        url: opts.url,
                        data: opts.data,
                        success: function success(res) {
                            res = typeof res === 'string' ? JSON.parse(res) : res;
                            consoleLog(opts.type + " " + opts.id + " " + res.success + ": %o", JSON.parse(JSON.stringify(res)));

                            opts.success(res);

                            if (opts.errorOnResponseFalse && !res.success) {
                                vm.newError(res.info || 'Data Error');
                            }
                        },
                        error: function error() {
                            opts.error();
                            vm.newError('ajax ' + arguments[1].toString() + ': ' + arguments[2].toString());
                        },
                        complete: function complete() {
                            opts.complete();
                        }
                    };

                    if (opts.preventRepeatRun) {
                        preventRepeatRun(opts.id, function (resetRun) {
                            ajaxConfig.complete = function () {
                                opts.complete();
                                resetRun();
                            };

                            $.ajax(ajaxConfig);
                        });
                    } else {
                        $.ajax(ajaxConfig);
                    }
                }
            }
        }, conf);
        return new Vue(conf);
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

    function getAppVersion() {
        var res = doMethod('getInitParams');
        if (res) {
            return JSON.parse(res).native_version;
        } else {
            return getQuery("app_version") || getQuery("version") || "2.5.0";
        }
    }
    // isLowVersion(2, 8, 2) || isLowVersion('2.8.2')
    function isLowVersion(a, b, c) {
        "use strict";

        var native_version = getAppVersion(),
            version = native_version.split('.'),
            part1 = parseInt(version[0]),
            part2 = parseInt(version[1]),
            part3 = parseInt(version[2]),
            res = false;
        if (typeof a == "string") {
            var target = a.split('.');
            a = parseInt(target[0]);
            b = parseInt(target[1]);
            c = parseInt(target[2]);
        }
        if (part1 < a) {
            res = true;
        }
        if (part1 == a && part2 < b) {
            res = true;
        }
        if (part1 == a && part2 == b && part3 < c) {
            res = true;
        }
        return res;
    }
    function studentOpenFairylandPage(appInfo) {
        //打开应用
        function openApp(appInfo) {
            "use strict";
            // 获取可以调用的壳方法

            var en = 'openFairylandPage';
            if (!isExistMethod(en)) {
                en = 'pageQueueNew';
            }
            // IOS 2.7.7 以下 从作业进的 需要使用pageQueueNew，其它可使用 openFairylandPage
            if (getQuery('from') === 'homework' && isIOS() && isLowVersion(2, 7, 8)) {
                en = 'pageQueueNew';
            }

            // 加 refer
            var referStr = '';
            if (/refer=/.test(appInfo.launchUrl)) {
                var connector = /\?/.test(appInfo.launchUrl) ? '?' : '&';
                var referId = getQuery('refer') || window.refer || '';
                referStr = connector + "refer=" + referId;
            }

            // 加页面 hash
            var hashStr = appInfo.location_hash ? appInfo.location_hash : '';

            var fullLaunchUrl = appInfo.launchUrl + referStr + hashStr;

            if (isExistMethod(en)) {
                doMethod(en, JSON.stringify({
                    url: fullLaunchUrl,
                    useNewCore: appInfo.browser || "system",
                    orientation: appInfo.orientation || "sensor",
                    initParams: JSON.stringify({ hwPrimaryVersion: appInfo.hwPrimaryVersion || "V2_4_0" }),

                    // page_viewable: 是否保留当前 webview，true保留， false 不保留，默认保留
                    page_viewable: appInfo.page_viewable !== false,
                    // use_native_title: 是否使用壳的 title，true使用，false 不使用，默认不使用
                    name: (appInfo.use_native_title ? "" : "fairyland_app:") + (appInfo.appKey || "link")
                }));
            } else {
                location.href = 'http://www.test.17zuoye.net' + fullLaunchUrl;
            }
        }

        switch (appInfo.appKey) {
            case 'BookListen':
                // 随身听打开方式
                doMethod('innerJump', JSON.stringify({ name: 'book_listen' }));
                break;
            case 'Arithmetic':
                // 速算脑力王
                doMethod('innerJump', JSON.stringify({ name: 'arithmetic', page_viewable: true }));
                break;
            default:
                openApp(appInfo);
                break;
        }
    }

    function trackOn(desc, module, op, s) {
        consoleLog(desc + " : (" + module + ", " + op + (s ? ', ' + s : '') + ")");
    }

    var Popup = function () {
        function Popup() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Popup);

            var self = this;

            var conf = self.conf = {
                maskId: '', // popup mask
                popupId: '', // popup content
                openBtnClass: '', // 点击弹出
                closeBtnClass: '', // 点击关闭
                triggerBtnClass: '', // trigger弹出关闭
                animateTime: 300, // 动画时间
                closePopupOnClickDocument: false, // 点击 document 空白区域时是否关闭弹窗
                closePopupOnClickMask: false, // 点击 mask 时是否关闭弹窗
                closeOthersOnOpen: true, // 打开一个弹窗时是否关闭其它弹窗

                activeTriggerBtn: '-active-trigger-btn-',
                panelStatusClass: '-panel-visible-' // 标识 panel 的状态
            };

            $.extend(conf, config);

            conf.onOpen = function () {
                // 打开 panel 时执行
                typeof config.onOpen === 'function' && config.onOpen(conf);
            };
            conf.onClose = function () {
                // 关闭 panel 时执行
                typeof config.onClose === 'function' && config.onClose(conf);
            };

            if (!$(conf.popupId).hasClass('-popup-created-')) {
                $(conf.popupId).addClass('-popup-created-');

                self.id = 'popup_' + Popup.instances.length;
                Popup.instances.push(self);

                self.event = null; // 点击事件

                self.initEvent();
            }
        }

        _createClass(Popup, [{
            key: "initEvent",
            value: function initEvent() {
                var self = this,
                    conf = self.conf;

                if (conf.openBtnClass) {
                    $(document).on('click', conf.openBtnClass, function (e) {
                        e.stopPropagation();
                        self.event = e;

                        self.open();
                    });
                }

                if (conf.closeBtnClass) {
                    $(document).on('click', conf.closeBtnClass, function (e) {
                        e.stopPropagation();
                        self.event = e;

                        self.close();
                    });
                }

                if (conf.closePopupOnClickMask) {
                    $(document).on('click', conf.maskId, function (e) {
                        e.stopPropagation();
                        self.event = e;

                        self.close();
                    });
                }

                if (conf.triggerBtnClass) {
                    $(document).on('click', conf.triggerBtnClass, function (e) {
                        e.stopPropagation();
                        self.event = e;

                        var $this = $(this);
                        if ($this.hasClass(conf.activeTriggerBtn)) {
                            self.trigger();
                        } else {
                            self.open();
                            $(conf.triggerBtnClass).removeClass(conf.activeTriggerBtn);
                            $this.addClass(conf.activeTriggerBtn);
                        }
                    });
                }

                if (conf.closePopupOnClickDocument) {
                    $(document).on('click', function (e) {
                        self.event = e;

                        self.close();
                    });
                }

                if (conf.popupId) {
                    $(document).on('click', conf.popupId, function (e) {
                        e.stopPropagation();
                        self.event = e;
                    });
                }
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
            key: "trigger",
            value: function trigger() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var onClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

                var self = this,
                    conf = self.conf;

                var panel = $(conf.popupId);
                if (panel.hasClass(conf.panelStatusClass)) {
                    self.close(onClose);
                } else {
                    self.open(onOpen);
                }
            }
        }]);

        return Popup;
    }();

    Popup.instances = [];

    var NormalPopup = function (_Popup) {
        _inherits(NormalPopup, _Popup);

        function NormalPopup(config) {
            _classCallCheck(this, NormalPopup);

            return _possibleConstructorReturn(this, (NormalPopup.__proto__ || Object.getPrototypeOf(NormalPopup)).call(this, config));
        }

        _createClass(NormalPopup, [{
            key: "open",
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;

                self.closeOthersOnOpen();

                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (!panel.hasClass(conf.panelStatusClass)) {
                    console.log('open');
                    mask.show();
                    panel.show().addClass(conf.panelStatusClass);
                    conf.onOpen();

                    onOpen(conf);
                }

                return self;
            }
        }, {
            key: "close",
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;
                console.log('close');
                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (panel.hasClass(conf.panelStatusClass)) {
                    mask.hide();
                    panel.hide().removeClass(conf.panelStatusClass);
                    onClose(conf);

                    conf.onClose();
                }

                return self;
            }
        }]);

        return NormalPopup;
    }(Popup);

    var logModule = 'm_WBW7QWYl';
    trackOn('6395', logModule, 'o_hSyTX96l');

    var successPopup = new NormalPopup({
        popupId: '#success-popup',
        openBtnClass: '.open-success-popup',
        closeBtnClass: '.close-success-popup'
    });
    var failurePopup = new NormalPopup({
        popupId: '#failure-popup',
        openBtnClass: '.open-failure-popup',
        closeBtnClass: '.close-failure-popup'
    });
    var noFairyPopup = new NormalPopup({
        popupId: '#noFairy-popup',
        openBtnClass: '.open-noFairy-popup',
        closeBtnClass: '.close-noFairy-popup'
    });

    // 圆心角
    var giftItemDegree = 0;

    newVue({
        el: '#index',
        data: {
            giftList: {}, // 奖品列表
            myGifts: {}, // 我的奖品
            classGifts: {}, // 抽奖动态

            prize: {} // 抽中的奖品
        },
        methods: {
            formatDate: function formatDate(timestamp) {
                var date = new Date(timestamp);
                return pad(date.getMonth() + 1, 2) + "\u6708" + pad(date.getDate(), 2) + "\u65E5 " + pad(date.getHours(), 2) + ":" + pad(date.getMinutes(), 2);
            },

            // 初始化抽奖转盘
            initLotteryUI: function initLotteryUI() {
                var prizeItems = $('.prize-item');
                giftItemDegree = 360 / prizeItems.length;
                var skew = 90 - giftItemDegree;
                var contentRotate = 90 - giftItemDegree / 2;

                prizeItems.each(function (index) {
                    var $this = $(this);
                    $this.css('transform', "translate(-100%, -100%) rotate(" + -giftItemDegree * index + "deg) skew(" + skew + "deg)");
                });
                $('.item-inner').css('transform', "skew(" + -skew + "deg)");
                $('.item-content').css('transform', "translateX(50%) rotate(" + -contentRotate + "deg)");

                $('.arc-text').arctext({
                    radius: 210 / 40 * parseInt($('html').css('font-size')) * 2
                });
            },

            // 获取奖品列表
            getGiftList: function getGiftList() {
                var vm = this;

                vm.ajax({
                    errorOnResponseFalse: false,
                    url: '/student/fairyland/creditmall/getcreditmarketgiftlist.vpage',
                    success: function success(res) {
                        if (res.success) {
                            vm.giftList = res;

                            vm.$nextTick(function () {
                                vm.initLotteryUI();
                            });
                        } else {
                            if (/精灵/.test(res.info)) {
                                noFairyPopup.open();
                            }
                        }
                    }
                });
            },

            // 获取我的奖品记录
            getMyGifts: function getMyGifts() {
                var vm = this;

                vm.ajax({
                    url: '/student/fairyland/creditmall/getstudentgiftrecord.vpage',
                    success: function success(res) {
                        if (res.success) {
                            vm.myGifts = res;
                        }
                    }
                });
            },

            // 获取同学抽奖动态
            getClassGifts: function getClassGifts() {
                var vm = this;

                vm.ajax({
                    url: '/student/fairyland/creditmall/getclassmategiftrecord.vpage',
                    success: function success(res) {
                        if (res.success) {
                            vm.classGifts = res;
                        }
                    }
                });
            },
            goGrowingWorld: function goGrowingWorld() {
                studentOpenFairylandPage({
                    launchUrl: '/app/redirect/openurl.vpage?fwdUrl=/resources/apps/hwh5/growingworld/v100/index.html'
                });
            },
            initData: function initData() {
                var vm = this;
                vm.getGiftList();
                vm.getMyGifts();
                vm.getClassGifts();
            }
        },
        mounted: function mounted() {
            var vm = this;
            vm.initData();

            window.vox = {
                task: {
                    refreshData: function refreshData() {
                        vm.getGiftList();
                    },
                    pauseHTML: function pauseHTML() {}
                }
            };

            // 点击抽奖
            $(document).on('click', '.drawLotteryBtn', function () {
                trackOn('6396', logModule, 'o_2xWEooAU');

                var $this = $(this);
                $this.addClass('animate-bubble').removeClass('drawLotteryBtn');

                vm.ajax({
                    errorOnResponseFalse: false,
                    url: '/student/fairyland/creditmall/getgiftlottery.vpage',
                    success: function success(res) {
                        trackOn('6397', logModule, 'o_QUMJdDlz', res.success ? 1 : 2);

                        if (res.success) {
                            vm.prize = res.creditMarketGiftInfo;

                            var prizeIndex = 0;
                            vm.giftList.creditMarketGiftInfoList.forEach(function (item, index) {
                                if (item.id === res.creditMarketGiftInfo.id) {
                                    prizeIndex = index;
                                }
                            });
                            var offsetDegree = giftItemDegree * (prizeIndex - 1) + giftItemDegree * (Math.random() * 0.8 + 0.1);

                            $('.con').css({
                                transform: "rotate(" + (360 * 3 + offsetDegree) + "deg)",
                                'transition-duration': '5s'
                            }).one('webkitTransitionEnd mozTransitionEnd transitionend', function () {
                                $this.addClass('drawLotteryBtn');

                                var $self = $(this);
                                $self.off('webkitTransitionEnd mozTransitionEnd transitionend');

                                $self.css({
                                    transform: "rotate(" + offsetDegree + "deg)",
                                    'transition-duration': '0s'
                                });

                                successPopup.open();

                                vm.getMyGifts();
                            });
                        } else {
                            $this.addClass('drawLotteryBtn');

                            if (/不足/.test(res.info)) {
                                failurePopup.open();
                            }
                        }
                    },
                    complete: function complete() {
                        $this.removeClass('animate-bubble');
                    }
                });
            });
        }
    });
})();