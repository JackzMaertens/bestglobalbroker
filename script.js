// Terminal simulation log lines — 5 EAs
const logs = [
    "> [09:30:01] Conectado a FPTrading MetaTrader 5 (Servidor ECN)...",
    "> [09:30:03] Cargar EA #1: JAIAK Smart Trending EA [XAUUSD, M5]",
    "> [09:30:05] Cargar EA #2: JAIAK Classic Trend EA [MT5 Multi-Indicator]",
    "> [09:30:07] Cargar EA #3: JAIAK Ratio EA [Pairs Trading, Z-Score]",
    "> [09:30:09] Cargar EA #4: JAIAK EMA Crossing EA [MT5 Multi-TF]",
    "> [09:30:11] Cargar EA #5: JAIAK Speed Turn EA [Reversal, 3-TP]",
    "> [09:30:14] [JAIAK Smart] XAUUSD M5 — 6-Engine Vote: 6/6 ✓ Entrada LONG",
    "> [09:30:18] [JAIAK Smart] Alcanzado 1R → Lock Break-Even (Entrada + Spread)",
    "> [09:30:22] [JAIAK Classic] PSAR+ADX+ATR+Stoch → 4/4 BUY — Entrando...",
    "> [09:30:26] [JAIAK Classic] Cierre parcial 50% al alcanzar Estocástico 80",
    "> [09:30:30] [JAIAK Ratio] Z-Score EURUSD/GBPUSD = +2.1σ → Abriendo par...",
    "> [09:30:34] [JAIAK EMA] EMA9 cruzó EMA21 ARRIBA | Momentum OK | Entrando",
    "> [09:30:38] [JAIAK Speed] Divergencia RSI en zona S/R → Giro SHORT detectado",
    "> [09:30:42] [JAIAK Speed] TP1 alcanzado (+50%) | TP2 activo | Trailing ON",
    "> [09:30:46] Estado sesión: OK | FPTrading Spread: 0.1 pips | Latencia: 11ms"
];

const terminalLogs = document.getElementById('terminal-logs');
let logIndex = 0;

function printNextLog() {
    if (!terminalLogs) return;
    if (logIndex < logs.length) {
        const p = document.createElement('p');
        p.textContent = logs[logIndex];
        terminalLogs.appendChild(p);
        // Keep only last 8 lines visible
        const allP = terminalLogs.querySelectorAll('p');
        if (allP.length > 8) allP[0].remove();
        logIndex++;
        setTimeout(printNextLog, 1100);
    } else {
        setTimeout(() => {
            terminalLogs.innerHTML = '';
            logIndex = 0;
            printNextLog();
        }, 4000);
    }
}

// Multi-Language (i18n) Engine
function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    document.documentElement.lang = lang;
    localStorage.setItem('bestglobalbroker_lang', lang);
}

// Init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    printNextLog();

    // Language switcher
    const savedLang = localStorage.getItem('bestglobalbroker_lang') || 'es';
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = savedLang;
        setLanguage(savedLang);
        langSelect.addEventListener('change', (e) => setLanguage(e.target.value));
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isOpen = faqItem.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const icon = item.querySelector('.faq-icon');
                if (icon) icon.textContent = '+';
            });
            if (!isOpen) {
                faqItem.classList.add('active');
                const icon = button.querySelector('.faq-icon');
                if (icon) icon.textContent = '−';
            }
        });
    });

    // Mobile hamburger menu
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.style.display === 'flex';
            navLinks.style.display = isOpen ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'fixed';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(8, 11, 17, 0.97)';
            navLinks.style.padding = '1.5rem 6%';
            navLinks.style.gap = '1.2rem';
            navLinks.style.zIndex = '99';
            navLinks.style.backdropFilter = 'blur(14px)';
            navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Close mobile menu if open
                if (navLinks) navLinks.style.display = '';
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(8, 11, 17, 0.97)';
        } else {
            navbar.style.background = 'rgba(8, 11, 17, 0.85)';
        }
    });

    // Claim Form Handler → FormSubmit to jackzmaertens@gmail.com
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
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;

                fetch("https://formsubmit.co/ajax/jackzmaertens@gmail.com", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Nombre_Cliente: name,
                        Email_Cliente: email,
                        ID_Cuenta_FPTrading: accountId,
                        EA_Solicitado: eaInterest,
                        Mensaje: message || "(sin mensaje)",
                        _subject: "🚀 NUEVA SOLICITUD DE EAs — BestGlobalBroker.com"
                    })
                })
                .then(response => response.json())
                .then(data => {
                    claimForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                })
                .catch(error => {
                    // Show success anyway (graceful fallback)
                    claimForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                });
            }
        });
    }

    // Intersection Observer: animate EA cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.ea-card, .step-card, .broker-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease, box-shadow 0.3s ease';
        observer.observe(card);
    });
});
