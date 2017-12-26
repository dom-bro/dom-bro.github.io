'use strict';

(function () {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase();

    require(['jquery'], function ($) {
        console.log($);
        document.write(navigator.userAgent);

        // location.href = targetUrl;
        // openSecondWebView('/view/mobile/student/livevideo/index.vpage')
        // studentOpenFairylandPage({
        //     launchUrl: '/view/mobile/student/livevideo/course_arrangement.vpage?subject=ENCYCLOPEDIA_HIGH&subjectName=%25E7%2599%25BE%25E7%25A7%2591-%25E5%259F%25BA%25E7%25A1%2580 &a=1',
        // });
    });
})();