// CONSTANTS 
var DELIVERY_FEE            = 30.00;
var TAX_RATE                = 0.12;
var FREE_DELIVERY_THRESHOLD = 250;
var MAX_FIELD_LENGTHS       = { name: 80, email: 120, phone: 11, address: 300, notes: 300 };

// STATE
var cart = sanitizeCart(JSON.parse(localStorage.getItem('dineSpaceCart') || 'null'));
var currentOrderDetails = {};
var promoApplied  = false;
var promoDiscount = 0;

// Map
var mapInstance = null;
var mapMarker   = null;

// INIT
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('menu-page'))     initMenuPage();
    if (document.getElementById('checkout-page')) initCheckoutPage();
});

// CART MIGRATION 
// Sanitize {name, price} items — no qty, no emoji → $NaN / undefined
function sanitizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter(function(i) { return i && typeof i.name === 'string' && i.name.trim(); })
        .map(function(i) {
            var price = parseFloat(i.price);
            var qty   = parseInt(i.qty, 10);
            return {
                name:  sanitizeText(i.name, 80),
                price: isNaN(price) || price < 0 ? 0 : Math.round(price * 100) / 100,
                emoji: (i.emoji && i.emoji.trim() && i.emoji !== 'undefined') ? i.emoji.trim() : '🍽️',
                qty:   (isNaN(qty) || qty < 1) ? 1 : Math.min(qty, 99)
            };
        })
        .slice(0, 50);
}

// SANITIZATION
function sanitizeText(str, maxLen) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLen || 200);
}
function sanitizeEmail(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[^a-zA-Z0-9@._+\-]/g, '').slice(0, 120);
}
function sanitizePhone(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[^0-9+\-()\s]/g, '').slice(0, 20);
}

// MENU PAGE
function initMenuPage() {
    updateMenuUI();
}

function addToCart(itemName, price, emoji) {
    itemName = sanitizeText(String(itemName || ''), 80);
    price    = parseFloat(price);
    emoji    = (typeof emoji === 'string' && emoji.trim()) ? emoji.trim() : '🍽️';
    if (!itemName || isNaN(price) || price <= 0) return;
    price = Math.round(price * 100) / 100;

    var existing = cart.find(function(i) { return i.name === itemName; });
    if (existing) {
        existing.qty = Math.min(existing.qty + 1, 99);
    } else {
        if (cart.length >= 50) { showToast('Cart is full (max 50 items).'); return; }
        cart.push({ name: itemName, price: price, emoji: emoji, qty: 1 });
    }
    saveCart();
    updateMenuUI();
    showToast(emoji + ' ' + itemName + ' added!');

    // Button pulse
    document.querySelectorAll('.add-btn').forEach(function(btn) {
        var oc = btn.getAttribute('onclick') || '';
        if (oc.indexOf(itemName) !== -1) {
            btn.textContent = '✓ Added';
            btn.classList.add('added');
            setTimeout(function() { btn.textContent = '+ Add'; btn.classList.remove('added'); }, 1300);
        }
    });
}

function updateMenuUI() {
    var count    = getItemCount();
    var subtotal = getSubtotal();
    setText('cart-count',     count);
    setText('cart-total-nav', subtotal.toFixed(2));
    setText('fc-total',       subtotal.toFixed(2));

    var floatCart = document.getElementById('floating-cart');
    if (!floatCart) return;
    if (count > 0) {
        floatCart.style.display = 'flex';
        setText('fc-count', count + ' item' + (count !== 1 ? 's' : ''));
        var fcNames = document.getElementById('fc-names');
        if (fcNames) fcNames.textContent = cart.map(function(i){ return i.emoji + ' ' + i.name; }).join(' · ');
    } else {
        floatCart.style.display = 'none';
    }
}

// CHECKOUT PAGE
function initCheckoutPage() {
    renderCheckoutItems();
    updateCheckoutTotals();
    if (cart.length === 0) hideCheckoutSections();
    initMap();

    // Enforce maxlength
    Object.keys(MAX_FIELD_LENGTHS).forEach(function(key) {
        var el = document.getElementById('cust-' + key);
        if (el) el.setAttribute('maxlength', MAX_FIELD_LENGTHS[key]);
    });

    // Payment option toggle
    document.querySelectorAll('.payment-opt').forEach(function(opt) {
        opt.addEventListener('click', function() {
            document.querySelectorAll('.payment-opt').forEach(function(o) { o.classList.remove('selected'); });
            opt.classList.add('selected');
        });
    });
}

function renderCheckoutItems() {
    var cartList = document.getElementById('checkout-cart-items');
    if (!cartList) return;
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = '<li class="empty-cart-msg">Your cart is empty. <a href="menu.html">Browse the menu →</a></li>';
        hideCheckoutSections();
        return;
    }

    cart.forEach(function(item, index) {
        var emoji = (item.emoji && item.emoji !== 'undefined') ? item.emoji : '🍽️';
        var name  = sanitizeText(item.name || 'Unknown item', 80);
        var price = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
        var qty   = (item.qty > 0) ? item.qty : 1;

        var li = document.createElement('li');
        li.className = 'cart-line-item';

        var nameSpan = document.createElement('span');
        nameSpan.className = 'ci-name';
        nameSpan.innerHTML = '<span class="ci-emoji">' + emoji + '</span>';
        var textSpan = document.createElement('span');
        textSpan.className = 'ci-text';
        textSpan.textContent = name;
        nameSpan.appendChild(textSpan);

        var controls = document.createElement('div');
        controls.className = 'ci-controls';
        controls.innerHTML =
            '<button class="qty-btn minus" data-index="' + index + '">−</button>' +
            '<span class="ci-qty-num">' + qty + '</span>' +
            '<button class="qty-btn plus" data-index="' + index + '">+</button>';

        var priceSpan = document.createElement('span');
        priceSpan.className = 'ci-price';
        priceSpan.textContent =  (price * qty).toFixed(2) + ' EGP' ;

        var removeBtn = document.createElement('button');
        removeBtn.className = 'ci-remove';
        removeBtn.dataset.index = index;
        removeBtn.title = 'Remove item';
        removeBtn.textContent = '✕';

        li.appendChild(nameSpan);
        li.appendChild(controls);
        li.appendChild(priceSpan);
        li.appendChild(removeBtn);
        cartList.appendChild(li);
    });

    cartList.querySelectorAll('.ci-remove').forEach(function(btn) {
        btn.addEventListener('click', function() { removeFromCart(parseInt(btn.dataset.index, 10)); });
    });
    cartList.querySelectorAll('.qty-btn.minus').forEach(function(btn) {
        btn.addEventListener('click', function() { changeQty(parseInt(btn.dataset.index, 10), -1); });
    });
    cartList.querySelectorAll('.qty-btn.plus').forEach(function(btn) {
        btn.addEventListener('click', function() { changeQty(parseInt(btn.dataset.index, 10), +1); });
    });
}

function removeFromCart(index) {
    if (!cart[index]) return;
    var name = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCheckoutItems();
    updateCheckoutTotals();
    showToast('Removed: ' + name);
    if (cart.length === 0) hideCheckoutSections();
}

function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, Math.min(99, (cart[index].qty || 1) + delta));
    saveCart();
    renderCheckoutItems();
    updateCheckoutTotals();
}

function hideCheckoutSections() {
    var f = document.getElementById('checkout-form-section');
    var p = document.getElementById('payment-section');
    if (f) f.style.display = 'none';
    if (p) p.style.display = 'none';
}

function updateCheckoutTotals() {
    var subtotal    = getSubtotal();
    var discount    = promoApplied ? Math.round(subtotal * promoDiscount * 100) / 100 : 0;
    var afterPromo  = subtotal - discount;
    var deliveryFee = afterPromo >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    var tax         = Math.round(afterPromo * TAX_RATE * 100) / 100;
    var total       = afterPromo + deliveryFee + tax;

    setText('checkout-subtotal',   subtotal.toFixed(2));
    setText('checkout-tax',        tax.toFixed(2));
    setText('checkout-cart-total', total.toFixed(2));

    var dRow = document.getElementById('discount-row');
    var dEl  = document.getElementById('checkout-discount');
    if (dRow) dRow.style.display = (promoApplied && discount > 0) ? 'flex' : 'none';
    if (dEl && promoApplied) dEl.textContent = discount.toFixed(2) + ' EGP';

    var feeEl = document.getElementById('delivery-fee-display');
    if (feeEl) {
        feeEl.textContent      = deliveryFee === 0 ? 'FREE' : deliveryFee.toFixed(2) + ' EGP';
        feeEl.style.color      = deliveryFee === 0 ? 'var(--success)' : '';
        feeEl.style.fontWeight = deliveryFee === 0 ? '700' : '';
    }

    var bar = document.getElementById('free-delivery-bar');
    var msg = document.getElementById('free-delivery-msg');
    if (bar && msg) {
        if (subtotal >= FREE_DELIVERY_THRESHOLD) {
            bar.style.width = '100%';
            msg.textContent = '🎉 You have free delivery!';
            msg.style.color = 'var(--success)';
        } else {
            bar.style.width = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100) + '%';
            msg.textContent = 'Add ' + (FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2) + ' more for free delivery EGP';
            msg.style.color = '';
        }
    }
}

// PROMO CODES
function applyPromo() {
    var raw  = ((document.getElementById('promo-code') || {}).value || '');
    var code = sanitizeText(raw, 20).toUpperCase();
    var codes = { 
        'DINE10': 0.10, 'DINE20': 0.20, 'WELCOME': 0.15, 'FRESH26': 0.26 
    };

    if (!code) { 
        showPromoMsg('Enter a promo code first.', 'error'); return; 
    }

    if (codes[code] !== undefined) {
        promoApplied  = true;
        promoDiscount = codes[code];
        showPromoMsg('✅ ' + Math.round(promoDiscount * 100) + '% discount applied!', 'success');
        var inp = document.getElementById('promo-code');
        var btn = document.getElementById('promo-apply-btn');
        if (inp) { 
            inp.disabled = true; inp.style.opacity = '0.6'; 
        }
        if (btn) { 
            btn.textContent = 'Applied ✓'; btn.disabled = true; 
        }
        updateCheckoutTotals();
    } else {
        showPromoMsg('❌ Invalid code. Try DINE10 or DINE20.', 'error');
    }
}

function showPromoMsg(msg, type) {
    var el = document.getElementById('promo-msg');
    if (el) { el.textContent = msg; el.className = 'promo-msg ' + type; }
}

// MAP
function initMap() {
    var mapEl = document.getElementById('leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    mapInstance = L.map('leaflet-map').setView([30.0444, 31.2357], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(mapInstance);

    mapInstance.on('click', function(e) { placeMapPin(e.latlng.lat, e.latlng.lng); });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 15);
            placeMapPin(pos.coords.latitude, pos.coords.longitude);
        }, function() {});
    }
}

function placeMapPin(lat, lng) {
    if (mapMarker) mapInstance.removeLayer(mapMarker);
    var icon = L.divIcon({
        className: '',
        html: '<div style="font-size:28px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4))">📍</div>',
        iconSize: [32, 32], iconAnchor: [16, 32]
    });
    mapMarker = L.marker([lat, lng], { icon: icon }).addTo(mapInstance);

    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&lon=' + lng)
        .then(function(r) { return r.json(); })
        .then(function(data) {
            var address = sanitizeText(data.display_name || 'Lat: ' + lat.toFixed(5) + ', Lng: ' + lng.toFixed(5), 300);
            var addrField = document.getElementById('cust-address');
            if (addrField) {
                addrField.value = address;
                addrField.classList.remove('field-error');
                addrField.style.borderColor = 'var(--success)';
                setTimeout(function() { addrField.style.borderColor = ''; }, 2000);
            }
            var qEl = document.getElementById('map-query');
            if (qEl) qEl.value = address;
            mapMarker.bindPopup('<strong>📍 Selected Location</strong><br><small>' + address + '</small>').openPopup();
            showToast('📍 Location added to your address!');
        })
        .catch(function() {
            var fallback = 'Lat: ' + lat.toFixed(5) + ', Lng: ' + lng.toFixed(5);
            var addrField = document.getElementById('cust-address');
            if (addrField) addrField.value = fallback;
            showToast('📍 Location pinned!');
        });
}

function searchOnMap() {
    var query = sanitizeText(((document.getElementById('map-query') || {}).value || ''), 200);
    if (!query) { showToast('Enter a location to search.'); return; }
    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1')
        .then(function(r) { return r.json(); })
        .then(function(data) {
            if (!data || !data.length) { showToast('Location not found. Try a different address.'); return; }
            var lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);
            mapInstance.setView([lat, lng], 16);
            placeMapPin(lat, lng);
        })
        .catch(function() { showToast('Search failed. Try again.'); });
}

function useMyLocation() {
    if (!navigator.geolocation) { 
        showToast('Geolocation not supported.'); 
        return; 
    }
    var btn = document.getElementById('my-location-btn');
    if (btn) { 
        btn.textContent = '⏳ Locating...'; btn.disabled = true; 
    }
    navigator.geolocation.getCurrentPosition(
        function(pos) {
            mapInstance.setView([pos.coords.latitude, pos.coords.longitude], 16);
            placeMapPin(pos.coords.latitude, pos.coords.longitude);
            if (btn) { 
                btn.textContent = '📍 My Location'; btn.disabled = false; 
                }
        },
        function() {
            showToast('Could not get location. Please allow access.');
            if (btn) { btn.textContent = '📍 My Location'; btn.disabled = false;
            }
        }
    );
}

//  PLACE ORDER (DEMO Version — no EmailJS, no OTP)
function initiateCheckout() {
    var name    = sanitizeText(val('cust-name'),    MAX_FIELD_LENGTHS.name);
    var email   = sanitizeEmail(val('cust-email'));
    var phone   = sanitizePhone(val('cust-phone'));
    var address = sanitizeText(val('cust-address'), MAX_FIELD_LENGTHS.address);
    var notes   = sanitizeText(val('cust-notes'),   MAX_FIELD_LENGTHS.notes) || 'None';

    if (!name || !email || !phone || !address) {
        highlightEmptyFields(['cust-name','cust-email','cust-phone','cust-address']);
        showToast('⚠️ Please fill in all required fields.');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('⚠️ Please enter a valid email address.');
        return;
    }
    if (phone.replace(/\D/g, '').length < 7) {
        showToast('⚠️ Please enter a valid phone number.');
        return;
    }
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    var orderItems    = cart.map(function(i) {
        return i.emoji + ' ' + i.name + ' ×' + i.qty + ' (' + (i.price * i.qty).toFixed(2) + ' EGP)';
    }).join(', ');

    var totalPrice    = (document.getElementById('checkout-cart-total') || {}).textContent || getTotal().toFixed(2);
    var paymentMethod = (document.querySelector('input[name="payment"]:checked') || {}).value || 'Cash on Delivery';

    currentOrderDetails = {
        customer_name:  name,
        order_details:  orderItems,
        total_price:     totalPrice +' EGP',
        payment_method: paymentMethod,
        address:        address,
        special_notes:  notes
    };

//Show demo success modal (no OTP, no email verification)
    var ref = generateOrderRef();
    setText('success-order-ref',   ref);
    setText('success-order-items', currentOrderDetails.order_details);
    setText('success-order-total', currentOrderDetails.total_price);
    setText('success-customer',    currentOrderDetails.customer_name);
    setText('success-address',     currentOrderDetails.address);

    startDeliveryCountdown();
    openModal('success-modal');

    // Clear cart
    cart = [];
    saveCart();
}

// Delivery Count Down
function startDeliveryCountdown() {
    var el = document.getElementById('eta-countdown');
    if (!el) return;
    var seconds = 35 * 60;
    el.textContent = fmtTime(seconds);
    var t = setInterval(function() {
        seconds--;
        if (seconds <= 0) { clearInterval(t); el.textContent = 'Arriving now! 🏍️'; return; }
        el.textContent = fmtTime(seconds);
    }, 1000);
}

function fmtTime(s) {
    var m = Math.floor(s / 60), sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
}

// Modals 
function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'flex';
}

function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') && e.target.id !== 'success-modal') {
        e.target.style.display = 'none';
    }
});

// Utilities 
function saveCart()     { 
    localStorage.setItem('dineSpaceCart',
    JSON.stringify(cart)); 
}

function getSubtotal()  { 
    return cart.reduce(function(s,i){
        return s+(parseFloat(i.price)||0)*(parseInt(i.qty,10)||1); }, 0); 
    }

function getTotal()     {
    var s=getSubtotal();
    var fee=s>=FREE_DELIVERY_THRESHOLD?0:DELIVERY_FEE;
    return s+fee+s*TAX_RATE; 
}

function getItemCount() {
    return cart.reduce(function(s,i){
        return s+(parseInt(i.qty,10)||1); 
    },
    0);
}

function val(id){
    var el=document.getElementById(id);
    return el?el.value.trim():'';
}

function setText(id,t)  {
    var el=document.getElementById(id);
    if(el) el.textContent=t;
}

function generateOrderRef() {
    var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = 'DS-';
    if (window.crypto && window.crypto.getRandomValues) {
        var arr = new Uint8Array(8);
        window.crypto.getRandomValues(arr);
        for (var i = 0; i < 8; i++)
            r += c[arr[i] % c.length];
    } else {
        for (var j = 0; j < 8; j++) r += c[Math.floor(Math.random() * c.length)];
    }
    return r;
}

function highlightEmptyFields(ids) {
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el && !el.value.trim()) {
            el.classList.add('field-error');
            el.addEventListener('input', function() {
                el.classList.remove('field-error'); 
            },
            {
                once: true 
            });
        }
    });
}

function showToast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = sanitizeText(msg, 120);
    t.classList.add('show');
    clearTimeout(t._tmr);
    t._tmr = setTimeout(function() { t.classList.remove('show'); }, 2800);
}
