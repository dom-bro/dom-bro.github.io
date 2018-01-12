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

    function initTrackEvent(logModule) {
        $(document).on('click', '[log-op]', function () {
            var $this = $(this);
            $this.attr('log-op') && trackOn("(" + logModule + ", " + $this.attr('log-op') + ")", logModule, $this.attr('log-op'), $this.attr('log-s0'));
        });
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

    var pricePanel = new SlideUpPanel({
        popupId: '#price-panel',
        maskId: '#price-panel-mask',
        openBtnClass: '.open-price-panel',
        closeBtnClass: '.close-price-panel'
    });
    var resultPopup = new NormalPopup({
        popupId: '#result-popup',
        maskId: '#result-popup-mask',
        openBtnClass: '.open-result-popup',
        closeBtnClass: '.close-result-popup'
    });

    window.refer = 330109;
    var logModule = 'm_UbzQt6pB';
    initTrackEvent(logModule);

    newVue({
        el: '#index',

        data: {
            appKey: '',
            isChinese: false,
            isEnglish: false,
            isMath: false,
            page: {},
            products: {},
            selectedProduct: {}
        },

        methods: {
            goTravelEurope: function goTravelEurope() {
                studentOpenFairylandPage({
                    launchUrl: '/app/redirect/openurl.vpage?fwdUrl=/resources/apps/hwh5/traveleurope/v100/index.html'
                });
            },
            pay: function pay() {
                var vm = this;

                trackOn('6634', logModule, 'o_uQcf5tSn', vm.selectedProduct.period);

                var param = {
                    productId: vm.selectedProduct.id,
                    refer: window.refer
                };
                location.href = '/api/1.0/afenti/order/submit.vpage?hideTopTitle=true&' + $.param(param);
            },
            receiveGift: function receiveGift() {
                var vm = this;

                vm.ajax({
                    url: '/studentMobile/growingworld/task/dxyr.vpage',
                    data: {
                        taskId: vm.page.tasks[0].taskId
                    },
                    success: function success(res) {
                        if (res.success) {
                            resultPopup.open();
                            vm.getPageData();
                        }
                    }
                });
            },
            getPriceInfo: function getPriceInfo() {
                var vm = this;

                vm.ajax({
                    url: '/wonderland/order/fasp.vpage',
                    data: {
                        appKey: vm.appKey
                    },
                    success: function success(res) {
                        res.products.sort(function (a, b) {
                            return a.period - b.period;
                        });
                        vm.selectedProduct = res.products[0];
                        vm.products = res;
                    }
                });
            },
            getPageData: function getPageData() {
                var vm = this;

                vm.ajax({
                    url: '/studentMobile/growingworld/task/dxyp.vpage',
                    data: {
                        source: 'temporary'
                    },
                    success: function success(res) {
                        if (res.success) {
                            vm.page = res;

                            var appKey = res.tasks[0].special.candidates[0].appKey;
                            vm.appKey = appKey;
                            vm.isChinese = appKey === 'AfentiChinese';
                            vm.isEnglish = appKey === 'AfentiExam';
                            vm.isMath = appKey === 'AfentiMath';

                            trackOn('6632', logModule, 'o_NH7JilFc', appKey);

                            $(document.body).addClass(vm.isChinese ? 'bg-chinese' : vm.isEnglish ? 'bg-english' : 'bg-math');

                            if (vm.page.tasks[0].status === 'ongoing') {
                                vm.getPriceInfo();
                            }
                        }
                    }
                });
            },
            initData: function initData() {
                var vm = this;

                vm.getPageData();
            }
        },

        mounted: function mounted() {
            var vm = this;

            vm.initData();
        }
    });
})();