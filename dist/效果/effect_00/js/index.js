"use strict";

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
  'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return _get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && ((typeof call === "undefined" ? "undefined" : _typeof2(call)) === "object" || typeof call === "function")) {
      return call;
    }

    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  /**
   * @param el：朴素的DOM元素
   * @param axis：哪个方向的偏移量（'x'|'y'）
   * @returns {number} 返回一个浮点型数值
   * @作用 获取DOM元素的transform:translate量
   *
   * !!! Don't edit this !!!
   * 该函数摘自 Swiper，为了方便以后同步，请不要做任何编辑
   */

  /* eslint-disable */
  function getTranslate(el) {
    var axis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'x';
    var matrix;
    var curTransform;
    var transformMatrix;
    var curStyle = window.getComputedStyle(el, null);

    if (window.WebKitCSSMatrix) {
      curTransform = curStyle.transform || curStyle.webkitTransform;

      if (curTransform.split(',').length > 6) {
        curTransform = curTransform.split(', ').map(function (a) {
          return a.replace(',', '.');
        }).join(', ');
      } // Some old versions of Webkit choke when 'none' is passed; pass
      // empty string instead in this case


      transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    } else {
      transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
      matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
        else curTransform = parseFloat(matrix[4]);
    }

    if (axis === 'y') {
      // Latest Chrome and webkits Fix
      if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
      else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
        else curTransform = parseFloat(matrix[5]);
    }

    return curTransform || 0;
  }
  /* eslint-enable */

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
        deep = false; // Handle a deep copy situation

    if (isBoolean(target)) {
      var _ref;

      deep = target; // Skip the boolean and the target

      target = Object((_ref = i++, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]));
    }

    for (; i < arguments.length; ++i) {
      var nextSource = i < 0 || arguments.length <= i ? undefined : arguments[i]; // Skip over if null/undefined

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
  /**
   * @el jQuery对象 | DOM | 选择器
   * @event 事件类型（如 click，transitionend 等等），多个以空格分割
   * @callback 事件回调
   * @作用 改进 $.fn.one
   * @Why el 子元素的 event 事件会冒泡触发 el 的 event 事件，这不是本插件期望的效果。
   *      比如为 el 添加 click 事件，点击其子元素时也会触发 el 的 click 事件，
   *      本插件希望只在 event target 为 el 时才执行且仅执行一次事件处理器。
   */

  function triggerOnce(el, event, callback) {
    el = $(el);
    el.off(event) // 确保只绑一次
    .on(event, function (e) {
      if (e.target === el[0]) {
        // 确保回调只被执行一次
        el.off(event);
        callback();
      }
    });
  }
  /**
   * @作用 将插件需要的样式写到 <style> 里并 append 到 <head> 里
   */

  function addStyle(rules) {
    var stylesheet = document.getElementById('es6-dessert-stylesheet');

    if (!stylesheet) {
      stylesheet = document.createElement('style');
      stylesheet.setAttribute('id', 'es6-dessert-stylesheet');
      document.head.appendChild(stylesheet);
    }

    stylesheet.innerHTML += rules;
  }

  var Popup =
  /*#__PURE__*/
  function () {
    function Popup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Popup);
      var self = this;
      var conf = self.conf = {
        mask: '',
        // popup 遮罩（推荐传入 id）
        popup: '',
        // popup 内容（推荐传入 id）
        openBtn: '',
        // 打开弹窗按钮（推荐传入 class）
        closeBtn: '',
        // 关闭弹窗按钮（推荐传入 class）
        toggleBtn: '',
        // 打开/关闭按钮（推荐传入 class）
        duration: 0,
        // 动画时长
        closeOnClickMask: false,
        // 点击遮罩时是否关闭弹窗
        closeOthersOnOpen: true,
        // 打开一个弹窗时是否关闭其它弹窗
        popupStatus: '-popup-visible-',
        // 标识弹窗的状态
        activeToggleBtn: '-active-trigger-btn-',
        // 多个 toggle btn 情况
        // 回调会在动画结束之后调用
        onOpen: function onOpen() {},
        // 打开回调
        onClose: function onClose() {}
      };
      extend(true, conf, options);
      self.required();
      var popup = $(conf.popup); // 兼容对同一个 DOM 重复实例化（强烈不推荐）

      if (!popup.hasClass('-dessert-created-')) {
        popup.addClass('-dessert-created-');
        self.id = "popup_".concat(Popup.instances.length);
        Popup.instances.push(self);
        self.initEvents();
      }
    }

    _createClass(Popup, [{
      key: "initEvents",
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
        } // 此处的 toggle 第一次点击总是打开


        if (conf.toggleBtn) {
          $(document).on('click', conf.toggleBtn, function (e) {
            e.stopPropagation();
            self.event = e;
            var $this = $(this);

            if ($this.hasClass(conf.activeToggleBtn)) {
              self.toggle();
            } else {
              self.open();
              $(".".concat(conf.activeToggleBtn)).removeClass(conf.activeToggleBtn);
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
      key: "closeOthersOnOpen",
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
      key: "required",
      value: function required() {
        var self = this,
            conf = self.conf;

        if (!window.$) {
          throw "".concat(self.constructor.name, " Error: \u8BE5\u6A21\u5757\u4F9D\u8D56 jQuery \u5E93\u5E76\u4E14\u987B\u5C06 jQuery \u66B4\u9732\u4E3A\u5168\u5C40\u53D8\u91CF window.$");
        }

        if (!conf.popup) {
          throw "".concat(self.constructor.name, " Error: \u8BF7\u5728\u5B9E\u4F8B\u5316\u65F6\u6307\u5B9A popup \u9009\u9879\uFF01");
        }

        var popup = $(conf.popup);

        if (!popup.length) {
          throw "".concat(self.constructor.name, " Error: \u672A\u627E\u5230 ").concat(conf.popup, " \u5143\u7D20\uFF01");
        }

        if (popup.css('display') !== 'none') {
          throw "".concat(self.constructor.name, " Error: \u8981\u6C42 ").concat(conf.popup, " \u5143\u7D20\u5FC5\u987B\u8BBE\u7F6E\u4E3A display:none\uFF01\u5982\u679C\u9700\u8981\u5728\u9875\u9762\u52A0\u8F7D\u8FDB\u6765\u5C31\u5C55\u793A\uFF0C\u8BF7\u901A\u8FC7\u5728\u5B9E\u4F8B\u5316\u540E\u76F4\u63A5\u8C03\u7528 open \u6765\u5B9E\u73B0\uFF0C\u6BD4\u5982 new ").concat(self.constructor.name, "(options).open()");
        }

        if (conf.mask && !$(conf.mask).length) {
          throw "".concat(self.constructor.name, " Error: \u672A\u627E\u5230 ").concat(conf.mask, " \u5143\u7D20\uFF01");
        }

        if (conf.closeOnClickMask) {
          if (!conf.mask) {
            throw "".concat(self.constructor.name, " Error: closeOnClickMask \u4E3A true \u65F6\u5FC5\u987B\u4F20\u5165 mask \u9009\u9879");
          }
        }
      }
    }, {
      key: "open",
      value: function open() {
        var self = this;
        self.closeOthersOnOpen();
      }
    }, {
      key: "close",
      value: function close() {}
    }, {
      key: "toggle",
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

  var NormalPopup =
  /*#__PURE__*/
  function (_Popup) {
    _inherits(NormalPopup, _Popup);

    function NormalPopup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, NormalPopup);
      return _possibleConstructorReturn(this, (NormalPopup.__proto__ || Object.getPrototypeOf(NormalPopup)).call(this, options));
    }

    _createClass(NormalPopup, [{
      key: "open",
      value: function open() {
        var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        _get(NormalPopup.prototype.__proto__ || Object.getPrototypeOf(NormalPopup.prototype), "open", this).call(this);
        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);

        if (!popup.hasClass(conf.popupStatus)) {
          mask.stop(true).clearQueue().fadeIn(conf.duration);
          popup.stop(true).clearQueue().addClass(conf.popupStatus).fadeIn(conf.duration, function () {
            /*
             * 回调总是在打开/关闭动画结束之后被调用的，但是某些阻塞页面渲染的
             * 操作（比如 window.alert）可能会阻止弹窗显现，导致看上去回调
             * 像是在打开/关闭动画之前执行的。如果想避免这种情况，可在回调中使
             * 用 setTimeout 延迟执行这些阻塞操作。
             */
            conf.onOpen.call(self);
            onOpen.call(self);
          });
        }

        return self;
      }
    }, {
      key: "close",
      value: function close() {
        var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        _get(NormalPopup.prototype.__proto__ || Object.getPrototypeOf(NormalPopup.prototype), "close", this).call(this);
        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);

        if (popup.hasClass(conf.popupStatus)) {
          mask.stop(true).clearQueue().fadeOut(conf.duration);
          popup.removeClass(conf.popupStatus).stop(true).clearQueue().fadeOut(conf.duration, function () {
            conf.onClose.call(self);
            onClose.call(self);
          });
        }

        return self;
      }
    }]);
    return NormalPopup;
  }(Popup);

  var requiredSlidePopupStyle = "\n.es6Dessert-SlidePopup{\n  position: fixed !important;\n  top: auto !important;\n  bottom: 0 !important;\n  width: 100%;\n  margin-bottom: 0 !important;\n  -webkit-transform: translate3d(0,100%,0);\n  transform: translate3d(0,100%,0);\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: transform;\n  transition-property: transform,-webkit-transform;\n}";
  var requiredFloorStyle = "\n.es6Dessert-Floor-container{\n  position: relative !important;\n  overflow: hidden !important;\n}\n";

  addStyle(requiredSlidePopupStyle);
  /**
   * 底部浮现弹窗
   */

  var transitionEndEvent = 'webkitTransitionEnd transitionend';

  function setTransform(el, val, transitionDuration) {
    el = $(el);
    el.css({
      webkitTransform: val,
      transform: val,
      transitionDuration: "".concat(transitionDuration, "ms")
    });
  }

  var SlidePopup =
  /*#__PURE__*/
  function (_Popup) {
    _inherits(SlidePopup, _Popup);

    function SlidePopup(config) {
      var _this;

      _classCallCheck(this, SlidePopup);
      config.duration = config.duration || 300;
      _this = _possibleConstructorReturn(this, (SlidePopup.__proto__ || Object.getPrototypeOf(SlidePopup)).call(this, config));
      var self = _assertThisInitialized(_this),
          conf = self.conf,
          popup = $(conf.popup);
      popup.addClass('es6Dessert-SlidePopup');
      return _this;
    }

    _createClass(SlidePopup, [{
      key: "required",
      value: function required() {
        _get(SlidePopup.prototype.__proto__ || Object.getPrototypeOf(SlidePopup.prototype), "required", this).call(this);
        var self = this,
            conf = self.conf,
            popup = $(conf.popup);
        /*
         * 不允许在 popup 上设置 transform 样式
         */

        var popupTransform = popup.css('transform'); // display:none 元素是拿不到 transform 值的，
        // 因此以迅雷不及掩耳盗铃铛之势快速 show 和 hide 一下，
        // 这不会引起浏览器的重绘，所以页面不会发生闪烁

        if (popup.css('display') === 'none') {
          popup.show();
          popupTransform = popup.css('transform');
          popup.hide();
        }

        if (popupTransform !== 'none') {
          console.error("[".concat(self.constructor.name, " warn]: \u8BE5\u63D2\u4EF6\u57FA\u4E8E transform \u5236\u9020\u52A8\u753B\uFF0C\u5C06\u8986\u76D6\u5DF2\u6709\u7684 transform \u503C\uFF0C\u56E0\u6B64\u4E0D\u5141\u8BB8\u5728 ").concat(conf.popup, " \u5143\u7D20\u4E0A\u8BBE\u7F6E transform \u6837\u5F0F\uFF0C\u8BF7\u91CD\u65B0\u7EC4\u7EC7\u60A8\u7684 html \u548C css \u7ED3\u6784\uFF01"));
        }
      }
    }, {
      key: "open",
      value: function open() {
        var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        _get(SlidePopup.prototype.__proto__ || Object.getPrototypeOf(SlidePopup.prototype), "open", this).call(this);
        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);

        if (!popup.hasClass(conf.popupStatus)) {
          // display:none 元素的 transform 值总是为 none，因此 getTranslate 方法是拿不到 display:none 元素的偏移量的，
          // 所以先把弹窗 show 出来
          popup.show(); // 根据偏移量去计算动画时长，因为弹窗并不总是从最底下冉冉升起的

          var popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
              percent = popupTranslate / popup.outerHeight(),
              duration = Math.round(conf.duration * percent);
          mask.stop(true).clearQueue().fadeIn(duration); // 更新弹窗状态

          popup.addClass(conf.popupStatus);
          setTransform(popup, 'translate3d(0,0,0)', duration);
          triggerOnce(popup, transitionEndEvent, function () {
            conf.onOpen.call(self);
            onOpen.call(self);
          });
        }

        return self;
      }
    }, {
      key: "close",
      value: function close() {
        var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        _get(SlidePopup.prototype.__proto__ || Object.getPrototypeOf(SlidePopup.prototype), "close", this).call(this);
        var self = this,
            conf = self.conf,
            popup = $(conf.popup),
            mask = $(conf.mask);

        if (popup.hasClass(conf.popupStatus)) {
          var popupTranslate = Math.abs(getTranslate(popup[0], 'y')),
              percent = 1 - popupTranslate / popup.outerHeight(),
              duration = Math.round(conf.duration * percent);
          mask.stop(true).clearQueue().fadeOut(duration);
          popup.removeClass(conf.popupStatus);
          setTransform(popup, 'translate3d(0,100%,0)', duration);
          triggerOnce(popup, transitionEndEvent, function () {
            conf.onClose.call(self);
            onClose.call(self);
          });
        }
      }
    }]);
    return SlidePopup;
  }(Popup);

  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var iscrollProbe = createCommonjsModule(function (module) {
    /*! iScroll v5.2.0 ~ (c) 2008-2016 Matteo Spinelli ~ http://cubiq.org/license */
    (function (window, document, Math) {
      var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };

      var utils = function () {
        var me = {};
        var _elementStyle = document.createElement('div').style;

        var _vendor = function () {
          var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
              transform,
              i = 0,
              l = vendors.length;

          for (; i < l; i++) {
            transform = vendors[i] + 'ransform';
            if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
          }

          return false;
        }();

        function _prefixStyle(style) {
          if (_vendor === false) return false;
          if (_vendor === '') return style;
          return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() {
          return new Date().getTime();
        };

        me.extend = function (target, obj) {
          for (var i in obj) {
            target[i] = obj[i];
          }
        };

        me.addEvent = function (el, type, fn, capture) {
          el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function (el, type, fn, capture) {
          el.removeEventListener(type, fn, !!capture);
        };

        me.prefixPointerEvent = function (pointerEvent) {
          return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(7).toUpperCase() + pointerEvent.substr(8) : pointerEvent;
        };

        me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
          var distance = current - start,
              speed = Math.abs(distance) / time,
              destination,
              duration;
          deceleration = deceleration === undefined ? 0.0006 : deceleration;
          destination = current + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
          duration = speed / deceleration;

          if (destination < lowerMargin) {
            destination = wrapperSize ? lowerMargin - wrapperSize / 2.5 * (speed / 8) : lowerMargin;
            distance = Math.abs(destination - current);
            duration = distance / speed;
          } else if (destination > 0) {
            destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + destination;
            duration = distance / speed;
          }

          return {
            destination: Math.round(destination),
            duration: duration
          };
        };

        var _transform = _prefixStyle('transform');

        me.extend(me, {
          hasTransform: _transform !== false,
          hasPerspective: _prefixStyle('perspective') in _elementStyle,
          hasTouch: 'ontouchstart' in window,
          hasPointer: !!(window.PointerEvent || window.MSPointerEvent),
          // IE10 is prefixed
          hasTransition: _prefixStyle('transition') in _elementStyle
        });
        /*
        This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        - galaxy S2 is ok
           - 2.3.6 : `AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1`
           - 4.0.4 : `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
          - galaxy S3 is badAndroid (stock brower, webview)
            `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
          - galaxy S4 is badAndroid (stock brower, webview)
            `AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30`
          - galaxy S5 is OK
            `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
          - galaxy S6 is OK
            `AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 (Chrome/)`
         */

        me.isBadAndroid = function () {
          var appVersion = window.navigator.appVersion; // Android browser is not a chrome browser.

          if (/Android/.test(appVersion) && !/Chrome\/\d/.test(appVersion)) {
            var safariVersion = appVersion.match(/Safari\/(\d+.\d)/);

            if (safariVersion && _typeof(safariVersion) === "object" && safariVersion.length >= 2) {
              return parseFloat(safariVersion[1]) < 535.19;
            } else {
              return true;
            }
          } else {
            return false;
          }
        }();

        me.extend(me.style = {}, {
          transform: _transform,
          transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
          transitionDuration: _prefixStyle('transitionDuration'),
          transitionDelay: _prefixStyle('transitionDelay'),
          transformOrigin: _prefixStyle('transformOrigin')
        });

        me.hasClass = function (e, c) {
          var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
          return re.test(e.className);
        };

        me.addClass = function (e, c) {
          if (me.hasClass(e, c)) {
            return;
          }

          var newclass = e.className.split(' ');
          newclass.push(c);
          e.className = newclass.join(' ');
        };

        me.removeClass = function (e, c) {
          if (!me.hasClass(e, c)) {
            return;
          }

          var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
          e.className = e.className.replace(re, ' ');
        };

        me.offset = function (el) {
          var left = -el.offsetLeft,
              top = -el.offsetTop; // jshint -W084

          while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
          } // jshint +W084


          return {
            left: left,
            top: top
          };
        };

        me.preventDefaultException = function (el, exceptions) {
          for (var i in exceptions) {
            if (exceptions[i].test(el[i])) {
              return true;
            }
          }

          return false;
        };

        me.extend(me.eventType = {}, {
          touchstart: 1,
          touchmove: 1,
          touchend: 1,
          mousedown: 2,
          mousemove: 2,
          mouseup: 2,
          pointerdown: 3,
          pointermove: 3,
          pointerup: 3,
          MSPointerDown: 3,
          MSPointerMove: 3,
          MSPointerUp: 3
        });
        me.extend(me.ease = {}, {
          quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function fn(k) {
              return k * (2 - k);
            }
          },
          circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
            // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
            fn: function fn(k) {
              return Math.sqrt(1 - --k * k);
            }
          },
          back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function fn(k) {
              var b = 4;
              return (k = k - 1) * k * ((b + 1) * k + b) + 1;
            }
          },
          bounce: {
            style: '',
            fn: function fn(k) {
              if ((k /= 1) < 1 / 2.75) {
                return 7.5625 * k * k;
              } else if (k < 2 / 2.75) {
                return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
              } else if (k < 2.5 / 2.75) {
                return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
              } else {
                return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
              }
            }
          },
          elastic: {
            style: '',
            fn: function fn(k) {
              var f = 0.22,
                  e = 0.4;

              if (k === 0) {
                return 0;
              }

              if (k == 1) {
                return 1;
              }

              return e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1;
            }
          }
        });

        me.tap = function (e, eventName) {
          var ev = document.createEvent('Event');
          ev.initEvent(eventName, true, true);
          ev.pageX = e.pageX;
          ev.pageY = e.pageY;
          e.target.dispatchEvent(ev);
        };

        me.click = function (e) {
          var target = e.target,
              ev;

          if (!/(SELECT|INPUT|TEXTAREA)/i.test(target.tagName)) {
            ev = document.createEvent('MouseEvents');
            ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
            ev._constructed = true;
            target.dispatchEvent(ev);
          }
        };

        return me;
      }();

      function IScroll(el, options) {
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style; // cache style for better performance

        this.options = {
          resizeScrollbars: true,
          mouseWheelSpeed: 20,
          snapThreshold: 0.334,
          // INSERT POINT: OPTIONS
          disablePointer: !utils.hasPointer,
          disableTouch: utils.hasPointer || !utils.hasTouch,
          disableMouse: utils.hasPointer || utils.hasTouch,
          startX: 0,
          startY: 0,
          scrollY: true,
          directionLockThreshold: 5,
          momentum: true,
          bounce: true,
          bounceTime: 600,
          bounceEasing: '',
          preventDefault: true,
          preventDefaultException: {
            tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
          },
          HWCompositing: true,
          useTransition: true,
          useTransform: true,
          bindToWrapper: typeof window.onmousedown === "undefined"
        };

        for (var i in options) {
          this.options[i] = options[i];
        } // Normalize options


        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;
        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault; // If you want eventPassthrough I have to lock one of the axes

        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX; // With eventPassthrough we also need lockDirection mechanism

        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

        if (this.options.tap === true) {
          this.options.tap = 'tap';
        }

        if (this.options.shrinkScrollbars == 'scale') {
          this.options.useTransition = false;
        }

        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

        if (this.options.probeType == 3) {
          this.options.useTransition = false;
        } // INSERT POINT: NORMALIZATION
        // Some defaults


        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {}; // INSERT POINT: DEFAULTS

        this._init();

        this.refresh();
        this.scrollTo(this.options.startX, this.options.startY);
        this.enable();
      }

      IScroll.prototype = {
        version: '5.2.0',
        _init: function _init() {
          this._initEvents();

          if (this.options.scrollbars || this.options.indicators) {
            this._initIndicators();
          }

          if (this.options.mouseWheel) {
            this._initWheel();
          }

          if (this.options.snap) {
            this._initSnap();
          }

          if (this.options.keyBindings) {
            this._initKeys();
          } // INSERT POINT: _init
        },
        destroy: function destroy() {
          this._initEvents(true);

          clearTimeout(this.resizeTimeout);
          this.resizeTimeout = null;

          this._execEvent('destroy');
        },
        _transitionEnd: function _transitionEnd(e) {
          if (e.target != this.scroller || !this.isInTransition) {
            return;
          }

          this._transitionTime();

          if (!this.resetPosition(this.options.bounceTime)) {
            this.isInTransition = false;

            this._execEvent('scrollEnd');
          }
        },
        _start: function _start(e) {
          // React to left mouse button only
          if (utils.eventType[e.type] != 1) {
            // for button property
            // http://unixpapa.com/js/mouse.html
            var button;

            if (!e.which) {
              /* IE case */
              button = e.button < 2 ? 0 : e.button == 4 ? 1 : 2;
            } else {
              /* All others */
              button = e.button;
            }

            if (button !== 0) {
              return;
            }
          }

          if (!this.enabled || this.initiated && utils.eventType[e.type] !== this.initiated) {
            return;
          }

          if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
            e.preventDefault();
          }

          var point = e.touches ? e.touches[0] : e,
              pos;
          this.initiated = utils.eventType[e.type];
          this.moved = false;
          this.distX = 0;
          this.distY = 0;
          this.directionX = 0;
          this.directionY = 0;
          this.directionLocked = 0;
          this.startTime = utils.getTime();

          if (this.options.useTransition && this.isInTransition) {
            this._transitionTime();

            this.isInTransition = false;
            pos = this.getComputedPosition();

            this._translate(Math.round(pos.x), Math.round(pos.y));

            this._execEvent('scrollEnd');
          } else if (!this.options.useTransition && this.isAnimating) {
            this.isAnimating = false;

            this._execEvent('scrollEnd');
          }

          this.startX = this.x;
          this.startY = this.y;
          this.absStartX = this.x;
          this.absStartY = this.y;
          this.pointX = point.pageX;
          this.pointY = point.pageY;

          this._execEvent('beforeScrollStart');
        },
        _move: function _move(e) {
          if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
            return;
          }

          if (this.options.preventDefault) {
            // increases performance on Android? TODO: check!
            e.preventDefault();
          }

          var point = e.touches ? e.touches[0] : e,
              deltaX = point.pageX - this.pointX,
              deltaY = point.pageY - this.pointY,
              timestamp = utils.getTime(),
              newX,
              newY,
              absDistX,
              absDistY;
          this.pointX = point.pageX;
          this.pointY = point.pageY;
          this.distX += deltaX;
          this.distY += deltaY;
          absDistX = Math.abs(this.distX);
          absDistY = Math.abs(this.distY); // We need to move at least 10 pixels for the scrolling to initiate

          if (timestamp - this.endTime > 300 && absDistX < 10 && absDistY < 10) {
            return;
          } // If you are scrolling in one direction lock the other


          if (!this.directionLocked && !this.options.freeScroll) {
            if (absDistX > absDistY + this.options.directionLockThreshold) {
              this.directionLocked = 'h'; // lock horizontally
            } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
              this.directionLocked = 'v'; // lock vertically
            } else {
              this.directionLocked = 'n'; // no lock
            }
          }

          if (this.directionLocked == 'h') {
            if (this.options.eventPassthrough == 'vertical') {
              e.preventDefault();
            } else if (this.options.eventPassthrough == 'horizontal') {
              this.initiated = false;
              return;
            }

            deltaY = 0;
          } else if (this.directionLocked == 'v') {
            if (this.options.eventPassthrough == 'horizontal') {
              e.preventDefault();
            } else if (this.options.eventPassthrough == 'vertical') {
              this.initiated = false;
              return;
            }

            deltaX = 0;
          }

          deltaX = this.hasHorizontalScroll ? deltaX : 0;
          deltaY = this.hasVerticalScroll ? deltaY : 0;
          newX = this.x + deltaX;
          newY = this.y + deltaY; // Slow down if outside of the boundaries

          if (newX > 0 || newX < this.maxScrollX) {
            newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
          }

          if (newY > 0 || newY < this.maxScrollY) {
            newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
          }

          this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
          this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

          if (!this.moved) {
            this._execEvent('scrollStart');
          }

          this.moved = true;

          this._translate(newX, newY);
          /* REPLACE START: _move */

          if (timestamp - this.startTime > 300) {
            this.startTime = timestamp;
            this.startX = this.x;
            this.startY = this.y;

            if (this.options.probeType == 1) {
              this._execEvent('scroll');
            }
          }

          if (this.options.probeType > 1) {
            this._execEvent('scroll');
          }
          /* REPLACE END: _move */
        },
        _end: function _end(e) {
          if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
            return;
          }

          if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
            e.preventDefault();
          }

          var point = e.changedTouches ? e.changedTouches[0] : e,
              momentumX,
              momentumY,
              duration = utils.getTime() - this.startTime,
              newX = Math.round(this.x),
              newY = Math.round(this.y),
              distanceX = Math.abs(newX - this.startX),
              distanceY = Math.abs(newY - this.startY),
              time = 0,
              easing = '';
          this.isInTransition = 0;
          this.initiated = 0;
          this.endTime = utils.getTime(); // reset if we are outside of the boundaries

          if (this.resetPosition(this.options.bounceTime)) {
            return;
          }

          this.scrollTo(newX, newY); // ensures that the last position is rounded
          // we scrolled less than 10 pixels

          if (!this.moved) {
            if (this.options.tap) {
              utils.tap(e, this.options.tap);
            }

            if (this.options.click) {
              utils.click(e);
            }

            this._execEvent('scrollCancel');

            return;
          }

          if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
            this._execEvent('flick');

            return;
          } // start momentum animation if needed


          if (this.options.momentum && duration < 300) {
            momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
              destination: newX,
              duration: 0
            };
            momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
              destination: newY,
              duration: 0
            };
            newX = momentumX.destination;
            newY = momentumY.destination;
            time = Math.max(momentumX.duration, momentumY.duration);
            this.isInTransition = 1;
          }

          if (this.options.snap) {
            var snap = this._nearestSnap(newX, newY);

            this.currentPage = snap;
            time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
            newX = snap.x;
            newY = snap.y;
            this.directionX = 0;
            this.directionY = 0;
            easing = this.options.bounceEasing;
          } // INSERT POINT: _end


          if (newX != this.x || newY != this.y) {
            // change easing function when scroller goes out of the boundaries
            if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
              easing = utils.ease.quadratic;
            }

            this.scrollTo(newX, newY, time, easing);
            return;
          }

          this._execEvent('scrollEnd');
        },
        _resize: function _resize() {
          var that = this;
          clearTimeout(this.resizeTimeout);
          this.resizeTimeout = setTimeout(function () {
            that.refresh();
          }, this.options.resizePolling);
        },
        resetPosition: function resetPosition(time) {
          var x = this.x,
              y = this.y;
          time = time || 0;

          if (!this.hasHorizontalScroll || this.x > 0) {
            x = 0;
          } else if (this.x < this.maxScrollX) {
            x = this.maxScrollX;
          }

          if (!this.hasVerticalScroll || this.y > 0) {
            y = 0;
          } else if (this.y < this.maxScrollY) {
            y = this.maxScrollY;
          }

          if (x == this.x && y == this.y) {
            return false;
          }

          this.scrollTo(x, y, time, this.options.bounceEasing);
          return true;
        },
        disable: function disable() {
          this.enabled = false;
        },
        enable: function enable() {
          this.enabled = true;
        },
        refresh: function refresh() {
          this.wrapperWidth = this.wrapper.clientWidth;
          this.wrapperHeight = this.wrapper.clientHeight;
          /* REPLACE START: refresh */

          this.scrollerWidth = this.scroller.offsetWidth;
          this.scrollerHeight = this.scroller.offsetHeight;
          this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
          this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
          /* REPLACE END: refresh */

          this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
          this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

          if (!this.hasHorizontalScroll) {
            this.maxScrollX = 0;
            this.scrollerWidth = this.wrapperWidth;
          }

          if (!this.hasVerticalScroll) {
            this.maxScrollY = 0;
            this.scrollerHeight = this.wrapperHeight;
          }

          this.endTime = 0;
          this.directionX = 0;
          this.directionY = 0;
          this.wrapperOffset = utils.offset(this.wrapper);

          this._execEvent('refresh');

          this.resetPosition(); // INSERT POINT: _refresh
        },
        on: function on(type, fn) {
          if (!this._events[type]) {
            this._events[type] = [];
          }

          this._events[type].push(fn);
        },
        off: function off(type, fn) {
          if (!this._events[type]) {
            return;
          }

          var index = this._events[type].indexOf(fn);

          if (index > -1) {
            this._events[type].splice(index, 1);
          }
        },
        _execEvent: function _execEvent(type) {
          if (!this._events[type]) {
            return;
          }

          var i = 0,
              l = this._events[type].length;

          if (!l) {
            return;
          }

          for (; i < l; i++) {
            this._events[type][i].apply(this, [].slice.call(arguments, 1));
          }
        },
        scrollBy: function scrollBy(x, y, time, easing) {
          x = this.x + x;
          y = this.y + y;
          time = time || 0;
          this.scrollTo(x, y, time, easing);
        },
        scrollTo: function scrollTo(x, y, time, easing) {
          easing = easing || utils.ease.circular;
          this.isInTransition = this.options.useTransition && time > 0;
          var transitionType = this.options.useTransition && easing.style;

          if (!time || transitionType) {
            if (transitionType) {
              this._transitionTimingFunction(easing.style);

              this._transitionTime(time);
            }

            this._translate(x, y);
          } else {
            this._animate(x, y, time, easing.fn);
          }
        },
        scrollToElement: function scrollToElement(el, time, offsetX, offsetY, easing) {
          el = el.nodeType ? el : this.scroller.querySelector(el);

          if (!el) {
            return;
          }

          var pos = utils.offset(el);
          pos.left -= this.wrapperOffset.left;
          pos.top -= this.wrapperOffset.top; // if offsetX/Y are true we center the element to the screen

          if (offsetX === true) {
            offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
          }

          if (offsetY === true) {
            offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
          }

          pos.left -= offsetX || 0;
          pos.top -= offsetY || 0;
          pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
          pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
          time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;
          this.scrollTo(pos.left, pos.top, time, easing);
        },
        _transitionTime: function _transitionTime(time) {
          time = time || 0;
          var durationProp = utils.style.transitionDuration;
          this.scrollerStyle[durationProp] = time + 'ms';

          if (!time && utils.isBadAndroid) {
            this.scrollerStyle[durationProp] = '0.0001ms'; // remove 0.0001ms

            var self = this;
            rAF(function () {
              if (self.scrollerStyle[durationProp] === '0.0001ms') {
                self.scrollerStyle[durationProp] = '0s';
              }
            });
          }

          if (this.indicators) {
            for (var i = this.indicators.length; i--;) {
              this.indicators[i].transitionTime(time);
            }
          } // INSERT POINT: _transitionTime
        },
        _transitionTimingFunction: function _transitionTimingFunction(easing) {
          this.scrollerStyle[utils.style.transitionTimingFunction] = easing;

          if (this.indicators) {
            for (var i = this.indicators.length; i--;) {
              this.indicators[i].transitionTimingFunction(easing);
            }
          } // INSERT POINT: _transitionTimingFunction
        },
        _translate: function _translate(x, y) {
          if (this.options.useTransform) {
            /* REPLACE START: _translate */
            this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;
            /* REPLACE END: _translate */
          } else {
            x = Math.round(x);
            y = Math.round(y);
            this.scrollerStyle.left = x + 'px';
            this.scrollerStyle.top = y + 'px';
          }

          this.x = x;
          this.y = y;

          if (this.indicators) {
            for (var i = this.indicators.length; i--;) {
              this.indicators[i].updatePosition();
            }
          } // INSERT POINT: _translate
        },
        _initEvents: function _initEvents(remove) {
          var eventType = remove ? utils.removeEvent : utils.addEvent,
              target = this.options.bindToWrapper ? this.wrapper : window;
          eventType(window, 'orientationchange', this);
          eventType(window, 'resize', this);

          if (this.options.click) {
            eventType(this.wrapper, 'click', this, true);
          }

          if (!this.options.disableMouse) {
            eventType(this.wrapper, 'mousedown', this);
            eventType(target, 'mousemove', this);
            eventType(target, 'mousecancel', this);
            eventType(target, 'mouseup', this);
          }

          if (utils.hasPointer && !this.options.disablePointer) {
            eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
            eventType(target, utils.prefixPointerEvent('pointermove'), this);
            eventType(target, utils.prefixPointerEvent('pointercancel'), this);
            eventType(target, utils.prefixPointerEvent('pointerup'), this);
          }

          if (utils.hasTouch && !this.options.disableTouch) {
            eventType(this.wrapper, 'touchstart', this);
            eventType(target, 'touchmove', this);
            eventType(target, 'touchcancel', this);
            eventType(target, 'touchend', this);
          }

          eventType(this.scroller, 'transitionend', this);
          eventType(this.scroller, 'webkitTransitionEnd', this);
          eventType(this.scroller, 'oTransitionEnd', this);
          eventType(this.scroller, 'MSTransitionEnd', this);
        },
        getComputedPosition: function getComputedPosition() {
          var matrix = window.getComputedStyle(this.scroller, null),
              x,
              y;

          if (this.options.useTransform) {
            matrix = matrix[utils.style.transform].split(')')[0].split(', ');
            x = +(matrix[12] || matrix[4]);
            y = +(matrix[13] || matrix[5]);
          } else {
            x = +matrix.left.replace(/[^-\d.]/g, '');
            y = +matrix.top.replace(/[^-\d.]/g, '');
          }

          return {
            x: x,
            y: y
          };
        },
        _initIndicators: function _initIndicators() {
          var interactive = this.options.interactiveScrollbars,
              customStyle = typeof this.options.scrollbars != 'string',
              indicators = [],
              indicator;
          var that = this;
          this.indicators = [];

          if (this.options.scrollbars) {
            // Vertical scrollbar
            if (this.options.scrollY) {
              indicator = {
                el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                interactive: interactive,
                defaultScrollbars: true,
                customStyle: customStyle,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenX: false
              };
              this.wrapper.appendChild(indicator.el);
              indicators.push(indicator);
            } // Horizontal scrollbar


            if (this.options.scrollX) {
              indicator = {
                el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                interactive: interactive,
                defaultScrollbars: true,
                customStyle: customStyle,
                resize: this.options.resizeScrollbars,
                shrink: this.options.shrinkScrollbars,
                fade: this.options.fadeScrollbars,
                listenY: false
              };
              this.wrapper.appendChild(indicator.el);
              indicators.push(indicator);
            }
          }

          if (this.options.indicators) {
            // TODO: check concat compatibility
            indicators = indicators.concat(this.options.indicators);
          }

          for (var i = indicators.length; i--;) {
            this.indicators.push(new Indicator(this, indicators[i]));
          } // TODO: check if we can use array.map (wide compatibility and performance issues)


          function _indicatorsMap(fn) {
            if (that.indicators) {
              for (var i = that.indicators.length; i--;) {
                fn.call(that.indicators[i]);
              }
            }
          }

          if (this.options.fadeScrollbars) {
            this.on('scrollEnd', function () {
              _indicatorsMap(function () {
                this.fade();
              });
            });
            this.on('scrollCancel', function () {
              _indicatorsMap(function () {
                this.fade();
              });
            });
            this.on('scrollStart', function () {
              _indicatorsMap(function () {
                this.fade(1);
              });
            });
            this.on('beforeScrollStart', function () {
              _indicatorsMap(function () {
                this.fade(1, true);
              });
            });
          }

          this.on('refresh', function () {
            _indicatorsMap(function () {
              this.refresh();
            });
          });
          this.on('destroy', function () {
            _indicatorsMap(function () {
              this.destroy();
            });

            delete this.indicators;
          });
        },
        _initWheel: function _initWheel() {
          utils.addEvent(this.wrapper, 'wheel', this);
          utils.addEvent(this.wrapper, 'mousewheel', this);
          utils.addEvent(this.wrapper, 'DOMMouseScroll', this);
          this.on('destroy', function () {
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = null;
            utils.removeEvent(this.wrapper, 'wheel', this);
            utils.removeEvent(this.wrapper, 'mousewheel', this);
            utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
          });
        },
        _wheel: function _wheel(e) {
          if (!this.enabled) {
            return;
          }

          e.preventDefault();
          var wheelDeltaX,
              wheelDeltaY,
              newX,
              newY,
              that = this;

          if (this.wheelTimeout === undefined) {
            that._execEvent('scrollStart');
          } // Execute the scrollEnd event after 400ms the wheel stopped scrolling


          clearTimeout(this.wheelTimeout);
          this.wheelTimeout = setTimeout(function () {
            if (!that.options.snap) {
              that._execEvent('scrollEnd');
            }

            that.wheelTimeout = undefined;
          }, 400);

          if ('deltaX' in e) {
            if (e.deltaMode === 1) {
              wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
              wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
            } else {
              wheelDeltaX = -e.deltaX;
              wheelDeltaY = -e.deltaY;
            }
          } else if ('wheelDeltaX' in e) {
            wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
            wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
          } else if ('wheelDelta' in e) {
            wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
          } else if ('detail' in e) {
            wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
          } else {
            return;
          }

          wheelDeltaX *= this.options.invertWheelDirection;
          wheelDeltaY *= this.options.invertWheelDirection;

          if (!this.hasVerticalScroll) {
            wheelDeltaX = wheelDeltaY;
            wheelDeltaY = 0;
          }

          if (this.options.snap) {
            newX = this.currentPage.pageX;
            newY = this.currentPage.pageY;

            if (wheelDeltaX > 0) {
              newX--;
            } else if (wheelDeltaX < 0) {
              newX++;
            }

            if (wheelDeltaY > 0) {
              newY--;
            } else if (wheelDeltaY < 0) {
              newY++;
            }

            this.goToPage(newX, newY);
            return;
          }

          newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
          newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);
          this.directionX = wheelDeltaX > 0 ? -1 : wheelDeltaX < 0 ? 1 : 0;
          this.directionY = wheelDeltaY > 0 ? -1 : wheelDeltaY < 0 ? 1 : 0;

          if (newX > 0) {
            newX = 0;
          } else if (newX < this.maxScrollX) {
            newX = this.maxScrollX;
          }

          if (newY > 0) {
            newY = 0;
          } else if (newY < this.maxScrollY) {
            newY = this.maxScrollY;
          }

          this.scrollTo(newX, newY, 0);

          if (this.options.probeType > 1) {
            this._execEvent('scroll');
          } // INSERT POINT: _wheel
        },
        _initSnap: function _initSnap() {
          this.currentPage = {};

          if (typeof this.options.snap == 'string') {
            this.options.snap = this.scroller.querySelectorAll(this.options.snap);
          }

          this.on('refresh', function () {
            var i = 0,
                l,
                m = 0,
                n,
                cx,
                cy,
                x = 0,
                y,
                stepX = this.options.snapStepX || this.wrapperWidth,
                stepY = this.options.snapStepY || this.wrapperHeight,
                el;
            this.pages = [];

            if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
              return;
            }

            if (this.options.snap === true) {
              cx = Math.round(stepX / 2);
              cy = Math.round(stepY / 2);

              while (x > -this.scrollerWidth) {
                this.pages[i] = [];
                l = 0;
                y = 0;

                while (y > -this.scrollerHeight) {
                  this.pages[i][l] = {
                    x: Math.max(x, this.maxScrollX),
                    y: Math.max(y, this.maxScrollY),
                    width: stepX,
                    height: stepY,
                    cx: x - cx,
                    cy: y - cy
                  };
                  y -= stepY;
                  l++;
                }

                x -= stepX;
                i++;
              }
            } else {
              el = this.options.snap;
              l = el.length;
              n = -1;

              for (; i < l; i++) {
                if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                  m = 0;
                  n++;
                }

                if (!this.pages[m]) {
                  this.pages[m] = [];
                }

                x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                y = Math.max(-el[i].offsetTop, this.maxScrollY);
                cx = x - Math.round(el[i].offsetWidth / 2);
                cy = y - Math.round(el[i].offsetHeight / 2);
                this.pages[m][n] = {
                  x: x,
                  y: y,
                  width: el[i].offsetWidth,
                  height: el[i].offsetHeight,
                  cx: cx,
                  cy: cy
                };

                if (x > this.maxScrollX) {
                  m++;
                }
              }
            }

            this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0); // Update snap threshold if needed

            if (this.options.snapThreshold % 1 === 0) {
              this.snapThresholdX = this.options.snapThreshold;
              this.snapThresholdY = this.options.snapThreshold;
            } else {
              this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
              this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
            }
          });
          this.on('flick', function () {
            var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1000), Math.min(Math.abs(this.y - this.startY), 1000)), 300);
            this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time);
          });
        },
        _nearestSnap: function _nearestSnap(x, y) {
          if (!this.pages.length) {
            return {
              x: 0,
              y: 0,
              pageX: 0,
              pageY: 0
            };
          }

          var i = 0,
              l = this.pages.length,
              m = 0; // Check if we exceeded the snap threshold

          if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
            return this.currentPage;
          }

          if (x > 0) {
            x = 0;
          } else if (x < this.maxScrollX) {
            x = this.maxScrollX;
          }

          if (y > 0) {
            y = 0;
          } else if (y < this.maxScrollY) {
            y = this.maxScrollY;
          }

          for (; i < l; i++) {
            if (x >= this.pages[i][0].cx) {
              x = this.pages[i][0].x;
              break;
            }
          }

          l = this.pages[i].length;

          for (; m < l; m++) {
            if (y >= this.pages[0][m].cy) {
              y = this.pages[0][m].y;
              break;
            }
          }

          if (i == this.currentPage.pageX) {
            i += this.directionX;

            if (i < 0) {
              i = 0;
            } else if (i >= this.pages.length) {
              i = this.pages.length - 1;
            }

            x = this.pages[i][0].x;
          }

          if (m == this.currentPage.pageY) {
            m += this.directionY;

            if (m < 0) {
              m = 0;
            } else if (m >= this.pages[0].length) {
              m = this.pages[0].length - 1;
            }

            y = this.pages[0][m].y;
          }

          return {
            x: x,
            y: y,
            pageX: i,
            pageY: m
          };
        },
        goToPage: function goToPage(x, y, time, easing) {
          easing = easing || this.options.bounceEasing;

          if (x >= this.pages.length) {
            x = this.pages.length - 1;
          } else if (x < 0) {
            x = 0;
          }

          if (y >= this.pages[x].length) {
            y = this.pages[x].length - 1;
          } else if (y < 0) {
            y = 0;
          }

          var posX = this.pages[x][y].x,
              posY = this.pages[x][y].y;
          time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;
          this.currentPage = {
            x: posX,
            y: posY,
            pageX: x,
            pageY: y
          };
          this.scrollTo(posX, posY, time, easing);
        },
        next: function next(time, easing) {
          var x = this.currentPage.pageX,
              y = this.currentPage.pageY;
          x++;

          if (x >= this.pages.length && this.hasVerticalScroll) {
            x = 0;
            y++;
          }

          this.goToPage(x, y, time, easing);
        },
        prev: function prev(time, easing) {
          var x = this.currentPage.pageX,
              y = this.currentPage.pageY;
          x--;

          if (x < 0 && this.hasVerticalScroll) {
            x = 0;
            y--;
          }

          this.goToPage(x, y, time, easing);
        },
        _initKeys: function _initKeys(e) {
          // default key bindings
          var keys = {
            pageUp: 33,
            pageDown: 34,
            end: 35,
            home: 36,
            left: 37,
            up: 38,
            right: 39,
            down: 40
          };
          var i; // if you give me characters I give you keycode

          if (_typeof(this.options.keyBindings) == 'object') {
            for (i in this.options.keyBindings) {
              if (typeof this.options.keyBindings[i] == 'string') {
                this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
              }
            }
          } else {
            this.options.keyBindings = {};
          }

          for (i in keys) {
            this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
          }

          utils.addEvent(window, 'keydown', this);
          this.on('destroy', function () {
            utils.removeEvent(window, 'keydown', this);
          });
        },
        _key: function _key(e) {
          if (!this.enabled) {
            return;
          }

          var snap = this.options.snap,

          // we are using this alot, better to cache it
          newX = snap ? this.currentPage.pageX : this.x,
              newY = snap ? this.currentPage.pageY : this.y,
              now = utils.getTime(),
              prevTime = this.keyTime || 0,
              acceleration = 0.250,
              pos;

          if (this.options.useTransition && this.isInTransition) {
            pos = this.getComputedPosition();

            this._translate(Math.round(pos.x), Math.round(pos.y));

            this.isInTransition = false;
          }

          this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

          switch (e.keyCode) {
            case this.options.keyBindings.pageUp:
              if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                newX += snap ? 1 : this.wrapperWidth;
              } else {
                newY += snap ? 1 : this.wrapperHeight;
              }

              break;

            case this.options.keyBindings.pageDown:
              if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                newX -= snap ? 1 : this.wrapperWidth;
              } else {
                newY -= snap ? 1 : this.wrapperHeight;
              }

              break;

            case this.options.keyBindings.end:
              newX = snap ? this.pages.length - 1 : this.maxScrollX;
              newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
              break;

            case this.options.keyBindings.home:
              newX = 0;
              newY = 0;
              break;

            case this.options.keyBindings.left:
              newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
              break;

            case this.options.keyBindings.up:
              newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
              break;

            case this.options.keyBindings.right:
              newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
              break;

            case this.options.keyBindings.down:
              newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
              break;

            default:
              return;
          }

          if (snap) {
            this.goToPage(newX, newY);
            return;
          }

          if (newX > 0) {
            newX = 0;
            this.keyAcceleration = 0;
          } else if (newX < this.maxScrollX) {
            newX = this.maxScrollX;
            this.keyAcceleration = 0;
          }

          if (newY > 0) {
            newY = 0;
            this.keyAcceleration = 0;
          } else if (newY < this.maxScrollY) {
            newY = this.maxScrollY;
            this.keyAcceleration = 0;
          }

          this.scrollTo(newX, newY, 0);
          this.keyTime = now;
        },
        _animate: function _animate(destX, destY, duration, easingFn) {
          var that = this,
              startX = this.x,
              startY = this.y,
              startTime = utils.getTime(),
              destTime = startTime + duration;

          function step() {
            var now = utils.getTime(),
                newX,
                newY,
                easing;

            if (now >= destTime) {
              that.isAnimating = false;

              that._translate(destX, destY);

              if (!that.resetPosition(that.options.bounceTime)) {
                that._execEvent('scrollEnd');
              }

              return;
            }

            now = (now - startTime) / duration;
            easing = easingFn(now);
            newX = (destX - startX) * easing + startX;
            newY = (destY - startY) * easing + startY;

            that._translate(newX, newY);

            if (that.isAnimating) {
              rAF(step);
            }

            if (that.options.probeType == 3) {
              that._execEvent('scroll');
            }
          }

          this.isAnimating = true;
          step();
        },
        handleEvent: function handleEvent(e) {
          switch (e.type) {
            case 'touchstart':
            case 'pointerdown':
            case 'MSPointerDown':
            case 'mousedown':
              this._start(e);

              break;

            case 'touchmove':
            case 'pointermove':
            case 'MSPointerMove':
            case 'mousemove':
              this._move(e);

              break;

            case 'touchend':
            case 'pointerup':
            case 'MSPointerUp':
            case 'mouseup':
            case 'touchcancel':
            case 'pointercancel':
            case 'MSPointerCancel':
            case 'mousecancel':
              this._end(e);

              break;

            case 'orientationchange':
            case 'resize':
              this._resize();

              break;

            case 'transitionend':
            case 'webkitTransitionEnd':
            case 'oTransitionEnd':
            case 'MSTransitionEnd':
              this._transitionEnd(e);

              break;

            case 'wheel':
            case 'DOMMouseScroll':
            case 'mousewheel':
              this._wheel(e);

              break;

            case 'keydown':
              this._key(e);

              break;

            case 'click':
              if (this.enabled && !e._constructed) {
                e.preventDefault();
                e.stopPropagation();
              }

              break;
          }
        }
      };

      function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');

        if (type === true) {
          scrollbar.style.cssText = 'position:absolute;z-index:9999';
          indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
        }

        indicator.className = 'iScrollIndicator';

        if (direction == 'h') {
          if (type === true) {
            scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
            indicator.style.height = '100%';
          }

          scrollbar.className = 'iScrollHorizontalScrollbar';
        } else {
          if (type === true) {
            scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
            indicator.style.width = '100%';
          }

          scrollbar.className = 'iScrollVerticalScrollbar';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        if (!interactive) {
          scrollbar.style.pointerEvents = 'none';
        }

        scrollbar.appendChild(indicator);
        return scrollbar;
      }

      function Indicator(scroller, options) {
        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;
        this.options = {
          listenX: true,
          listenY: true,
          interactive: false,
          resize: true,
          defaultScrollbars: false,
          shrink: false,
          fade: false,
          speedRatioX: 0,
          speedRatioY: 0
        };

        for (var i in options) {
          this.options[i] = options[i];
        }

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.interactive) {
          if (!this.options.disableTouch) {
            utils.addEvent(this.indicator, 'touchstart', this);
            utils.addEvent(window, 'touchend', this);
          }

          if (!this.options.disablePointer) {
            utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
            utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
          }

          if (!this.options.disableMouse) {
            utils.addEvent(this.indicator, 'mousedown', this);
            utils.addEvent(window, 'mouseup', this);
          }
        }

        if (this.options.fade) {
          this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
          var durationProp = utils.style.transitionDuration;
          this.wrapperStyle[durationProp] = utils.isBadAndroid ? '0.0001ms' : '0ms'; // remove 0.0001ms

          var self = this;

          if (utils.isBadAndroid) {
            rAF(function () {
              if (self.wrapperStyle[durationProp] === '0.0001ms') {
                self.wrapperStyle[durationProp] = '0s';
              }
            });
          }

          this.wrapperStyle.opacity = '0';
        }
      }

      Indicator.prototype = {
        handleEvent: function handleEvent(e) {
          switch (e.type) {
            case 'touchstart':
            case 'pointerdown':
            case 'MSPointerDown':
            case 'mousedown':
              this._start(e);

              break;

            case 'touchmove':
            case 'pointermove':
            case 'MSPointerMove':
            case 'mousemove':
              this._move(e);

              break;

            case 'touchend':
            case 'pointerup':
            case 'MSPointerUp':
            case 'mouseup':
            case 'touchcancel':
            case 'pointercancel':
            case 'MSPointerCancel':
            case 'mousecancel':
              this._end(e);

              break;
          }
        },
        destroy: function destroy() {
          if (this.options.fadeScrollbars) {
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;
          }

          if (this.options.interactive) {
            utils.removeEvent(this.indicator, 'touchstart', this);
            utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
            utils.removeEvent(this.indicator, 'mousedown', this);
            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);
            utils.removeEvent(window, 'touchend', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
            utils.removeEvent(window, 'mouseup', this);
          }

          if (this.options.defaultScrollbars) {
            this.wrapper.parentNode.removeChild(this.wrapper);
          }
        },
        _start: function _start(e) {
          var point = e.touches ? e.touches[0] : e;
          e.preventDefault();
          e.stopPropagation();
          this.transitionTime();
          this.initiated = true;
          this.moved = false;
          this.lastPointX = point.pageX;
          this.lastPointY = point.pageY;
          this.startTime = utils.getTime();

          if (!this.options.disableTouch) {
            utils.addEvent(window, 'touchmove', this);
          }

          if (!this.options.disablePointer) {
            utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
          }

          if (!this.options.disableMouse) {
            utils.addEvent(window, 'mousemove', this);
          }

          this.scroller._execEvent('beforeScrollStart');
        },
        _move: function _move(e) {
          var point = e.touches ? e.touches[0] : e,
              deltaX,
              deltaY,
              newX,
              newY,
              timestamp = utils.getTime();

          if (!this.moved) {
            this.scroller._execEvent('scrollStart');
          }

          this.moved = true;
          deltaX = point.pageX - this.lastPointX;
          this.lastPointX = point.pageX;
          deltaY = point.pageY - this.lastPointY;
          this.lastPointY = point.pageY;
          newX = this.x + deltaX;
          newY = this.y + deltaY;

          this._pos(newX, newY);

          if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
            this.startTime = timestamp;

            this.scroller._execEvent('scroll');
          } else if (this.scroller.options.probeType > 1) {
            this.scroller._execEvent('scroll');
          } // INSERT POINT: indicator._move


          e.preventDefault();
          e.stopPropagation();
        },
        _end: function _end(e) {
          if (!this.initiated) {
            return;
          }

          this.initiated = false;
          e.preventDefault();
          e.stopPropagation();
          utils.removeEvent(window, 'touchmove', this);
          utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
          utils.removeEvent(window, 'mousemove', this);

          if (this.scroller.options.snap) {
            var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

            var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);

            if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
              this.scroller.directionX = 0;
              this.scroller.directionY = 0;
              this.scroller.currentPage = snap;
              this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
            }
          }

          if (this.moved) {
            this.scroller._execEvent('scrollEnd');
          }
        },
        transitionTime: function transitionTime(time) {
          time = time || 0;
          var durationProp = utils.style.transitionDuration;
          this.indicatorStyle[durationProp] = time + 'ms';

          if (!time && utils.isBadAndroid) {
            this.indicatorStyle[durationProp] = '0.0001ms'; // remove 0.0001ms

            var self = this;
            rAF(function () {
              if (self.indicatorStyle[durationProp] === '0.0001ms') {
                self.indicatorStyle[durationProp] = '0s';
              }
            });
          }
        },
        transitionTimingFunction: function transitionTimingFunction(easing) {
          this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },
        refresh: function refresh() {
          this.transitionTime();

          if (this.options.listenX && !this.options.listenY) {
            this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
          } else if (this.options.listenY && !this.options.listenX) {
            this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
          } else {
            this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
          }

          if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
            utils.addClass(this.wrapper, 'iScrollBothScrollbars');
            utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

            if (this.options.defaultScrollbars && this.options.customStyle) {
              if (this.options.listenX) {
                this.wrapper.style.right = '8px';
              } else {
                this.wrapper.style.bottom = '8px';
              }
            }
          } else {
            utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
            utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

            if (this.options.defaultScrollbars && this.options.customStyle) {
              if (this.options.listenX) {
                this.wrapper.style.right = '2px';
              } else {
                this.wrapper.style.bottom = '2px';
              }
            }
          }

          if (this.options.listenX) {
            this.wrapperWidth = this.wrapper.clientWidth;

            if (this.options.resize) {
              this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
              this.indicatorStyle.width = this.indicatorWidth + 'px';
            } else {
              this.indicatorWidth = this.indicator.clientWidth;
            }

            this.maxPosX = this.wrapperWidth - this.indicatorWidth;

            if (this.options.shrink == 'clip') {
              this.minBoundaryX = -this.indicatorWidth + 8;
              this.maxBoundaryX = this.wrapperWidth - 8;
            } else {
              this.minBoundaryX = 0;
              this.maxBoundaryX = this.maxPosX;
            }

            this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX;
          }

          if (this.options.listenY) {
            this.wrapperHeight = this.wrapper.clientHeight;

            if (this.options.resize) {
              this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
              this.indicatorStyle.height = this.indicatorHeight + 'px';
            } else {
              this.indicatorHeight = this.indicator.clientHeight;
            }

            this.maxPosY = this.wrapperHeight - this.indicatorHeight;

            if (this.options.shrink == 'clip') {
              this.minBoundaryY = -this.indicatorHeight + 8;
              this.maxBoundaryY = this.wrapperHeight - 8;
            } else {
              this.minBoundaryY = 0;
              this.maxBoundaryY = this.maxPosY;
            }

            this.maxPosY = this.wrapperHeight - this.indicatorHeight;
            this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY;
          }

          this.updatePosition();
        },
        updatePosition: function updatePosition() {
          var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
              y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

          if (!this.options.ignoreBoundaries) {
            if (x < this.minBoundaryX) {
              if (this.options.shrink == 'scale') {
                this.width = Math.max(this.indicatorWidth + x, 8);
                this.indicatorStyle.width = this.width + 'px';
              }

              x = this.minBoundaryX;
            } else if (x > this.maxBoundaryX) {
              if (this.options.shrink == 'scale') {
                this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                this.indicatorStyle.width = this.width + 'px';
                x = this.maxPosX + this.indicatorWidth - this.width;
              } else {
                x = this.maxBoundaryX;
              }
            } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
              this.width = this.indicatorWidth;
              this.indicatorStyle.width = this.width + 'px';
            }

            if (y < this.minBoundaryY) {
              if (this.options.shrink == 'scale') {
                this.height = Math.max(this.indicatorHeight + y * 3, 8);
                this.indicatorStyle.height = this.height + 'px';
              }

              y = this.minBoundaryY;
            } else if (y > this.maxBoundaryY) {
              if (this.options.shrink == 'scale') {
                this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                this.indicatorStyle.height = this.height + 'px';
                y = this.maxPosY + this.indicatorHeight - this.height;
              } else {
                y = this.maxBoundaryY;
              }
            } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
              this.height = this.indicatorHeight;
              this.indicatorStyle.height = this.height + 'px';
            }
          }

          this.x = x;
          this.y = y;

          if (this.scroller.options.useTransform) {
            this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
          } else {
            this.indicatorStyle.left = x + 'px';
            this.indicatorStyle.top = y + 'px';
          }
        },
        _pos: function _pos(x, y) {
          if (x < 0) {
            x = 0;
          } else if (x > this.maxPosX) {
            x = this.maxPosX;
          }

          if (y < 0) {
            y = 0;
          } else if (y > this.maxPosY) {
            y = this.maxPosY;
          }

          x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
          y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;
          this.scroller.scrollTo(x, y);
        },
        fade: function fade(val, hold) {
          if (hold && !this.visible) {
            return;
          }

          clearTimeout(this.fadeTimeout);
          this.fadeTimeout = null;
          var time = val ? 250 : 500,
              delay = val ? 0 : 300;
          val = val ? '1' : '0';
          this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';
          this.fadeTimeout = setTimeout(function (val) {
            this.wrapperStyle.opacity = val;
            this.visible = +val;
          }.bind(this, val), delay);
        }
      };
      IScroll.utils = utils;

      if ('object' != 'undefined' && module.exports) {
        module.exports = IScroll;
      } else if (typeof undefined == 'function' && undefined.amd) {
        undefined(function () {
          return IScroll;
        });
      } else {
        window.IScroll = IScroll;
      }
    })(window, document, Math);
  });

  addStyle(requiredFloorStyle);

  var Floor =
  /*#__PURE__*/
  function () {
    function Floor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, Floor);
      var self = this;
      var conf = self.conf = {
        container: '',
        itemClass: '',
        baseline: 0.5,
        baselineDebug: false,
        iscroll: {
          probeType: 3,
          mouseWheel: true,
          scrollbars: true,
          fadeScrollbars: true,
          interactiveScrollbars: true,
          shrinkScrollbars: 'scale',
          bounce: false
        },
        onFloorChange: function onFloorChange() {}
      };
      extend(true, conf, options);
      self.required();
      var container = $(conf.container); // 兼容对同一个 DOM 重复实例化（强烈不推荐）

      if (!container.hasClass('-dessert-created-')) {
        container.addClass('-dessert-created-');
        self.id = "floor_".concat(Floor.instances.length);
        Floor.instances.push(self); // 事件开关，用于在 api 滚动时关闭事件监听

        self.eventSwitches = {};
        self.initIScroll();
      }
    }

    _createClass(Floor, [{
      key: "required",
      value: function required() {
        var self = this,
            conf = self.conf,
            container = $(conf.container);

        if (!window.$) {
          throw "".concat(self.constructor.name, " Error: \u8BE5\u6A21\u5757\u4F9D\u8D56 jQuery \u5E93\u5E76\u4E14\u987B\u5C06 jQuery \u66B4\u9732\u4E3A\u5168\u5C40\u53D8\u91CF window.$");
        }

        if (!conf.container) {
          throw "".concat(self.constructor.name, " Error: \u8BF7\u5728\u5B9E\u4F8B\u5316\u65F6\u6307\u5B9A container \u9009\u9879\uFF01");
        }

        if (!container.length) {
          throw "".concat(self.constructor.name, " Error: \u672A\u627E\u5230 ").concat(conf.container, " \u5143\u7D20\uFF01");
        }

        var invisibleError = "".concat(self.constructor.name, " Error: \u4F60\u5B9E\u4F8B\u5316 Floor \u7684\u65F6\u673A\u5FC5\u987B\u662F\u5728 ").concat(conf.container, " \u5143\u7D20\u53EF\u89C1\u540E\uFF0C\u5373 ").concat(conf.container, " \u5143\u7D20\u53CA\u5176\u6240\u6709\u7956\u5148\u5143\u7D20\u7684 display \u5C5E\u6027\u90FD\u4E0D\u4E3A none \u540E\uFF01");

        if (container.css('display') === 'none') {
          throw invisibleError;
        }

        container.parents().each(function () {
          if ($(this).css('display') === 'none') {
            throw invisibleError;
          }
        });
      }
      /**
       * @description 初始化 IScroll，主要是监听 scroll 事件及处理回调执行时机
       */

    }, {
      key: "initIScroll",
      value: function initIScroll() {
        var self = this,
            conf = self.conf,
            container = $(conf.container),
            wrapper = container.children().eq(0);
        container.addClass('es6Dessert-Floor-container');

        if (conf.baselineDebug) {
          var lineStyle = "\n        position: absolute;\n        z-index: 1;\n        width: 100%;\n        top: ".concat(conf.baseline * 100, "%;\n        left: 0;\n        border-bottom: 1px dashed #000;\n      ");
          container.append("<div style=\"".concat(lineStyle, "\"></div>"));
        }

        self.scroller = new iscrollProbe(conf.container, conf.iscroll);
        self.activeIndex = 0;
        self._activeIndex = -1;

        function calculateActiveFloor() {
          wrapper.children(conf.itemClass).each(function (index, el) {
            /* $.fn.offset 方法是不包含 margin 的，因此定位逻辑就是：
             * 当 floor 距容器顶部(包含padding和border)的距离小于基准线距容器顶部的距离时，
             * 即floor滑到了基准线上方，此 floor 变为 activeFloor。
             * 也即基准线穿过的楼层即是焦点楼层。
             */
            if ($(el).offset().top - container.offset().top < parseFloat(container.css('border-top-width')) + container.innerHeight() * conf.baseline) {
              self.activeIndex = index;
            }
          });
        }

        function floorChangeCallback() {
          if (self.activeIndex !== self._activeIndex) {
            self._activeIndex = self.activeIndex;
            conf.onFloorChange.call(self);
          }
        }

        calculateActiveFloor();
        floorChangeCallback(); // 始终计算当前楼层

        self.scroller.on('scroll', calculateActiveFloor); // 控制 floorChange 回调触发

        self.on('scroll', floorChangeCallback).stopListen('scroll');
        self.on('scrollStart', function () {
          self.resumeListen('scroll');
        });
        self.on('scrollEnd', function () {
          self.stopListen('scroll');
        });
      }
      /**
       * @param y [required]<Number> 滚动指定数量像素 scrollTo(100) | 相对现在位置滚动指定数量像素 scrollTo('+100') | 滚动到指定元素 scrollTo('#target-floor')
       * @param rest 可选的配置项
       *    time [optional]<Number> 单位毫秒(ms)
       *    easing [optional]<String> 以下值之一：quadratic | circular | back | bounce | elastic
       *    offsetY [optional]<Number> 用于在【滚动到指定元素】时再偏移指定个像素
       *
       * @description 垂直方向上滚动指定个单位，与 iscroll API 相反，正值向下滚动，负值向上滚动
       * @BestPractice iscroll.js 的 scrollToElement 方法对可滚动的区域做了限制，这是一般需求所期望的，并且 offsetY 的 true 值可居中。
       *    所以如果需要滚动到指定位置，请尽可能地优先使用它。scrollTo 和 scrollBy 想滚到哪就能滚到哪，这通常不是所预想的。除了 scrollTo(0)
       *    我实在想不出还有什么理由去使用它。
       */

    }, {
      key: "scrollTo",
      value: function scrollTo(y) {
        for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          rest[_key - 1] = arguments[_key];
        }

        var self = this; // 如果不停止可能导致 iscroll 在用户滑动后 momentum 时行为异常

        self.stopListen('scroll'); // container 元素位置上的变化会导致定位错误（貌似只影响 api 滚动，手指滑动是没问题的），因此每次在这里 refresh 一下。至于元素内部发生变化，那就没办法了，只能用户手动 refresh 咯

        self.scroller.refresh(); // frozen iscroll，在连续调用 scrollTo 之前清掉未完成的动画，防止相互影响，类似于 $.fn.stop(true).clearQueue()

        clearTimeout(self.scrollToTimer);
        self.scroller.isAnimating = false;
        self.scrollToTimer = setTimeout(function () {
          var _parseArgs = parseArgs(rest),
              time = _parseArgs.time,
              easing = _parseArgs.easing,
              offsetY = _parseArgs.offsetY;

          if (/^\d+$/.test(y)) {
            // scrollTo(x, y, time, easing)
            self.scroller.scrollTo(0, -y, time, iscrollProbe.utils.ease[easing]);
          } else if (/^[+-]\d+$/.test(y)) {
            // scrollBy(x, y, time, easing)
            self.scroller.scrollBy(0, -parseFloat(y), time, iscrollProbe.utils.ease[easing]);
          } else {
            // scrollToElement(el, time, offsetX, offsetY, easing)
            self.scroller.scrollToElement($(y)[0], time, 0, offsetY, iscrollProbe.utils.ease[easing]);
          }
        }, 20); // 之所以是 20 秒，是因为 iscroll 内部的实现是 requestAnimationFrame

        return self;
      }
      /**
       * @param eventType beforeScrollStart | scrollCancel | scrollStart | scroll | scrollEnd
       * @param callback 事件回调
       * @description 封装一层 iscroll.prototype.on，使得可以监听和停止监听事件
       */

    }, {
      key: "on",
      value: function on(eventType, callback) {
        var self = this;
        self.scroller.on(eventType, function () {
          if (self.eventSwitches[eventType] !== false) {
            callback.call(self.scroller);
          }
        });
        return self;
      }
      /**
       * @param eventTypes 可同时设置多个事件（以空格或逗号分隔如'scroll scrollCancel'）
       * @description 停止触发事件监听器，需要注意的是，事件仍在触发，但句柄不在执行了，这是 on 方法做的一小层处理
       */

    }, {
      key: "stopListen",
      value: function stopListen(eventTypes) {
        var self = this;
        eventTypes.split(/[ ,]/).forEach(function (eventType) {
          self.eventSwitches[eventType] = false;
        });
        return self;
      }
      /**
       * @param eventTypes 可同时设置多个事件（以空格或逗号分隔如'scroll scrollCancel'）
       * @description 恢复触发事件监听器
       */

    }, {
      key: "resumeListen",
      value: function resumeListen(eventTypes) {
        var self = this;
        eventTypes.split(/[ ,]/).forEach(function (eventType) {
          self.eventSwitches[eventType] = true;
        });
        return self;
      }
      /**
       * @description iscroll.prototype.refresh
       */

    }, {
      key: "refresh",
      value: function refresh() {
        var self = this;
        self.scroller.refresh();
        return self;
      }
    }]);
    return Floor;
  }();

  Floor.instances = [];
  /**
   * @description 解析 scrollTo 方法的传入参数，类似于方法重载
   */

  function parseArgs(rest) {
    var res = {};

    if (rest.length) {
      var arg0 = rest[0];

      switch (getType(arg0)) {
        // floor.scrollTo(y, time)
        case 'Number':
          res.time = arg0;
          res.easing = rest[1];
          break;
        // floor.scrollTo(y, easing)

        case 'String':
          res.easing = arg0;
          break;
        // floor.scrollTo(y, {time, easing})

        case 'Object':
          extend(res, arg0);
          break;
      }
    }

    return res;
  }

  var exampleA = new Floor({
    container: '#example-A',
    baseline: 0.2,
    baselineDebug: true,
    onFloorChange: function onFloorChange() {
      $('#example-A-num').html(this.activeIndex);
    }
  });

  var floorA = new Floor({
    container: '#floor-A',
    baseline: 0.2, // 基准线，作为判断 active floor 的依据，
    baselineDebug: true, // 是否显示基准线
    onFloorChange: function onFloorChange() {
      $('#floor-A-num').html(this.activeIndex);
    }
  });

  var exampleB = new Floor({
    container: '#example-B',
    baselineDebug: true,
    onFloorChange: function onFloorChange() {
      $('#example-B-tab').children().eq(this.activeIndex).addClass('active').siblings().removeClass('active');
    }
  });

  $(document).on('click', '.example-B-tab-item', function () {
    var $this = $(this),
        $parent = $this.parent(),
        floors = $('#example-B').find('.floor-item');

    $parent.addClass('active').siblings().removeClass('active');

    floorB.scrollTo(floors.eq($parent.index()));
  });

  var floorB = new Floor({
    container: '#floor-B',
    baselineDebug: true,
    onFloorChange: function onFloorChange() {
      $('#floor-B-tab').children().eq(this.activeIndex).addClass('active').siblings().removeClass('active');
    }
  });

  $(document).on('click', '.floor-B-tab-item', function () {
    var $this = $(this),
        $parent = $this.parent(),
        floors = $('#floor-B').find('.floor-item');

    $parent.addClass('active').siblings().removeClass('active');

    floorB.scrollTo(floors.eq($parent.index()));
  });

  var floorCTab = new IScroll('#floor-C-tab', {
    scrollX: true,
    bounce: false,
    click: true
  });

  var floorC = new Floor({
    container: '#floor-C',
    baselineDebug: true,
    onFloorChange: function onFloorChange() {
      var activeTab = $('.floor-C-tab-item').eq(this.activeIndex);

      floorCTab.scrollToElement(activeTab[0], 1000, true);

      activeTab.addClass('active').siblings().removeClass('active');
    }
  });

  $(document).on('click', '.floor-C-tab-item', function () {
    var $this = $(this),
        floors = $('#floor-C').find('.floor-item');

    $this.addClass('active').siblings().removeClass('active');

    floorC.scrollTo(floors.eq($this.index()));
  });

  var exampleCTab = new IScroll('#example-C-tab', {
    scrollX: true,
    bounce: false,
    click: true
  });

  var exampleC = new Floor({
    container: '#example-C',
    baselineDebug: true,
    onFloorChange: function onFloorChange() {
      var activeTab = $('.example-C-tab-item').eq(this.activeIndex);
      console.log(activeTab);

      exampleCTab.scrollToElement(activeTab[0], 1000, true);

      activeTab.addClass('active').siblings().removeClass('active');
    }
  });

  $(document).on('click', '.example-C-tab-item', function () {
    var $this = $(this),
        examples = $('#example-C').find('.floor-item');

    $this.addClass('active').siblings().removeClass('active');

    exampleC.scrollTo(examples.eq($this.index()));
  });
})();