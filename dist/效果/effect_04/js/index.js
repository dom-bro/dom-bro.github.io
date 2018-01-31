'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  'use strict';

  /*!
   * ES6 Dessert v1.1.0
   * (c) 2017-2018 DOM哥
   * https://github.com/dom-bro/es6-dessert
   */
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

  /**
   * @el jQuery对象 | DOM | 选择器
   * @event 事件类型（如 click，transitionend 等等），多个以空格分割
   * @callback 事件回调
   * @作用 改进 $.fn.one
   * @Why el 子元素的 event 事件会冒泡触发 el 的 event 事件，这不是本插件期望的效果。
   *      比如为 el 添加 click 事件，点击其子元素时也会触发 el 的 click 事件，
   *      本插件希望只在 event target 为 el 时才执行且仅执行一次事件处理器。
   */

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
      if (!popup.hasClass('-dessert-created-')) {
        popup.addClass('-dessert-created-');

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

        if (!conf.popup) {
          throw self.constructor.name + ' Error: \u8BF7\u5728\u5B9E\u4F8B\u5316\u65F6\u6307\u5B9A popup \u9009\u9879\uFF01';
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

  /**
   * 通用弹窗
   */

  var NormalPopup = function (_Popup) {
    _inherits(NormalPopup, _Popup);

    function NormalPopup() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, NormalPopup);

      return _possibleConstructorReturn(this, (NormalPopup.__proto__ || Object.getPrototypeOf(NormalPopup)).call(this, options));
    }

    _createClass(NormalPopup, [{
      key: 'open',
      value: function open() {
        var onOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        _get(NormalPopup.prototype.__proto__ || Object.getPrototypeOf(NormalPopup.prototype), 'open', this).call(this);

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
      key: 'close',
      value: function close() {
        var onClose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        _get(NormalPopup.prototype.__proto__ || Object.getPrototypeOf(NormalPopup.prototype), 'close', this).call(this);

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

  var popupA = new NormalPopup({
    popup: '#popup-A',
    openBtn: '.open-popup-A',
    closeBtn: '.close-popup-A'
  });

  var popupB = new NormalPopup({
    popup: '#popup-B',
    openBtn: '.open-popup-B',
    closeBtn: '.close-popup-B',
    onOpen: function onOpen() {
      setTimeout(function () {
        alert('open B');
      }, 0);
    },
    onClose: function onClose() {
      alert('close B');
    }
  });

  var popupC = new NormalPopup({
    mask: '#popup-C-mask',
    popup: '#popup-C',
    openBtn: '.open-popup-C',
    closeOnClickMask: true
  });

  var popupD = new NormalPopup({
    popup: '#popup-D',
    openBtn: '.open-popup-D',
    closeBtn: '.close-popup-D',
    duration: 600
  });

  $(document).on('click', '.clickBtnA', function () {
    popupA.open(function () {
      alert('open A with jQuery');
    });
  });
  $(document).on('click', '.clickBtnB', function () {
    popupB.open(function () {
      alert('open B with jQuery');
    });
  });

  new Vue({
    el: '#index',
    methods: {
      openPopupC: function openPopupC() {
        popupC.open(function () {
          alert('open C with Vue');
        });
      },
      openPopupD: function openPopupD() {
        popupD.open(function () {
          alert('open D with Vue');
        });
      }
    }
  });
})();