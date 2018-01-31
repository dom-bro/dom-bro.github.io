"use strict";

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
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

    function trackOn(desc, module, op, s) {
        consoleLog(desc + " : (" + module + ", " + op + (s ? ', ' + s : '') + ")");
    }

    require(['jquery', 'vue', 'swiper', 'init_mock'], function ($, Vue, Swiper) {

        var logModule = 'm_5MdgPOOA';
        new Vue({
            el: '#index',
            data: {
                error: false,
                errorInfo: '',

                popup: false,
                popupInfo: '',

                status: {
                    end: '已结束',
                    ongoing: '进行中',
                    notStarted: '即将开始'
                },

                activeItemIndex: 0,

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

                countDown: function countDown() {
                    var vm = this,
                        cd = false,
                        sales = vm.server.sales;

                    for (var i = 0; i < sales.length; ++i) {
                        var item = sales[i];

                        // 未结束
                        if (item.status !== vm.status.end) {
                            if (item.remainingTime > 0) {
                                if (item.remainingTime >= 1000) {
                                    item.remainingTime -= 1000;
                                } else {
                                    item.remainingTime = 0;
                                }
                                cd = true;
                            } else {
                                vm.initData();
                                cd = false;
                                break;
                            }
                        }
                    }

                    if (cd) {
                        setTimeout(function () {
                            vm.countDown();
                        }, 1000);
                    }
                },
                pay: function pay() {
                    var vm = this;

                    trackOn('开启宝箱按钮被点击', logModule, 'o_p1SljmP8', new Date().toLocaleDateString() + ' ' + vm.activeItem.title);

                    var data = {
                        productId: vm.activeItem.productId,
                        refer: getQuery('refer') || '330032'
                    };
                    location.href = 'http://www.test.17zuoye.net/api/1.0/afenti/order/submit.vpage?hideTopTitle=true&' + $.param(data);
                },

                initData: function initData() {
                    var vm = this;

                    $.get('/wonderland/activity/sales.vpage', function (res) {
                        res = typeof res === 'string' ? JSON.parse(res) : res;
                        vm.error = !res.success;

                        if (res.success) {
                            consoleLog('数据获取成功%o', res);

                            if (res.currentTime < res.sales[0].startTimestamp) {
                                vm.activeItemIndex = 0;
                            } else if (res.currentTime > res.sales[res.sales.length - 1].endTimestamp) {
                                vm.activeItemIndex = res.sales.length - 1;
                            }

                            res.sales.forEach(function (item, index) {
                                if (res.currentTime < item.startTimestamp) {
                                    item.status = vm.status.notStarted;

                                    item.remainingTime = item.startTimestamp - res.currentTime;
                                } else if (res.currentTime > item.endTimestamp) {
                                    item.status = vm.status.end;
                                } else {
                                    item.status = vm.status.ongoing;

                                    vm.activeItemIndex = index;
                                    item.remainingTime = item.endTimestamp - res.currentTime;
                                }

                                item.appInfo = getAppInfo(item.appKey);
                            });

                            if (!vm.server.success) {
                                var activeItem = res.sales[vm.activeItemIndex];
                                trackOn('页面被加载', logModule, 'o_7DXpIGGb', activeItem.status + '-' + (activeItem.open ? '已开启' : '未开启'));
                            }

                            vm.server = res;

                            vm.$nextTick(function () {
                                vm.countDown();
                                new Swiper('.swiper-container', {
                                    initialSlide: vm.activeItemIndex,
                                    slidesPerView: 4,
                                    freeMode: true
                                });
                            });
                        } else {
                            vm.errorInfo = res.info || '数据获取失败！' + appKey;
                        }
                    }).fail(function () {
                        vm.error = true;
                        vm.errorInfo = '网络请求失败！';
                    });
                }
            },
            computed: {
                activeItem: function activeItem() {
                    var vm = this;

                    return vm.server.sales ? vm.server.sales[vm.activeItemIndex] : {};
                },
                getLeft: function getLeft() {
                    var vm = this;

                    var leftSeconds = Math.floor(vm.activeItem.remainingTime / 1000);
                    var leftMinutes = Math.floor(leftSeconds / 60);
                    var leftHours = Math.floor(leftMinutes / 60);

                    var s = leftSeconds % 60;
                    s = s > 9 ? s : '0' + s;
                    var min = leftMinutes % 60;
                    min = min > 9 ? min : '0' + min;
                    var h = leftHours % 60;
                    h = h > 9 ? h : '0' + h;

                    return h + ":" + min + ":" + s;
                }
            },
            watch: {
                error: function error(newValue) {
                    var vm = this;
                    if (newValue === true) {
                        // 错误出现时给用户一个反馈信息
                        alert(vm.errorInfo);
                    }
                }
            },
            created: function created() {
                var vm = this;
                vm.initData();

                onPageVisibilityChange(function () {
                    alert(1);
                });
            },
            mounted: function mounted() {}
        });
    });
})();