

const maxMemoryDefault = 16384;

class RAM {

	constructor(curMaxSize) {
    this.maxMemory = curMaxSize || maxMemoryDefault;
    this._busyMemory = 0;
    this._lifeTime = {};
    this._data = {};
	}


  get maxMemory() { return this._maxMemory };
  get busyMemory() { return this._busyMemory };
  get freeMemory() { return (this.maxMemory - this._busyMemory) };


  set maxMemory(value) {
    value = (typeof value === 'number') ? value : parseInt(value);

    if (!isNaN(value) && value >= 0) {
      this._maxMemory = value;

      if (value < this.busyMemory) {
        const overwriting = Storage._leastRecentlyUsed(this._lifeTime, this.busyMemory - value);

        for (let [key, obj] of overwriting) {
          this._busyMemory -= obj.size;
          delete this._lifeTime[key];
          delete this._data[key];
        }
      }
    }
  }


  /*
   *   Get data from Local Storage by key
   *
   *   @key: when need get value by key (string) || empty: return all data
   */

  data(key) {
    if (key) {
      return this._data[key];
    } else {
      return this._data;
    }
  };


  /*
   *   Insert data to RAM
   *
   *   @key: key set to RAM (string)
   *   @data: data set to RAM by key (any)
   *   @sizeData: how much data is occupied (number)
   */

  insert(key, data, sizeData) {
    const freeSize = this.freeMemory;

    if (sizeData < freeSize) {

      if (this._data[key]) {
        this._data[key] = {};
      }

      this._data[key] = data;
      this._busyMemory += sizeData;
      Storage._setKeyLifeTime(key, sizeData, this._lifeTime);

    } else if (sizeData < this.maxMemory) {

      const overwriting = Storage._leastRecentlyUsed(this._lifeTime, sizeData - freeSize);

      for (let [key, obj] of overwriting) {
        this._busyMemory -= obj.size;
        delete this._lifeTime[key];
        delete this._data[key];
      }

    } else {
      throw 'Max size RAM is less than this data';
    }

  }


  /*
   *   Remove data from RAM by key
   *
   *   @key: key from RAM (string)
   */

  remove(key) {
    if (this._data[key]) {
      this._busyMemory -= this._lifeTime[key].size;
      delete this._data[key];
    }
  }
  
}