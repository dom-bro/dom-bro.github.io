'use strict';

(function () {
    'use strict';

    $('.tile-rect').each(function () {
        var $this = $(this);
        $this.height($this.outerWidth() / 2);
    });

    $('.tile-square').each(function () {
        var $this = $(this);
        $this.height($this.outerWidth());
    });

    function getRandom() {
        return Math.round(Math.random() * 120 + 50);
    }

    $('.tile-inner').each(function () {
        var $this = $(this);
        $this.css({
            backgroundColor: 'rgba(' + getRandom() + ', ' + getRandom() + ', ' + getRandom() + ', 1)'
        });
    });
})();