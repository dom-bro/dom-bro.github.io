'use strict';

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function isIOS() {
        return (/iphone|ipad|ipod/.test(ua)
        );
    }
    function consoleLog() {
        console.log.apply(console, arguments);
    }
    /*
     * 功能:
     * 1. 防止连击(选择时机使用 resetRun)
     * 2. 只执行一次(不使用 resetRun)
     */
    var _prevent_repeat_run_ = {};
    function preventRepeatRun(id) {
        var func = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var func2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        if (!id) {
            alert('preventRepeatRun 方法缺少 id 参数');
        } else {
            var resetRun = function resetRun() {
                _prevent_repeat_run_[id] = false;
            };

            if (!_prevent_repeat_run_[id]) {
                _prevent_repeat_run_[id] = true;

                func(resetRun);
            } else {
                func2(resetRun);
            }
        }
    }

    /*
     * deps: ['jqeury', 'Vue']
     * 将 Vue 封装一层的目的是把每次实例化 Vue 时都要用到的配置项提出来(主要是错误反馈和 ajax 请求)
     * 增加的 methods:
     *  onError: 错误出现时的处理方法(比如弹窗提示)，newError 会调用 onError
     *  newError: 显式抛出一条错误
     *  ajax: 在 jquery ajax 的基础上封装了一些常用的业务逻辑
     */
    function newVue(conf) {
        conf = $.extend(true, {
            el: '#index',
            data: {
                errorInfo: ''
            },
            methods: {
                onError: function onError() {
                    var vm = this;

                    alert(vm.errorInfo);
                },
                newError: function newError() {
                    var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unknown Error!';

                    var vm = this;
                    vm.errorInfo = info;
                    vm.onError();
                },

                /*
                 * 在 jquery ajax 方法原有配置项的基础上新增了一些常用的可配置项
                 *  id: (可选, 但如果想要使用 preventRepeatRun, 则必须提供一个 unique id)给 ajax 一个 unique id
                 *  errorOnResponseFalse: (可选，默认true)是否在返回的数据有错误时显式抛出一条错误 newError
                 *  preventRepeatRun: (可选，默认false)是否防止连续点击(在第一次请求返回结果后才可以发送第二次请求)
                 */
                ajax: function ajax(opts) {
                    var vm = this;
                    // 可配置项默认值
                    opts = $.extend({
                        id: '',
                        errorOnResponseFalse: true,
                        preventRepeatRun: false,
                        type: 'GET',
                        url: '',
                        data: {},
                        success: function success(res) {},
                        error: function error() {},
                        complete: function complete() {}
                    }, opts);

                    var ajaxConfig = {
                        type: opts.type,
                        url: opts.url,
                        data: opts.data,
                        success: function success(res) {
                            res = typeof res === 'string' ? JSON.parse(res) : res;
                            consoleLog(opts.type + ' ' + opts.id + ' ' + res.success + ': %o', JSON.parse(JSON.stringify(res)));

                            opts.success(res);

                            if (opts.errorOnResponseFalse && !res.success) {
                                vm.newError(res.info || 'Data Error');
                            }
                        },
                        error: function error() {
                            opts.error();
                            vm.newError('ajax ' + arguments[1].toString() + ': ' + arguments[2].toString());
                        },
                        complete: function complete() {
                            opts.complete();
                        }
                    };

                    if (opts.preventRepeatRun) {
                        preventRepeatRun(opts.id, function (resetRun) {
                            ajaxConfig.complete = function () {
                                opts.complete();
                                resetRun();
                            };

                            $.ajax(ajaxConfig);
                        });
                    } else {
                        $.ajax(ajaxConfig);
                    }
                }
            }
        }, conf);
        return new Vue(conf);
    }

    newVue({
        el: '#index'
    });
    // head 固定
    $(document).on('focus', 'input', function (e) {
        setTimeout(function () {
            $('#index').height($(window).height());
            $(window).scrollTop(0);
        }, 0);
    });
    $('#index').height($(window).height());

    setInterval(function () {
        $(window).scrollTop(0);
        $('#index').height($(window).height());
        $('header').html(window.innerHeight + '|' + $(window).height() + ': ' + Math.random());
    }, 200);

    $(window).on('scroll', function (e) {
        $('.status').html($(window).scrollTop() + ': ' + Math.random());
    });
    $(window).resize(function (e) {
        $(window).scrollTop(0);
        $('#index').height($(window).height());
        // alert(2);
    });

    // 防止内容区域滚到底后引起页面整体的滚动
    var content = document.querySelector('main');
    var startY;
    content.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
    });
    content.addEventListener('touchmove', function (e) {
        // 高位表示向上滚动
        // 底位表示向下滚动
        // 1容许 0禁止
        var status = '11';
        var ele = this;
        var currentY = e.touches[0].clientY;
        if (ele.scrollTop === 0) {
            // 如果内容小于容器则同时禁止上下滚动
            status = ele.offsetHeight >= ele.scrollHeight ? '00' : '01';
        } else if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
            // 已经滚到底部了只能向上滚动
            status = '10';
        }
        if (status != '11') {
            // 判断当前的滚动方向
            var direction = currentY - startY > 0 ? '10' : '01';
            // 操作方向和当前允许状态求与运算，运算结果为0，就说明不允许该方向滚动，则禁止默认事件，阻止滚动
            if (!(parseInt(status, 2) & parseInt(direction, 2))) {
                e.preventDefault();
            }
        }
    });
    // $(window).on('touchmove', function(e){
    //     e.preventDefault();
    // });
    // content.addEventListener('touchmove', function (e) {
    //     return true;
    // });

    var footerHeight = $('footer').outerHeight();
    if (isIOS()) {
        $('.foot-input').on('focus', function () {
            $('footer').animate({
                'height': $(window).height() * 0.7
            });
        });
        $('.foot-input').on('blur', function () {
            $('footer').animate({
                'height': footerHeight
            });
        });
    }
    $('.foot-input').on('blur', function () {
        // $('footer').animate({
        //     // top: $(window).height()*0.3,
        //     'padding-bottom': 0,
        // });
    });

    $('.arc-text').arctext({
        radius: 200
    });

    // let ua = navigator.userAgent.toLowerCase(),
    //     systemVersion = '';
    // if(isIOS()){
    //     systemVersion = ua.match(/ os ([^ ]+) /)[1];
    // }else{
    //     systemVersion = ua.match(/android ([^ ]+);/)[1];
    // }
    // consoleLog(systemVersion);
    // alert(ua);

    // $('header').removeAttr('onclick');
})();