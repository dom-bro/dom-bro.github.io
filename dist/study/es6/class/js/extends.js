'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    'use strict';

    var A = function () {
        function A() {
            _classCallCheck(this, A);

            this.name = 'a';
        }

        _createClass(A, [{
            key: 'print',
            value: function print() {
                console.log('a');
            }
        }]);

        return A;
    }();

    var B = function (_A) {
        _inherits(B, _A);

        function B() {
            _classCallCheck(this, B);

            var _this = _possibleConstructorReturn(this, (B.__proto__ || Object.getPrototypeOf(B)).call(this));

            _this.name = 'b';
            return _this;
        }

        _createClass(B, [{
            key: 'print',
            value: function print() {
                console.log('b');
            }
        }]);

        return B;
    }(A);

    require(['jquery', 'init_mock'], function ($) {
        var a = new A();
        console.log(a);
        console.log(a.name);
        a.print();

        var b = new B();
        console.log(b);
        console.log(b.name);
        b.print();
    });
})();