
class RAM {
	constructor() {
		
	}


  insertData(key, data) {
    const sizeData = Persistent._roughSizeOfObject(data);
    const freeSize = this.freeMemoryRAM;

    if (sizeData < freeSize) {

      if (data[key]) {
        data[key] = {};
      }

      data[key] = data;
      freeMemoryRAM += sizeData;
      this._setKeyLifeTime(key, sizeData, lifeTimeRAM);

    } else if (sizeData < maxSizeRAM) {

      const overwriting = Persistent._leastRecentlyUsed(lifeTimeRAM, sizeData - freeSize);

      for (let [key, obj] of overwriting) {
        busySizeRAM -= obj.size;
        delete data[key];
      }

    }


    this._insertLocalStorage(key, data, sizeData);
  }


  _setValuesRAM(){};

  
}