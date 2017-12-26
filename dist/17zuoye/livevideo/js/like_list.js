"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    require(['jquery', 'swiper', 'vue', 'fastclick', 'lazyload', 'init_mock'], function ($, Swiper, Vue, FastClick) {
        FastClick.attach(document.body);

        new Vue({
            el: '#index',
            data: {
                error: false,
                errorInfo: '',
                server: {
                    success: false,
                    recordList: []
                }
            },
            methods: {
                openSecondWebView: openSecondWebView,

                initData: function initData() {
                    var vm = this;

                    $.get(URL.likeList, function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            vm.server = res;

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

                onPageVisibilityChange(function () {
                    vm.initData();
                });
            },
            mounted: function mounted() {}
        });
    });
})();