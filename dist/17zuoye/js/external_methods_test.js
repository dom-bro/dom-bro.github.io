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
    function isEqualVersion(a, b, c) {
        "use strict";

        var native_version = getAppVersion(),
            version = native_version.split('.'),
            part1 = parseInt(version[0]),
            part2 = parseInt(version[1]),
            part3 = parseInt(version[2]);

        if (typeof a == "string") {
            var target = a.split('.');
            a = parseInt(target[0]);
            b = parseInt(target[1]);
            c = parseInt(target[2]);
        }
        return part1 == a && part2 == b && part3 == c;
    }
    function isHighVersion(a, b, c) {
        return !(isLowVersion(a, b, c) || isEqualVersion(a, b, c));
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

    var open_app = function open_app($) {
        var default_opts = {
            parent: {
                schema: 'a17parent',
                sj_download: 'com.yiqizuoye.jzt',
                yq_url_pre: 'j/jzt',
                yq_type: 'tab',
                ad_type: 'news_detail'
            },
            student: {
                schema: 'a17zuoye',
                sj_download: 'com.A17zuoye.mobile.homework',
                yq_url_pre: 's/student',
                yq_type: 'tab',
                ad_type: 'news_detail'
            },
            teacher: {
                schema: 'a17teacher',
                sj_download: 'com.yiqizuoye.teacher',
                yq_url_pre: 't/teacher',
                yq_type: 'tab',
                ad_type: 'news_detail'
            }
        };

        var ua = navigator.userAgent.toLowerCase(),
            is_android = ua.search('android') > -1,
            from_wechat_or_qq_ua_reg = /(micromessenger|qq)\//.test(ua);

        var get_default_schema_pathname = function get_default_schema_pathname(schema) {
            return schema.replace('a17', '') + '_main';
        },
            get_webview_url = function get_webview_url(url) {
            return encodeURIComponent(url === 'location' ? location.href : url);
        },
            get_schema_search = function get_schema_search(dataset) {
            if (dataset.search) {
                return '?' + dataset.search;
            }

            if (is_android) {
                return dataset.ad_val ? "?from=h5&type=" + dataset.ad_type + "&url=" + get_webview_url(dataset.ad_val) + "&val=" + get_webview_url(dataset.ad_val) : '';
            }

            return dataset.yq_val ? "?yq_from=h5&yq_type=" + dataset.yq_type + "&yq_val=" + get_webview_url(dataset.yq_val) : '';
        },
            build_sj_download = function build_sj_download(pkgname) {
            return "https://a.app.qq.com/o/simple.jsp?pkgname=" + pkgname;
        },
            build_schema = function build_schema(data_set) {
            return data_set.schema + "://platform.open.api:/" + (data_set.pathname || get_default_schema_pathname(data_set.schema)) + (get_schema_search(data_set) || '');
        },
            build_download_url = function build_download_url(dataset, client) {
            return dataset.download_url || "https://wx.17zuoye.com/download/17" + client + "app?cid=" + dataset.channel;
        },
            build_ios_universal_link = function build_ios_universal_link(dataset) {
            return "https://wechat.17zuoye.com/" + dataset.yq_url_pre + "?yq_from=h5&yq_type=" + dataset.yq_type + "&yq_val=" + get_webview_url(dataset.yq_val);
        };

        var do_open_app = function do_open_app() {
            var dataset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var client = dataset.client || 'parent';

            dataset = $.extend({}, default_opts[client], dataset);

            var schema = dataset.schema,
                download_url = build_download_url(dataset, client),
                sj_download = build_sj_download(dataset.sj_download);

            if (is_android) {
                schema = build_schema(dataset);

                if (from_wechat_or_qq_ua_reg) {
                    var android_scheme = dataset.ad_val ? "&android_scheme=" + encodeURIComponent(schema) : '';

                    schema = "" + sj_download + android_scheme;
                }
            } else {
                var ios_version = /ip(ad|hone|od)/.test(ua) && ua.match(/os (\d+)_(\d+)/);

                if (ios_version) {
                    if (from_wechat_or_qq_ua_reg) {
                        schema = +ios_version[1] > 8 ? build_ios_universal_link(dataset) : sj_download;
                    } else {
                        schema = build_schema(dataset);
                    }
                } else {
                    schema = download_url;
                }
            }

            setTimeout(function (url) {
                location.href = url;
            }, 2200, download_url);

            location.href = schema;
        };

        $(document).on('click', '.do_open_client', function () {
            do_open_app($(this).data());
        });

        return do_open_app;
    };

    colour();

    $(document).on('click', '.getAppVersion', function () {
        var $this = $(this);
        $this.next('.preview').html(getAppVersion());
    });
    $('.getAppVersion').click();

    $(document).on('click', '.isLowVersion', function () {
        var $this = $(this);
        $this.next('.preview').html(isLowVersion($this.siblings('.version').val()).toString());
    });
    $('.isLowVersion').click();

    $(document).on('click', '.isEqualVersion', function () {
        var $this = $(this);
        $this.next('.preview').html(isEqualVersion($this.siblings('.version').val()).toString());
    });
    $('.isEqualVersion').click();

    $(document).on('click', '.isHighVersion', function () {
        var $this = $(this);
        $this.next('.preview').html(isHighVersion($this.siblings('.version').val()).toString());
    });
    $('.isHighVersion').click();

    $(document).on('change', '.version', function () {
        $('.isLowVersion').click();
        $('.isEqualVersion').click();
        $('.isHighVersion').click();
    });

    $(document).on('click', '.openSecondWebView', function () {
        var $this = $(this);
        var url = void 0;

        // url = 'http://hello.com:3002/views/效果/effect_04_通用弹窗/index'
        // url = 'http://hello.com:3002/view/mobile/student/wrong_question/index.vpage'
        url = 'http://hello.com:3002/view/mobile/student/wrong_question/index.vpage?subject=MATH&from=world&refer=330049&app_version=2.9.3.731&client_type=mobile&client_name=17Student&app_product_id=101&imei=8D7739D3-079F-4655-960E-54165E1C50EC&env=test';
        $this.next('.preview').html(openSecondWebView(url));
    });

    $(document).on('click', '.openFairylandPage', function () {
        var $this = $(this);
        $this.next('.preview').html(studentOpenFairylandPage({
            // launchUrl: 'http://hello.com:3002/view/mobile/student/wrong_question/question_list.vpage?subject=MATH&from=world&refer=330049&app_version=2.9.3.731&client_type=mobile&client_name=17Student&app_product_id=101&imei=8D7739D3-079F-4655-960E-54165E1C50EC&env=test',
            launchUrl: 'http://hello.com:3002/view/mobile/student/wrong_question/index.vpage?subject=MATH&from=world&refer=330049&app_version=2.9.3.731&client_type=mobile&client_name=17Student&app_product_id=101&imei=8D7739D3-079F-4655-960E-54165E1C50EC&env=test'
            // launchUrl: 'http://hello.com:3002',
            // launchUrl: 'http://hello.com:3002/view/mobile/student/activity/guide_pay_20170525/index',
        }));
    });

    $(document).on('click', '.openLiveStream', function () {
        if (!doMethod('openLiveStream', JSON.stringify({
            type: 'live_talkfun',
            play_mode: '1',
            access_key: 'wkDOiRGNwkDOkZWMjFjYjV2NiljMyEzNxIWYwgTZ1MDf8xXfigjN5UDNfNzNzQjN2IiOiUWbh5mciwCM6ISYiwSXbpjIyRHdhJCLycjMzMTNwATNxojIl1Wa0dWZyJCLiUDM4cTNwITMiojIklGeiwSN0ITMxojIklGciwCM6ICZpdmIsgjN5UDN6ICZp9VZzJXdvNmIsIiI6IichRXY2FmIsAjOiIXZk5WZnJCLycDO2MTNwATNxojIlJXawhXZiwyM3MDN2YjOiQWat92byJCLikXZsRHanlmbLFmcpV2SiojIl1WYut2Yp5mIsIiclNXdiojIlx2byJCLiETMwAzMiojIklWdiwSN0ITMxojIkl2XyVmb0JXYwJye',
            course_id: '45968'
        }))) {
            alert('未找到 openLiveStream 方法');
        }
    });

    var openApp = open_app($);
    var download_url = '//wx.17zuoye.com/download/17parentapp?cid=203009';
    var activity_index_url = location.origin + "/view/mobile/student/wrong_question/question_list.vpage?subject=MATH&tab_0=0";
    $(document).on('click', '.openStudentApp', function () {
        openApp({
            download_url: download_url,
            client: 'student',
            yq_type: 'webview',
            yq_val: activity_index_url,
            ad_val: activity_index_url
        });
        // location.href = 'a17zuoye://platform.open.api/student/primary/main/?paper="/view/mobile/student/wrong_question/question_list.vpage?subject=MATH&from=parents';
        // doMethod('openApp', JSON.stringify({
        //     name: "a17zuoye",
        //     type: 'h5',
        //     url: '/view/mobile/student/wrong_question/question_list.vpage?subject=MATH&from=parents'
        //
        // }))
        // doMethod('openApp', JSON.stringify({
        //     name: "a17zuoye",
        //     type: 'h5',
        //     url: '/view/mobile/student/wrong_question/question_list.vpage?subject=MATH&from=parents'
        //     params: '',
        // }))
    });
    $(document).on('click', '.openParentApp', function () {

        openApp({
            download_url: download_url,
            yq_type: 'webview',
            yq_val: activity_index_url,
            ad_val: activity_index_url
        });
    });

    window.vox = {
        task: {
            refreshData: function refreshData() {
                $(document.body).prepend('<div>come back</div>');
            }
        }
    };
    // alert(1);
    // openSecondWebView('/view/mobile/student/wrong_question/question_list.vpage');
    // doMethod('homeworkHTMLLoaded');
})();