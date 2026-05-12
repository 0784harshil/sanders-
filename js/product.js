(function () {
  'use strict';
  var MC = window.MerchantCommon;
  var params = new URLSearchParams(window.location.search);
  var sku = params.get('sku');
  var root = document.getElementById('root');
  var metaDesc =
    document.getElementById('meta-desc') ||
    document.querySelector('meta[name="description"]');

  if (!root) return;

  if (!MC) {
    root.innerHTML = '<p class="meta">Missing scripts.</p>';
    return;
  }

  if (!sku) {
    root.innerHTML =
      '<p class="meta">Open a product from the <a href="/products.html">catalog</a>.</p>';
    return;
  }

  function buildShippingOffer(site) {
    var sd = site.shipping_details || {};
    return {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: String(sd.shipping_rate_value != null ? sd.shipping_rate_value : '0'),
        currency: sd.shipping_rate_currency || site.currency || 'USD'
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: sd.destination_country || 'US'
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: sd.handling_min_days != null ? sd.handling_min_days : 1,
          maxValue: sd.handling_max_days != null ? sd.handling_max_days : 2,
          unitCode: 'DAY'
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: sd.transit_min_days != null ? sd.transit_min_days : 3,
          maxValue: sd.transit_max_days != null ? sd.transit_max_days : 7,
          unitCode: 'DAY'
        }
      }
    };
  }

  Promise.all([
    MC.fetchSite(),
    fetch('/data/products.json').then(function (r) {
      if (!r.ok) throw new Error('products');
      return r.json();
    })
  ])
    .then(function (tuple) {
      var site = tuple[0];
      var items = tuple[1];
      var p = items.find(function (x) {
        return String(x.sku) === String(sku);
      });

      if (!p) {
        root.innerHTML = '<p class="meta">Product not found for this SKU.</p>';
        return;
      }

      var returnsUrl = MC.absoluteUrl(site, '/returns.html');

      root.innerHTML =
        '<div class="layout">' +
        '<div><img src="' +
        MC.esc(p.image) +
        '" alt="' +
        MC.esc(p.title) +
        '" width="600" height="600" loading="eager" /></div>' +
        '<div>' +
        '<h1>' +
        MC.esc(p.title) +
        '</h1>' +
        '<p class="price">' +
        MC.esc(p.currency || 'USD') +
        ' ' +
        MC.esc(p.price) +
        '</p>' +
        '<p class="meta">Availability (must match Merchant Center): <strong>' +
        MC.esc(p.availability) +
        '</strong></p>' +
        '<p class="meta">Brand: <strong>' +
        MC.esc(p.brand) +
        '</strong></p>' +
        '<div class="policy-prose"><p>' +
        MC.esc(p.description) +
        '</p></div>' +
        '<p class="meta">Offer ID / SKU: <code>' +
        MC.esc(p.sku) +
        '</code></p>' +
        '<p class="meta"><a href="' +
        MC.esc(returnsUrl) +
        '">Return policy</a> · <a href="' +
        MC.esc(MC.absoluteUrl(site, '/shipping.html')) +
        '">Shipping information</a></p>' +
        '</div></div>';
      root.setAttribute('data-loaded', '1');

      MC.injectVerificationMeta(site);

      var canonical = MC.absoluteUrl(site, '/product.html?sku=' + encodeURIComponent(p.sku));
      MC.setCanonical(canonical);
      if (metaDesc) metaDesc.setAttribute('content', p.description);
      document.title = p.title + ' — ' + site.business_name;

      try {
        MC.setOgTags({
          title: p.title,
          description: p.description,
          image: p.image,
          url: canonical,
          type: 'product'
        });
      } catch (e1) {}

      var origin = site.canonical_origin.replace(/\/$/, '');

      var offer = {
        '@type': 'Offer',
        url: canonical,
        price: p.price,
        priceCurrency: p.currency || site.currency || 'USD',
        availability: MC.availabilityToSchema(p.availability),
        itemCondition: 'https://schema.org/NewCondition',
        priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          .toISOString()
          .slice(0, 10),
        seller: {
          '@type': 'Organization',
          name: site.legal_business_name || site.business_name,
          url: origin
        },
        shippingDetails: [buildShippingOffer(site)],
        merchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: site.address_country || 'US',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: site.return_policy_days != null ? site.return_policy_days : 30,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFeesCustomerResponsibility: 'https://schema.org/FreeReturn',
          url: returnsUrl
        }
      };

      var productLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        sku: p.sku,
        name: p.title,
        description: p.description,
        image: [p.image],
        brand: { '@type': 'Brand', name: p.brand },
        offers: offer
      };

      try {
        MC.injectJsonLd('ld-product', productLd);
      } catch (e2) {}

      var crumbs = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: MC.absoluteUrl(site, '/')
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: MC.absoluteUrl(site, '/products.html')
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: p.title,
            item: canonical
          }
        ]
      };
      try {
        MC.injectJsonLd('ld-breadcrumb', crumbs);
      } catch (e3) {}
    })
    .catch(function () {
      root.innerHTML =
        '<p class="meta">Could not load catalog. Deploy <code>data/site.json</code> and <code>data/products.json</code> with your hosting.</p>';
    });
})();
