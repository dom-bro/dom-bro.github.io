'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  /**
   * @param el：朴素的DOM元素
   * @param axis：哪个方向的偏移量（'x'|'y'）
   * @returns {number} 返回一个浮点型数值
   * @作用 获取DOM元素的transform:translate量
   *
   * !!! Don't edit this !!!
   * 该函数摘自 Swiper，为了方便以后同步，请不要做任何编辑
   */

  function getTranslate(el) {
    var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';

    var matrix = void 0;
    var curTransform = void 0;
    var transformMatrix = void 0;

    var curStyle = window.getComputedStyle(el, null);

    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;
      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(function (a) {
          return a.replace(',', '.');
        }).join(', ');
      }
      // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case
      transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42;
      // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]);
        // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
    }
    return curTransform || 0;
  }

  function getType(val) {
    return val ? Object(val).constructor.name : Object.prototype.toString.call(val).match(/\[object (.*)]/)[1];
  }
  function isObject(val) {
    return getType(val) === 'Object';
  }

  function isBoolean(val) {
    return getType(val) === 'Boolean';
  }

  function isArray(val) {
    return getType(val) === 'Array';
  }

  /**
   * $.extend
   */
  function extend() {
    var target = arguments.length <= 0 ? undefined : arguments[0],
        i = 1,
        deep = false;

    // Handle a deep copy situation
    if (isBoolean(target)) {
      var _ref;

      deep = target;

      // Skip the boolean and the target
      target = Object((_ref = i++, arguments.length <= _ref ? undefined : arguments[_ref]));
    }
    for (; i < arguments.length; ++i) {
      var nextSource = arguments.length <= i ? undefined : arguments[i];
      // Skip over if null/undefined
      if (nextSource !== undefined && nextSource !== null) {
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            var from = nextSource[nextKey],
                to = target[nextKey];

            if (deep && getType(to) === getType(from) && (isObject(to) || isArray(to))) {
              extend(deep, to, from);
            } else {
              target[nextKey] = from;
            }
          }
        }
      }
    }
    return target;
  }

  // 将插件需要的样式写到 <style> 里 append 到 <head> 里
  var stylesheet = document.createElement('style');
  stylesheet.setAttribute('id', 'es6-dessert-stylesheet');
  document.head.appendChild(stylesheet);

  var Popup = function () {
    function Popup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Popup);

      var self = this;

      var conf = self.conf = {
        mask: '', // popup 遮罩（推荐传入 id）
        popup: '', // popup 内容（推荐传入 id）
        openBtn: '', // 打开弹窗按钮（推荐传入 class）
        closeBtn: '', // 关闭弹窗按钮（推荐传入 class）
        toggleBtn: '', // 打开/关闭按钮（推荐传入 class）
        duration: 0, // 动画时长
        closeOnClickMask: false, // 点击遮罩时是否关闭弹窗
        closeOthersOnOpen: true, // 打开一个弹窗时是否关闭其它弹窗
        popupStatus: '-popup-visible-', // 标识弹窗的状态
        activeToggleBtn: '-active-trigger-btn-', // 多个 toggle btn 情况

        // 回调会在动画结束之后调用
        onOpen: function onOpen() {},
        // 打开回调
        onClose: function onClose() {}
      };

      extend(conf, options);

      self.required();

      var popup = $(conf.popup);
      // 兼容对同一个 DOM 重复实例化（强烈不推荐）
      if (!popup.hasClass('-popup-created-')) {
        popup.addClass('-popup-created-');

        self.id = 'popup_' + Popup.instances.length;
        Popup.instances.push(self);

        self.initEvents();
      }
    }

    _createClass(Popup, [{
      key: 'initEvents',
      value: function initEvents() {
        var self = this,
            conf = self.conf;


        if (conf.openBtn) {
          $(document).on('click', conf.openBtn, function (e) {
            e.stopPropagation();
            self.event = e;
            self.open();
          });
        }

        if (conf.closeBtn) {
          $(document).on('click', conf.closeBtn, function (e) {
            e.stopPropagation();
            self.event = e;
            self.close();
          });
        }

        if (conf.closeOnClickMask) {
          $(document).on('click', conf.mask, function (e) {
            e.stopPropagation();
            self.event = e;
            self.close();
          });
        }

        // 此处的 toggle 第一次点击总是打开
        if (conf.toggleBtn) {
          $(document).on('click', conf.toggleBtn, function (e) {
            e.stopPropagation();
            self.event = e;

            var $this = $(this);
            if ($this.hasClass(conf.activeToggleBtn)) {
              self.toggle();
            } else {
              self.open();
              $('.' + conf.activeToggleBtn).removeClass(conf.activeToggleBtn);
              $this.addClass(conf.activeToggleBtn);
            }
          });
        }

        $(document).on('click', conf.popup, function (e) {
          e.stopPropagation();
          self.event = e;
        });
      }
    }, {
      key: 'closeOthersOnOpen',
      value: function closeOthersOnOpen() {
        var self = this,
            conf = self.conf;


        if (conf.closeOthersOnOpen) {
          Popup.instances.forEach(function (instance) {
            if (instance !== self) {
              instance.close();
            }
          });
        }
      }

      /*
       * 子类实现时务必调用 super.xxx()
       */

    }, {
      key: 'required',
      value: function required() {
        var self = this,
            conf = self.conf;


        if (!window.$) {
          throw self.constructor.name + ' Error: \u8BE5\u6A21\u5757\u4F9D\u8D56 jQuery \u5E93\u5E76\u4E14\u987B\u5C06 jQuery \u66B4\u9732\u4E3A\u5168\u5C40\u53D8\u91CF window.$';
        }

        var popup = $(conf.popup);
        if (!popup.length) {
          throw self.constructor.name + ' Error: \u672A\u627E\u5230 ' + conf.popup + ' \u5143\u7D20\uFF01';
        }
        if (popup.css('display') !== 'none') {
          throw self.constructor.name + ' Error: \u8981\u6C42 ' + conf.popup + ' \u5143\u7D20\u5FC5\u987B\u8BBE\u7F6E\u4E3A display:none\uFF01\u5982\u679C\u9700\u8981\u5728\u9875\u9762\u52A0\u8F7D\u8FDB\u6765\u5C31\u5C55\u793A\uFF0C\u8BF7\u901A\u8FC7\u5728\u5B9E\u4F8B\u5316\u540E\u76F4\u63A5\u8C03\u7528 open \u6765\u5B9E\u73B0\uFF0C\u6BD4\u5982 new ' + self.constructor.name + '(options).open()';
        }

        if (conf.mask && !$(conf.mask).length) {
          throw self.constructor.name + ' Error: \u672A\u627E\u5230 ' + conf.mask + ' \u5143\u7D20\uFF01';
        }

        if (conf.closeOnClickMask) {
          if (!conf.mask) {
            throw self.constructor.name + ' Error: closeOnClickMask \u4E3A true \u65F6\u5FC5\u987B\u4F20\u5165 mask \u9009\u9879';
          }
        }
      }
    }, {
      key: 'open',
      value: function open() {
        var self = this;

        self.closeOthersOnOpen();
      }
    }, {
      key: 'close',
      value: function close() {}
    }, {
      key: 'toggle',
      value: function toggle() {
        var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var onClose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var self = this,
            conf = self.conf,
            popup = $(conf.popup);


        popup.hasClass(conf.popupStatus) ? self.close(onClose) : self.open(onOpen);
      }
    }]);

    return Popup;
  }();

  Popup.instances = [];
  Popup.addStyle = function (rules) {
    stylesheet.innerHTML += rules;
  };

  var requiredSlidePopupStyle = '\n.es6Dessert-SlidePopup{\n  position: fixed !important;\n  top: auto !important;\n  bottom: 0 !important;\n  width: 100%;\n  margin-bottom: 0 !important;\n  -webkit-transform: translate3d(0,100%,0);\n  transform: translate3d(0,100%,0);\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: transform;\n  transition-property: transform,-webkit-transform;\n}';

  /**
   * 底部浮现弹窗
   */
  Popup.addStyle(requiredSlidePopupStyle);

  var transitionEnd = 'webkitTransitionEnd transitionend';

  var SlidePopup = function (_Popup) {
    _inherits(SlidePopup, _Popup);

    function SlidePopup(config) {
      _classCallCheck(this, SlidePopup);

      config.duration = config.duration || 300;

      var _this = _possibleConstructorReturn(this, (SlidePopup.__proto__ || Object.getPrototypeOf(SlidePopup)).call(this, config));

      var self = _this,
          conf = self.conf,
          popup = $(conf.popup);


      popup.addClass('es6Dessert-SlidePopup');
      return _this;
    }

    _createClass(SlidePopup, [{
      key: 'required',
      value: function required() {
        _get(SlidePopup.prototype.__proto__ || Object.getPrototypeOf(SlidePopup.prototype), 'required', this).call(this);

        var self = this,
            conf = self.conf,
            popup = $(conf.popup);

        /*
         * 不允许在 popup 上设置 transform 样式
         */
        var popupTransform = popup.css('transform');
        // display:none 元素是拿不到 transform 值的，
        // 因此以迅雷不及掩耳盗铃铛之势快速 show 和 hide 一下，
        // 这不会引起浏览器的重绘，所以页面不会发生闪烁
        if (popup.css('display') === 'none') {
          popup.show();
          popupTransform = popup.css('transform');
          popup.hide();
        }
        if (popupTransform !== 'none') {
          console.error('[' + self.constructor.name + ' warn]: \u8BE5\u63D2\u4EF6\u57FA\u4E8E transform \u5236\u9020\u52A8\u753B\uFF0C\u5C06\u8986\u76D6\u5DF2\u6709\u7684 transform \u503C\uFF0C\u56E0\u6B64\u4E0D\u5141\u8BB8\u5728 ' + conf.popup + ' \u5143\u7D20\u4E0A\u8BBE\u7F6E transform \u6837\u5F0F\uFF0C\u8BF7\u91CD\u65B0\u7EC4\u7EC7\u60A8\u7684 html \u548C css \u7ED3\u6784\uFF01');
        }
      }
    }, {
      key: 'open',
      value: function open() {
        var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        _get(SlidePopup.prototype.__proto__ || Object.getPrototypeOf(SlidePopup.prototype), 'open', this).call(this);

        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);


        self.closeOthersOnOpen();

        function openCallback() {
          conf.onOpen.call(self);
          onOpen.call(self);
        }

        if (!popup.hasClass(conf.popupStatus)) {
          // getTranslate 方法是拿不到 display:none 元素的偏移量的，
          // 因为 display:none 元素的 transform 值总是为 none
          popup.show();

          // 按照偏移量去计算动画时长，因为弹窗并不总是从最底下冉冉升起的
          var popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
              percent = popupTranslate / popup.outerHeight(),
              duration = Math.round(conf.duration * percent);

          mask.stop(true).clearQueue().fadeIn(duration);
          // 更新弹窗状态
          popup.addClass(conf.popupStatus).css({
            transform: 'translate3d(0,0,0)',
            transitionDuration: duration + 'ms'
          })
          // 过渡未完成不会触发 transitionEnd 事件，因此需要移除之前绑定的事件
          .off(transitionEnd).on(transitionEnd, function (e) {
            // popup 子元素的 transition 也会冒泡触发 popup 的 transitionEnd 事件，
            // 因此需要这层过滤，且必须用 on 而不能是 one 绑定事件
            if (e.target === popup[0]) {
              // 确保回调只被执行一次
              popup.off(transitionEnd);

              openCallback();
            }
          });
        }

        return self;
      }
    }, {
      key: 'close',
      value: function close() {
        var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);


        function closeCallback() {
          conf.onClose.call(self);
          onClose.call(self);
        }

        if (popup.hasClass(conf.popupStatus)) {
          var popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
              percent = 1 - popupTranslate / popup.outerHeight(),
              duration = Math.round(conf.duration * percent);

          mask.stop(true).clearQueue().fadeOut(duration);

          popup.removeClass(conf.popupStatus).css({
            transform: 'translate3d(0,100%,0)',
            transitionDuration: duration + 'ms'
          }).off(transitionEnd).on(transitionEnd, function (e) {
            if (e.target === popup[0]) {
              popup.off(transitionEnd).hide();

              closeCallback();
            }
          });
        }
      }
    }]);

    return SlidePopup;
  }(Popup);

  var popupA = new SlidePopup({
    popup: '#popup-A',
    openBtn: '.open-popup-A',
    closeBtn: '.close-popup-A'
  });

  var popupB = new SlidePopup({
    mask: '#popup-B-mask',
    popup: '#popup-B',
    openBtn: '.open-popup-B',
    closeBtn: '.close-popup-B'
  });

  var popupC = new SlidePopup({
    mask: '#popup-C-mask',
    popup: '#popup-C',
    openBtn: '.open-popup-C',
    closeBtn: '.close-popup-C'
  });

  var popupD = new SlidePopup({
    popup: '#popup-D',
    openBtn: '.open-popup-D',
    closeBtn: '.close-popup-D'
  });

  var popupE = new SlidePopup({
    popup: '#popup-E'
  });
  $(document).on('click', '.toggle-popup-E', function () {
    popupE.toggle();
  });

  var popupF = new SlidePopup({
    mask: '#popup-F-mask',
    popup: '#popup-F',
    openBtn: '.open-popup-F',
    closeOnClickMask: true
  });

  var popupG = new SlidePopup({
    popup: '#popup-G',
    openBtn: '.open-popup-G',
    closeBtn: '.close-popup-G',
    closeOthersOnOpen: false
  });

  var popupH = new SlidePopup({
    popup: '#popup-H',
    openBtn: '.open-popup-H',
    closeBtn: '.close-popup-H',
    duration: 2000
  });

  var popupK = new SlidePopup({
    popup: '#popup-K',
    openBtn: '.open-popup-K',
    closeBtn: '.close-popup-K',
    onOpen: function onOpen() {
      alert('opened K');
    },
    onClose: function onClose() {
      alert('closed K');
    }
  });

  var popupM = new SlidePopup({
    popup: '#popup-M',
    toggleBtn: '.toggle-popup-M'
  });

  var popupN = new SlidePopup({
    popup: '#popup-N',
    openBtn: '.open-popup-N'
  });
  $(document).on('click', function () {
    popupN.close();
  });

  window.vm = new Vue({
    el: '#index',
    data: {
      activeIndex: 0,
      M: ['M1(喜)', 'M2(怒)', 'M3(哀)', 'M4(乐)']
    }
  });
})();