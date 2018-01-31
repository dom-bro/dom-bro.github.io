'use strict';

(function () {
    'use strict';

    var myScroll = void 0;

    function requestData(start, count) {
        $.get('/?start=' + +start + '&count=' + +count, {
            callback: function callback(data) {
                data = JSON.parse(data);
                myScroll.updateCache(start, data);
            }
        });
    }

    function updateContent(el, data) {
        el.innerHTML = data;
    }

    myScroll = new IScroll('#wrapper', {
        mouseWheel: true,
        infiniteElements: '#scroller .row',
        //infiniteLimit: 2000,
        dataset: requestData,
        dataFiller: updateContent,
        cacheSize: 1000
    });
})();