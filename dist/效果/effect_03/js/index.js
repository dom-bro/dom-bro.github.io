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
        function tabInit() {
            //获取url参数
            function _tabInitGetQuery(key) {
                var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)"),
                    res = window.location.search.substr(1).match(reg);
                return res != null ? decodeURIComponent(res[2]) : null;
            }
            //tab切换效果
            $('.j-tab-head').each(function () {
                var item = $(this),
                    tabLevel = item.attr('data-tab-serial-number') || '',
                    activeNumber = parseInt(_tabInitGetQuery('active' + tabLevel)) || 0;
                if (item.children('.active').length) {
                    activeNumber = item.children('.active').index();
                }
                var activeChildren = item.children('.item').eq(activeNumber);
                activeChildren.addClass('active');
                !item.attr('data-no-main') && item.siblings('.j-tab-main').children('.item').eq(activeNumber).addClass('active').show();
                activeChildren.hasClass('change-title') && change_title(activeChildren.attr('data-title') || activeChildren.html());
            });
            $(document).on('click', '.j-tab-head .item', function () {
                var $this = $(this),
                    tabSerialNumber = $this.parent().attr('data-tab-serial-number') || '',
                    activeNumber = $this.index(),
                    href = location.href;

                var reg = new RegExp('active' + tabSerialNumber + '=[^&#]*');
                if (reg.test(href)) {
                    href = href.replace(reg, 'active' + tabSerialNumber + '=' + activeNumber);
                } else {
                    href += (/\?/.test(href) ? '&' : '?') + 'active' + tabSerialNumber + '=' + activeNumber;
                }
                history.replaceState(null, '', href);
                !$this.hasClass('active') && !$this.parent().attr('data-no-main') && $this.parent().siblings('.j-tab-main').eq(0).children('.item').removeClass('active').hide().eq(activeNumber).addClass('active').show();
                $this.addClass('active').siblings().removeClass('active');
            });
        }

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
                    $.get('/effect_03', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        consoleLog(res);

                        if (res.success) {
                            vm.server = res;

                            vm.$nextTick(function () {
                                colour(false);

                                tabInit();
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