//
// storage.js
//

const globalSizeLocal = 5242880; // 5MB

let idMemory = 1;
let currentSizeMemoryRAM = 0;
let currentSizeMemoryPersistent = 0;

let defaultSizeRAM = 16384;
let defaultSizeLocal = 16384;

let storages = {};


export default class Storage {

  constructor(sizeRAM = 16384, sizeLocal = 16384) {

    sizeRAM = parseInt(sizeRAM);
    sizeLocal = parseInt(sizeLocal);

    sizeRAM = (isNaN(sizeRAM) || sizeRAM < 0) ? defaultSizeRAM : sizeRAM;
    sizeLocal = (isNaN(sizeLocal) || sizeLocal < 0) ? defaultSizeLocal : sizeLocal;

    if (Storage.freeMemoryLocal < sizeLocal) {
      throw 'Memory is full, clear cache!';
    }


    this._id = idMemory;
    this._ram = new RAM(sizeRAM);
    this._persistent = new Persistent(idMemory, sizeLocal);

    currentSizeMemoryRAM += sizeRAM;
    currentSizeMemoryPersistent += sizeLocal;

    storages[idMemory++] = this;
  }


  get id() { return this._id };

	get freeMemory() {
		return {
			ram: this._ram.freeMemory,
			persistent: this._persistent.freeMemory
    };
	}

  get busyMemory() {
    return {
      ram: this._ram.busyMemory,
      persistent: this._persistent.busyMemory
    };
  }

	get maxMemory() {
		return {
      ram: this._ram.maxMemory,
      persistent: this._persistent.maxMemory
		};
	}


	/*
	 *   Get data from RAM od Local Storage by key
	 *
	 *   @keyMemory: when need get value by key (string) || empty: return all data
	 */

	data(key) {

		if (typeof key !== 'string') {
			throw 'Key is not string';
		}

		let result;
		const busyMemory = this.busyMemory;

		if (key) {

      result = this._ram.data(key);

      if (result) {
        result = this._persistent.data(key);
			}

		} else {

      if (busyMemory.ram >= busyMemory.persistent) {
        result = this._ram.data();
      } else {
        result = this._persistent.data();
      }

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

    this._ram.insert(key, data, Storage.sizeOf(data));
    this._persistent.insert(key, data, Storage.sizeOf(JSON.stringify(data)));
	}


	/*
	 *   Remove data from Local Storage and RAM by key
	 *
	 *   @key: key from Local Storage and RAM (string)
	 */

	remove(key) {

    key = (typeof key === 'string') ? key : key.toString();

    this._ram.remove(key);
    this._persistent.remove(key);
  }


	/*
	 *   Clear cache by Local Storage and RAM
	 *
	 *   @cache: link to storage (link (class => function))
	 */

  clear() {
    currentSizeMemoryRAM -= this._ram.maxMemory;
    currentSizeMemoryPersistent -= this._persistent.maxMemory;

    localStorage.removeItem(this._id);
    delete storages[this._id];
  }


  // static methods


	/*
	 *   Free memory space in the Local storage, by default in browsers is available 5 MB on one tab
	 */

  static get maxMemoryLocal() { return globalSizeLocal; }
  static get freeMemoryLocal() { return (globalSizeLocal - Storage.sizeOf(localStorage)); }


  /*
  * 		Counter request to Local Storage
  */

  static get counterRequest() { return Persistent.counterRequest; }



  static clearById(id) {

  	if (typeof id !== 'number' && typeof id !== 'string') {
  		throw 'Id is not string or number';
		}

  	if (storages[id]) {
  		storages[id].clear();
		}

	}


	/*
	 *		Clear full data from RAM and Local Storage
	 */

  static clear() {
    currentSizeMemoryRAM = 0;
    currentSizeMemoryPersistent = 0;

    for (let storage of storages) {
      storage = null;
    }

    storages = [];

    localStorage.clear();
  }


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
	 *   Ancillary function for set key into life time object
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