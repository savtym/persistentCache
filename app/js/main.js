

import Storage from 'storage';


const sizeMemoryRAM = document.querySelector('[name="ram_size"]');
const sizeMemoryLocal = document.querySelector('[name="local_size"]');

const data = document.querySelectorAll('.full-data input');

const btnAdd = '.btn-add.insert';
const btnRemove = '.btn-remove.insert';

const btnStartInsert = '.insert-data .btn-start';
const btnStopInsert = '.insert-data .btn-stop';

const btnStartGet = '.get-data .btn-start';
const btnStopGet = '.get-data .btn-stop';

const btnRemoveCache = '.cache .btn-remove';


const test = document.querySelector('.caches');
const testList = document.querySelector('.list-caches > table > tbody');
const testCurrentDataLocal = document.querySelector('.circle-local > span');


const addFiled = `<div class="field">
                        <input name="key" type="text" placeholder="key">
                        <input name="value" type="text" placeholder="value">
                        <button class="btn btn-remove insert">Remove</button>
                    </div>`;


const randomSize = 100;


export class Main {

  constructor() {

    Main.eventListener(btnAdd, 'click', this.addFiled);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStartInsert, 'click', Main.startTestInsert);
    Main.eventListener(btnStopInsert, 'click', Main.stopTestInsert);

    Main.eventListener(btnStartGet, 'click', Main.startTestGet);
    Main.eventListener(btnStopGet, 'click', Main.stopTestGet);

    Main.eventListener(btnRemoveCache, 'click', Main.removeCache);

    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);
    Main.localStorage();

  }


  addFiled() {
    const parent = this.closest('.work-data').querySelector('.fields');
    const tmp = document.createElement('template');
    tmp.innerHTML = addFiled;
    parent.appendChild(tmp.content);
  }

  removeField() {
    const parent = this.closest('.field');
    parent.outerHTML = '';
  }


  static startTestInsert() {

    const sizeRAM = sizeMemoryRAM.value;
    const sizeLocal = sizeMemoryLocal.value;

    let cache = new Storage(sizeRAM, sizeLocal);

    let counterPairs = 0;
    const table = [];
    const id = cache.id;

    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);

    console.log(cache);

    if (document.querySelector('[name="full_data"]:checked').value === 'insert') {
      const keys = document.querySelectorAll('.insert .fields [name="key"]');
      const values = document.querySelectorAll('.insert .fields [name="value"]');

      if (keys.length !== values.length) {
        alert('Error! Length keys !== length values');
        return;
      }

      counterPairs = keys.length;
      
      for (let i = 0; i < keys.length; i++) {
        try {
          cache.insert(keys[i].value, values[i].value);

        } catch(e) {
          alert(e);
          cache.clear();
          testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);
          return;
        }

      }

    } else {

      counterPairs = randomSize;

      for (let i = 0; i < randomSize; i++) {
        cache.insert(i, i);
        table.push(Main.objectTable(i, 1, 1, 1, 0, ));
      }

    }

    const tmp = document.createElement('template');

    tmp.innerHTML = `<div class="cache" data-id="${ id }">
            
                <h2>Cache #${ id }</h2>

                <div class="counter">
                    <h3>The number of stored key-value pairs: <span>${ counterPairs }</span></h3>
                </div>

                <div class="current-data">
                    <h3>Current amount of stored data:</h3>

                    <div class="circle-ram">
                        <h4>Free memory RAM</h4>
                        <span class="circle">${ cache.freeMemory.ram }</span>
                    </div>

                    <div class="circle-persistent">
                        <h4>Free memory Persistent</h4>
                        <span class="circle">${ cache.freeMemory.persistent }</span>
                    </div>
                </div>

                <div class="percent-cache">
                    <h3>Counters and percent hit / miss cache</h3>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>RAM</th>
                                <th>Persistent</th>
                                <th>Insert</th>
                                <th>Get Data</th>
                                <th>Hit/Miss</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                table.map( (item) =>
                                  `<tr>
                                        <td>${ item.key }</td>
                                        <td>${ item.ram }</td>
                                        <td>${ item.persistent }</td>
                                        <td>${ item.insert }</td>
                                        <td>${ item.getData }</td>
                                        <td>${ (item.hitMiss) ? 'Hit' : 'Miss' }</td>
                                    </tr>`
                                ).join('')
                            }
                        </tbody>
                    </table>
                </div>
                
                <div class="buttons">
                    <span class="btn btn-remove">Remove cache</span>
                </div>
            </div>`;

    test.appendChild(tmp.content);
  }


  static stopTestInsert() {

  }



  static startTestGet() {

  }

  static stopTestGet() {

  }


  static removeCache() {
    const parent = this.closest('.cache');
    const id = parent.getAttribute('data-id');
    Storage.clearById(id);

    parent.outerHTML = '';
    testCurrentDataLocal.textContent = Main.formatByteSize(Storage.freeMemoryLocal);

  }




  static objectTable(key, ram, persistent, insert, getData, hitMiss) {
    return {
      key: key.toString(),
      ram: ram,
      persistent: persistent,
      insert: insert,
      getData: getData,
      hitMiss: hitMiss
    };
  }




  static localStorage() {
    let strHTML = '';

    for (let key in localStorage) {
      strHTML += `<tr class="work-data" data-id="${ key }">
                        <td class="id">${ key }</td>
                        <td class="memory">${ Main.formatByteSize(Storage.sizeOf(localStorage.getItem(key))) }</td>
                        <td class="btn btn-remove">Remove</td>
                    </tr>`;
    }

    testList.innerHTML = strHTML;
  }



  static formatByteSize(bytes) {
    if(bytes < 1024) return bytes + " bytes";
    else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KiB";
    else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MiB";
    else return(bytes / 1073741824).toFixed(3) + " GiB";
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

}

