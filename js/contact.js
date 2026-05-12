(function () {
  'use strict';
  var MC = window.MerchantCommon;
  if (!MC || !MC.fetchSite) return;

  MC.fetchSite().then(function (site) {
    var tel = document.querySelector('a[data-site="telephone"]');
    if (tel && site.telephone) {
      tel.textContent = site.telephone;
      tel.setAttribute('href', 'tel:' + String(site.telephone).replace(/\s+/g, ''));
    }
    var em = document.querySelector('[data-site-email="true"]');
    if (em && site.email) {
      em.textContent = site.email;
      em.setAttribute('href', 'mailto:' + site.email);
    }
  });
})();
