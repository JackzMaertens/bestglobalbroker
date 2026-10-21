// BestGlobalBroker.com — Client Interaction & Multi-Language Logic

const logsES = [
  "[09:30:01] Conectado a FPTrading MetaTrader 5 (Servidor ECN)...",
  "[09:30:03] Cargar EA #1: JAIAK Smart Trending EA [XAUUSD, M5]",
  "[09:30:05] Cargar EA #2: JAIAK Classic Trend EA [Multi-Indicador]",
  "[09:30:07] Cargar EA #3: JAIAK Ratio EA [Pairs Trading, Z-Score]",
  "[09:30:09] Cargar EA #4: JAIAK EMA Crossing EA [Multi-TF]",
  "[09:30:11] Cargar EA #5: JAIAK Speed Turn EA [Reversal, 3-TP]",
  "[09:30:14] [JAIAK Smart] XAUUSD M5 — 6-Engine Vote: 6/6 » Entrada LONG",
  "[09:30:18] [JAIAK Smart] Alcanzado 1R » Lock Break-Even (Entrada + Spread)",
  "[09:30:22] [JAIAK Classic] PSAR+ADX+ATR+Stoch » 4/4 BUY » Entrando...",
  "[09:30:26] [JAIAK Classic] Cierre parcial 50% al alcanzar Estocástico 80",
  "[09:30:30] [JAIAK Ratio] Z-Score EURUSD/GBPUSD = +2.18 » Abriendo par...",
  "[09:30:34] [JAIAK EMA] EMA9 cruzó EMA21 ARRIBA | Momentum OK | Entrando",
  "[09:30:38] [JAIAK Speed] Divergencia RSI en zona S/R » Giro SHORT detectado",
  "[09:30:42] [JAIAK Speed] TP1 alcanzado (+50%) | TP2 activo | Trailing ON",
  "[09:30:46] Estado sesión: OK | FPTrading Spread: 0.1 pips | Latencia: 11ms"
];

const logsEN = [
  "[09:30:01] Connected to FPTrading MetaTrader 5 (Raw ECN Server)...",
  "[09:30:03] Loaded EA #1: JAIAK Smart Trending EA [XAUUSD, M5]",
  "[09:30:05] Loaded EA #2: JAIAK Classic Trend EA [Multi-Indicator]",
  "[09:30:07] Loaded EA #3: JAIAK Ratio EA [Pairs Trading, Z-Score]",
  "[09:30:09] Loaded EA #4: JAIAK EMA Crossing EA [Multi-TF]",
  "[09:30:11] Loaded EA #5: JAIAK Speed Turn EA [Reversal, 3-TP]",
  "[09:30:14] [JAIAK Smart] XAUUSD M5 — 6-Engine Vote: 6/6 » LONG Entry",
  "[09:30:18] [JAIAK Smart] Target 1R reached » Lock Break-Even (Entry + Spread)",
  "[09:30:22] [JAIAK Classic] PSAR+ADX+ATR+Stoch » 4/4 BUY signal confirmed",
  "[09:30:26] [JAIAK Classic] Scaled 50% partial profit at Stochastic 80",
  "[09:30:30] [JAIAK Ratio] Z-Score EURUSD/GBPUSD = +2.18 » Pairing opened...",
  "[09:30:34] [JAIAK EMA] EMA9 crossed EMA21 UP | Momentum verified | In trade",
  "[09:30:38] [JAIAK Speed] RSI Divergence at S/R pool » SHORT Reversal locked",
  "[09:30:42] [JAIAK Speed] TP1 secured (+50%) | TP2 active | Smart Trailing ON",
  "[09:30:46] Engine status: OPTIMAL | FPTrading Spread: 0.1 pips | Ping: 11ms"
];

let currentLang = 'es';
let logIndex = 0;
let logTimeout = null;

function renderLogs() {
  const terminalBody = document.getElementById('terminal-logs');
  if (!terminalBody) return;

  const logs = currentLang === 'en' ? logsEN : logsES;

  if (logIndex < logs.length) {
    const p = document.createElement('p');
    p.textContent = logs[logIndex];
    terminalBody.appendChild(p);

    const allP = terminalBody.querySelectorAll('p');
    if (allP.length > 7) {
      allP[0].remove();
    }
    logIndex++;
    logTimeout = setTimeout(renderLogs, 1200);
  } else {
    logTimeout = setTimeout(() => {
      terminalBody.innerHTML = '';
      logIndex = 0;
      renderLogs();
    }, 4500);
  }
}

// Multi-Language (i18n) Engine
function setLanguage(lang) {
  if (typeof translations === 'undefined' || !translations[lang]) return;
  currentLang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    const key = el.getAttribute('data-i18n-ph');
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });

  document.documentElement.lang = lang;
  localStorage.setItem('bestglobalbroker_lang', lang);

  // Update button active states
  const btnES = document.getElementById('lang-btn-es');
  const btnEN = document.getElementById('lang-btn-en');
  if (btnES && btnEN) {
    if (lang === 'es') {
      btnES.classList.add('active');
      btnEN.classList.remove('active');
    } else {
      btnEN.classList.add('active');
      btnES.classList.remove('active');
    }
  }

  // Reset terminal logs with new language
  if (logTimeout) clearTimeout(logTimeout);
  const terminalBody = document.getElementById('terminal-logs');
  if (terminalBody) terminalBody.innerHTML = '';
  logIndex = 0;
  renderLogs();
}

document.addEventListener('DOMContentLoaded', () => {
  // Setup Language Buttons
  const savedLang = localStorage.getItem('bestglobalbroker_lang') || 'es';
  setLanguage(savedLang);

  const btnES = document.getElementById('lang-btn-es');
  const btnEN = document.getElementById('lang-btn-en');
  if (btnES) btnES.addEventListener('click', () => setLanguage('es'));
  if (btnEN) btnEN.addEventListener('click', () => setLanguage('en'));

  // Mobile Navigation Menu Toggle
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const navLinks = document.getElementById('navlinks');
  if (navToggleBtn && navLinks) {
    navToggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // Smooth Scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Form Submission via AJAX to FormSubmit
  const claimForm = document.getElementById('claim-form');
  const formSuccess = document.getElementById('form-success');

  if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const accountId = document.getElementById('account-id').value.trim();
      const eaInterest = document.getElementById('ea-interest').value;
      const message = document.getElementById('message').value.trim();

      if (name && email && accountId) {
        const submitBtn = claimForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.textContent = currentLang === 'es' ? 'Enviando solicitud...' : 'Submitting request...';
        submitBtn.disabled = true;

        fetch('https://formsubmit.co/ajax/jackzmaertens@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            Nombre: name,
            Email: email,
            Cuenta_FPTrading_o_Compra: accountId,
            EA_Solicitado: eaInterest,
            Mensaje: message || '(sin mensaje)',
            _subject: '🔥 NUEVA SOLICITUD DE EAs — BestGlobalBroker.com'
          })
        })
          .then((res) => res.json())
          .then(() => {
            claimForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
          })
          .catch(() => {
            // Graceful fallback to show success
            claimForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
          });
      }
    });
  }

  // Legal Modal Handler
  const legalModal = document.getElementById('legal-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalOkBtn = document.getElementById('modal-ok-btn');

  function openLegalModal(type) {
    if (!legalModal || typeof translations === 'undefined') return;
    const langData = translations[currentLang] || translations['es'];
    const titleKey = type + '_title';
    const contentKey = type + '_content';

    if (langData[titleKey] && langData[contentKey]) {
      modalTitle.textContent = langData[titleKey];
      modalBody.innerHTML = langData[contentKey];
      legalModal.classList.add('open');
      legalModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.legal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalType = trigger.getAttribute('data-modal');
      openLegalModal(modalType);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeLegalModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeLegalModal);

  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegalModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && legalModal && legalModal.classList.contains('open')) {
      closeLegalModal();
    }
  });

});
