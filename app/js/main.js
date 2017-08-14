

import Cache from 'cache';


const sizeMemoryRAM = document.querySelector('[name="ram_size"]');
const sizeMemoryLocal = document.querySelector('[name="local_size"]');

const data = document.querySelectorAll('.full-data input');

const btnAdd = '.btn-add';
const btnRemove = '.btn-remove';

const btnStart = '.btn-start';
const btnStop = '.btn-stop';


const addFiled = `<div class="field">
                        <input name="key" type="text" placeholder="key">
                        <input name="value" type="text" placeholder="value">
                        <button class="btn btn-remove">Remove</button>
                    </div>`;

const randomSize = 10000;


export class Main {

  constructor() {

    Main.eventListener(btnAdd, 'click', this.addFiled);
    Main.eventListener(btnRemove, 'click', this.removeField);

    Main.eventListener(btnStart, 'click', this.startTest);
    Main.eventListener(btnStop, 'click', this.stopTest);

  }


  addFiled() {
    const parent = this.closest('.insert').querySelector('.fields');
    const tmp = document.createElement('template');
    tmp.innerHTML = addFiled;
    parent.appendChild(tmp.content);
  }


  removeField() {
    const parent = this.closest('.field');
    parent.outerHTML = '';
  }


  startTest() {

    const sizeRAM = sizeMemoryRAM.value;
    const sizeLocal = sizeMemoryLocal.value;

    const cache = new Cache(sizeRAM, sizeLocal);
    console.log(cache);

    if (document.querySelector('[name="full_data"]:checked').value === 'insert') {
      const keys = document.querySelectorAll('.fields [name="key"]');
      const values = document.querySelectorAll('.fields [name="value"]');
      
      for (let i = 0; i < keys.length; i++) {
        
      }
    }
  }


  stopTest() {

  }



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

