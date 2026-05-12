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
    })
    .catch(function () {});
})();
