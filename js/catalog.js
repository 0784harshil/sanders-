(function () {
  var catalog = document.getElementById('catalog');
  var errEl = document.getElementById('catalog-error');

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function productHref(p) {
    if (p.link && /^https?:\/\//i.test(String(p.link).trim())) {
      try {
        var u = new URL(String(p.link).trim());
        return u.pathname + u.search;
      } catch (e) {
        return '/product.html?sku=' + encodeURIComponent(p.sku);
      }
    }
    return '/product.html?sku=' + encodeURIComponent(p.sku);
  }

  fetch('/data/products.json')
    .then(function (r) {
      if (!r.ok) throw new Error('bad response');
      return r.json();
    })
    .then(function (items) {
      catalog.innerHTML = items
        .map(function (p) {
          var href = productHref(p);
          return (
            '<article class="card">' +
            '<a href="' + href + '">' +
            '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" width="600" height="600" loading="lazy" />' +
            '</a>' +
            '<div class="card-body">' +
            '<h2><a href="' + href + '">' + esc(p.title) + '</a></h2>' +
            '<p class="price">' + esc(p.currency) + ' ' + esc(p.price) + '</p>' +
            '<p class="meta">SKU: ' + esc(p.sku) + '</p>' +
            '</div></article>'
          );
        })
        .join('');
    })
    .catch(function () {
      errEl.hidden = false;
    });
})();
