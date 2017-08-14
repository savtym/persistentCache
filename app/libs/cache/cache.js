
const globalSize = 5242880; // 5MB

let idMemory = 1;
let currentSizeMemory = 0;

let defaultSizeRAM = 16384;
let defaultsizeLocal = 16384;

export default class Cache {

  static freeSize() { return (globalSize - currentSizeMemory); }

  constructor(sizeRAM = 16384, sizeLocal = 16384) {

    sizeRAM = parseInt(sizeRAM);
    sizeLocal = parseInt(sizeLocal);

    sizeRAM = (isNaN(sizeRAM) || sizeRAM < 0) ? defaultSizeRAM : sizeRAM;
    sizeLocal = (isNaN(sizeLocal) || sizeLocal < 0) ? defaultsizeLocal : sizeLocal;

    if (Cache.freeSize < sizeLocal) {
      throw 'Memory is full';
    }

    this.persistent = new Persistent(sizeRAM, sizeLocal, idMemory++);
    currentSizeMemory += this.persistent.freeMemoryLocalStorage;

    return this.persistent;
  }

  static removeCache(cache) {
    currentSizeMemory -= cache.maxSizeLocalStorage;
    localStorage.removeItem(cache.id);
    cache = null;
  }

  static clear() {
    currentSizeMemory = 0;
    localStorage.clear();
  }

}
