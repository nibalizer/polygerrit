(function(document) {
  'use strict';

  // Grab a reference to our auto-binding template
  // and give it some initial binding values
  // Learn more about auto-binding templates at http://goo.gl/Dx1u2g
  var app = document.querySelector('#app');

  // Scroll page to top and expand header
  app.scrollPageToTop = function() {
    document.body.scrollTop = 0;
  };

  // See https://github.com/Polymer/polymer/issues/1381
  window.addEventListener('WebComponentsReady', function() {
    // Middleware
    function scrollToTop(ctx, next) {
      app.scrollPageToTop();
      next();
    }

    // Routes.
    page('/', function() {
      page.redirect('/q/status:open');
    });

    function queryHandler(data) {
      app.route = 'gr-change-list';
      app.params = data.params;
    }

    page('/q/:query,:offset', scrollToTop, queryHandler);
    page('/q/:query', scrollToTop, queryHandler);

    page('/c/:changeNum', scrollToTop, function(data) {
      app.route = 'gr-change-view';
      app.params = data.params;
    });

    page(/^\/c\/(\d+)\/(\d+)\/(.+)/, scrollToTop, function(ctx) {
      app.route = 'gr-diff';
      var params = {
        changeNum: ctx.params[0],
        patchNum: ctx.params[1],
        path: ctx.params[2]
      };
      app.params = params;
    });

    page.start();
  });

})(document);
