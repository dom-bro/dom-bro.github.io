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

    var Floor = function () {
        function Floor(options) {
            _classCallCheck(this, Floor);

            var self = this;

            var defaults = {
                container: $(window),
                floorSelector: '.floor',
                division: 0.5,
                on: {
                    floorChange: function floorChange() {}
                }
            };

            self.opts = $.extend(true, defaults, options);

            self.activeIndex = 0; // 当前楼层
            self._last = -1; // 用于 scroll 事件中记录上次触发时当前楼层
            self.previousIndex = 0; // 之前的楼层

            self.initEvent();
        }

        _createClass(Floor, [{
            key: "initEvent",
            value: function initEvent() {
                var self = this,
                    opts = self.opts;

                opts.container.on('scroll', function () {
                    self.calcActiveFloor();
                });

                return self;
            }
        }, {
            key: "initHTML",
            value: function initHTML() {
                var self = this,
                    opts = self.opts;

                self.floors = $(opts.floorSelector);
                self.calcActiveFloor();

                return self;
            }
        }, {
            key: "calcActiveFloor",
            value: function calcActiveFloor() {
                var self = this,
                    opts = self.opts;

                self.floors && self.floors.each(function () {
                    var $this = $(this);
                    // 在分界线(opts.division)以上的最后一个 floor 为 active
                    if (opts.container.height() * opts.division >= $this.offset().top - opts.container.scrollTop()) {
                        self.previousIndex = self.activeIndex;
                        self.activeIndex = self.floors.index($this);
                    }
                });

                if (self._last !== self.activeIndex) {
                    opts.on.floorChange.call(self);
                }

                self._last = self.activeIndex;

                return self;
            }
        }]);

        return Floor;
    }();

    function floorChange() {
        console.log(this.activeIndex);
        $('.swiper-slide').eq(this.activeIndex).addClass('active').siblings().removeClass('active');
    }

    var floor = new Floor({
        on: {
            floorChange: floorChange
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
                            colour(false);

                            floor.initHTML();
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
})();