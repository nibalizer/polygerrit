(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Listen for template bound event to know when bindings
  // have resolved and content has been stamped to the page
  app.addEventListener('dom-change', function() {
    console.log('Our app is ready to rock!');
  });

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // imports are loaded and elements have been registered
    console.log('Web Components Ready!');
  });

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.body.scrollTop = 0;
  };

})(document);

function loadResource(type, url) {
  return new Promise(function(fulfill, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = type;
    xhr.send();
    xhr.onload = function() {
      fulfill(xhr);
    };
    xhr.onerror = function() {
      reject(xhr);
    };
  });
}

function loadText(url) {
  return loadResource('text', url).then(function(xhr) {
    return xhr.responseText;
  });
}

function loadDocument(url) {
  return loadResource('document', url).then(function(xhr) {
    if (!xhr.responseXML) {
      throw Error('Not found');
    }
    return xhr.responseXML;
  });
}

function loadJSON(url) {
  return loadResource('json', url).then(function(xhr) {
    if (!xhr.response) {
      throw Error('Not found');
    }
    return xhr.response;
  });
}
