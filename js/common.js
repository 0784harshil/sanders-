(function (window) {
  'use strict';

  window.MerchantCommon = {
    esc: function (s) {
      if (s === undefined || s === null) return '';
      var d = document.createElement('div');
      d.textContent = String(s);
      return d.innerHTML;
    },

    fetchSite: function () {
      return fetch('data/site.json').then(function (r) {
        if (!r.ok) throw new Error('site.json');
        return r.json();
      });
    },

    availabilityToSchema: function (availabilityText) {
      var m = String(availabilityText || '').toLowerCase();
      if (m.indexOf('out') !== -1) return 'https://schema.org/OutOfStock';
      if (m.indexOf('preorder') !== -1 || m.indexOf('pre-order') !== -1)
        return 'https://schema.org/PreOrder';
      if (m.indexOf('limited') !== -1) return 'https://schema.org/LimitedAvailability';
      return 'https://schema.org/InStock';
    },

    absoluteUrl: function (site, relativePath) {
      try {
        return new URL(relativePath, site.canonical_origin).href;
      } catch (e) {
        return relativePath;
      }
    },

    injectVerificationMeta: function (site) {
      var v = site.google_site_verification;
      if (!v || !String(v).trim()) return;
      if (document.querySelector('meta[name="google-site-verification"]')) return;
      var meta = document.createElement('meta');
      meta.setAttribute('name', 'google-site-verification');
      meta.setAttribute('content', String(v).trim());
      document.head.appendChild(meta);
    },

    injectJsonLd: function (id, data) {
      var el = document.getElementById(id);
      if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    },

    fillDataSiteElements: function (site) {
      document.querySelectorAll('[data-site]').forEach(function (el) {
        var key = el.getAttribute('data-site');
        if (!key || site[key] === undefined || site[key] === null) return;
        var val = site[key];
        if (Array.isArray(val)) {
          el.textContent = val.join(', ');
        } else if (typeof val === 'object') {
          el.textContent = JSON.stringify(val);
        } else {
          el.textContent = String(val);
        }
      });
    },

    setCanonical: function (href) {
      var existing = document.querySelector('link[rel="canonical"]');
      if (existing) {
        existing.setAttribute('href', href);
        return;
      }
      var link = document.createElement('link');
      link.rel = 'canonical';
      link.href = href;
      document.head.appendChild(link);
    },

    setOgTags: function (opts) {
      function meta(property, content) {
        if (!content) return;
        var m = document.querySelector('meta[property="' + property + '"]');
        if (!m) {
          m = document.createElement('meta');
          m.setAttribute('property', property);
          document.head.appendChild(m);
        }
        m.setAttribute('content', content);
      }
      meta('og:title', opts.title);
      meta('og:description', opts.description);
      meta('og:image', opts.image);
      meta('og:url', opts.url);
      meta('og:type', opts.type || 'website');
    }
  };
})(window);
