'use strict';

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
    function consoleLog() {
        console.log.apply(console, arguments);
    }

    require(['jquery', 'vue', 'init_mock'], function ($, Vue) {
        //S 底部弹出Panel
        var Panel = function () {
            var conf = {
                maskClass: '', // popup mask
                popupClass: '.popup', // popup content
                triggerBtnClass: '.trigger-panel', // 点击弹出弹窗的按钮
                animateTime: 300, // 动画时间
                activeTriggerBtn: '-active-trigger-btn-',
                panelStatusClass: 'visible' // 标识 panel 的状态
            };
            conf._onOpen = function () {// 打开 panel 时执行
                // open code here
            };
            conf._onClose = function () {// 关闭 panel 时执行
                // close code here
            };

            function initPanel() {
                var panel = $(conf.popupClass);
                panel.css({
                    // 对于会出现加载延迟的dom，比如image，务必固定占位高度，否则 outerHeight 拿不到最终高度(加载渲染完毕)
                    bottom: -panel.outerHeight()
                });
            }

            function openPanel() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var panel = $(conf.popupClass),
                    mask = $(conf.maskClass);
                if (!panel.hasClass(conf.panelStatusClass)) {
                    mask.fadeIn(conf.animateTime);
                    panel.show().addClass(conf.panelStatusClass).stop(true).clearQueue().fadeIn(0).animate({
                        bottom: 0
                    }, conf.animateTime);

                    conf._onOpen();

                    onOpen();
                }
            }
            function closePanel() {
                var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

                var panel = $(conf.popupClass),
                    mask = $(conf.maskClass);
                if (panel.hasClass(conf.panelStatusClass)) {
                    mask.fadeOut(conf.animateTime);
                    panel.show().removeClass(conf.panelStatusClass).stop(true).clearQueue().animate({
                        bottom: -panel.outerHeight()
                    }, conf.animateTime, function () {
                        panel.fadeOut(conf.animateTime);

                        onClose();
                    });

                    conf._onClose();
                }
            }
            function triggerPanel() {
                var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var onClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

                var panel = $(conf.popupClass);
                if (panel.hasClass(conf.panelStatusClass)) {
                    closePanel(onClose);
                } else {
                    openPanel(onOpen);
                }
            }

            $(document).on('click', conf.triggerBtnClass, function (e) {
                e.stopPropagation();
                consoleLog(2);

                var $this = $(this);
                if ($this.hasClass(conf.activeTriggerBtn)) {
                    triggerPanel();
                } else {
                    openPanel();
                    $(conf.triggerBtnClass).removeClass(conf.activeTriggerBtn);
                    $this.addClass(conf.activeTriggerBtn);
                }
            });
            $(document).on('click', function () {
                closePanel();
            });
            $(document).on('click', conf.popupClass, function (e) {
                e.stopPropagation();
            });

            return {
                open: openPanel,
                close: closePanel,
                trigger: triggerPanel,
                init: initPanel
            };
        }();
        //E 底部弹出Panel

        new Vue({
            el: '#index',
            data: {
                activeItem: {},

                server: {
                    success: false
                }
            },
            methods: {
                initData: function initData() {
                    var vm = this;
                    $.get('/effect_02', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;

                        if (res.success) {
                            vm.server = res;

                            vm.$nextTick(function () {
                                colour();
                                Panel.init();
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

                onPageVisibilityChange(function () {
                    vm.initData();
                });
            }
        });
    });
})();