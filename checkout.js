const orderItems = document.getElementById('orderItems');
const checkoutEmpty = document.getElementById('checkoutEmpty');
const orderTotals = document.getElementById('orderTotals');
const orderSubtotal = document.getElementById('orderSubtotal');
const orderDelivery = document.getElementById('orderDelivery');
const orderTotal = document.getElementById('orderTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutMessage = document.getElementById('checkoutMessage');
const payment = document.getElementById('payment');
const mpesaFields = document.getElementById('mpesaFields');
const mpesaPhone = document.getElementById('mpesaPhone');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const jerseyNumberSection = document.getElementById('jerseyNumberSection');
const jerseyNumberFields = document.getElementById('jerseyNumberFields');
const darajaEndpoint = 'https://fastapi-ta07.onrender.com/api/v1/stkpush';
const callbackPollInterval = 3000;
let cart = JSON.parse(localStorage.getItem('utawalaCart') || '[]');

const formatCurrency = (amount) => `KES ${amount.toLocaleString('en-KE')}`;

function selectedDeliveryFee() {
  return Number(document.querySelector('input[name="delivery"]:checked')?.dataset.fee || 0);
}

function updatePaymentFields() {
  const isMpesa = payment.value === 'mpesa';
  mpesaFields.hidden = !isMpesa;
  mpesaPhone.required = isMpesa;
  mpesaPhone.pattern = '2547\\d{8}';
  placeOrderBtn.textContent = isMpesa ? 'Request M-Pesa payment' : 'Place demo order';
}

function renderJerseyNumberFields() {
  jerseyNumberFields.innerHTML = cart.map((item) => `
    <div class="field">
      <label for="jersey-${item.key}">${item.name} · Size ${item.size}</label>
      <input id="jersey-${item.key}" type="number" min="0" max="99" inputmode="numeric" placeholder="Optional number" data-jersey-key="${item.key}">
    </div>
  `).join('');
  jerseyNumberSection.hidden = cart.length === 0;
}

function renderOrder() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = selectedDeliveryFee();
  orderItems.innerHTML = cart.map((item) => `
    <div class="order-item">
      <div>
        <strong>${item.name}</strong>
        <small>Size ${item.size} · Qty ${item.quantity}</small>
      </div>
      <span class="order-item-price">${formatCurrency(item.price * item.quantity)}</span>
    </div>
  `).join('');
  const isEmpty = cart.length === 0;
  checkoutEmpty.hidden = !isEmpty;
  orderTotals.hidden = isEmpty;
  checkoutForm.querySelector('.place-order-btn').disabled = isEmpty;
  orderSubtotal.textContent = formatCurrency(subtotal);
  orderDelivery.textContent = deliveryFee ? formatCurrency(deliveryFee) : 'Free';
  orderTotal.textContent = formatCurrency(subtotal + deliveryFee);
  renderJerseyNumberFields();
}

function callbackSucceeded(result) {
  return result.callbackReceived === true
    || result.paid === true
    || result.status === 'success'
    || result.ResultCode === 0
    || result.resultCode === 0;
}

function callbackFailed(result) {
  return result.status === 'failed'
    || result.status === 'cancelled'
    || (result.ResultCode !== undefined && Number(result.ResultCode) !== 0)
    || (result.resultCode !== undefined && Number(result.resultCode) !== 0);
}

async function waitForCallback(statusUrl) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, callbackPollInterval));
    const response = await fetch(statusUrl);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || result.error || `Callback status failed (${response.status})`);
    }
    if (callbackSucceeded(result)) return result;
    if (callbackFailed(result)) {
      throw new Error(result.message || result.ResultDesc || result.resultDesc || 'M-Pesa payment was not completed');
    }
  }
  throw new Error('Timed out waiting for the M-Pesa callback');
}

document.querySelectorAll('input[name="delivery"]').forEach((option) => {
  option.addEventListener('change', renderOrder);
});

payment.addEventListener('change', updatePaymentFields);

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (cart.length === 0) return;
  if (!checkoutForm.reportValidity()) return;

  const submitLabel = placeOrderBtn.textContent;
  const deliveryFee = selectedDeliveryFee();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  
  const jerseyNumbers = [...document.querySelectorAll('[data-jersey-key]')]
    .filter((input) => input.value)
    .map((input) => ({ key: input.dataset.jerseyKey, number: Number(input.value) }));
  const payload = {
    amount: subtotal + deliveryFee,
    phone: mpesaPhone.value,
    customer: {
      name: checkoutForm.fullName.value,
      email: checkoutForm.email.value,
      phone: checkoutForm.phone.value
    },
    delivery: {
      method: checkoutForm.delivery.value,
      address: checkoutForm.address.value,
      fee: deliveryFee
    },
    items: cart,
    jerseyNumbers
  };

  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Sending payment request...';
  checkoutMessage.textContent = '';

  try {
    const response = await fetch(darajaEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || result.error || `API request failed (${response.status})`);
    }

    const orderNumber = result.orderNumber || result.CheckoutRequestID || `UY-${Date.now().toString().slice(-6)}`;
    checkoutMessage.textContent = `Payment request sent for order ${orderNumber}. Check your phone to complete the M-Pesa prompt.`;
    if (!result.statusUrl && !callbackSucceeded(result)) {
      checkoutMessage.textContent = `Payment request sent for order ${orderNumber}. Waiting for the Daraja callback; your cart is still reserved.`;
      placeOrderBtn.disabled = false;
      placeOrderBtn.textContent = submitLabel;
      return;
    }
    const callbackResult = result.statusUrl ? await waitForCallback(result.statusUrl) : result;
    localStorage.removeItem('utawalaCart');
    checkoutMessage.textContent = `Payment confirmed for order ${orderNumber}. Your kit order is complete.`;
    renderOrder();
  } catch (error) {
    checkoutMessage.textContent = `Payment request failed: ${error.message}. Confirm that the Daraja API is running on port 8000.`;
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = submitLabel;
  }
});

updatePaymentFields();
renderOrder();
