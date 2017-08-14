//
// eventEmiter.js
//

/*
 option for cookie:
 name - name cookie
 value - value cookie
 options:
 expires - time life for coolie in seconds
 path - path for cookie
 domain - domain for cookie
 secure - true/false if need send cookie with secure canal
 */

let id;
const data = {};

const lifeTimeRAM = {};
const lifeTimeLocalStorage = {};

let busySizeRAM = 0;
let busySizeLocalStorage = 0;

let maxSizeRAM = 0;
let maxSizeLocalStorage = 0;

class Persistent {

  constructor(curMaxSizeRAM, curMaxSizeLocalStorage, curId) {
    id = curId;
    maxSizeRAM = curMaxSizeRAM;
    maxSizeLocalStorage = curMaxSizeLocalStorage;
  }

  get id() { return id };
  get maxSizeRAM() { return maxSizeRAM };
  get maxSizeLocalStorage() { return maxSizeLocalStorage };

  get RAM() { return data }; 
  get localStorage() { return JSON.parse(localStorage.getItem(id))};

  get freeMemoryRAM() { return (maxSizeRAM - busySizeRAM); };
  get freeMemoryLocalStorage() { return (maxSizeLocalStorage - busySizeLocalStorage); };





  _insertLocalStorage(key, data, sizeData) {
    const freeSize = this.freeMemoryLocalStorage;

    if (sizeData < freeSize) {

      this._setValuesLocalStorage(key, data, JSON.parse(localStorage.getItem(id)) || {}, sizeData, lifeTimeLocalStorage);

    } else if (sizeData < maxSizeLocalStorage) {

      const overwriting = Persistent._leastRecentlyUsed(lifeTimeLocalStorage, sizeData - freeSize);
      const values = this.localStorage();

      for (let [key, obj] of overwriting) {
        busySizeLocalStorage -= obj.size;
        delete values[key];
      }

      this._setValuesLocalStorage(key, data, values, sizeData);

    } else {
      console.log('Max size localStorage is less than this data');
    }

  }

  _setValuesLocalStorage(key, data, values, sizeData, lifeTime) {
    values[key] = data;
    busySizeLocalStorage += sizeData;
    this._setKeyLifeTime(key, sizeData, lifeTime);
    localStorage.setItem(id, JSON.stringify(values));
  }


  _setKeyLifeTime(key, sizeData, lifeTime) {
    lifeTime[key] = {
      size: sizeData ,
      time: new Date().getTime()
    };
  }




  static _leastRecentlyUsed(lifeTime, needSize) {

    let result = [];
    let sortable = [];
    let curSizeFree = 0;

    for (let key in lifeTime) {
      sortable.push([key, lifeTime[key]]);
    }

    sortable.sort(function(a, b) {
      return a[1].time - b[1].time;
    });

    for (let [key, obj] of sortable) {
      result.push([key, obj]);
      curSizeFree += obj.size;
      if (curSizeFree >= needSize) {
        break;
      }
    }

    return result;
  }

  static _roughSizeOfObject(str) {
    return JSON.stringify(str).length * 2;
  }

}