(function () {
  'use strict';
  var MC = window.MerchantCommon;
  var Cart = window.StoreCart;
  var form = document.getElementById('checkout-form');
  var rootMsg = document.getElementById('checkout-msg');
  if (!Cart) return;

  var ORDER_KEY = 'sanders_last_order_v1';

  function showMsg(text, isError) {
    if (!rootMsg) return;
    rootMsg.textContent = text;
    rootMsg.className = 'checkout-msg' + (isError ? ' checkout-msg--error' : '');
    rootMsg.hidden = false;
  }

  function tryAddFromHash(products) {
    var h = window.location.hash || '';
    var m = /^#add=(.+)$/.exec(h);
    if (!m) return;
    var sku = decodeURIComponent(m[1]);
    var p = products.find(function (x) {
      return String(x.sku) === String(sku) || String(x.gmc_offer_id || '') === String(sku);
    });
    if (!p) return;
    var avail = String(p.availability || '').toLowerCase();
    if (avail.indexOf('out') !== -1) return;
    Cart.addFromProduct(p, 1);
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e) {}
  }

  function orderId() {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
  }

  Promise.all([
    MC && MC.fetchSite ? MC.fetchSite() : Promise.resolve({}),
    fetch('/data/products.json').then(function (r) {
      if (!r.ok) throw new Error('products');
      return r.json();
    })
  ])
    .then(function (tuple) {
      var products = tuple[1];
      tryAddFromHash(products);

      var lines = Cart.getLines();
      var emptyEl = document.getElementById('checkout-empty');
      var mainEl = document.getElementById('checkout-main');
      if (!lines.length) {
        if (emptyEl) emptyEl.hidden = false;
        if (mainEl) mainEl.hidden = true;
        return;
      }
      if (emptyEl) emptyEl.hidden = true;
      if (mainEl) mainEl.hidden = false;

      var sum = Cart.subtotal();
      var cur = lines[0].currency || 'USD';
      var sumEl = document.getElementById('checkout-order-total');
      if (sumEl) sumEl.textContent = cur + ' ' + sum.toFixed(2);

      if (!form) return;

      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        showMsg('', false);

        var name = String(form.elements.namedItem('full_name').value || '').trim();
        var email = String(form.elements.namedItem('email').value || '').trim();
        var phone = String(form.elements.namedItem('phone').value || '').trim();
        var age = form.elements.namedItem('age_confirm');
        if (!name || !email || !phone) {
          showMsg('Please fill in name, email, and phone.', true);
          return;
        }
        if (!age || !age.checked) {
          showMsg('Please confirm you are 21 or older.', true);
          return;
        }

        var linesNow = Cart.getLines();
        if (!linesNow.length) {
          showMsg('Your cart is empty.', true);
          return;
        }

        var oid = orderId();
        var order = {
          id: oid,
          created: new Date().toISOString(),
          customer: { name: name, email: email, phone: phone },
          lines: linesNow,
          total: Cart.subtotal(),
          currency: linesNow[0].currency || 'USD'
        };

        try {
          sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
        } catch (e2) {}

        Cart.clear();
        window.location.href = '/order-complete.html?id=' + encodeURIComponent(oid);
      });
    })
    .catch(function () {
      showMsg('Could not load catalog. Try again later.', true);
    });
})();
