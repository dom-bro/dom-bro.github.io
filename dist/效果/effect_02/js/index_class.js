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
                console.error('[Popup warn]: \u672A\u627E\u5230 ' + conf.popup + ' \u5143\u7D20\uFF01');
            }

            self.id = 'popup_' + Popup.instances.length;
            Popup.instances.push(self);

            // 兼容对同一个 DOM 重复实例化（强烈不推荐）
            if (!popup.hasClass('-popup-created-')) {
                popup.addClass('-popup-created-');
                self.initEvents();
            }
        }

        _createClass(Popup, [{
            key: 'initEvents',
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
            key: 'toggle',
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
            key: 'init',
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
            key: 'open',
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

    require(['jquery', 'vue', 'init_mock'], function ($, Vue) {
        var panel_01 = new SlideUpPanel({
            popupId: '.panel-01',
            triggerBtnClass: '.trigger-panel-01',
            closePopupOnClickDocument: false
        });
        var panel_02 = new SlideUpPanel({
            popupId: '.panel-02',
            triggerBtnClass: '.trigger-panel-02',
            closeOthersOnOpen: false
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