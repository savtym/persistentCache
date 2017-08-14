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
let lifeTime = {};
let busySizeLocalStorage = 0;

class Persistent {

  constructor(maxSizeRAM, maxSizeLocalStorage, curId) {
    id = curId;
    this.maxSizeLocalStorage = maxSizeLocalStorage;
    this.maxSizeRAM = maxSizeRAM;
  }



  get freeMemoryLocalStorage() { return (this.maxSizeLocalStorage - busySizeLocalStorage); }



  insertLocalStorage(key, data) {
    const sizeData = Persistent._roughSizeOfObject(data);
    const freeSize = this.freeMemoryLocalStorage;

    if (sizeData < freeSize) {

      this.setValues(key, data, JSON.parse(localStorage.getItem(id)) || {}, sizeData);

    } else if (sizeData < this.maxSizeLocalStorage) {

      const overwriting = Persistent.leastRecentlyUsed(lifeTime, sizeData - freeSize);
      const values = this.allValues();

      for (let [key, obj] of overwriting) {
        busySizeLocalStorage -= obj.size;
        delete values[key];
      }

      this.setValues(key, data, values, sizeData);

    } else {
      console.log('Max size localStorage is less than this data');
    }

  }

  setValues(key, data, values, sizeData) {
    values[key] = data;
    busySizeLocalStorage += sizeData;
    this.setKeyLifeTime(key, sizeData);

    localStorage.setItem(id, JSON.stringify(values));
  }


  setKeyLifeTime(key, sizeData) {
    lifeTime[key] = {
      size: sizeData ,
      time: new Date().getTime()
    };
  }


  allValues() { return JSON.parse(localStorage.getItem(id))};


  static leastRecentlyUsed(lifeTime, needSize) {

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