//
// persistent.js
//

let counterRequest = 0;

class Persistent {

  constructor(curId, curMaxSize) {
    this._id = curId;
    this._maxMemory = curMaxSize;
    this._busyMemory = 0;
    this._lifeTime = {};
  }

  get maxMemory() { return this._maxMemory; };
  get busyMemory() { return this._busyMemory; };
  get freeMemory() { return (this._maxMemory - this._busyMemory); };


  /*
  *   Get data from Local Storage by key
  *
  *   @key: when need get value by key (string) || empty: return all data
  */

  data(key) {
    counterRequest++;

    if (key) {
      return JSON.parse(localStorage.getItem(this._id))[key];
    } else {
      return JSON.parse(localStorage.getItem(this._id));
    }
  };



  /*
  *   Insert data to Local Storage by key
  *
  *   @key: key set to Local Storage (string)
  *   @data: data set to Local Storage by key (any)
  *   @sizeData: how much data is occupied (number)
  */

  insert(key, data, sizeData) {
    const freeSize = this.freeMemory;
    const values = this.data();

    if (values && values[key] && JSON.stringify(values[key]) === JSON.stringify(data)) {
      Storage._setKeyLifeTime(key, sizeData, this._lifeTime);
      return;
    }

    if (sizeData < freeSize) {

      counterRequest++;
      this._setValuesLocalStorage(key, data, values || {}, sizeData);

    } else if (sizeData < this._maxMemory) {

      const overwriting = Storage._leastRecentlyUsed(this._lifeTime, sizeData - freeSize);
      const values = this.data();

      for (let [key, obj] of overwriting) {
        this._busyMemory -= obj.size;
        delete values[key];
      }

      this._setValuesLocalStorage(key, data, values, sizeData);

    } else {
      throw 'Max size localStorage is less than this data';
    }

  }


  /*
   *   Remove data from Local Storage by key
   *
   *   @key: key from Local Storage (string)
   */

  remove(key) {
    const values = this.data();

    if (values[key]) {
      this._busyMemory -= this._lifeTime[key].size;
      delete values[key];
      counterRequest++;
      localStorage.setItem(this._id, JSON.stringify(values));
    }

  }



  /*
  *   Ancillary function for inserting into Local Storage
  *
  *   @key: key set to Local Storage (string)
  *   @data: data set to Local Storage by key (any)
  *   @values: values from Local Storage by key (any)
  *   @sizeData: how much data is occupied (number)
  *
  */


  _setValuesLocalStorage(key, data, values, sizeData) {
    values[key] = data;
    this._busyMemory += sizeData;
    Storage._setKeyLifeTime(key, sizeData, this._lifeTime);
    counterRequest++;
    localStorage.setItem(this._id, JSON.stringify(values));
  }


  // static methods

  static get counterRequest() { return counterRequest; }


}