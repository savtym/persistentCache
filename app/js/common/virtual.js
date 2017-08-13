
const properties = {};

const html = (function(){
  const cache = {};

  function generateTemplate(template){
    let fn = cache[template];

    if (!fn){
      // Replace ${expressions} (etc) with ${map.expressions}.
      const sanitized = template
        .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match) {
        	const prop = match.trim();
        	properties[prop] = Virtual.hashCode(prop);
          return `<property n-hash="${ properties[prop] }">\$\{map.${ prop }\}</property>`;
        })
        // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
        .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
      fn = new Function('map', `return \`${sanitized}\``);
      
    }
    return fn;
  }

  return generateTemplate;
})();


export class Virtual {

	constructor(tmp, cls) {
		this.tmp = tmp;
		this.cls = cls;
	}


	init(parent, isClass) {

    this.parent = parent;

		if (isClass) {

      this.tmp = html(this.tmp);

      this.cls = new this.cls(Native);

      const properties = Object.getOwnPropertyNames(this.cls);
      const obj = {};

      for (let key of properties) {
        obj[key] = this.cls[key];
        Object.defineProperty(this.cls, key, {
        	set: function(value) {
        		debugger
        		this[key] = val;

        	}
        });
        debugger;
      }

      this.parent.innerHTML = this.tmp(obj);

      this.methods = Virtual.parseMethods(this.parent, this.cls);
      Virtual.eventListener(this.methods);

		} else if (this.cls) {
      this.parent.innerHTML = this.tmp;
			new this.cls(Native);
		} else {
      this.parent.innerHTML = this.tmp;
		}

	}


  destructor() {
    Virtual.eventListener(this.methods, false);
  }


	/*
			event listener
	*/

	static eventListener(methods, isAddEvent = true) {
		const funcListener = (isAddEvent) ? 'addEventListener' : 'removeEventListener';
		for (let event of methods) {
			for (let [key, obj] of event) {
        obj.dom[funcListener](key, obj.func, false);
			}
		}
	}


	/*
			parse methods
	*/

	static parseMethods(el, cls) {

		const result = [];

		el.querySelectorAll('*').forEach(function(dom) {

    	for (let attr of dom.attributes) {

    		if (attr.name.startsWith(Var.listener)) {

					let func = attr.value;

					if (cls && cls[func]) {
						func = cls[func].bind(cls);
					} else {
						func = new Function('Native', attr.value).bind(Native, Native);
					}

					result.push(new Map([[attr.name.replace(Var.listener, ''), { func: func, dom: dom }]]));
    			break;
    		}

    	}

    });

		return result;
	}


	static hashCode(str) {
    let hash = 0;
    str = (typeof str === 'string') ? str : str.toString();

    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

}