
const components = {
  'app-nav' : '/components/common/app-nav/app-nav.html',
  'app-header' : '/components/common/app-header/app-header.html',
  'app-main' : '/components/core/management/management.html',
};


const listener = 'n\-on:';
const className = 'n\-class';
const nameMainContent = 'app\-main';
const scriptStandard = 'es6';


const documentIsReady = 'documentIsReady';

export class Var {
  static get components() { return components };


  /*
  *  Common
  */

  static get listener() { return listener; }
  static get className() { return className; }
  static get nameMainContent() { return nameMainContent; }
  static get scriptStandard() { return scriptStandard; }


	static get documentIsReady() { return documentIsReady; }

}