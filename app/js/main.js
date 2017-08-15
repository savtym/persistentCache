

import Storage from 'storage';


const sizeMemoryRAM = document.querySelector('[name="ram_size"]');
const sizeMemoryLocal = document.querySelector('[name="local_size"]');

const data = document.querySelectorAll('.full-data input');

const btnAddGet = '.btn-add.get';

const btnAddInsert = '.btn-add.insert';
const btnRemove = '.btn-remove.insert';

const btnStartInsert = '.insert-data .btn-start:not(.active)';
const btnStopInsert = '.insert-data .btn-stop';

const btnStartGet = '.get-data .btn-start:not(.active)';
const btnStopGet = '.get-data .btn-stop';

const btnRemoveCache = '.cache .btn-remove';


const testList = document.querySelector('.list-caches > table > tbody');
const testCurrentDataLocal = document.querySelector('.circle-local > span');

const testRAM = document.querySelector('.cache .circle-ram .circle');
const testPersistent = document.querySelector('.cache .circle-persistent .circle');
const testPairsRAM = document.querySelector('.cache .counter .ram');
const testPairsLocal = document.querySelector('.cache .counter .local');
const testTable = document.querySelector('.cache table > tbody');

const addFiledInsert = `<div class="field">
                        <input name="key" type="text" placeholder="key">
                        <input name="value" type="text" placeholder="value">
                        <button class="btn btn-remove insert">Remove</button>
                    </div>`;

const addFiledGet = `<div class="field">
                        <input name="key" type="text" placeholder="key">
                        <button class="btn btn-remove insert">Remove</button>
                    </div>`;

const randomSize = 100;
let timerInsert;
let timerGet;
let cache;


export class Main {

  constructor() {

    Main.eventListener(btnAddGet, 'click', this.addFiledGet);
    Main.eventListener(btnAddInsert, 'click', this.addFiledInsert);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStartInsert, 'click', Main.startTestInsert);
    Main.eventListener(btnStopInsert, 'click', Main.stopTestInsert);

    Main.eventListener(btnStartGet, 'click', Main.startTestGet);
    Main.eventListener(btnStopGet, 'click', Main.stopTestGet);

    Main.eventListener(btnRemoveCache, 'click', Main.removeCache);


    cache = new Storage({ id: 'test-drive'});

    testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
    testPersistent.textContent = Main.formatByteSize(cache.persistent.freeMemory);
    testPairsLocal.textContent = Object.keys(cache.persistent.data()).length;

    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);
    Main.localStorage();

  }

  addFiledGet() {
    const parent = this.closest('.work-data').querySelector('.fields');
    const tmp = document.createElement('template');
    tmp.innerHTML = addFiledGet;
    parent.appendChild(tmp.content);
  }

  addFiledInsert() {
    const parent = this.closest('.work-data').querySelector('.fields');
    const tmp = document.createElement('template');
    tmp.innerHTML = addFiledInsert;
    parent.appendChild(tmp.content);
  }

  removeField() {
    const parent = this.closest('.field');
    parent.outerHTML = '';
  }


  static startTestInsert() {

    this.classList.add('active');

    let counterPairs = 0;
    let data = [];

    if (document.querySelector('[name="full_data"]:checked').value === 'insert') {

      const keys = document.querySelectorAll('.insert .fields [name="key"]');
      const values = document.querySelectorAll('.insert .fields [name="value"]');

      counterPairs = keys.length;

      let [result, error] = Main._parseKeyValue(keys, values);

      if (error) {
        this.classList.remove('active');
        return;
      }

      data = result;

    } else {

      counterPairs = randomSize;

      for (let i = 0; i < randomSize; i++) {
        data.push({
          key: i,
          value: Math.random() * randomSize
        });
      }

    }

    cache.ram.maxMemory = sizeMemoryRAM.value;
    cache.persistent.maxMemory = sizeMemoryLocal.value;

    Main.localStorage();

    let index = 0;

    timerInsert = setInterval(() => {
      Main._insertDataToCache.call(this, index++, data);
    }, 50);

  }


  static stopTestInsert() {
    if (timerInsert) {
      clearInterval(timerInsert);
    }

    const button = this.closest('.buttons').querySelector('.active');
    (!button) || button.classList.remove('active');
  }



  static startTestGet() {
    this.classList.add('active');

    const keys = document.querySelectorAll('.get .fields [name="key"]');

    const counterPairs = keys.length;
    const data = [];
    const button = this;

    let error = false;

    for (let i = 0; i < counterPairs; i++) {
      if (keys[i].value.length !== 0) {

        data.push(keys[i].value);

        keys[i].classList.remove('error');
      } else {
        error = true;
        keys[i].classList.add('error');
      }
    }

    if (error) {
      this.classList.remove('active')
      return;
    }

    let index = 0;

    timerGet = setInterval(() => {
      Main._getDataFromCache.call(this, index++, data);
    }, 50);

  }

  static stopTestGet() {
    if (timerGet) {
      clearInterval(timerGet);
    }

    const button = this.closest('.buttons').querySelector('.active');
    (!button) || button.classList.remove('active');
  }



  static removeCache() {
    const parent = this.closest('.cache');
    const id = parent.getAttribute('data-id');
    Storage.clearById(id);

    testTable.innerHTML = '';
    testRAM.innerHTML = '';
    testPersistent.innerHTML = '';
    testPairsRAM.textContent = 0;
    testPairsLocal.textContent = 0
    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);
    Main.localStorage();

  }


  static localStorage() {
    let strHTML = '';

    for (let key in localStorage) {
      strHTML += `<tr class="cache" data-id="${ key }">
                        <td class="id">${ key }</td>
                        <td class="memory">${ Main.formatByteSize(Storage.sizeOf(localStorage.getItem(key))) }</td>
                    </tr>`;
    }

    testList.innerHTML = strHTML;
  }



  static formatByteSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
    else if (bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
    else return (bytes / 1073741824).toFixed(3) + " GiB";
  };


  /*
   event listener
   */

  static eventListener(str, event, func, isAddEvent = true) {
    const funcListener = (isAddEvent) ? 'addEventListener' : 'removeEventListener';

    document[funcListener](event, function (e) {
      const selectors = document.querySelectorAll(str);
      let element = e.target;
      let index = -1;

      if (selectors) {

        while (element && ((index = Array.prototype.indexOf.call(selectors, element)) === -1)) {
          element = element.parentElement;
        }

        if (index > -1) {
          func.call(element, e);
        }
      }
    }, false);
  }




  static _parseKeyValue(keys, values) {
    const result = [];

    let error = false;

    if (keys.length !== values.length) {
      alert('Error! Length keys !== length values');
      return;
    }
    
    for (let i = 0; i < keys.length; i++) {

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



  static _insertRowInTable(key, value, insert, get, hitMiss) {
    const tmp = document.createElement('template');
    tmp.innerHTML = `<tr>
                        <td>${ key }</td>
                        <td>${ value }</td>
                        <td>${ insert }</td>
                        <td>${ get }</td>
                        <td>${ hitMiss }</td>
                    </tr>`;
    testTable.insertBefore(tmp.content, testTable.firstChild);

    let counterInsert = 0;
    let counterGet = 0;
    let hit = 0;
    let miss = 0;

    document.querySelectorAll('.cache table > tbody > tr:not(.last)').forEach(function(dom) {

      counterInsert += (dom.querySelector(':nth-child(3)').textContent === 'True') ? 1 : 0;
      counterGet += (dom.querySelector(':nth-child(4)').textContent === 'True') ? 1 : 0;

      const hitMissValue = dom.querySelector(':nth-child(5)').textContent;

      if (hitMissValue === 'Hit') {
        hit++;
      } else if (hitMissValue === 'Miss') {
        miss++;
      }

    });

    const last = document.querySelector('.cache table .last');

    last.querySelector(':nth-child(3)').textContent = counterInsert;
    last.querySelector(':nth-child(4)').textContent = counterGet;
    last.querySelector(':nth-child(5)').textContent = `${ hit }/${ miss } hit: ${ (hit / (hit + miss) * 100).toFixed(1) }%`;

  }


  static _insertDataToCache(index, data) {
    const obj = data[index];

    if (!obj) {
      clearInterval(timerInsert);
      this.classList.remove('active');
      return;
    }

    let hitMiss = 'Miss';

    const request = Storage.counterRequest;

    cache.insert(obj.key, obj.value);

    if (request === (Storage.counterRequest - 1)) {
      hitMiss = 'Hit';
    }

    Main._insertRowInTable(obj.key, obj.value, 'True', 'False', hitMiss);

    testPairsRAM.textContent = Object.keys(cache.ram.data()).length;
    testPairsLocal.textContent = Object.keys(cache.persistent.data()).length;

    testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
    testPersistent.textContent = Main.formatByteSize(cache.persistent.freeMemory)
    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);

    const memoryList = document.querySelector(`.cache[data-id="test-drive"] .memory`);
    memoryList.textContent = Main.formatByteSize(cache.persistent.busyMemory);
  }


  static _getDataFromCache(index, data) {
    const key = data[index];

    if (!key) {
      clearInterval(timerGet);
      this.classList.remove('active');
      return;
    }

    let hitMiss = 'Miss';

    const request = Storage.counterRequest;
    const value = cache.data(key);

    if (request === Storage.counterRequest) {
      hitMiss = 'Hit';
    } else {
      testRAM.textContent = Main.formatByteSize(cache.ram.freeMemory);
      testPairsRAM.textContent = Object.keys(cache.ram.data()).length;
    }

    Main._insertRowInTable(key, (value) ? value : 'Not value', 'False', 'True', (value) ? hitMiss : 'Not value');
  }

}

