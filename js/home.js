(function () {
  'use strict';
  var MC = window.MerchantCommon;
  if (!MC) return;

  MC.fetchSite()
    .then(function (site) {
      MC.injectVerificationMeta(site);
      MC.fillDataSiteElements(site);

      var origin = site.canonical_origin.replace(/\/$/, '');
      var logo = site.logo_url || origin + '/images/logo.svg';
      var orgId = origin + '/#organization';

      MC.injectJsonLd('ld-organization', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': orgId,
        name: site.legal_business_name || site.business_name,
        legalName: site.legal_business_name || site.business_name,
        url: origin,
        logo: logo,
        image: logo,
        telephone: site.telephone,
        email: site.email,
        description: site.business_description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.street_address,
          addressLocality: site.address_locality,
          addressRegion: site.address_region,
          postalCode: site.postal_code,
          addressCountry: site.address_country
        },
        sameAs: Array.isArray(site.sameAs) ? site.sameAs : []
      });

      MC.injectJsonLd('ld-website', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': origin + '/#website',
        name: site.business_name,
        url: origin + '/',
        publisher: { '@id': orgId }
      });

      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && site.business_description) {
        metaDesc.setAttribute('content', site.business_description);
      }

      document.title = site.business_name + ' — Official catalog';
    })
    .catch(function () {});
})();
