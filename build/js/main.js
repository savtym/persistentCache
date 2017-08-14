'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Main = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cache = require('cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sizeMemoryRAM = document.querySelector('[name="ram_size"]');
var sizeMemoryLocal = document.querySelector('[name="local_size"]');

var data = document.querySelectorAll('.full-data input');

var btnAdd = '.btn-add';
var btnRemove = '.btn-remove';

var btnStart = '.btn-start';
var btnStop = '.btn-stop';

var _addFiled = '<div class="field">\n                        <input name="key" type="text" placeholder="key">\n                        <input name="value" type="text" placeholder="value">\n                        <button class="btn btn-remove">Remove</button>\n                    </div>';

var randomSize = 10000;

var Main = exports.Main = function () {
  function Main() {
    _classCallCheck(this, Main);

    Main.eventListener(btnAdd, 'click', this.addFiled);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStart, 'click', this.startTest);
    Main.eventListener(btnStop, 'click', this.stopTest);
  }

  _createClass(Main, [{
    key: 'addFiled',
    value: function addFiled() {
      var parent = this.closest('.insert').querySelector('.fields');
      var tmp = document.createElement('template');
      tmp.innerHTML = _addFiled;
      parent.appendChild(tmp.content);
    }
  }, {
    key: 'removeField',
    value: function removeField() {
      var parent = this.closest('.field');
      parent.outerHTML = '';
    }
  }, {
    key: 'startTest',
    value: function startTest() {

      var sizeRAM = sizeMemoryRAM.value;
      var sizeLocal = sizeMemoryLocal.value;

      var cache = new _cache2.default(sizeRAM, sizeLocal);
      console.log(cache);

      if (document.querySelector('[name="full_data"]:checked').value === 'insert') {
        var keys = document.querySelectorAll('.fields [name="key"]');
        var values = document.querySelectorAll('.fields [name="value"]');

        for (var i = 0; i < keys.length; i++) {}
      }
    }
  }, {
    key: 'stopTest',
    value: function stopTest() {}

    /*
     event listener
     */

  }], [{
    key: 'eventListener',
    value: function eventListener(str, event, func) {
      var isAddEvent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

      var funcListener = isAddEvent ? 'addEventListener' : 'removeEventListener';

      document[funcListener](event, function (e) {
        var selectors = document.querySelectorAll(str);
        var element = e.target;
        var index = -1;

        if (selectors) {

          while (element && (index = Array.prototype.indexOf.call(selectors, element)) === -1) {
            element = element.parentElement;
          }

          if (index > -1) {
            func.call(element, e);
          }
        }
      }, false);
    }
  }]);

  return Main;
}();