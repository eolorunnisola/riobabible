/** n8n webhook URL — set in index.html via window.RIOBA_SIGNUP_WEBHOOK, or here directly. */
const SIGNUP_ENDPOINT =
  (typeof window !== 'undefined' && window.RIOBA_SIGNUP_WEBHOOK) || '';

const SCRIPTURES = [
  {
    text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
    ref: 'Matthew 11:28',
  },
  {
    text: 'Be still, and know that I am God.',
    ref: 'Psalm 46:10',
  },
  {
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    ref: 'Philippians 4:6',
  },
  {
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God.',
    ref: 'Isaiah 41:10',
  },
  {
    text: 'Trust in the Lord with all your heart and lean not on your own understanding.',
    ref: 'Proverbs 3:5',
  },
  {
    text: 'The Lord is my shepherd; I shall not want.',
    ref: 'Psalm 23:1',
  },
  {
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    ref: 'Joshua 1:9',
  },
  {
    text: 'And we know that in all things God works for the good of those who love him.',
    ref: 'Romans 8:28',
  },
  {
    text: 'My grace is sufficient for you, for my power is made perfect in weakness.',
    ref: '2 Corinthians 12:9',
  },
  {
    text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    ref: 'Jeremiah 29:11',
  },
];

const ROTATE_MS = 6000;

function scriptureHtml(item) {
  return `${item.text}<span class="scripture-ref">${item.ref}</span>`;
}

/** Reserve enough height for the longest verse so text never overlaps the card below. */
function sizeScriptureRotator(rotator) {
  const width = rotator.clientWidth;
  if (!width) return;

  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = `position:absolute;left:-9999px;top:0;width:${width}px;visibility:hidden;pointer-events:none;`;
  document.body.appendChild(probe);

  let maxHeight = 0;
  for (const item of SCRIPTURES) {
    const p = document.createElement('p');
    p.className = 'scripture';
    p.innerHTML = scriptureHtml(item);
    probe.appendChild(p);
    maxHeight = Math.max(maxHeight, p.offsetHeight);
    probe.removeChild(p);
  }

  document.body.removeChild(probe);
  rotator.style.minHeight = `${maxHeight}px`;
}

function initScriptureRotator() {
  const rotator = document.querySelector('.scripture-rotator');
  const slots = document.querySelectorAll('.scripture');
  if (!rotator || slots.length < 2 || SCRIPTURES.length === 0) return;

  let index = 0;
  let activeSlot = 0;

  function render(slot, item) {
    slot.innerHTML = scriptureHtml(item);
  }

  render(slots[0], SCRIPTURES[0]);
  render(slots[1], SCRIPTURES[1]);
  slots[0].classList.add('active');
  sizeScriptureRotator(rotator);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => sizeScriptureRotator(rotator), 150);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  setInterval(() => {
    const nextIndex = (index + 1) % SCRIPTURES.length;
    const inactiveSlot = 1 - activeSlot;

    render(slots[inactiveSlot], SCRIPTURES[nextIndex]);
    slots[activeSlot].classList.remove('active');
    slots[inactiveSlot].classList.add('active');

    activeSlot = inactiveSlot;
    index = nextIndex;
  }, ROTATE_MS);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function submitSignup(email) {
  if (SIGNUP_ENDPOINT) {
    const res = await fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, source: 'rioba-signup' }),
    });
    if (!res.ok) throw new Error('Signup failed');
    return;
  }
  await new Promise((r) => setTimeout(r, 400));
}

function initForm() {
  const form = document.getElementById('signup-form');
  const formPanel = document.getElementById('form-panel');
  const thankPanel = document.getElementById('thank-panel');
  const emailInput = document.getElementById('email');
  const errorEl = document.getElementById('form-error');
  const submitBtn = document.getElementById('submit-btn');

  if (!form || !formPanel || !thankPanel || !emailInput) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    errorEl.textContent = '';

    if (!isValidEmail(email)) {
      emailInput.classList.add('invalid');
      errorEl.textContent = 'Please enter a valid email address.';
      emailInput.focus();
      return;
    }

    emailInput.classList.remove('invalid');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    try {
      await submitSignup(email);
      formPanel.classList.add('hidden');
      thankPanel.classList.remove('hidden');
      thankPanel.setAttribute('aria-hidden', 'false');
    } catch {
      errorEl.textContent = 'Something went wrong. Please try again.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get the app link';
    }
  });

  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('invalid');
    errorEl.textContent = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScriptureRotator();
  initForm();
});
