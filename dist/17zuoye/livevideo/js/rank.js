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
        var giftPopup = new NormalPopup({
            popupId: '#rule-popup',
            openBtnClass: '.open-rule-popup',
            closeBtnClass: '.close-rule-popup'
        });

        new Vue({
            el: '#index',
            data: {
                error: false,
                errorInfo: '',
                server: {
                    success: false,
                    rankList: []
                }
            },
            methods: {
                getPageUrl: getPageUrl,
                openSecondWebView: openSecondWebView,

                // 点赞
                giveLike: function giveLike(item) {
                    var vm = this;

                    if (!item.isGaveGood && item.studentId !== vm.server.studentId) {
                        // $.get(URL.like, {targetStudentId: item.studentId}, function(res){
                        $.get(URL.giveLike, function (res) {
                            res = typeof res === 'string' ? JSON.parse(res) : res;
                            vm.error = !res.success;

                            if (res.success) {
                                consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                                item.isGaveGood = true;
                                item.goodTotal = res.currentGoodTotal;
                            } else {

                                vm.errorInfo = res.info || '数据获取失败！';
                            }
                        }).fail(function () {
                            vm.error = true;
                            vm.errorInfo = '网络请求失败！';
                        });
                    }
                },

                initData: function initData() {
                    var vm = this;

                    $.get(URL.rank, function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', JSON.parse(JSON.stringify(res)));

                            res.rankList.forEach(function (item) {
                                switch (item.learnGrade) {
                                    case 'LV1':
                                        item.iconClass = 'type01';
                                        item.levelName = '见习';
                                        break;
                                    case 'LV2':
                                        item.iconClass = 'type02';
                                        item.levelName = '学徒';
                                        break;
                                    case 'LV3':
                                        item.iconClass = 'type03';
                                        item.levelName = '资深';
                                        break;
                                    case 'LV4':
                                        item.iconClass = 'type04';
                                        item.levelName = '精英';
                                        break;
                                }
                            });

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