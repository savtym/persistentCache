
const globalSize = 5242880; // 5MB

let idMemory = 1;
let currentSize = 0;

export default class Cache {

  static freeSize() { return (globalSize - currentSize); }

  constructor(sizeRAM = 16384, sizeLocal = 16384) {

    if (Cache.freeSize < sizeLocal) {
      throw 'Memory is full';
    }

    this.persistent = new Persistent(sizeRAM, sizeLocal, idMemory++);
    currentSize += this.persistent.freeMemoryLocalStorage;

    return this.persistent;
  }

  static clear() {
    localStorage.clear();
  }

}
