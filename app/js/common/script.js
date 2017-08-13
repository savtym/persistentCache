
const classIncludes = {};
const scriptIncludes = [];

export class Script {

    static get classIncludes() { return classIncludes };
    static get scriptIncludes() { return scriptIncludes };


    static hasAttr(tmp, url, name) {

      const regex = new RegExp('src="([^"]*)"', 'g');
      const requestScript = [];
      let isRequest = false;
      let match, script;

      url = url.replace(/[^/]+$/g, '');

      tmp = tmp.replace(/<script([^>]*)>([\s\S]*?)<\/script>/g, function(_, attr, func) {

        while (match = regex.exec(attr)) {
          if (match[0].startsWith('src')) {
            url = (match[1].startsWith('/')) ? match[1] : url + match[1];
            requestScript.push(url);

            return '';
          }
        }

        script = new Function('Native', func);

        return '';
      });

      for (let url of requestScript) {
        isRequest = true;
        System.import(url).then(function(classes) {
          Parse.parsComponents(tmp, classes[Object.keys(classes)[0]], name, true);
        });
      }

      return [tmp, script, isRequest];

    }

    /*
    *   call func js
    */

    static callScripts() {
      try {
        for (let script of scriptIncludes) {
          script.call(Native, Native);
        }
      } catch (e) {
        console.error(`\n${ func }\n\n`, e);
      }
    }



     /*
     *   import script dynamically
     */

    static importScript(component) {
        let scriptsComponent = [];

        component.querySelectorAll(Var.dynamicallyScript).forEach((dom) => {
            scriptsComponent.push(dom.getAttribute('src'));
        });

        for (let script of scriptIncludes) {
            const normalized = System.normalizeSync(script);
            if (System.has(normalized) && scriptsComponent.includes(script)) {
                System.delete(normalized);
            }
            System.import(script);
        }
    }
}
