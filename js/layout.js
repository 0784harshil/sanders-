(function () {
  'use strict';
  var MC = window.MerchantCommon;
  if (!MC || !MC.fetchSite) return;

  MC.fetchSite()
    .then(function (site) {
      MC.injectVerificationMeta(site);
      MC.fillDataSiteElements(site);
      var yr = new Date().getFullYear();
      document.querySelectorAll('.js-year').forEach(function (el) {
        el.textContent = yr;
      });

      if (window.StoreCart) {
        function injectCartLink() {
          var n = window.StoreCart.countItems();
          var label = n ? 'Cart (' + n + ')' : 'Cart';
          var existing = document.querySelectorAll('a[data-nav-cart]');
          if (existing.length) {
            existing.forEach(function (a) {
              a.textContent = label;
            });
            return;
          }
          document.querySelectorAll('.nav-links').forEach(function (nav) {
            var a = document.createElement('a');
            a.setAttribute('data-nav-cart', '1');
            a.href = '/cart.html';
            a.textContent = label;
            nav.appendChild(a);
          });
        }
        injectCartLink();
        window.addEventListener('sanders-cart-updated', injectCartLink);
      }
    })
    .catch(function () {});
})();
