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
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, Popup);

            var self = this;

            var conf = self.conf = {
                mask: '', // popup 遮罩（推荐传入 id）
                popup: '', // popup 内容（推荐传入 id）
                openBtn: '', // 打开弹窗按钮（推荐传入 class）
                closeBtn: '', // 关闭弹窗按钮（推荐传入 class）
                toggleBtn: '', // 打开/关闭按钮（推荐传入 class）
                effect: '', // 过渡效果
                speed: 300, // 动画时间
                closeOnClickMask: false, // 点击遮罩时是否关闭弹窗
                closeOthersOnOpen: true, // 打开一个弹窗时是否关闭其它弹窗
                popupStatus: '-popup-visible-', // 标识弹窗的状态
                activeToggleBtn: '-active-trigger-btn-', // 多个 toggle btn 情况

                // 回调会在动画结束之后调用
                onOpen: function onOpen() {},
                // 打开回调
                onClose: function onClose() {}
            };

            if (!$) {
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