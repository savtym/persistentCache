
const tmps = [];
const cache = {};

let isInnerBody = false;
let counterRequest = 0;

// HTML Escape helper utility
const util = (function () {
  // Thanks to Andrea Giammarchi
  let
    reEscape = /[&<>'"]/g,
    reUnescape = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g,
    oEscape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    },
    oUnescape = {
      '&amp;': '&',
      '&#38;': '&',
      '&lt;': '<',
      '&#60;': '<',
      '&gt;': '>',
      '&#62;': '>',
      '&apos;': "'",
      '&#39;': "'",
      '&quot;': '"',
      '&#34;': '"'
    },
    fnEscape = function (m) {
      return oEscape[m];
    },
    fnUnescape = function (m) {
      return oUnescape[m];
    },
    replace = String.prototype.replace
    ;
  return (Object.freeze || Object)({
    escape: function escape(s) {
      return replace.call(s, reEscape, fnEscape);
    },
    unescape: function unescape(s) {
      return replace.call(s, reUnescape, fnUnescape);
    }
  });
}());

export class Common {


  static get components() { return cache };

  static incrementCounterRequest() { counterRequest++; };



  static decrementCounterRequest(str) {
    counterRequest--;

    if (counterRequest === 0) {
      Parse.parsComponents(str);
    }
  };


  /*
   *   include components
   */

  static includeComponents(components) {

    for (let name in components) {
      if (!cache[name]) {

        Native.request({
          processData: false,
          url: components[name],
          success: (response, url) => {
            cache[url] = response;
            let [tmp, script, isRequest] = Script.hasAttr(response, url, name);

            if (!isRequest) {
              Parse.parsComponents(tmp, script, name);
            }
          }
        });

      } else {
        debugger;
        // tmp.innerHTML = cache[name];
        // tmp = (tmp.content) ? tmp.content : tmp;
        //
        // Script.hasAttr(tmp, components[name]);
        // Script.importScript(tmp);
        // Parse.parsComponents(tmp, name);
      }
    }
  }


  /*
      get component by url
  */
  //
  // static getComponentByRoute(name, url) {
  //   if (isInnerBody) {
  //     const obj = {};
  //     obj[name] = url;
  //     Common.includeComponents(document.createElement('template'), obj);
  //   } else {
  //     tmps.push({name: name, url: url});
  //   }
  // }


}