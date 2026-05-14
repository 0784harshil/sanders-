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
          var avail = String(p.availability || '').toLowerCase();
          var inStock =
            avail.indexOf('out of') === -1 &&
            avail.indexOf('out_of') === -1 &&
            avail.indexOf('sold out') === -1;
          var cartBtn = '';
          if (inStock && window.StoreCart) {
            cartBtn =
              '<button type="button" class="btn btn-primary btn-compact" data-cart-sku="' +
              esc(p.sku) +
              '">Add to cart</button>';
          }
          return (
            '<article class="card">' +
            '<a href="' +
            href +
            '">' +
            '<img src="' +
            esc(p.image) +
            '" alt="' +
            esc(p.title) +
            '" width="600" height="600" loading="lazy" />' +
            '</a>' +
            '<div class="card-body">' +
            '<h2><a href="' +
            href +
            '">' +
            esc(p.title) +
            '</a></h2>' +
            '<p class="price">' +
            esc(p.currency) +
            ' ' +
            esc(p.price) +
            '</p>' +
            '<p class="meta">SKU: ' +
            esc(p.sku) +
            '</p>' +
            cartBtn +
            '</div></article>'
          );
        })
        .join('');

      if (window.StoreCart) {
        catalog.querySelectorAll('[data-cart-sku]').forEach(function (btn) {
          btn.addEventListener('click', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var sku = btn.getAttribute('data-cart-sku');
            var p = items.find(function (x) {
              return String(x.sku) === String(sku);
            });
            if (p) {
              window.StoreCart.addFromProduct(p, 1);
              btn.textContent = 'Added ✓';
              window.setTimeout(function () {
                btn.textContent = 'Add to cart';
              }, 1400);
              try {
                window.dispatchEvent(new CustomEvent('sanders-cart-updated'));
              } catch (e) {}
            }
          });
        });
      }
    })
    .catch(function () {
      errEl.hidden = false;
    });
})();
