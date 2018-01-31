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

    colour();

    require(['jquery', 'init_mock'], function ($) {
        var ua = window.navigator.userAgent.toLowerCase(),
            isAndroid$$1 = /android/.test(ua),
            isIOS$$1 = /iphone|ipad|ipod/.test(ua),
            isParent$$1 = /17parent/.test(ua),
            isStudent$$1 = /17student/.test(ua),
            isReserve = isAndroid$$1 && isStudent$$1 || history.length > 1; // 安卓默认以page_viewable: true打开

        // 通过from=page传参强制使用 history.length，这样就能兼容安卓2.8.1 以下从页面上打开时也能关掉中间页
        if (getQuery('from') == 'page') {
            isReserve = history.length > 1;
        }

        function closePage() {
            // 如果该中间页是所在 webview 的第一个页面，则关闭该 webview；否则就保留该 webview 并返回到上一个页面；
            if (history.length <= 1) {
                // 学生端安卓2.8.1以下关不掉中间页(它不支持返回自动调用refreshData)，定位到自学乐园首页
                if (isAndroid$$1 && isStudent$$1 && isLowVersion(2, 8, 1)) {
                    // history.replaceState(null,'', '/view/mobile/student/wonderland/index');
                    history.replaceState(null, '', '/views/demo/demo.html');
                    location.reload();
                }

                // 返回时关掉中间页
                window.vox = {
                    task: {
                        refreshData: function refreshData() {
                            if (window.external && window.external.disMissView) {
                                window.external.disMissView();
                            }
                        }
                    }
                };
            } else {
                history.back();
            }
        }

        function openApp(appInfo) {
            studentOpenFairylandPage(appInfo);
            closePage();
        }

        if (getQuery('url')) {
            openApp({
                launchUrl: '/app/redirect/openurl.vpage?fwdUrl=' + getQuery('url'),
                page_viewable: isReserve
            });
        } else if (getQuery('appKey')) {
            location.href = 'http://www.test.17zuoye.net/app/redirect/getredirectparas.vpage?appKey=AfentiMath&platform=STUDENT_APP&productType=APPS';
            // $.get('http://www.test.17zuoye.net/app/redirect/getredirectparas.vpage', function (res) {
            //     res = typeof res === 'string' ? JSON.parse(res) : res;
            //     if(res.success){
            //         res.page_viewable = isReserve;
            //         openApp(res);
            //     }else{
            //         alert(res.info || '数据错误');
            //     }
            // });
        } else {
            alert('请传入要打开的url或appKey参数');
        }
    });
})();