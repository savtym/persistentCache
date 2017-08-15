'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Main = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sizeMemoryRAM = document.querySelector('[name="ram_size"]');
var sizeMemoryLocal = document.querySelector('[name="local_size"]');

var data = document.querySelectorAll('.full-data input');

var btnAdd = '.btn-add.insert';
var btnRemove = '.btn-remove.insert';

var btnStartInsert = '.insert-data .btn-start';
var btnStopInsert = '.insert-data .btn-stop';

var btnStartGet = '.get-data .btn-start';
var btnStopGet = '.get-data .btn-stop';

var btnRemoveCache = '.cache .btn-remove';

var test = document.querySelector('.caches');
var testList = document.querySelector('.list-caches > table > tbody');
var testCurrentDataLocal = document.querySelector('.circle-local > span');

var _addFiled = '<div class="field">\n                        <input name="key" type="text" placeholder="key">\n                        <input name="value" type="text" placeholder="value">\n                        <button class="btn btn-remove insert">Remove</button>\n                    </div>';

var randomSize = 100;

var Main = exports.Main = function () {
  function Main() {
    _classCallCheck(this, Main);

    Main.eventListener(btnAdd, 'click', this.addFiled);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStartInsert, 'click', Main.startTestInsert);
    Main.eventListener(btnStopInsert, 'click', Main.stopTestInsert);

    Main.eventListener(btnStartGet, 'click', Main.startTestGet);
    Main.eventListener(btnStopGet, 'click', Main.stopTestGet);

    Main.eventListener(btnRemoveCache, 'click', Main.removeCache);

    testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);
    Main.localStorage();
  }

  _createClass(Main, [{
    key: 'addFiled',
    value: function addFiled() {
      var parent = this.closest('.work-data').querySelector('.fields');
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
  }], [{
    key: 'startTestInsert',
    value: function startTestInsert() {

      var sizeRAM = sizeMemoryRAM.value;
      var sizeLocal = sizeMemoryLocal.value;

      var cache = new _storage2.default(sizeRAM, sizeLocal);

      var counterPairs = 0;
      var table = [];
      var id = cache.id;

      testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);

      console.log(cache);

      if (document.querySelector('[name="full_data"]:checked').value === 'insert') {
        var keys = document.querySelectorAll('.insert .fields [name="key"]');
        var values = document.querySelectorAll('.insert .fields [name="value"]');

        if (keys.length !== values.length) {
          alert('Error! Length keys !== length values');
          return;
        }

        counterPairs = keys.length;

        for (var i = 0; i < keys.length; i++) {
          try {
            cache.insert(keys[i].value, values[i].value);
          } catch (e) {
            alert(e);
            cache.clear();
            testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);
            return;
          }
        }
      } else {

        counterPairs = randomSize;

        for (var _i = 0; _i < randomSize; _i++) {
          cache.insert(_i, _i);
          table.push(Main.objectTable(_i, 1, 1, 1, 0));
        }
      }

      var tmp = document.createElement('template');

      tmp.innerHTML = '<div class="cache" data-id="' + id + '">\n            \n                <h2>Cache #' + id + '</h2>\n\n                <div class="counter">\n                    <h3>The number of stored key-value pairs: <span>' + counterPairs + '</span></h3>\n                </div>\n\n                <div class="current-data">\n                    <h3>Current amount of stored data:</h3>\n\n                    <div class="circle-ram">\n                        <h4>Free memory RAM</h4>\n                        <span class="circle">' + cache.freeMemory.ram + '</span>\n                    </div>\n\n                    <div class="circle-persistent">\n                        <h4>Free memory Persistent</h4>\n                        <span class="circle">' + cache.freeMemory.persistent + '</span>\n                    </div>\n                </div>\n\n                <div class="percent-cache">\n                    <h3>Counters and percent hit / miss cache</h3>\n                    \n                    <table>\n                        <thead>\n                            <tr>\n                                <th>Key</th>\n                                <th>RAM</th>\n                                <th>Persistent</th>\n                                <th>Insert</th>\n                                <th>Get Data</th>\n                                <th>Hit/Miss</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            ' + table.map(function (item) {
        return '<tr>\n                                        <td>' + item.key + '</td>\n                                        <td>' + item.ram + '</td>\n                                        <td>' + item.persistent + '</td>\n                                        <td>' + item.insert + '</td>\n                                        <td>' + item.getData + '</td>\n                                        <td>' + (item.hitMiss ? 'Hit' : 'Miss') + '</td>\n                                    </tr>';
      }).join('') + '\n                        </tbody>\n                    </table>\n                </div>\n                \n                <div class="buttons">\n                    <span class="btn btn-remove">Remove cache</span>\n                </div>\n            </div>';

      test.appendChild(tmp.content);
    }
  }, {
    key: 'stopTestInsert',
    value: function stopTestInsert() {}
  }, {
    key: 'startTestGet',
    value: function startTestGet() {}
  }, {
    key: 'stopTestGet',
    value: function stopTestGet() {}
  }, {
    key: 'removeCache',
    value: function removeCache() {
      var parent = this.closest('.cache');
      var id = parent.getAttribute('data-id');
      _storage2.default.clearById(id);

      parent.outerHTML = '';
      testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);
    }
  }, {
    key: 'objectTable',
    value: function objectTable(key, ram, persistent, insert, getData, hitMiss) {
      return {
        key: key.toString(),
        ram: ram,
        persistent: persistent,
        insert: insert,
        getData: getData,
        hitMiss: hitMiss
      };
    }
  }, {
    key: 'localStorage',
    value: function (_localStorage) {
      function localStorage() {
        return _localStorage.apply(this, arguments);
      }

      localStorage.toString = function () {
        return _localStorage.toString();
      };

      return localStorage;
    }(function () {
      var strHTML = '';

      for (var key in localStorage) {
        strHTML += '<tr class="work-data" data-id="' + key + '">\n                        <td class="id">' + key + '</td>\n                        <td class="memory">' + Main.formatByteSize(_storage2.default.sizeOf(localStorage.getItem(key))) + '</td>\n                        <td class="btn btn-remove">Remove</td>\n                    </tr>';
      }

      testList.innerHTML = strHTML;
    })
  }, {
    key: 'formatByteSize',
    value: function formatByteSize(bytes) {
      if (bytes < 1024) return bytes + " bytes";else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";else return (bytes / 1073741824).toFixed(3) + " GiB";
    }
  }, {
    key: 'eventListener',


    /*
     event listener
     */

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