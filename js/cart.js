(function (window) {
  'use strict';

  var STORAGE_KEY = 'sanders_liquor_cart_v1';

  function readRaw() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function writeRaw(lines) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch (e) {}
  }

  function parsePrice(val) {
    var n = parseFloat(String(val == null ? '0' : val).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  }

  window.StoreCart = {
    STORAGE_KEY: STORAGE_KEY,

    getLines: function () {
      return readRaw();
    },

    countItems: function () {
      return readRaw().reduce(function (sum, line) {
        return sum + (line.qty || 0);
      }, 0);
    },

    subtotal: function () {
      return readRaw().reduce(function (sum, line) {
        return sum + parsePrice(line.price) * (line.qty || 0);
      }, 0);
    },

    clear: function () {
      writeRaw([]);
      try {
        window.dispatchEvent(new CustomEvent('sanders-cart-updated'));
      } catch (e) {}
    },

    setQty: function (sku, qty) {
      var q = parseInt(String(qty), 10);
      if (isNaN(q) || q < 1) {
        this.remove(sku);
        return;
      }
      var lines = readRaw();
      var i;
      for (i = 0; i < lines.length; i++) {
        if (String(lines[i].sku) === String(sku)) {
          lines[i].qty = q;
          writeRaw(lines);
          try {
            window.dispatchEvent(new CustomEvent('sanders-cart-updated'));
          } catch (e2) {}
          return;
        }
      }
    },

    remove: function (sku) {
      var next = readRaw().filter(function (line) {
        return String(line.sku) !== String(sku);
      });
      writeRaw(next);
      try {
        window.dispatchEvent(new CustomEvent('sanders-cart-updated'));
      } catch (e3) {}
    },

    /** @param p product row from products.json */
    addFromProduct: function (p, qty) {
      if (!p || !p.sku) return;
      var addQty = parseInt(String(qty == null ? 1 : qty), 10);
      if (isNaN(addQty) || addQty < 1) addQty = 1;

      var lines = readRaw();
      var found = false;
      var i;
      for (i = 0; i < lines.length; i++) {
        if (String(lines[i].sku) === String(p.sku)) {
          lines[i].qty = (lines[i].qty || 0) + addQty;
          found = true;
          break;
        }
      }
      if (!found) {
        lines.push({
          sku: String(p.sku),
          title: String(p.title || ''),
          price: parsePrice(p.price),
          currency: String(p.currency || 'USD'),
          image: String(p.image || ''),
          qty: addQty
        });
      }
      writeRaw(lines);
      try {
        window.dispatchEvent(new CustomEvent('sanders-cart-updated'));
      } catch (e4) {}
    }
  };
})(window);
