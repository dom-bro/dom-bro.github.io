'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    //<drop-load>
    var dropload = {};
    function lock(dl) {
        if (dl) {
            dl.lock();
            dl.noData();
            dl.resetload();
        }
    }
    function unlock(dl) {
        if (dl) {
            dl.unlock();
            dl.noData(false);
            dl.resetload();
        }
    }
    $(document).on('click', '.re-init-dropload', function () {
        // 数据加载失败后点击重新加载
        unlock(dropload);
    });
    //</drop-load>

    newVue({
        el: '#index',
        data: {
            server: {}
        },
        methods: {
            //<drop-load>
            initDropLoad: function initDropLoad(wrapper) {
                var vm = this;

                dropload = wrapper.dropload({
                    scrollArea: window,
                    domDown: {
                        domRefresh: '<div class="dropload-load"><span class="loading-gif domRefresh"></span>正在加载</div>',
                        domLoad: '<div class="dropload-load"><span class="loading-gif domLoad"></span>正在加载</div>',
                        domNoData: '<div class="dropload-noData domNoData">\u6CA1\u6709\u66F4\u591A\u6570\u636E\u4E86</div>'
                    },
                    threshold: 80,
                    loadDownFn: function loadDownFn() {
                        consoleLog('event: 上拉加载更多事件');

                        vm.ajax({
                            url: '/drop-load/one-tab',
                            success: function success(res) {
                                //<数据处理>
                                var hasData = true;
                                if (vm.server.success) {
                                    var _vm$server$descriptio;

                                    (_vm$server$descriptio = vm.server.description).push.apply(_vm$server$descriptio, _toConsumableArray(res.description));
                                } else {
                                    vm.server = res;
                                }
                                hasData = vm.server.description.length <= res.totalPage;
                                //</数据处理>

                                if (hasData) {
                                    vm.$nextTick(function () {
                                        unlock(dropload);
                                    });
                                } else {
                                    consoleLog('data-null: 没有更多数据了');
                                    lock(dropload);
                                }
                            }
                        });
                    }
                });
            }
        },
        mounted: function mounted() {
            var vm = this;

            vm.initDropLoad($('#drop-load'));
        }
    });
})();