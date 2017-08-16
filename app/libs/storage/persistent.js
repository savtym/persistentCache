//
// persistent.js
//

let counterRequest = 0;
let maxMemoryDefault = 16384;

class Persistent {


  /*
   *   Constructor of Persistent
   *
   *   @curId: id
   *   @curMaxSize: max memory Local Storage
   */

  constructor(curId, curMaxSize) {
    this._id = curId;
    this.maxMemory = curMaxSize || maxMemoryDefault;
    this._lifeTime = {};

    this.data() || localStorage.setItem(this._id, '{}');
  }


  /*
   *   Getters
   */

  get maxMemory() { return this._maxMemory; };
  get busyMemory() { return (Storage.sizeOf(localStorage.getItem(this._id))); };
  get freeMemory() { return (this._maxMemory - Storage.sizeOf(localStorage.getItem(this._id))); };


  /*
   *   Setters
   */

  set maxMemory(value) {
    value = (typeof value === 'number') ? value : parseInt(value);

    if (!isNaN(value) && value >= 0) {
      this._maxMemory = value;

      if (value < this.busyMemory) {
        const overwriting = Storage._leastRecentlyUsed(this._lifeTime, this.busyMemory - value);
        const values = this.data();

        for (let [key] of overwriting) {
          delete this._lifeTime[key];
          delete values[key];
        }

        counterRequest++;
        localStorage.setItem(this._id, JSON.stringify(values));
      }
    }
  }


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

    if (typeof values[key] !== 'undefined'
      && JSON.stringify(values[key]) === JSON.stringify(data)) {
      Storage._setKeyLifeTime(key, sizeData, this._lifeTime);
      return;
    }

    if (sizeData < freeSize) {
      this._setValuesLocalStorage(key, data, values, sizeData);
    } else if (sizeData < this._maxMemory) {

      const overwriting = Storage._leastRecentlyUsed(this._lifeTime, sizeData - freeSize);
      const values = this.data();

      for (let [key] of overwriting) {
        delete this._lifeTime[key];
        delete values[key];
      }

      this._setValuesLocalStorage(key, data, values, sizeData);

    } else {
      throw 'Max size Persistent is less than this data';
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
      delete values[key];
      counterRequest++;
      localStorage.setItem(this._id, JSON.stringify(values));
    }
  }


  /*
  *     Clear data from Local Storage
  */

  clear() {
    this._lifeTime = {};
    counterRequest++;
    localStorage.setItem(this._id, '{}');
  }



  /*
   *   private methods
   */


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
    Storage._setKeyLifeTime(key, sizeData, this._lifeTime);
    counterRequest++;
    localStorage.setItem(this._id, JSON.stringify(values));
  }


  // static methods

  /*
  *    Getters
  */

  static get counterRequest() { return counterRequest; }


}