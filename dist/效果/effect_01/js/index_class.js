"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function getQuery(key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"),
            res = window.location.search.substr(1).match(reg);
        return res != null ? decodeURIComponent(res[2]) : null;
    }

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
    function historyReplaceState(key) {
        var newValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

        var href = location.href;
        if (key) {
            var newPair = key + "=" + newValue;
            var reg = new RegExp(key + '=[^&#]*');
            if (reg.test(href)) {
                href = href.replace(reg, newPair);
            } else {
                newPair = (/\?/.test(location.search) ? '&' : '?') + newPair;

                if (/#/.test(location.hash)) {
                    href = href.replace(location.hash, newPair + location.hash);
                } else {
                    href += newPair;
                }
            }
        }
        history.replaceState(null, '', href);
    }

    /*
     * move Active Slide to ['center', 'left', 'right']
     */
    function getActiveSlideMoveMethod(tab) {
        tab = $.extend({
            id: 'tab',
            tabHeadSwiper: null,
            replaceState: true,
            attr: 'item-id',
            tabHead: {
                onSlideChangeStart: function onSlideChangeStart(activeSlide, index) {}
            }
        }, tab);

        var swiper = tab.tabHeadSwiper;
        var windowWidth = $(window).width();
        var wrapperWidth = 0;
        for (var i = 0; i < swiper.slides.length; ++i) {
            wrapperWidth += $(swiper.slides[i]).outerWidth(true);
        }

        swiper.timer = null;
        return function (index, conf) {
            var defaultConf = {
                replaceState: tab.replaceState,
                align: 'center',
                activeClass: 'active'
            };
            conf = $.extend(defaultConf, conf);
            var activeSlide = $(swiper.slides[index]);
            activeSlide.addClass(conf.activeClass).siblings().removeClass(conf.activeClass);

            tab.tabHead.onSlideChangeStart(activeSlide, index);

            if (conf.replaceState !== false) {
                consoleLog(tab.id);
                consoleLog(activeSlide.attr(tab.attr));
                historyReplaceState(tab.id, activeSlide.attr(tab.attr));
            }

            var translate3d_X = Math.abs(swiper.getWrapperTranslate());
            // 使activeSlide的中线位于屏幕正中间，仿今日头条tab效果
            var activeSlideHalfWidth = activeSlide.outerWidth(true) / 2;
            if (wrapperWidth > windowWidth) {
                if (conf.align === 'side') {
                    var prevSlideWidth = 0;
                    var nextSlideWidth = 0;
                    var distance = 1 / 2;
                    if (index > 0) {
                        prevSlideWidth = $(swiper.slides[index - 1]).outerWidth(true);
                    }
                    if (index < swiper.slides.length - 1) {
                        nextSlideWidth = $(swiper.slides[index + 1]).outerWidth(true);
                    }

                    // slide 不完全出现在屏幕上(偏左)
                    if (Math.abs(swiper.getWrapperTranslate()) - (activeSlide.position().left - prevSlideWidth * distance) > 0) {
                        if (index === 0) {
                            translate3d_X = 0;
                        } else {
                            var prevSlide = $(swiper.slides[index - 1]);
                            translate3d_X = prevSlide.position().left + prevSlideWidth * distance;
                        }
                        // slide 不完全出现在屏幕上(偏右)
                    } else if (activeSlide.position().left + activeSlide.outerWidth(true) + nextSlideWidth * distance > Math.abs(swiper.getWrapperTranslate()) + windowWidth) {
                        if (index === swiper.slides.length - 1) {
                            translate3d_X = wrapperWidth - windowWidth;
                        } else {
                            var nextSlide = $(swiper.slides[index + 1]);
                            translate3d_X = nextSlide.position().left + nextSlideWidth * distance - windowWidth;
                        }
                    }
                } else {
                    // 最左边
                    if (activeSlide.position().left + activeSlideHalfWidth < windowWidth / 2) {
                        translate3d_X = 0;
                    } else {
                        // 最右边
                        if (wrapperWidth - (activeSlide.position().left + activeSlideHalfWidth) < windowWidth / 2) {
                            translate3d_X = wrapperWidth - windowWidth;
                        } else {
                            // 中间部分
                            translate3d_X = activeSlide.position().left + activeSlideHalfWidth - windowWidth / 2;
                        }
                    }
                }

                // 不用 setTimeout 会出 bug
                clearTimeout(swiper.timer);
                swiper.timer = setTimeout(function () {
                    if (swiper.wrapper) {
                        swiper.setWrapperTransition(300);
                        swiper.setWrapperTranslate(-translate3d_X);
                    }
                }, 0);
            }
        };
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

    /*
     * deps: ['jquery', 'swiper', 'getActiveSlideMoveMethod']
     *
     */

    var SwiperTab = function () {
        function SwiperTab(config) {
            _classCallCheck(this, SwiperTab);

            var self = this;
            var conf = self.conf = {
                tabHeadId: '', // 必须
                tabMainId: '', // 可选
                activeItemClassName: 'active', // 可选
                replaceState: true, // 可选
                attr: 'item-id', // item identifier
                tabHead: {
                    onClick: function onClick(swiper, event) {}, // tab head item click event callback
                    onSlideChangeStart: function onSlideChangeStart(swiper, event) {},
                    onSlideChangeEnd: function onSlideChangeEnd(swiper, event) {},
                    onInit: function onInit(swiper) {}
                },
                tabMain: {
                    onClick: function onClick(swiper, event) {}, // tab head item click event callback
                    onSlideChangeStart: function onSlideChangeStart(swiper, event) {},
                    onSlideChangeEnd: function onSlideChangeEnd(swiper, event) {},
                    onInit: function onInit(swiper) {}
                },
                onInit: function onInit() {},

                nested: false
            };
            $.extend(conf, config);

            self.id = 'tab_' + SwiperTab.instances.length;
            SwiperTab.instances.push(self);

            self.tabHeadSwiper = null;
            self.tabMainSwiper = null;

            self.init();

            self.initEvent();
        }

        _createClass(SwiperTab, [{
            key: "init",
            value: function init() {
                var self = this,
                    conf = self.conf;

                conf.onInit(conf);

                // destroy swiper
                if (self.tabHeadSwiper) {
                    self.tabHeadSwiper.destroy();
                    clearTimeout(self.tabHeadSwiper.timer);
                }
                if (self.tabMainSwiper) {
                    self.tabMainSwiper.destroy();
                }

                self.tabHeadSwiper = new Swiper(conf.tabHeadId, {
                    // 此处有坑, 样式为 width: auto 时, border-width务必用px，否则会出一个小bug，wrapper和container右边贴不紧
                    slidesPerView: 'auto',
                    freeMode: true,
                    // 此处有坑，freeModeMomentumBounce 必须设置为false
                    // 如果为 true 的话 swiper 会在 TransitionEnd 再做一次 setTranslate，就会覆盖掉下面 moveActiveSlideTo 计算出的位置
                    freeModeMomentumBounce: false,
                    // freeModeMomentumRatio: 5,

                    nested: conf.nested,
                    resistanceRatio: conf.nested ? 0 : 0.85,

                    onInit: function onInit(swiper) {
                        // 添加 item-id 属性
                        $(swiper.slides).each(function (index) {
                            var item = $(this);
                            !item.attr(conf.attr) && item.attr(conf.attr, index);
                        });

                        conf.tabHead.onInit(swiper);
                    }
                });

                var moveActiveSlideTo = getActiveSlideMoveMethod(self);

                // 初始化选中项
                var activeId = getQuery(self.id),
                    activeItem = $("[" + conf.attr + "=" + activeId + "]");

                if (!activeItem.length || !activeItem.index()) {
                    moveActiveSlideTo(0);
                }

                self.tabMainSwiper = new Swiper(conf.tabMainId, {
                    autoHeight: true,
                    initialSlide: activeItem.length ? activeItem.index() : 0,

                    nested: conf.nested,
                    resistanceRatio: conf.nested ? 0 : 0.85,

                    onSlideChangeStart: function onSlideChangeStart(swiper) {
                        moveActiveSlideTo(swiper.activeIndex, { align: 'side' });
                    },
                    onSlideChangeEnd: function onSlideChangeEnd(swiper) {},
                    onInit: function onInit(swiper) {
                        // 添加 item-id 属性
                        $(swiper.slides).each(function (index) {
                            var item = $(this);
                            !item.attr(conf.attr) && item.attr(conf.attr, index);
                        });

                        conf.tabMain.onInit(swiper);
                    }
                });
            }
        }, {
            key: "initEvent",
            value: function initEvent() {
                var self = this,
                    conf = self.conf;

                $(document).on('click', conf.tabHeadId + " .swiper-slide", function () {
                    self.tabMainSwiper.slideTo($(this).index());
                    consoleLog($(this).index());
                });
            }
        }]);

        return SwiperTab;
    }();

    SwiperTab.instances = [];

    require(['jquery', 'vue', 'swiper', 'init_mock'], function ($, Vue, Swiper) {
        var swiperTab01, swiperTab02;
        var initTab = runOnce({
            fn: function fn() {
                consoleLog(1);
                swiperTab01 = new SwiperTab({
                    tabHeadId: '#tab-head-01',
                    tabMainId: '#tab-main-01',
                    onInit: function onInit(conf) {
                        var fixedHeaderHeight = $('.fixed-header').outerHeight();
                        $(document.body).css('padding-top', fixedHeaderHeight);
                        $(conf.tabMainId + ">.swiper-wrapper>.swiper-slide").css('min-height', $(window).height() - fixedHeaderHeight);
                    }
                });
                swiperTab02 = new SwiperTab({
                    tabHeadId: '#tab-head-02',
                    tabMainId: '#tab-main-02',
                    nested: true,
                    replaceState: false,
                    onInit: function onInit(conf) {
                        var fixedHeaderHeight = $('.fixed-header').outerHeight();
                        $(document.body).css('padding-top', fixedHeaderHeight);
                        $(conf.tabMainId + " .swiper-slide").css('min-height', $(window).height() - fixedHeaderHeight);
                    }
                });
            },
            fn2: function fn2() {
                consoleLog(2);
                swiperTab01.init();
                swiperTab02.init();
            }
        });
        new Vue({
            el: '#index',
            data: {
                activeTab: null,

                server: {
                    success: false
                }
            },
            methods: {
                openSecondWebView: openSecondWebView,
                initData: function initData() {
                    var vm = this;
                    $.get('/effect_00', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;

                        if (res.success) {
                            vm.activeTab = getQuery('active') || res.head[0].id;
                            vm.server = res;

                            vm.$nextTick(function () {
                                initTab();

                                colour(false);
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
                // vm.initData();
                // vm.initData();
                // vm.initData();
                // vm.initData();
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
            }
        });
    });
})();