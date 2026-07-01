// ===== Relógio na barra superior =====
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${hh}:${mm}`;
}
updateClock();
setInterval(updateClock, 1000 * 30);

// ===== Modais (Login / Cadastro) =====
const modalLogin = document.getElementById('modalLogin');
const modalCadastro = document.getElementById('modalCadastro');

function openModal(modal) {
  document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
  modal.classList.add('show');
}
function closeModal(modal) {
  modal.classList.remove('show');
}

document.getElementById('openLogin')?.addEventListener('click', () => openModal(modalLogin));
document.getElementById('openRegister')?.addEventListener('click', () => openModal(modalCadastro));
document.getElementById('switchToRegister')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal(modalCadastro);
});

document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.close);
    if (target) closeModal(target);
  });
});

window.addEventListener('click', (e) => {
  document.querySelectorAll('.modal.show').forEach(modal => {
    if (e.target === modal) closeModal(modal);
  });
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.show').forEach(closeModal);
  }
});

// ===== Envio dos formulários (simulado, sem backend real) =====
document.getElementById('formCadastro')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Cadastro simulado com sucesso! (nenhum dado foi enviado a um servidor)');
  e.target.reset();
  closeModal(modalCadastro);
});

document.getElementById('formLogin')?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Login simulado com sucesso! (nenhum dado foi enviado a um servidor)');
  e.target.reset();
  closeModal(modalLogin);
});

// ===== Botão do Bolão (sidebar) =====
document.getElementById('btnPromo')?.addEventListener('click', () => {
  alert('Funcionalidade de bolão simulada — em breve!');
});

// ===== Cupom de Aposta (simulado, sem transações reais) =====
const betslip = new Map(); // key -> { match, pick, odd, el }

const betslipEmpty = document.getElementById('betslipEmpty');
const betslipSelections = document.getElementById('betslipSelections');
const betslipFooter = document.getElementById('betslipFooter');
const betslipCount = document.getElementById('betslipCount');
const stakeInput = document.getElementById('stakeInput');
const totalOddsEl = document.getElementById('totalOdds');
const potentialReturnEl = document.getElementById('potentialReturn');

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function renderBetslip() {
  const hasSelections = betslip.size > 0;
  betslipEmpty.hidden = hasSelections;
  betslipFooter.hidden = !hasSelections;
  betslipCount.textContent = betslip.size;

  betslipSelections.innerHTML = '';
  let totalOdds = 1;

  betslip.forEach((sel, key) => {
    totalOdds *= sel.odd;
    const item = document.createElement('div');
    item.className = 'betslip-item';
    item.innerHTML = `
      <div class="betslip-item-main">
        <span class="betslip-item-match">${sel.match}</span>
        <span class="betslip-item-pick">${sel.pick}</span>
      </div>
      <span class="betslip-item-odd">${sel.odd.toFixed(2)}</span>
      <button class="betslip-remove" data-key="${key}" aria-label="Remover">
        <svg class="icon icon-xs"><use href="#i-trash"/></svg>
      </button>`;
    betslipSelections.appendChild(item);
  });

  betslipSelections.querySelectorAll('.betslip-remove').forEach(btn => {
    btn.addEventListener('click', () => removeSelection(btn.dataset.key));
  });

  const stake = parseFloat(stakeInput.value) || 0;
  totalOddsEl.textContent = hasSelections ? totalOdds.toFixed(2) : '0.00';
  potentialReturnEl.textContent = formatBRL(hasSelections ? stake * totalOdds : 0);
}

function removeSelection(key) {
  betslip.delete(key);
  document.querySelector(`.odd[data-key="${key}"]`)?.classList.remove('is-selected');
  renderBetslip();
}

document.querySelectorAll('.odd').forEach((btn, idx) => {
  const card = btn.closest('.match-card');
  const teams = card ? [...card.querySelectorAll('.team')].map(t => t.textContent.replace(/\d+$/, '').trim()) : ['Time A', 'Time B'];
  const matchLabel = teams.join(' × ');
  const pickLabel = btn.querySelector('.odd-label')?.textContent === 'X' ? 'Empate' : `Vitória — ${btn.querySelector('.odd-label')?.textContent === '1' ? teams[0] : teams[1]}`;
  const oddValue = parseFloat(btn.querySelector('.odd-value')?.textContent) || 0;
  const key = `sel-${idx}`;
  btn.dataset.key = key;

  btn.addEventListener('click', () => {
    if (betslip.has(key)) {
      removeSelection(key);
    } else {
      betslip.set(key, { match: matchLabel, pick: pickLabel, odd: oddValue });
      btn.classList.add('is-selected');
    }
    renderBetslip();
  });
});

stakeInput?.addEventListener('input', renderBetslip);

document.getElementById('placeBetBtn')?.addEventListener('click', () => {
  if (betslip.size === 0) return;
  alert('Aposta simulada registrada com sucesso! (nenhuma transação real foi feita)');
  betslip.clear();
  document.querySelectorAll('.odd.is-selected').forEach(el => el.classList.remove('is-selected'));
  renderBetslip();
});

renderBetslip();

// ===== Carrossel do banner principal (troca automática de dots) =====
const dots = document.querySelectorAll('.hero-dots .dot');
let activeDot = 0;
function cycleDots() {
  if (!dots.length) return;
  dots[activeDot].classList.remove('is-active');
  activeDot = (activeDot + 1) % dots.length;
  dots[activeDot].classList.add('is-active');
}
setInterval(cycleDots, 4000);

document.querySelector('.hero-arrow-right')?.addEventListener('click', cycleDots);
document.querySelector('.hero-arrow-left')?.addEventListener('click', () => {
  if (!dots.length) return;
  dots[activeDot].classList.remove('is-active');
  activeDot = (activeDot - 1 + dots.length) % dots.length;
  dots[activeDot].classList.add('is-active');
});

// ===== Categorias / abas de esportes (Esportes vs Ao vivo) =====
document.querySelectorAll('.sports-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sports-tab').forEach(t => t.classList.remove('is-active'));
    tab.classList.add('is-active');
  });
});

// ===== Botão flutuante de suporte =====
document.querySelector('.support-fab')?.addEventListener('click', () => {
  alert('Chat de suporte simulado — em breve integração real!');
});
