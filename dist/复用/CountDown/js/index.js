'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function consoleLog() {
        console.log.apply(console, arguments);
    }

    var CountDown = function () {
        function CountDown(conf) {
            _classCallCheck(this, CountDown);

            var self = this;
            // 默认配置
            self.conf = $.extend({
                startTime: 0, // 开始时间戳
                endTime: 0, // 结束时间戳
                format: function format(val) {
                    return val.toString();
                },
                // 对 this.days,...,this.seconds 的值格式化
                onDayChange: function onDayChange() {},
                // 天数变化时回调
                onHourChange: function onHourChange() {},
                // 小时变化时回调
                onMinuteChange: function onMinuteChange() {},
                // 分钟变化时回调
                onSecondChange: function onSecondChange() {},
                // 秒数变化时回调
                onFinish: function onFinish() {}
            }, conf);
            self.remainingTime = conf.endTime - conf.startTime;

            self.ticks = 0;

            self.countDown();
        }

        _createClass(CountDown, [{
            key: 'countDown',
            value: function countDown() {
                var self = this,
                    conf = self.conf;


                var leftSeconds = Math.floor(self.remainingTime / 1000),
                    leftMinutes = Math.floor(leftSeconds / 60),
                    leftHours = Math.floor(leftMinutes / 60),
                    leftDays = Math.floor(leftHours / 24),
                    s = leftSeconds % 60,
                    m = leftMinutes % 60,
                    h = leftHours % 24,
                    d = leftDays % 365;

                var cbs = []; // 回调队列


                if (self.ticks++) {
                    self.s !== s && cbs.push(conf.onSecondChange);
                    self.m !== m && cbs.push(conf.onMinuteChange);
                    self.h !== h && cbs.push(conf.onHourChange);
                    self.d !== d && cbs.push(conf.onDayChange);
                }

                if (self.remainingTime <= 0) {
                    cbs.push(conf.onFinish);
                } else {
                    setTimeout(function () {
                        self.countDown();
                    }, 1000);
                }

                if (self.remainingTime >= 1000) {
                    self.remainingTime -= 1000;
                } else {
                    self.remainingTime = 0;
                }

                $.extend(self, {
                    // private
                    s: s, m: m, h: h, d: d,

                    // public
                    seconds: conf.format(s),
                    minutes: conf.format(m),
                    hours: conf.format(h),
                    days: conf.format(d)

                });

                cbs.forEach(function (cb) {
                    return cb.call(self);
                });
            }
        }]);

        return CountDown;
    }();

    new Vue({
        el: '#index',
        data: {
            cd: {}
        },
        created: function created() {
            this.cd = new CountDown({
                startTime: 0,
                endTime: 1000 * 60,
                format: function format(val) {
                    return val.toString().split('');
                },
                onSecondChange: function onSecondChange() {
                    var self = this;
                    consoleLog(self.days + ': ' + self.hours + ': ' + self.minutes + ': ' + self.seconds);
                    consoleLog('秒');
                },
                onMinuteChange: function onMinuteChange() {
                    consoleLog('分钟');
                },
                onHourChange: function onHourChange() {
                    consoleLog('小时');
                },
                onDayChange: function onDayChange() {
                    consoleLog('天');
                },
                onFinish: function onFinish() {
                    consoleLog('结束');
                }
            });
        }
    });
})();