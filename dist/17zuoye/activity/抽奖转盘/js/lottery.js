'use strict';

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();
    function consoleLog() {
        console.log.apply(console, arguments);
    }

    $(document).on('click', '.item-content', function () {
        consoleLog(1);
    });

    $('.arc-text').arctext({
        radius: 210
    });

    var prizeItems = $('.prize-item');
    var deg = 360 / prizeItems.length;
    var skew = 90 - deg;
    var contentRotate = 90 - deg / 2;

    prizeItems.each(function (index) {
        var $this = $(this);
        $this.css('transform', 'translate(-100%, -100%) rotate(' + deg * index + 'deg) skew(' + skew + 'deg)');
    });
    $('.item-inner').css('transform', 'skew(' + -skew + 'deg)');
    $('.item-content').css('transform', 'translateX(50%) rotate(' + -contentRotate + 'deg)');
})();