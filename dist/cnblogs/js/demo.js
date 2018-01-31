'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var Bubble = function () {
        function Bubble(options) {
            _classCallCheck(this, Bubble);

            var self = this;

            self.opts = $.extend({
                bottom: '50%',
                left: '50%',
                speed: randomInRange(2, 6), // 初始上升速度，会随时间越来越快
                radius: randomInRange(5, 20), // 物体尺寸，会随时间从零长大到该值
                // radius: 20,
                swing: randomInRange(-40, 40), // 上升时左右浮动区间，该区间随时间越来越大
                innerHtml: '',
                background: 'rgba(250,0,0, 0.6)'
            }, options);

            self.dom = $('<div class="heart">' + self.opts.innerHtml + '</div>');
            self.dom.css({
                width: 0,
                height: 0,
                bottom: self.opts.bottom,
                left: self.opts.left,
                background: self.opts.background
            });
            $(document.body).append(self.dom);
            self.startX = parseFloat(self.dom.css('left'));
            self.startY = parseFloat(self.dom.css('bottom'));

            self.interval = 20;
            self.time = 0;
            self.timer = setInterval(function () {
                self.update();
            }, self.interval);
        }

        _createClass(Bubble, [{
            key: 'update',
            value: function update() {
                var self = this;
                self.time += 1;

                var y = parseFloat(self.dom.css('bottom'));

                // 注意：使用了 transform:rotate 的元素 $(dom).width() 取的是转换后的虚框的宽高，而不是转换前实框的宽高。
                // $(dom).width($(dom).width()) 会无限变大。因此使用 offsetWidth 取得实际宽高。
                var radius = self.dom[0].offsetWidth;

                // if(self.time % 2 === 0){
                radius = Math.min(++radius, self.opts.radius);
                // }

                if (y - $(window).height() > radius * 2) {
                    // 已飘到屏幕之外
                    clearInterval(self.timer);
                    self.dom.remove();
                } else {
                    self.dom.css({
                        left: self.startX + Math.sin((y - self.startY) / 80) * (self.opts.swing + self.time), // 横向越来越宽
                        bottom: y + self.opts.speed * (1 + Math.log10(self.time) / 2), // 纵向上升速度越来越快
                        width: radius,
                        height: radius
                    });
                }
            }
        }]);

        return Bubble;
    }();

    $('[name="viewport"]').attr('content', 'width=device-width, initial-scale=1, user-scalable=no');

    /**
     * @left bubble 初始 left 位置
     * @bottom bubble 初始 bottom 位置
     * @cb 所有 bubble 生成完回调
     */
    var COLORS = ['#F00', '#FF4040', '#FF7373', '#CD0074', '#FF5983'];
    function generateHearts(left, bottom, cb) {
        var count = 20;
        var generator = setInterval(function () {
            if (count-- > 0) {
                new Bubble({
                    left: left,
                    bottom: bottom,
                    background: COLORS[Math.floor(randomInRange(0, COLORS.length))]
                });
            } else {
                clearInterval(generator);
                cb();
            }
        }, 30);
    }
    function triggerEffect(e) {
        var left = e.clientX,
            bottom = $(window).height() - e.clientY;
        generateHearts(left, bottom, function () {
            new Bubble({
                left: left,
                bottom: bottom,
                speed: 1,
                radius: 50,
                background: COLORS[Math.floor(randomInRange(0, COLORS.length))],
                innerHtml: '<div class="heart-inner">Thanks</div>'
            });
        });
    }
    // $(document).on('click', triggerEffect);

    /*
     * 关注 & 推荐个性化
     */
    var diggKey = location.pathname + '_digg';
    if (!localStorage.getItem(diggKey)) {
        // 点击推荐出特效
        $(document).one('click', '.diggit, #green_channel_digg', function (e) {
            localStorage.setItem(diggKey, 1);
            triggerEffect(e);
        });
    }
    var followKey = location.pathname + '_follow';
    if (!localStorage.getItem(followKey)) {
        // 点击关注出特效
        $(document).one('click', '#green_channel_follow', function (e) {
            localStorage.setItem(followKey, 1);
            triggerEffect(e);
        });
    }

    /*
     * 滚动到指定位置
     */
    $(document).on('click', '[scroll-to]', function () {
        var position = $(this).attr('scroll-to');

        // 滚动到指定元素位置 #dom|.pos
        // 滚动到指定高度 0|1000
        $('html,body').stop(true).clearQueue().animate({
            scrollTop: Math.max(($(position).length ? $(position).offset().top : parseInt(position)) - 20, 0)
        });
    });
})();