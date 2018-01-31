"use strict";

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
    function openSecondWebView(url) {
        "use strict";

        if (isExistMethod('openSecondWebview')) {
            return doMethod('openSecondWebview', JSON.stringify({ url: url }));
        } else {
            location.href = url;
        }
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

    var logModule = 'm_mHvrOc7i';

    require(['jquery', 'swiper', 'vue', 'fastclick', 'lazyload', 'init_mock'], function ($, Swiper, Vue, FastClick) {
        FastClick.attach(document.body);

        //S 弹窗
        function closePopupAll() {
            "use strict";

            $('[id$="-popup"]').hide();
        }
        function openPopupId(id) {
            "use strict";

            $((/^#/.test(id) ? '' : '#') + id).show();
        }
        $(document).on('click', '.open-popup', function () {
            "use strict";

            openPopupId($(this).attr('popup-id'));
        });
        $(document).on('click', '.close-popup', function () {
            "use strict";

            closePopupAll();
        });
        //E 弹窗

        //S 底部弹出Panel
        var Panel = function () {
            var conf = {
                maskClass: '', // popup mask
                popupClass: '.goods-popup', // popup content
                triggerBtnClass: '.trigger-panel', // 点击弹出弹窗的按钮
                animateTime: 300, // 动画时间
                activeTriggerBtn: '-active-trigger-btn-',
                panelStatusClass: 'visible' // 标识 panel 的状态
            };
            conf._onOpen = function () {
                // 打开 panel 时执行
                $(document.body).stop(true).clearQueue().animate({
                    'padding-bottom': $('.mySchoolbag-footer .inner').outerHeight(true)
                }, conf.animateTime);
            };
            conf._onClose = function () {
                // 关闭 panel 时执行
                $(document.body).stop(true).clearQueue().animate({
                    'padding-bottom': 0
                }, conf.animateTime);
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

        // slide 内图片懒加载
        var imageLoaded = {};
        function slideImageLazyLoad(swiper) {
            if (!imageLoaded['slide_' + swiper.activeIndex]) {
                var activeSlide = $(swiper.slides[swiper.activeIndex]);
                activeSlide.find('img.lazy').lazyload({
                    effect: "fadeIn",
                    placeholder: ''
                });
                imageLoaded['slide_' + swiper.activeIndex] = true;
            }
        }
        var initSwiper = function () {
            var tabHeadSelectorName = '#swiper-tab-head',
                tabMainSelectorName = '#swiper-tab-main',
                onSlideChange = function onSlideChange(activeSlide) {
                Panel.close();
                trackOn("(" + logModule + ", o_rSzkwi43, " + activeSlide.attr('data-id') + ")", logModule, 'o_rSzkwi43', activeSlide.attr('data-id'));
            },
                swiperTabHead = null,
                swiperTabMain = null,
                moveActiveSlideTo = null;
            $(document).on('click', tabHeadSelectorName + ' .swiper-slide', function () {
                swiperTabMain.slideTo($(this).index());
            });

            return function () {
                // destroy swiper
                if (swiperTabHead) {
                    swiperTabHead.destroy();
                    clearTimeout(swiperTabHead.timer);
                }
                if (swiperTabMain) {
                    swiperTabMain.destroy();
                }

                var fixedHeaderHeight = $('.fixed-header').outerHeight();
                // 占位
                $(document.body).css('padding-top', fixedHeaderHeight);
                $(tabMainSelectorName).find('.swiper-slide').css('min-height', $(window).height() - fixedHeaderHeight);
                // swiper
                swiperTabHead = new Swiper(tabHeadSelectorName, {
                    // 此处有坑, 样式为 width: auto 时, border-width务必用px，否则会出一个小bug，wrapper和container右边贴不紧
                    slidesPerView: 'auto',
                    freeMode: true,
                    // 此处有坑，freeModeMomentumBounce 必须设置为false
                    // 如果为 true 的话 swiper 会在 TransitionEnd 再做一次 setTranslate，就会覆盖掉下面 moveActiveSlideTo 计算出的位置
                    freeModeMomentumBounce: false
                    // freeModeMomentumRatio: 5,
                });

                moveActiveSlideTo = getActiveSlideMoveMethod(swiperTabHead, onSlideChange);

                var activeId = getQuery('active'),
                    activeItem = $("[data-id=" + activeId + "]");

                if (!activeItem.length || !activeItem.index()) {
                    moveActiveSlideTo(0);
                }

                swiperTabMain = new Swiper(tabMainSelectorName, {
                    autoHeight: true,
                    initialSlide: activeItem.length ? activeItem.index() : 0,
                    onSlideChangeStart: function onSlideChangeStart(swiper) {
                        moveActiveSlideTo(swiper.activeIndex, { align: 'side' });
                    },
                    onSlideChangeEnd: function onSlideChangeEnd(swiper) {
                        slideImageLazyLoad(swiper);
                    },
                    onInit: function onInit(swiper) {
                        slideImageLazyLoad(swiper);
                    }
                });
            };
        }();

        new Vue({
            el: '#index',
            data: {
                error: false,
                errorInfo: '',

                popup: false,
                popupInfo: '',

                imageLoaded: {},

                activeItem: {},

                server: {
                    success: false
                }
            },
            methods: {
                openPopup: function openPopup(info) {
                    var vm = this;
                    vm.popup = true;
                    info && typeof info === 'string' && (vm.popupInfo = info);
                },
                closePopup: function closePopup() {
                    var vm = this;
                    vm.error = false;
                    vm.errorInfo = '';

                    vm.popup = false;
                    vm.popupInfo = '';
                },

                getGoods: function getGoods(goods) {
                    "use strict";

                    var vm = this,
                        goodsList = vm.server.goodsList;

                    return goods.type === 'All' ? goodsList : goodsList.filter(function (item) {
                        return item.goodsType === goods.type;
                    });
                },
                clickGoods: function clickGoods(item) {
                    trackOn("(" + logModule + ", o_du3OnsDM, " + item.goodsType + ")", logModule, 'o_du3OnsDM', item.goodsType);

                    var vm = this;
                    vm.activeItem = item;
                },
                trackOperation: function trackOperation() {
                    var vm = this;
                    trackOn("(" + logModule + ", o_orOP9UTo, " + vm.activeItem.goodsType + ")", logModule, 'o_orOP9UTo', vm.activeItem.goodsType);
                },
                // 前往错题宝
                fwdWrongVideo: function fwdWrongVideo() {
                    var vm = this;
                    vm.trackOperation();

                    Panel.close();

                    var subjectMap = {
                        "EnglishVideo": 0,
                        "MathVideo": 1,
                        "ChineseVideo": 2
                    };
                    openSecondWebView('/view/mobile/student/activity/guide_pay_20170525/index?active=' + subjectMap[vm.activeItem.goodsOriginType]);
                },
                // 前往知识树精灵商城
                fwdKnowledgeTree: function fwdKnowledgeTree() {
                    var vm = this;
                    vm.trackOperation();

                    Panel.close();
                    studentOpenFairylandPage({
                        launchUrl: '/resources/apps/hwh5/studyspace/v100/index.html?module=FairyShop'
                    });
                },
                // 头饰: 立刻装扮
                dressUp: function dressUp() {
                    var vm = this;
                    vm.trackOperation();

                    $.get('/schoolbag/dressup', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;
                        if (res.success) {
                            consoleLog('数据获取成功%o', res);

                            // 更新头饰
                            if (window.external && window.external.sendNotification) {
                                window.external.sendNotification(30000);
                            }

                            openPopupId('#dressup-result-popup');
                            Panel.close(function () {
                                vm.initData();
                            });
                        } else {
                            vm.errorInfo = res.info || '数据获取失败！';
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                },
                // 使用碎片
                usePieces: function usePieces() {
                    var vm = this;
                    vm.trackOperation();

                    Panel.close();
                    studentOpenFairylandPage({
                        launchUrl: '/resources/apps/hwh5/studyspace/v100/index.html?module=CompoundScene'
                    });
                },

                initData: function initData() {
                    var vm = this;

                    $.get('/schoolbag/index', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', res);
                            res.goodsTypeConfigs = [{
                                "name": "全部",
                                "type": "All"
                            }].concat(res.goodsTypeConfigs);
                            res.goodsList.forEach(function (item) {
                                if (item.isOwned) {
                                    if (item.validityDate === 0) {
                                        item.validateDesc = '今天过期';
                                    } else if (item.validityDate === -1) {
                                        item.validateDesc = '永久有效';
                                    } else if (item.validityDate > 0) {
                                        item.validateDesc = "\u5269\u4F59\u6709\u6548\u671F" + item.validityDate + "\u5929";
                                    }
                                }
                            });

                            if (vm.server.success) {
                                vm.imageLoaded = $.extend({}, imageLoaded);
                            }

                            vm.server = res;

                            vm.$nextTick(function () {
                                initSwiper();

                                Panel.init();
                            });
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
            },
            mounted: function mounted() {}
        });
    });
})();