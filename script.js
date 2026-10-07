// Terminal simulation log lines
const logs = [
    "> [09:30:01] Conectado a FPTrading MetaTrader 5 (Servidor ECN)...",
    "> [09:30:03] Cargar EA #1: JAIAK Smart Trending EA [XAUUSD, M5]",
    "> [09:30:05] Cargar EA #2: JAIAK Classic Trend EA [MT5 Multi-Indicator]",
    "> [09:30:08] [JAIAK Smart Trending] Entrada XAUUSD M5: 6-Engine Vote + MA Cloud [OK]",
    "> [09:30:12] [JAIAK Smart Trending] Alcanzado 1R -> Lock Break-Even (Entrada + Spread)",
    "> [09:30:16] [JAIAK Classic Trend] Votación 4 Indicadores (PSAR+ADX+ATR+Stoch) -> 4/4 BUY",
    "> [09:30:20] [JAIAK Classic Trend] Cierre parcial 50% al alcanzar Estocástico 80",
    "> [09:30:25] [JAIAK Classic Trend] 50% restante sigue la tendencia tras PSAR...",
    "> [09:30:30] Estado de la sesión: OK | FPTrading Spread: 0.1 pips | Latencia: 11ms"
];

const terminalLogs = document.getElementById('terminal-logs');
let logIndex = 0;

function printNextLog() {
    if (!terminalLogs) return;
    if (logIndex < logs.length) {
        const p = document.createElement('p');
        p.textContent = logs[logIndex];
        terminalLogs.appendChild(p);
        logIndex++;
        setTimeout(printNextLog, 1200);
    } else {
        setTimeout(() => {
            terminalLogs.innerHTML = '';
            logIndex = 0;
            printNextLog();
        }, 5000);
    }
}

// Multi-Language (i18n) Engine
function setLanguage(lang) {
    if (typeof translations === 'undefined' || !translations[lang]) return;
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem('bestglobalbroker_lang', lang);
}

// Iniciar componentes al cargar DOM
document.addEventListener('DOMContentLoaded', () => {
    printNextLog();

    const savedLang = localStorage.getItem('bestglobalbroker_lang') || 'es';
    const langSelect = document.getElementById('lang-select');
    
    if (langSelect) {
        langSelect.value = savedLang;
        setLanguage(savedLang);

        langSelect.addEventListener('change', (e) => {
            setLanguage(e.target.value);
        });
    }
});

// Desplazamiento suave para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Manejo del Formulario de Solicitud de EAs -> Envío a jackzmaertens@gmail.com vía FormSubmit
const claimForm = document.getElementById('claim-form');
const formSuccess = document.getElementById('form-success');

if (claimForm) {
    claimForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const accountId = document.getElementById('account-id').value;

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
                    _subject: "🚀 NUEVA SOLICITUD DE EAs - BestGlobalBroker.com"
                })
            })
            .then(response => response.json())
            .then(data => {
                claimForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            })
            .catch(error => {
                claimForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            });
        }
    });
}
