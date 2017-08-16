//
// storage.js
//

const globalSizeLocal = 5242880; // 5MB

let idMemory = 1;
let storage = {};

export default class Storage {


  /*
  *   Constructor of Storage
  *
  *   @sizeRam: max memory RAM
  *   @sizeLocal: max memory Local Storage
  *   @id: id
  */

  constructor({ sizeRAM, sizeLocal, id = idMemory }) {

    if (Storage.freeMemoryLocal < sizeLocal) {
      throw 'Memory is full, remove cache!';
    }

    this._id = id;
    this._ram = new RAM(sizeRAM);
    this._persistent = new Persistent(id, sizeLocal);

    storage[id] = this;

    if (idMemory === id) {
      idMemory++;
    }
  }


  /*
   *   Getters
   */

  get id() { return this._id; }
  get ram() { return this._ram; }
  get persistent() { return this._persistent; }


	/*
	 *   Get data from RAM od Local Storage by key
	 *
	 *   @keyMemory: when need get value by key (string) || empty: return all data
	 */

	data(key) {

		let result;

		if (typeof key !== 'undefined') {

      key = (typeof key === 'string') ? key : key.toString();
      result = this.ram.data(key);

      if (typeof result === 'undefined') {
        result = this.persistent.data(key);
        if (typeof result !== 'undefined') {
          this.ram.insert(key, result, Storage.sizeOf(result))
        }
			}

		} else {
        result = {
          ram: this.ram.data(),
          persistent: this.persistent.data()
        };
		}

		return result;
	}


	/*
	*		Insert data by key
	*
	*   @key: key set to RAM and Local Storage
	*   @data: data set to RAM and Local Storage by key
	*
	*/

	insert(key, data) {

    if (typeof data === 'undefined') {
      throw 'Data is undefined';
    }

    key = (typeof key === 'string') ? key : key.toString();

    this.ram.insert(key, data, Storage.sizeOf(data));
    this.persistent.insert(key, data, Storage.sizeOf(JSON.stringify({key:data})));
	}


	/*
	 *   Remove data from Local Storage and RAM by key
	 *
	 *   @key: key from Local Storage and RAM (string)
	 */

	remove(key) {

	  if (typeof key === 'undefined') {
	    throw 'Key is undefined';
    }

    key = (typeof key === 'string') ? key : key.toString();

    this.ram.remove(key);
    this.persistent.remove(key);
  }


	/*
	 *   Clear cache by Local Storage and RAM
	 */

  clear() {
    this._ram.clear();
    this._persistent.clear();
  }


  // static methods


  /*
  *   Getters
  */

	/*
	 *   Free memory space in the Local storage, by default in browsers is available 5 MB on one tab
	 */

  static get maxMemoryLocal() { return globalSizeLocal; }
  static get freeMemoryLocal() { return (globalSizeLocal - Storage.sizeOf(localStorage)); }


  /*
  * 		Counter request to Local Storage
  */

  static get counterRequest() { return Persistent.counterRequest; }



  /*
   *   Clear By Id cache by Local Storage and RAM
   *
   *   @id: id storage (string || number)
   */

  static clearById(id) {

    if (typeof id !== 'number' && typeof id !== 'string') {
      throw 'Id is not string or number';
    }

    if (storage[id]) {
      storage[id]._ram.clear();
      storage[id]._persistent.clear();
    } else {
      localStorage.removeItem(id);
    }
  }


  /*
   *   Remove By Id cache by Local Storage and RAM
   *
   *   @id: storage (string || number)
   */

  static removeById(id) {

  	if (typeof id !== 'number' && typeof id !== 'string') {
  		throw 'Id is not string or number';
		}

  	if (storage[id]) {
      storage[id].clear();
      storage[id]._ram = null;
      storage[id]._persistent = null;
      delete storage[id];
		} else {
      localStorage.removeItem(id);
    }

	}


	/*
	 *		Clear full data from RAM and Local Storage
	 */

  static remove() {

    for (let cache of storage) {
      cache.clear();
      cache._ram = null;
      cache._persistent = null;
      cache = null;
    }

    storage = [];
    localStorage.clear();
  }


  /*
   *   Size Of obj set key into life time object
   *
   *   @obj: how much memory (any)
   *
   */

  static sizeOf(obj) {
    let bytes = 0;

    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          const objClass = Object.prototype.toString.call(obj).slice(8, -1);

          if (objClass === 'Object' || objClass === 'Array') {
            for (let key in obj) {
              if (!obj.hasOwnProperty(key)) {
                continue;
              }
              bytes += Storage.sizeOf(obj[key]);
            }

          } else  {
            bytes += JSON.stringify(obj).length * 2;
          }

          break;
      }
    }

    return bytes;
  };


  /*
  *   private methods
  */


	/*
	 *   Ancillary function for set key into life time object
	 *
	 *   @key: key set to Local Storage (string)
	 *   @sizeData: how much data is occupied (number)
	 *   @lifeTime: object that stores the key data ({ size: (number), time: (number) })
	 *
	 */

  static _setKeyLifeTime(key, sizeData, lifeTime) {
    lifeTime[key] = {
      size: sizeData,
      time: new Date().getTime()
    };
  }


  /*
  *		Ancillary function for Least Recently Used (LRU) data
	*
	*   @lifeTime: object that stores the key data ({ size: (number), time: (number) })
	*		@needSize: how need memory size for data
  *
  */

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

}