"use strict";

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function isAndroid() {
        return (/android/.test(ua)
        );
    }
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
    var appsInfo = [{
        "appKey": "AfentiMath",
        "productName": "阿分题数学",
        "productDesc": " 每日同步练习—奖学豆",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846625c777487030e710bce.jpg",
        "operationMessage": "173万名同学在学",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": true,
        "catalogDesc": "同步教辅",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=AfentiMath&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 489
    }, {
        "appKey": "AfentiExam",
        "productName": "阿分题英语",
        "productDesc": " 随堂知识复习 —奖学豆",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846624fe92b1bb215dafd74.jpg",
        "operationMessage": "197万名同学在学",
        "hotFlag": false,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "同步教辅",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=AfentiExam&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 475
    }, {
        "appKey": "AfentiChinese",
        "productName": "阿分题语文",
        "productDesc": "夯实基础，随堂天天练",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846626ae92b1bb215dafd7c.jpg",
        "operationMessage": "196万名同学在学",
        "hotFlag": false,
        "newFlag": true,
        "recommendFlag": false,
        "catalogDesc": "同步教辅",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=AfentiChinese&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 1,
        "dayToExpire": 0
    }, {
        "appKey": "EagletSinologyClassRoom",
        "productName": "小鹰国学堂",
        "productDesc": "争当国学小状元~",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-59b23a0fe92b1ba88fb292e3.png",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": true,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=EagletSinologyClassRoom&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "system",
        "appStatus": 2,
        "dayToExpire": 727
    }, {
        "appKey": "EncyclopediaChallenge",
        "productName": "百科大挑战",
        "productDesc": "十万个为什么-智慧化身",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846622e777487030e710bc2.jpg",
        "operationMessage": "3名同学在学",
        "hotFlag": false,
        "newFlag": true,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=EncyclopediaChallenge&platform=STUDENT_APP&productType=APPS",
        "orientation": "landscape",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 26
    }, {
        "appKey": "UsaAdventure",
        "productName": "走遍美国学英语",
        "productDesc": " 单词闯关、竞技场-每日礼包",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846623f777487030e710bc6.jpg",
        "operationMessage": "3名同学在学",
        "hotFlag": true,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=UsaAdventure&platform=STUDENT_APP&productType=APPS",
        "orientation": "landscape",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 317
    }, {
        "appKey": "ValueAddedLiveTimesCard",
        "productName": "小鹰学堂",
        "productDesc": "互动直播，让学习更有趣",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5971740be92b1b8eae98c859.png",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=ValueAddedLiveTimesCard&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 20
    }, {
        "appKey": "Arithmetic",
        "productName": "速算脑力王",
        "productDesc": "培养速算兴趣，探索脑力巅峰",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-585241c4777487960f8055fd.jpg",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "INNER_APPS",
        "appStatus": 2,
        "dayToExpire": 605
    }, {
        "appKey": "AfentiExamVideo",
        "productName": "错题宝",
        "productDesc": "学习易错题 天天领奖励",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-597173fe7774875b401d3cee.png",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=AfentiExamVideo&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "system",
        "appStatus": 1,
        "dayToExpire": 0
    }, {
        "appKey": "ChineseHero",
        "productName": "字词英雄",
        "productDesc": "字词英雄",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-58f07415e92b1bad8cb79aed.jpg",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=ChineseHero&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 18
    }, {
        "appKey": "ChineseSynPractice",
        "productName": "语文同步练",
        "productDesc": "专注字词，强化语文基础",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-58466219777487030e710bbb.jpg",
        "operationMessage": "3名同学在学",
        "hotFlag": false,
        "newFlag": true,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=ChineseSynPractice&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 11
    }, {
        "appKey": "GreatAdventure",
        "productName": "酷跑学单词",
        "productDesc": " 小升初单词PK-成绩亮剑",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5846627ce92b1bb215dafd82.jpg",
        "operationMessage": "4名同学在学",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=GreatAdventure&platform=STUDENT_APP&productType=APPS",
        "orientation": "landscape",
        "browser": "crossWalk",
        "appStatus": 1,
        "dayToExpire": 0
    }, {
        "appKey": "PicListenBook",
        "productName": "点读机",
        "productDesc": "点读机机",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-58b6b2ff7774870de311a744.jpg",
        "operationMessage": "38万名同学在学",
        "hotFlag": true,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=PicListenBook&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "system",
        "appStatus": 0,
        "dayToExpire": 0
    }, {
        "appKey": "Sudoku",
        "productName": "天天爱数独",
        "productDesc": "思路引导，冲击奖牌",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-58b8084e77748755c2b6da36.jpg",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=Sudoku&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 1,
        "dayToExpire": 0
    }, {
        "appKey": "AnimalLand",
        "productName": "动物大冒险",
        "productDesc": "畅游动物世界~了解动物知识！",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-599e383ce92b1b3e88640693.png",
        "operationMessage": "",
        "hotFlag": true,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=AnimalLand&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 18
    }, {
        "appKey": "FunOlympicMath",
        "productName": "趣味奥数国际版",
        "productDesc": "趣味奥数国际版",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-5996c732e92b1bb006f52874.png",
        "operationMessage": "",
        "hotFlag": true,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=FunOlympicMath&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "system",
        "appStatus": 0,
        "dayToExpire": 0
    }, {
        "appKey": "DinosaurLand",
        "productName": "恐龙时代",
        "productDesc": "带你穿越到恐龙时代~",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-59a37f6377748703b46da3de.png",
        "operationMessage": "",
        "hotFlag": true,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=DinosaurLand&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 2,
        "dayToExpire": 24
    }, {
        "appKey": "ScienceLand",
        "productName": "魔力科技",
        "productDesc": "ScienceLand",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-599fde5d777487102f832ce4.png",
        "operationMessage": "",
        "hotFlag": true,
        "newFlag": true,
        "recommendFlag": true,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=ScienceLand&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "crossWalk",
        "appStatus": 0,
        "dayToExpire": 0
    }, {
        "appKey": "WrongTopic",
        "productName": "错题本",
        "productDesc": "",
        "productIcon": "http://cdn-portrait.test.17zuoye.net/gridfs/fairylandProduct-59a680e4e92b1b5de7cc5fa1.png",
        "operationMessage": "",
        "hotFlag": false,
        "newFlag": false,
        "recommendFlag": false,
        "catalogDesc": "课外自学",
        "productType": "APPS",
        "launchUrl": "/app/redirect/jump.vpage?appKey=WrongTopic&platform=STUDENT_APP&productType=APPS",
        "orientation": "portrait",
        "browser": "system",
        "appStatus": 0,
        "dayToExpire": 0
    }];
    var APP_INFO = {};

    function getAppInfo(appKey) {
        // app info 格式处理
        if (!APP_INFO['MATH']) {
            appsInfo.forEach(function (item) {
                APP_INFO[item.appKey] = item;
            });
            APP_INFO['CHINESE'] = APP_INFO['AfentiChinese'];
            APP_INFO['ENGLISH'] = APP_INFO['AfentiExam'];
            APP_INFO['MATH'] = APP_INFO['AfentiMath'];
        }

        return appKey ? APP_INFO[appKey] : APP_INFO;
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

    require(['jquery'], function ($) {
        $(document).on('click', '.open-app', function () {
            var $this = $(this);

            // IOS 2.7.7(不包括) 以下，Android 2.7.8(不包括) 以下不支持打开速算脑力王
            if ($this.attr('appKey') === "Arithmetic" && (isIOS() && isLowVersion(2, 7, 7) || isAndroid() && isLowVersion(2, 7, 8))) {
                alert('当前版本不支持打开速算脑力王，请前往下载最新版本');
            } else {
                var data = getAppInfo($this.attr('appKey'));
                data.location_hash = $this.attr('hash');
                studentOpenFairylandPage(data);
            }
        });
    });
})();