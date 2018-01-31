'use strict';

(function () {
  'use strict';

  var scroller = new IScroll('#floors', {
    probeType: 3,
    mouseWheel: true,
    scrollbars: true,
    fadeScrollbars: true,
    interactiveScrollbars: true,
    shrinkScrollbars: 'scale',
    bounce: false
  });

  $(document).on('click', '.scrollTo', function () {
    scroller.scrollTo(0, -100, 16000);
  });

  $(document).on('click', '.frozen', frozen);

  function frozen() {
    // scroller.resetPosition(600)
    // scroller._animate(scroller.x, scroller.y, 0, IScroll.utils.ease.circular.fn)
    scroller.isAnimating = false;
    // scroller._translate(scroller.x, scroller.y)
    // scroller.scrollTo(scroller.x, scroller.y, 0.0001);
    // scroller.refresh()
    // scroller._execEvent('scrollEnd')
  }

  $(document).on('click', '.scrollToElement', function () {
    // frozen()
    // setTimeout(()=> {
    //   scroller.scrollToElement($('.floor:last')[0])
    // }, 0)
    scroller.isAnimating = false;
    setTimeout(function () {
      scroller.scrollToElement($('.floor:last')[0]);
    }, 20);
  });

  scroller.on('beforeScrollStart', function () {
    console.log('beforeScrollStart');
  });

  scroller.on('scrollCancel', function () {
    console.log('scrollCancel');
  });
  scroller.on('scrollStart', function () {
    console.log('scrollStart');
  });
  scroller.on('scroll', function () {
    console.log('scroll');
  });
  scroller.on('scrollEnd', function () {
    console.log('scrollEnd');
  });
  // scroller.on('flick', function() {
  //   console.log('flick')
  // })
})();