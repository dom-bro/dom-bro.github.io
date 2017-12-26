'use strict';

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
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

    var scroller = void 0;

    newVue({
        el: '#index',
        data: {
            n: 20
        },
        computed: {
            getN: function getN() {
                var vm = this;
                vm.$nextTick(function () {
                    scroller.refresh();
                });
                return parseInt(vm.n) || 0;
            }
        },
        mounted: function mounted() {
            scroller = new IScroll('#scroll-container', {
                probeType: 3,
                indicators: {
                    el: '#indicator',
                    ignoreBoundaries: true,
                    speedRatioY: 0.4
                }
            });
            scroller.on('scroll', function () {
                $('#status').html(this.y);
                console.log(this.x);
                // console.log(this.directionX);
                // console.log(this.directionY);
            });
            scroller.on('beforeScrollStart', function () {

                $('#status').html('beforeScrollStart');
            });
            scroller.on('scrollCancel', function () {
                $('#status').html('scrollCancel');
            });
            scroller.on('scrollStart', function () {
                $('#status').html('scrollStart');
            });
            scroller.on('scrollEnd', function () {
                $('#status').html('scrollEnd');
            });
        }
    });
})();