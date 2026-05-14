(function () {
  'use strict';
  var MC = window.MerchantCommon;
  var root = document.getElementById('order-root');
  var ORDER_KEY = 'sanders_last_order_v1';
  if (!root) return;

  var params = new URLSearchParams(window.location.search);
  var idParam = params.get('id');

  try {
    var raw = sessionStorage.getItem(ORDER_KEY);
    if (!raw) {
      root.innerHTML =
        '<p class="meta">No order information found. If you just completed checkout, open this page from the confirmation step.</p>' +
        '<p><a class="btn-link" href="/products.html">Back to catalog</a></p>';
      return;
    }
    var order = JSON.parse(raw);
    if (idParam && order.id && order.id !== idParam) {
      root.innerHTML =
        '<p class="meta">Order reference does not match.</p>' +
        '<p><a class="btn-link" href="/">Home</a></p>';
      return;
    }

    var linesHtml = (order.lines || [])
      .map(function (line) {
        var sub = (Number(line.price) || 0) * (line.qty || 0);
        return (
          '<li>' +
          (MC ? MC.esc(line.title) : line.title) +
          ' × ' +
          line.qty +
          ' — ' +
          (order.currency || 'USD') +
          ' ' +
          sub.toFixed(2) +
          '</li>'
        );
      })
      .join('');

    root.innerHTML =
      '<div class="order-card">' +
      '<p class="order-badge">Order placed</p>' +
      '<h1>Thank you, ' +
      (MC ? MC.esc((order.customer && order.customer.name) || '') : '') +
      '</h1>' +
      '<p class="meta">Confirmation number: <strong>' +
      (MC ? MC.esc(order.id) : order.id) +
      '</strong></p>' +
      '<p>We received your order. A store associate will contact you at <strong>' +
      (MC ? MC.esc((order.customer && order.customer.email) || '') : '') +
      '</strong> to confirm payment (card or pay at pickup) and pickup or delivery details.</p>' +
      '<ul class="order-lines">' +
      linesHtml +
      '</ul>' +
      '<p class="cart-total"><strong>Total:</strong> ' +
      (order.currency || 'USD') +
      ' ' +
      (Number(order.total) || 0).toFixed(2) +
      '</p>' +
      '<p class="meta">Government-issued ID proving age 21+ is required when you receive alcohol.</p>' +
      '<p><a class="btn-link" href="/products.html">Continue shopping</a></p>' +
      '</div>';

    try {
      sessionStorage.removeItem(ORDER_KEY);
    } catch (e) {}
  } catch (err) {
    root.innerHTML =
      '<p class="meta">Could not read order details.</p><p><a href="/">Home</a></p>';
  }
})();
