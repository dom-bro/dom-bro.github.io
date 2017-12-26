'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function colour(use_default_style) {
        // 着色
        var units = document.querySelectorAll('.unit');
        var threshold = 126;
        for (var i = 0; i < units.length; ++i) {
            units[i].style.background = 'rgb(' + Math.floor(Math.random() * threshold) + ',' + Math.floor(Math.random() * threshold) + ',' + Math.floor(Math.random() * threshold) + ')';

            // 默认样式
            if (use_default_style !== false) {
                units[i].style.display = 'block';
                units[i].style.color = '#fff';
                units[i].style.margin = '.2rem .2rem .5rem';
                units[i].style.lineHeight = 2;
                units[i].style.fontWeight = 700;
                units[i].style.textAlign = 'center';
                units[i].style.textDecoration = 'none';
            }
        }
    }

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
    function runOnce(conf) {
        if (typeof conf === 'function') {
            conf = {
                fn: conf
            };
        }

        conf = $.extend({
            fn: function fn() {
                // 第一次运行执行
            },
            context: this, // fn 的执行上下文

            fn2: function fn2() {
                // 之后每次运行执行
            },
            context2: this // fn2 的执行上下文
        }, conf);

        var result;
        return function () {
            if (conf.fn) {
                result = conf.fn.apply(conf.context, arguments);
                conf.fn = null;
            } else {
                result = conf.fn2.apply(conf.context2, arguments);
            }

            return result;
        };
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
            key: 'initEvent',
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
            key: 'closeOthersOnOpen',
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
            key: 'open',
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
            }
        }, {
            key: 'close',
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
            }
        }, {
            key: 'trigger',
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

    var ShrinkPopup = function (_Popup) {
        _inherits(ShrinkPopup, _Popup);

        function ShrinkPopup(config) {
            _classCallCheck(this, ShrinkPopup);

            var _this = _possibleConstructorReturn(this, (ShrinkPopup.__proto__ || Object.getPrototypeOf(ShrinkPopup)).call(this, config));

            var self = _this,
                conf = self.conf,
                panel = $(conf.popupId);

            self.x = 0;
            self.y = 0;

            // 适用场景(必要条件)：弹窗宽高固定(即渲染之后弹窗宽高不会发生变化，因为该效果是对宽高进行操作，所以要求宽高固定)
            self.panelData = {
                width: panel.outerWidth(true),
                height: panel.outerHeight(true)
            };
            return _this;
        }

        _createClass(ShrinkPopup, [{
            key: 'init',
            value: function init() {
                var self = this,
                    conf = self.conf;

                self.x = self.event.clientX;
                self.y = self.event.clientY;

                var panel = $(conf.popupId);
                panel.css({
                    left: self.x,
                    top: self.y,
                    width: 0,
                    height: 0

                });
            }
        }, {
            key: 'open',
            value: function open() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;

                self.closeOthersOnOpen();

                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (!panel.hasClass(conf.panelStatusClass)) {
                    self.init();

                    mask.fadeIn(conf.animateTime);
                    panel.show().addClass(conf.panelStatusClass).stop(true).clearQueue().fadeIn(0).animate({
                        left: ($(window).width() - self.panelData.width) / 2,
                        top: ($(window).height() - self.panelData.height) / 2,
                        width: self.panelData.width,
                        height: self.panelData.height
                    }, conf.animateTime);

                    conf.onOpen();

                    onOpen(conf);
                }
            }
        }, {
            key: 'close',
            value: function close() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var self = this,
                    conf = self.conf;

                var panel = $(conf.popupId),
                    mask = $(conf.maskId);
                if (panel.hasClass(conf.panelStatusClass)) {
                    mask.fadeOut(conf.animateTime);
                    panel.show().removeClass(conf.panelStatusClass).stop(true).clearQueue().animate({
                        left: self.x,
                        top: self.y,
                        width: 0,
                        height: 0
                    }, conf.animateTime, function () {
                        panel.fadeOut(conf.animateTime);

                        onClose(conf);
                    });

                    onClose(conf);

                    conf.onClose();
                }
            }
        }]);

        return ShrinkPopup;
    }(Popup);

    require(['jquery', 'vue', 'init_mock'], function ($, Vue) {
        var panel_01, panel_02;
        var initPanel = runOnce(function () {
            panel_01 = new ShrinkPopup({
                popupId: '.panel-01',
                closeBtnClass: '.close-panel-01',
                closeOthersOnOpen: false,
                closePopupOnClickDocument: false,
                openBtnClass: '.trigger-panel-01'
                // animateTime: 3000,
            });
            panel_02 = new ShrinkPopup({
                popupId: '.panel-02',
                triggerBtnClass: '.trigger-panel-02'
                // animateTime: 3000,
            });
        });

        new Vue({
            el: '#index',
            data: {
                activeItem: {},

                server: {
                    success: false
                }
            },
            methods: {
                closePanel01: function closePanel01() {
                    var vm = this;

                    panel_01.close(function () {
                        vm.initData();
                    });
                },
                closePanel02: function closePanel02() {
                    var vm = this;

                    panel_02.close(function () {
                        vm.initData();
                    });
                },
                initData: function initData() {
                    var vm = this;
                    $.get('/effect_02', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;

                        if (res.success) {
                            vm.activeItem = res.contents[0];
                            vm.server = res;

                            vm.$nextTick(function () {
                                colour();

                                initPanel();
                            });
                        } else {
                            alert('数据错误！');
                        }
                    });
                }
            },
            created: function created() {
                var vm = this;
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();
                vm.initData();

                onPageVisibilityChange(function () {
                    vm.initData();
                });
            }
        });
    });
})();