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
     * deps: ['jquery', 'getQuery', 'historyReplaceState']
     *
     * [html 必要结构]
     * 1. tab id
     * 2. item class
     * 3. item-id attributes
     *
     * [js]
     * 实例化只会初始化事件绑定(click), 而不会初始化 HTML (比如高亮选中项, 隐藏 tab main item 等),
     * 须手动调用 initHTML 完成初始化(考虑到结合 vue 使用时往往需要延迟初始化HTML并且经常需要多次重复初始化, 抽出来就不会导致重复执行事件绑定);
     */

    var NormalTab = function () {
        function NormalTab() {
            var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            _classCallCheck(this, NormalTab);

            var self = this;
            var conf = self.conf = {
                head: '', // require tab head id
                item: '.item', // require tab children class
                main: '', // optional tab main id
                active: 'active', // optional active class
                attr: 'item-id', // optional item identifier
                history: true, // optional history replace state
                triggerClickOnInit: true,
                onClick: function onClick(e) {}
            };
            $.extend(conf, config);

            if (!$(conf.head).length) {
                console.error("NormalTab: cannot find " + (conf.head || 'tab head id'));
            }

            if (conf.main && !$(conf.main).length) {
                conf.main && console.error("NormalTab: cannot find " + conf.main);
            }

            self.id = 'tab_' + NormalTab.instances.length;
            NormalTab.instances.push(self);

            self.initEvent();
        }

        _createClass(NormalTab, [{
            key: "initHtml",
            value: function initHtml() {
                var self = this,
                    conf = self.conf;

                self.initDOM(conf.main);

                self.initDOM(conf.head);
            }
        }, {
            key: "initDOM",
            value: function initDOM(selector) {
                var self = this,
                    conf = self.conf;

                if (selector) {
                    var tab = $(selector),
                        isMain = selector === conf.main,
                        items = tab.children(conf.item);

                    isMain && items.hide();

                    // 添加 item-id 属性
                    items.each(function (index) {
                        var item = $(this);
                        !item.attr(conf.attr) && item.attr(conf.attr, index);
                    });

                    var activeItem = tab.children("[" + conf.attr + "=" + getQuery(self.id) + "]");
                    // 初始化 active item
                    if (!activeItem.length) {
                        var temp = tab.children("." + conf.active);
                        activeItem = temp.length ? temp : items.eq(0);
                    }

                    if (conf.triggerClickOnInit) {
                        activeItem.click();
                    } else {
                        self.focusOn(activeItem, isMain);
                    }
                }
            }
        }, {
            key: "initEvent",
            value: function initEvent() {
                var self = this,
                    conf = self.conf;

                if (conf.head) {
                    $(document).on('click', conf.head + " " + conf.item, function (e) {
                        conf.onClick.call(this, e);

                        var $this = $(this);

                        self.focusOn($this);

                        conf.history && historyReplaceState(self.id, $this.attr(conf.attr));

                        $(conf.main).length && self.focusOn($(conf.main).children("[" + conf.attr + "=" + $this.attr(conf.attr) + "]"), true);
                    });
                }
            }
        }, {
            key: "focusOn",
            value: function focusOn(ele, isMain) {
                var self = this,
                    conf = self.conf;

                isMain && ele.show().siblings(conf.item).hide();

                ele.addClass(conf.active).siblings(conf.item).removeClass(conf.active);
            }
        }]);

        return NormalTab;
    }();

    NormalTab.instances = [];

    require(['jquery', 'vue', 'init_mock'], function ($, Vue) {
        setTimeout(function () {
            $('#index').show();
        }, 0);

        colour(false);

        new NormalTab({
            head: '#person-list',
            main: '#person-list-main',
            onClick: function onClick(e) {}
        }).initHtml();
        new NormalTab({
            head: '#person-list2'
        }).initHtml();
    });
})();