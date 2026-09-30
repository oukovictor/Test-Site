const toggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (toggle && navList) {
  toggle.addEventListener('click', () => navList.classList.toggle('open'));
  navList.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => navList.classList.remove('open')));
}

const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

const countdownGrid = document.getElementById('countdownGrid');
if (countdownGrid) {
  const fixtures = [
    {
      opponent: 'Cloth Millers',
      date: '2026-10-01T15:00:00+03:00',
      timeLabel: '15:00 EAT',
      venue: 'San Siro, Kincar · League fixture'
    },
    {
      opponent: 'Kasarani FC',
      date: '2026-10-15T15:00:00+03:00',
      timeLabel: '15:00 EAT',
      venue: 'Kasarani Stadium · Cup fixture'
    },
    {
      opponent: 'Mwiki United',
      date: '2026-10-29T15:00:00+03:00',
      timeLabel: '15:00 EAT',
      venue: 'Kincar Pitch · Friendly'
    }
  ];

  const dEl = document.getElementById('cd-days');
  const hEl = document.getElementById('cd-hours');
  const mEl = document.getElementById('cd-mins');
  const sEl = document.getElementById('cd-secs');
  const opponentEl = document.getElementById('fixtureOpponent');
  const dateEl = document.getElementById('fixtureDate');
  const timeEl = document.getElementById('fixtureTime');
  const venueEl = document.getElementById('fixtureVenue');
  const noteEl = document.getElementById('fixtureNote');
  const pad = (n) => String(n).padStart(2, '0');

  const formatDate = (value) => new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(value);

  const upcomingFixture = fixtures
    .filter((fixture) => new Date(fixture.date).getTime() > Date.now())
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || fixtures[0];

  const target = new Date(upcomingFixture.date).getTime();

  if (opponentEl) {
    opponentEl.textContent = upcomingFixture.opponent;
  }
  if (dateEl) {
    dateEl.textContent = formatDate(new Date(upcomingFixture.date));
  }
  if (timeEl) {
    timeEl.textContent = upcomingFixture.timeLabel;
  }
  if (venueEl) {
    venueEl.textContent = upcomingFixture.venue;
  }
  if (noteEl) {
    noteEl.textContent = `Next fixture loaded: ${upcomingFixture.opponent} on ${formatDate(new Date(upcomingFixture.date))}.`;
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
}

const cartTrigger = document.getElementById('cartTrigger');
const cartClose = document.getElementById('cartClose');
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartItems = document.getElementById('cartItems');
const cartEmpty = document.getElementById('cartEmpty');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartNote = document.getElementById('cartNote');
let cart = JSON.parse(localStorage.getItem('utawalaCart') || '[]');

const formatCurrency = (amount) => `KES ${amount.toLocaleString('en-KE')}`;

function saveCart() {
  localStorage.setItem('utawalaCart', JSON.stringify(cart));
}

function renderCart() {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = itemCount;
  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <strong>${item.name}</strong>
        <span>Size ${item.size} · ${formatCurrency(item.price)}</span>
      </div>
      <div class="cart-quantity">
        <button type="button" data-action="decrease" data-key="${item.key}" aria-label="Remove one ${item.name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" data-key="${item.key}" aria-label="Add one ${item.name}">+</button>
      </div>
    </div>
  `).join('');
  cartEmpty.hidden = cart.length > 0;
  cartTotal.textContent = formatCurrency(total);
  clearCartBtn.disabled = cart.length === 0;
  checkoutBtn.disabled = cart.length === 0;
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle('open', isOpen);
  cartDrawer.setAttribute('aria-hidden', String(!isOpen));
  cartOverlay.hidden = !isOpen;
  document.body.classList.toggle('cart-open', isOpen);
}

document.querySelectorAll('.add-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.jersey-card');
    const size = card.querySelector('.size-select').value;
    const name = btn.dataset.item;
    const key = `${name}-${size}`;
    const existing = cart.find((item) => item.key === key);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ key, name, size, price: Number(btn.dataset.price), quantity: 1 });
    }
    saveCart();
    renderCart();
    setCartOpen(true);
    const original = btn.textContent;
    btn.textContent = 'Added';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('added');
    }, 1600);
  });
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const item = cart.find((entry) => entry.key === button.dataset.key);
  if (!item) return;
  if (button.dataset.action === 'increase') item.quantity += 1;
  if (button.dataset.action === 'decrease') item.quantity -= 1;
  cart = cart.filter((entry) => entry.quantity > 0);
  saveCart();
  renderCart();
});

cartTrigger.addEventListener('click', () => setCartOpen(true));
cartClose.addEventListener('click', () => setCartOpen(false));
cartOverlay.addEventListener('click', () => setCartOpen(false));
clearCartBtn.addEventListener('click', () => {
  cart = [];
  saveCart();
  renderCart();
  cartNote.textContent = 'Your cart is empty. Add a kit to get started.';
});
checkoutBtn.addEventListener('click', () => {
  if (cart.length > 0) {
    window.location.href = 'checkout.html';
  }
});
renderCart();

const amountBtns = document.querySelectorAll('.amount-btn');
const customAmount = document.getElementById('customAmount');
amountBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    amountBtns.forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    if (customAmount) {
      customAmount.value = '';
    }
  });
});

if (customAmount) {
  customAmount.addEventListener('input', () => {
    amountBtns.forEach((b) => b.classList.remove('selected'));
  });
}

const contributeBtn = document.getElementById('contributeBtn');
if (contributeBtn) {
  contributeBtn.addEventListener('click', () => {
    const selected = document.querySelector('.amount-btn.selected');
    const amount = customAmount?.value || (selected ? selected.dataset.amount : null);
    const original = contributeBtn.textContent;

    if (!amount) {
      contributeBtn.textContent = 'Pick or enter an amount';
    } else {
      contributeBtn.textContent = `Thank you — KES ${amount} noted ✓`;
    }

    setTimeout(() => {
      contributeBtn.textContent = original;
    }, 2200);
  });
}
