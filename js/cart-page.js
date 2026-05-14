(function () {
  'use strict';
  var MC = window.MerchantCommon;
  var Cart = window.StoreCart;
  var root = document.getElementById('cart-root');
  if (!root || !Cart) return;

  function esc(s) {
    return MC ? MC.esc(s) : String(s == null ? '' : s);
  }

  function render() {
    var lines = Cart.getLines();
    if (!lines.length) {
      root.innerHTML =
        '<p class="meta">Your cart is empty.</p>' +
        '<p><a class="btn-link" href="/products.html">Browse products</a></p>';
      return;
    }

    var rows = lines
      .map(function (line) {
        var sub = (Number(line.price) || 0) * (line.qty || 0);
        return (
          '<tr data-sku="' +
          esc(line.sku) +
          '">' +
          '<td class="cart-thumb"><img src="' +
          esc(line.image) +
          '" alt="" width="72" height="72" loading="lazy" /></td>' +
          '<td><a href="/product.html?sku=' +
          encodeURIComponent(line.sku) +
          '">' +
          esc(line.title) +
          '</a><div class="meta">SKU <code>' +
          esc(line.sku) +
          '</code></div></td>' +
          '<td class="cart-price">' +
          esc(line.currency) +
          ' ' +
          esc(line.price) +
          '</td>' +
          '<td><label class="sr-only" for="qty-' +
          esc(line.sku) +
          '">Quantity</label>' +
          '<input class="cart-qty" id="qty-' +
          esc(line.sku) +
          '" type="number" min="1" max="99" value="' +
          esc(line.qty) +
          '" data-sku="' +
          esc(line.sku) +
          '" /></td>' +
          '<td>' +
          esc(line.currency) +
          ' ' +
          sub.toFixed(2) +
          '</td>' +
          '<td><button type="button" class="btn btn-ghost btn-remove" data-sku="' +
          esc(line.sku) +
          '">Remove</button></td>' +
          '</tr>'
        );
      })
      .join('');

    var total = Cart.subtotal();
    var currency = lines[0].currency || 'USD';

    root.innerHTML =
      '<div class="cart-wrap">' +
      '<table class="cart-table" aria-label="Shopping cart">' +
      '<thead><tr><th></th><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>' +
      '<tbody>' +
      rows +
      '</tbody></table>' +
      '<div class="cart-summary">' +
      '<p class="cart-total"><strong>Estimated total:</strong> ' +
      esc(currency) +
      ' ' +
      total.toFixed(2) +
      '</p>' +
      '<p class="meta">Taxes calculated at checkout. Alcohol: valid ID required at pickup.</p>' +
      '<a class="btn-link" href="/checkout.html">Proceed to checkout</a>' +
      '</div></div>';

    root.querySelectorAll('.cart-qty').forEach(function (input) {
      input.addEventListener('change', function () {
        Cart.setQty(input.getAttribute('data-sku'), input.value);
        render();
      });
    });
    root.querySelectorAll('.btn-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Cart.remove(btn.getAttribute('data-sku'));
        render();
      });
    });
  }

  render();
  window.addEventListener('sanders-cart-updated', render);
})();
