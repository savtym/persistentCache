'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Main = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _storage = require('storage');

var _storage2 = _interopRequireDefault(_storage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var sizeMemoryRAM = document.querySelector('[name="ram_size"]');
var sizeMemoryLocal = document.querySelector('[name="local_size"]');

var data = document.querySelectorAll('.full-data input');

var btnAddGet = '.btn-add.get';

var btnAddInsert = '.btn-add.insert';
var btnRemove = '.btn-remove.insert';

var btnStartInsert = '.insert-data .btn-start:not(.active)';
var btnStopInsert = '.insert-data .btn-stop';

var btnStartGet = '.get-data .btn-start:not(.active)';
var btnStopGet = '.get-data .btn-stop';

var btnRemoveCache = '.cache .btn-remove';

var testList = document.querySelector('.list-caches > table > tbody');
var testCurrentDataLocal = document.querySelector('.circle-local > span');

var testRAM = document.querySelector('.cache .circle-ram .circle');
var testPersistent = document.querySelector('.cache .circle-persistent .circle');
var testPairsRAM = document.querySelector('.cache .counter .ram');
var testPairsLocal = document.querySelector('.cache .counter .local');
var testTable = document.querySelector('.cache table > tbody');

var _addFiledInsert = '<div class="field">\n                        <input name="key" type="text" placeholder="key">\n                        <input name="value" type="text" placeholder="value">\n                        <button class="btn btn-remove insert">Remove</button>\n                    </div>';

var _addFiledGet = '<div class="field">\n                        <input name="key" type="text" placeholder="key">\n                        <button class="btn btn-remove insert">Remove</button>\n                    </div>';

var randomSize = 100;
var timerInsert = void 0;
var timerGet = void 0;
var cache = void 0;

var Main = exports.Main = function () {
  function Main() {
    _classCallCheck(this, Main);

    Main.eventListener(btnAddGet, 'click', this.addFiledGet);
    Main.eventListener(btnAddInsert, 'click', this.addFiledInsert);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStartInsert, 'click', Main.startTestInsert);
    Main.eventListener(btnStopInsert, 'click', Main.stopTestInsert);

    Main.eventListener(btnStartGet, 'click', Main.startTestGet);
    Main.eventListener(btnStopGet, 'click', Main.stopTestGet);

    Main.eventListener(btnRemoveCache, 'click', Main.removeCache);

    cache = new _storage2.default({ id: 'test-drive' });

    testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
    testPersistent.textContent = Main.formatByteSize(cache.persistent.freeMemory);
    testPairsLocal.textContent = Object.keys(cache.persistent.data()).length;

    testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);
    Main.localStorage();
  }

  _createClass(Main, [{
    key: 'addFiledGet',
    value: function addFiledGet() {
      var parent = this.closest('.work-data').querySelector('.fields');
      var tmp = document.createElement('template');
      tmp.innerHTML = _addFiledGet;
      parent.appendChild(tmp.content);
    }
  }, {
    key: 'addFiledInsert',
    value: function addFiledInsert() {
      var parent = this.closest('.work-data').querySelector('.fields');
      var tmp = document.createElement('template');
      tmp.innerHTML = _addFiledInsert;
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
      var _this = this;

      this.classList.add('active');

      var counterPairs = 0;
      var data = [];

      if (document.querySelector('[name="full_data"]:checked').value === 'insert') {

        var keys = document.querySelectorAll('.insert .fields [name="key"]');
        var values = document.querySelectorAll('.insert .fields [name="value"]');

        counterPairs = keys.length;

        var _Main$_parseKeyValue = Main._parseKeyValue(keys, values),
            _Main$_parseKeyValue2 = _slicedToArray(_Main$_parseKeyValue, 2),
            result = _Main$_parseKeyValue2[0],
            error = _Main$_parseKeyValue2[1];

        if (error) {
          this.classList.remove('active');
          return;
        }

        data = result;
      } else {

        counterPairs = randomSize;

        for (var i = 0; i < randomSize; i++) {
          data.push({
            key: i,
            value: Math.random() * randomSize
          });
        }
      }

      cache.ram.maxMemory = sizeMemoryRAM.value;
      cache.persistent.maxMemory = sizeMemoryLocal.value;

      Main.localStorage();

      var index = 0;

      timerInsert = setInterval(function () {
        Main._insertDataToCache.call(_this, index++, data);
      }, 50);
    }
  }, {
    key: 'stopTestInsert',
    value: function stopTestInsert() {
      if (timerInsert) {
        clearInterval(timerInsert);
      }

      var button = this.closest('.buttons').querySelector('.active');
      !button || button.classList.remove('active');
    }
  }, {
    key: 'startTestGet',
    value: function startTestGet() {
      var _this2 = this;

      this.classList.add('active');

      var keys = document.querySelectorAll('.get .fields [name="key"]');

      var counterPairs = keys.length;
      var data = [];
      var button = this;

      var error = false;

      for (var i = 0; i < counterPairs; i++) {
        if (keys[i].value.length !== 0) {

          data.push(keys[i].value);

          keys[i].classList.remove('error');
        } else {
          error = true;
          keys[i].classList.add('error');
        }
      }

      if (error) {
        this.classList.remove('active');
        return;
      }

      var index = 0;

      timerGet = setInterval(function () {
        Main._getDataFromCache.call(_this2, index++, data);
      }, 50);
    }
  }, {
    key: 'stopTestGet',
    value: function stopTestGet() {
      if (timerGet) {
        clearInterval(timerGet);
      }

      var button = this.closest('.buttons').querySelector('.active');
      !button || button.classList.remove('active');
    }
  }, {
    key: 'removeCache',
    value: function removeCache() {
      var parent = this.closest('.cache');
      var id = parent.getAttribute('data-id');
      _storage2.default.clearById(id);

      testTable.innerHTML = '';
      testRAM.innerHTML = '';
      testPersistent.innerHTML = '';
      testPairsRAM.textContent = 0;
      testPairsLocal.textContent = 0;
      testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);
      Main.localStorage();
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
        strHTML += '<tr class="cache" data-id="' + key + '">\n                        <td class="id">' + key + '</td>\n                        <td class="memory">' + Main.formatByteSize(_storage2.default.sizeOf(localStorage.getItem(key))) + '</td>\n                    </tr>';
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
  }, {
    key: '_parseKeyValue',
    value: function _parseKeyValue(keys, values) {
      var result = [];

      var error = false;

      if (keys.length !== values.length) {
        alert('Error! Length keys !== length values');
        return;
      }

      for (var i = 0; i < keys.length; i++) {

        if (keys[i].value.length !== 0) {

          result.push({
            key: keys[i].value,
            value: values[i].value
          });

          keys[i].classList.remove('error');
        } else {
          error = true;
          keys[i].classList.add('error');
        }
      }

      return [result, error];
    }
  }, {
    key: '_insertRowInTable',
    value: function _insertRowInTable(key, value, insert, get, hitMiss) {
      var tmp = document.createElement('template');
      tmp.innerHTML = '<tr>\n                        <td>' + key + '</td>\n                        <td>' + value + '</td>\n                        <td>' + insert + '</td>\n                        <td>' + get + '</td>\n                        <td>' + hitMiss + '</td>\n                    </tr>';
      testTable.insertBefore(tmp.content, testTable.firstChild);

      var counterInsert = 0;
      var counterGet = 0;
      var hit = 0;
      var miss = 0;

      document.querySelectorAll('.cache table > tbody > tr:not(.last)').forEach(function (dom) {

        counterInsert += dom.querySelector(':nth-child(3)').textContent === 'True' ? 1 : 0;
        counterGet += dom.querySelector(':nth-child(4)').textContent === 'True' ? 1 : 0;

        var hitMissValue = dom.querySelector(':nth-child(5)').textContent;

        if (hitMissValue === 'Hit') {
          hit++;
        } else if (hitMissValue === 'Miss') {
          miss++;
        }
      });

      var last = document.querySelector('.cache table .last');

      last.querySelector(':nth-child(3)').textContent = counterInsert;
      last.querySelector(':nth-child(4)').textContent = counterGet;
      last.querySelector(':nth-child(5)').textContent = hit + '/' + miss + ' hit: ' + (hit / (hit + miss) * 100).toFixed(1) + '%';
    }
  }, {
    key: '_insertDataToCache',
    value: function _insertDataToCache(index, data) {
      var obj = data[index];

      if (!obj) {
        clearInterval(timerInsert);
        this.classList.remove('active');
        return;
      }

      var hitMiss = 'Miss';

      var request = _storage2.default.counterRequest;

      cache.insert(obj.key, obj.value);

      if (request === _storage2.default.counterRequest - 1) {
        hitMiss = 'Hit';
      }

      Main._insertRowInTable(obj.key, obj.value, 'True', 'False', hitMiss);

      testPairsRAM.textContent = Object.keys(cache.ram.data()).length;
      testPairsLocal.textContent = Object.keys(cache.persistent.data()).length;

      testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
      testPersistent.textContent = Main.formatByteSize(cache.persistent.freeMemory);
      testCurrentDataLocal.textContent = Main.formatByteSize(_storage2.default.freeMemoryLocal);

      var memoryList = document.querySelector('.cache[data-id="test-drive"] .memory');
      memoryList.textContent = Main.formatByteSize(cache.persistent.busyMemory);
    }
  }, {
    key: '_getDataFromCache',
    value: function _getDataFromCache(index, data) {
      var key = data[index];

      if (!key) {
        clearInterval(timerGet);
        this.classList.remove('active');
        return;
      }

      var hitMiss = 'Miss';

      var request = _storage2.default.counterRequest;
      var value = cache.data(key);

      if (request === _storage2.default.counterRequest) {
        hitMiss = 'Hit';
      } else {
        testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
        testPairsRAM.textContent = Object.keys(cache.ram.data()).length;
      }

      Main._insertRowInTable(key, value ? value : 'Not value', 'False', 'True', value ? hitMiss : 'Not value');
    }
  }]);

  return Main;
}();