
const virtuals = [];
const cache = {};


let mainContent;

export class Parse {

  static get virtuals() { return virtuals }


  static parsComponents(tmp, script, name, isClass = false) {


    const cls = new Virtual(tmp, script);

    document.body.querySelectorAll(name).forEach(function(dom) {
      cls.init(dom, isClass);
      if (cls.cls && cls.cls.afterInit) {
        cls.cls.afterInit();
      }
    });

    virtuals.push(cls);

    // const str = Parse.getNClass(Common.components[tmp]);
    //
    // if (typeof str === 'string') {
    //   dom.innerHTML = str;
    // } else {
    //   for (let cls of str) {
    //     dom.innerHTML = cls.el;
    //   }
    // }
    //
    //
    //
    //
    // for (let tmp in Common.components) {
    //   component.querySelectorAll(`${ tmp }`).forEach(function(dom) {
    //     const str = Parse.getNClass(Common.components[tmp]);
    //
    //     if (typeof str === 'string') {
    //         dom.innerHTML = str;
    //     } else {
    //       for (let cls of str) {
    //         dom.innerHTML = cls.el;
    //       }
    //     }
    //
    //   });
    // }

  }


  /*
      get n-class
  */

  static getNClass(str) {
    let match;
    const result = [];
    const regex = new RegExp(Var.className + '="([^"]*)"', 'g');

    while (match = regex.exec(str)) {
      if (Script.classIncludes[match[1]]) {
        const cls = new Virtual(str, Script.classIncludes[match[1]]);
        result.push(cls);
        virtuals.push(cls);
      } else {
        console.error('Not found class: ' + Script.classIncludes[match[1]]);
      }
    }

    return (result.length !== 0) ? result : str;
  }

}