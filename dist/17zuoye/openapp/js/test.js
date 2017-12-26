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
            console.error('\u672A\u627E\u5230 ' + methodName + ' \u65B9\u6CD5');
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

    colour();

    require(['jquery', 'init_mock'], function ($) {
        $(document).on('click', '.open-app', function () {
            var targetUrl = void 0;
            targetUrl = 'https://www.17zuoye.com/view/mobile/student/wonderland/openapp?url=/view/mobile/student/activity/guide_pay_2017061501/index&use_native_title=true&uid=378250995&sid=0&_aid=1441&app_version=2.8.2.585';
            openSecondWebView(targetUrl);
        });
    });
})();