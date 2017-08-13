
export class Native {

  static init() {
    Common.includeComponents(Var.components);
  }


  /*
  *   register component
  */

  static component(name = '', url = '') {
    if (typeof url === 'string' && url.startsWith('/')) {
      const obj = {};
      obj[name] = url;
      Common.includeComponents(obj);
    } else {
      console.error(`Invalid name component: ${ name }`);
    }
  }





  /*
   *  get and post request with callback
   *
   *  beforeSend, complete, error, success, onprogress
   *
   */

  static request({
    contentType = 'multipart/form-data',
    method = 'GET',
    processData = true,
    url = null,
    data = null,
    beforeSend = null,
    complete = null,
    error = null,
    success = null,
    onprogress = null } = { url }) {

    let body = ['\r\n'];

    const XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xhr = new XHR();

    if (data) {
      method = 'POST';
    }

    if (typeof onprogress === 'function') {
      xhr.onprogress = onprogress;
    }

    xhr.open(method, url, true);

    if (data) {
      let boundary = String(Math.random()).slice(2);
      const boundaryMiddle = '--' + boundary + '\r\n';
      const boundaryLast = '--' + boundary + '--\r\n';

      for (let key in data) {
        body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
      }

      body = body.join(boundaryMiddle) + boundaryLast;
      xhr.setRequestHeader('Content-Type', `${ contentType }; boundary=` + boundary);
    }

    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    if (typeof beforeSend === 'function') {
      beforeSend();
    }

    xhr.send(body);

    xhr.onload = (response) => {

      let responseText = response.currentTarget.responseText;

      if (processData) {
        try {
          responseText = JSON.parse(responseText);
        } catch(e) {
          console.error(e, responseText);
        }
      }

      if (typeof success === 'function') {
        success(responseText, url);
      }

      if (typeof complete === 'function') {
        complete();
      }
    };

    xhr.onerror = function (e) {
      if (typeof error === 'function') {
        error(e, url);
      } else {
        console.error(`Error ${ e.target.status } occurred while receiving the document.`);
      }
    };

  }

}
