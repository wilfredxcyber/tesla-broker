// ===== APP.JS — Tesla Currency Team Dashboard Logic =====

// ===== AUTH CHECK =====
const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
if (!currentUser) { window.location.href = 'index.html'; }

// ===== TIER DEFINITIONS =====
const TIERS = [
    { level: 1, name: 'Starter', badge: 'bronze', invest: 1000, returnAmount: 10000 },
    { level: 2, name: 'Growth', badge: 'silver', invest: 3000, returnAmount: 30000 },
    { level: 3, name: 'Premium', badge: 'gold-tier', invest: 5000, returnAmount: 50000 },
    { level: 4, name: 'Platinum', badge: 'platinum', invest: 10000, returnAmount: 100000 },
    { level: 5, name: 'Diamond', badge: 'diamond', invest: 25000, returnAmount: 250000 },
];

// ===== MESSAGES =====
let userMessages = [
    { id: 1, sender: 'Tesla Currency Team', icon: '<i class="bi bi-lightning-charge-fill" style="color:#1e88e5;"></i>', subject: 'Welcome to Tesla Currency Team!', text: `Welcome ${currentUser.name}! Your investment of $${currentUser.invested.toLocaleString()} has been successfully activated. Our advanced AI trading system is now working to grow your portfolio. Track your gains in real-time from the dashboard.`, time: 'Feb 20, 2026', unread: false },
    { id: 2, sender: 'Investment Desk', icon: '<i class="bi bi-graph-up-arrow" style="color:#16a34a;"></i>', subject: 'Your Portfolio is Growing!', text: `Great news! Your portfolio has seen exceptional growth this week. Your initial investment of $${currentUser.invested.toLocaleString()} is now valued at $${currentUser.currentValue.toLocaleString()}. Keep watching as the market continues to favour our positions.`, time: 'Feb 21, 2026', unread: true },
    { id: 3, sender: 'Compliance Team', icon: '<i class="bi bi-shield-lock-fill" style="color:#C9A84C;"></i>', subject: 'Withdrawal Eligibility — Action Required', text: 'To enable withdrawal functionality, your account must reach Plane 2 (minimum $10,000 equity). Please navigate to the Investment Planes section to view upgrade details.', time: 'Feb 21, 2026', unread: true }
];

// ===== LIVE VALUE =====
let liveValue = 8500.00; // Hardcoded start instead of pulling from cached sessionStorage

function startLiveValue() {
    // Flicker decimals upward rapidly to simulate real-time rise
    setInterval(() => {
        const change = (Math.random() - 0.25) * 18;
        liveValue = Math.max(liveValue + change, currentUser.invested);
        updateDisplayedValues();
        flickerDecimals();
    }, 2800);

    // Fast decimal flicker (purely visual)
    setInterval(() => {
        const decEl = document.getElementById('balanceDec');
        if (decEl) {
            const randDec = String(Math.floor(Math.random() * 100)).padStart(2, '0');
            decEl.textContent = randDec;
        }
    }, 120);
}

function flickerDecimals() {
    const decEl = document.getElementById('balanceDec');
    if (!decEl) return;
    let flickers = 0;
    const flickerInterval = setInterval(() => {
        decEl.textContent = String(Math.floor(Math.random() * 100)).padStart(2, '0');
        flickers++;
        if (flickers > 15) {
            clearInterval(flickerInterval);
            const dec = liveValue.toFixed(2).split('.')[1];
            decEl.textContent = dec;
        }
    }, 50);
}

function updateDisplayedValues() {
    const whole = Math.floor(liveValue).toLocaleString();
    const dec = liveValue.toFixed(2).split('.')[1];
    const formatted = '$' + liveValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const profit = liveValue - currentUser.invested;
    const profitFormatted = '+$' + profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const wholeEl = document.getElementById('balanceWhole');
    if (wholeEl) wholeEl.textContent = whole;

    const ids = ['portfolioValue', 'withdrawAmount', 'withdrawAmountDisplay', 'qsPortfolio'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = formatted;
    });
    const profitEl = document.getElementById('totalProfit');
    if (profitEl) profitEl.textContent = profitFormatted;
    const profitCard = document.getElementById('totalProfitCard');
    if (profitCard) profitCard.textContent = profitFormatted;
}

// ===== POPULATE USER DATA =====
function populateUserData() {
    const initials = currentUser.name.split(' ').map(n => n[0]).join('');
    const firstName = currentUser.name.split(' ')[0];

    // Sidebar + topbar
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarAvatar) sidebarAvatar.textContent = initials;
    const sidebarName = document.getElementById('sidebarName');
    if (sidebarName) sidebarName.textContent = currentUser.name;
    const topbarAvatar = document.getElementById('topbarAvatar');
    if (topbarAvatar) topbarAvatar.textContent = initials;

    // Date
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' });
    const dateEl = document.getElementById('topbarDate');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const dateFullEl = document.getElementById('topbarDateFull');
    if (dateFullEl) dateFullEl.textContent = dateStr;

    // Stats
    const initialInvest = document.getElementById('initialInvest');
    if (initialInvest) initialInvest.textContent = '$' + currentUser.invested.toLocaleString() + '.00';
    const initialInvestCard = document.getElementById('initialInvestCard');
    if (initialInvestCard) initialInvestCard.textContent = '$' + currentUser.invested.toLocaleString() + '.00';
    const tierDisplay = document.getElementById('currentTierDisplay');
    if (tierDisplay) tierDisplay.textContent = 'Plane ' + currentUser.tier;

    // ID Card
    const cardAvatar = document.getElementById('cardAvatar');
    if (cardAvatar) cardAvatar.textContent = initials;
    const cardName = document.getElementById('cardName');
    if (cardName) cardName.textContent = currentUser.name;

    const cardTier = document.getElementById('cardTier');
    if (cardTier) cardTier.textContent = `Plane ${currentUser.tier} — ${TIERS[currentUser.tier - 1].name}`;
    const cardId = document.getElementById('cardId');
    if (cardId) cardId.textContent = 'ID: ' + currentUser.id;

    const joinDate = new Date(currentUser.joinDate);
    const cardJoinDate = document.getElementById('cardJoinDate');
    if (cardJoinDate) cardJoinDate.textContent = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    updateTierCards();
    updateDisplayedValues();
}

function updateTierCards() {
    const userTier = currentUser.tier;
    const progress = (currentUser.currentValue / TIERS[userTier - 1].returnAmount * 100).toFixed(0);
    for (let i = 1; i <= 5; i++) {
        const card = document.getElementById('tierCard' + i);
        if (!card) continue;
        if (i === userTier) {
            const bar = card.querySelector('.tier-progress-bar');
            const txt = card.querySelector('.tier-progress-text');
            if (bar) bar.style.width = Math.min(progress, 100) + '%';
            if (txt) txt.textContent = Math.min(progress, 100) + '% to target';
        }
    }
}

// ===== NAVIGATION =====
function switchSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav - item[data - section="${sectionId}"]`);
    if (navItem) navItem.classList.add('active');
    const titles = { overview: 'Dashboard Overview', portfolio: 'Portfolio Performance', tiers: 'Investment Planes', withdraw: 'Withdraw Funds', messages: 'Messages', idcard: 'My ID Card' };
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = titles[sectionId] || 'Dashboard';

    // Auto-close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (window.innerWidth <= 1100 && sidebar) {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('show');
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.toggle('open');
    if (backdrop) backdrop.classList.toggle('show');
}

// ===== PLANE ACCORDION =====
function togglePlaneDetails(btn) {
    const card = btn.closest('.plane-card');
    const details = card.querySelector('.plane-details');
    card.classList.toggle('expanded');
    details.classList.toggle('expanded');
}

// ===== CHART =====
let investmentChart;
function createChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;
    const gradientFill = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    gradientFill.addColorStop(0, 'rgba(45,99,144,0.25)');
    gradientFill.addColorStop(0.6, 'rgba(45,99,144,0.07)');
    gradientFill.addColorStop(1, 'rgba(45,99,144,0)');
    investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDateLabels(90),
            datasets: [{
                label: 'Portfolio Value ($)',
                data: generateGrowthData(90, currentUser.invested, currentUser.currentValue),
                borderColor: '#2D6390',
                backgroundColor: gradientFill,
                borderWidth: 2.5, fill: true, tension: 0.4,
                pointRadius: 0, pointHitRadius: 10, pointHoverRadius: 6,
                pointHoverBackgroundColor: '#4a84b5', pointHoverBorderColor: '#fff', pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(4,6,13,0.95)', borderColor: 'rgba(45,99,144,0.4)', borderWidth: 1,
                    titleColor: 'rgba(255,255,255,0.5)', bodyColor: '#fff', bodyFont: { size: 15, weight: '600' },
                    padding: 14, displayColors: false,
                    callbacks: { label: c => '$' + c.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', maxTicksLimit: 8, font: { size: 11 } }, border: { display: false } },
                y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 11 }, callback: v => '$' + (v / 1000).toFixed(1) + 'k' }, border: { display: false } }
            }
        }
    });
}

function generateDateLabels(days) {
    const labels = [], now = new Date();
    for (let i = days; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return labels;
}

function generateGrowthData(days, start, end) {
    const data = [];
    for (let i = 0; i <= days; i++) {
        const progress = i / days;
        const base = start + (end - start) * Math.pow(progress, 1.3);
        const noise = (Math.random() - 0.5) * (end - start) * 0.04;
        data.push(Math.max(start, base + noise));
    }
    return data;
}

function updateChart(period) {
    document.querySelectorAll('.chart-filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const daysMap = { '1W': 7, '1M': 30, '3M': 90, '1Y': 365, 'ALL': 365 };
    const days = daysMap[period] || 90;
    if (investmentChart) {
        investmentChart.data.labels = generateDateLabels(days);
        investmentChart.data.datasets[0].data = generateGrowthData(days, currentUser.invested, currentUser.currentValue);
        investmentChart.update('active');
    }
}

// ===== WITHDRAWAL FLOW =====
let registrationComplete = false;

function handleWithdraw() {
    if (!registrationComplete) {
        showModal('registrationModal');
        showToast('<i class="bi bi-exclamation-triangle-fill"></i>', 'Action Required', 'Full registration is required before withdrawal.', 'warning');
        return;
    }
    showTierBlockMessage();
}

function openRegForm() {
    closeModal('registrationModal');
    setTimeout(() => showModal('regFormModal'), 300);
}

function handleRegistration(e) {
    e.preventDefault();
    closeModal('regFormModal');
    registrationComplete = true;
    const regStatus = document.getElementById('regStatus');
    if (regStatus) { regStatus.innerHTML = '<i class="bi bi-check-lg"></i> Complete'; regStatus.className = 'status-badge completed'; }
    showToast('<i class="bi bi-check-circle-fill"></i>', 'Registration Submitted', 'Your registration is being reviewed. Withdrawal processing will begin shortly...', 'success');
    setTimeout(() => { showTierBlockMessage(); addSystemMessage(); }, 2500);
    return false;
}

function showTierBlockMessage() {
    const userTier = currentUser.tier;
    const nextTier = TIERS[userTier];

    // TOP CENTER liquid-glass toast (Phase 4 spec)
    const toastMsg = nextTier
        ? `To process a payout, your account must successfully transition to the Second Plane ($${nextTier.returnAmount.toLocaleString()}). Please complete the full registration to unlock next - tier eligibility.`
        : 'Your withdrawal is being processed by our compliance team. Please allow 5–7 business days.';

    showToast('<i class="bi bi-exclamation-triangle-fill"></i>', 'Withdrawal Unsuccessful', toastMsg, 'error');

    // Also show modal
    const modalMsg = nextTier
        ? `Dear ${currentUser.name}, your withdrawal request cannot be processed at this time.Your current investment is on Plane ${userTier} (${TIERS[userTier - 1].name} Plan). To unlock withdrawals, your portfolio must advance to Plane ${userTier + 1} (${nextTier.name} Plan), which requires a minimum investment of $${nextTier.invest.toLocaleString()}.`
        : `Dear ${currentUser.name}, your withdrawal is being processed by our compliance team.Please allow 5–7 business days.`;

    const tierModalMsg = document.getElementById('tierModalMsg');
    if (tierModalMsg) tierModalMsg.textContent = modalMsg;
    showModal('tierModal');
}

function addSystemMessage() {
    const userTier = currentUser.tier;
    const nextTier = TIERS[userTier];
    const messageHtml = `
      <div style="font-size:1.1rem;margin-bottom:1rem;">Your available balance of <strong>$8,500.00</strong> consists of your initial deposit ($1,000.00) and generated profit ($7,500.00).</div>
      <div style="color:var(--text-3);font-size:0.95rem;margin-bottom:1.5rem;line-height:1.6;">According to TCT regulatory policy, your account must reach <strong>Plane 2</strong> (minimum $10,000 equity) before withdrawals can be processed.</div>
      
      <div style="background:rgba(255,255,255,0.03);padding:1rem;border-radius:12px;margin-bottom:1.5rem;border:1px solid rgba(255,255,255,0.05);">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
              <span style="color:var(--text-3);">Current Portfolio:</span>
              <span style="font-weight:600;">$8,500.00</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
              <span style="color:var(--text-3);">Plane 2 Requirement:</span>
              <span style="font-weight:600;">$10,000.00</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding-top:0.5rem;border-top:1px solid rgba(255,255,255,0.1);margin-top:0.5rem;">
              <span style="color:var(--gold);">Difference:</span>
              <span style="font-weight:600;color:var(--gold);">-$1,500.00</span>
          </div>
      </div>
      
      <div style="font-size:0.9rem;color:var(--text-3);">Please upgrade your account to Plane 2 to unlock global withdrawals.</div>
    `;
    const newMsg = {
        id: userMessages.length + 1, sender: 'Withdrawal Desk', icon: '<i class="bi bi-bank" style="color:#C9A84C;"></i>',
        subject: 'Withdrawal Request — Action Required',
        text: messageHtml,
        time: 'Just now', unread: true
    };
    userMessages.push(newMsg);
    renderMessages();
}

// ===== MESSAGES =====
function renderMessages() {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    container.innerHTML = userMessages.slice().reverse().map(m => `
    < div class= "message-item ${m.unread ? 'unread' : ''}" >
      <div class="message-avatar">${m.icon}</div>
      <div class="message-body">
        <div class="message-header">
          <span class="message-sender">${m.sender}</span>
          <span class="message-time">${m.time}</span>
        </div>
        <div style="font-weight:600;font-size:13.5px;margin-bottom:4px;">${m.subject}</div>
        <div class="message-text">${m.text}</div>
      </div>
    </div>`).join('');
}

// ===== MODAL HELPERS =====
function showModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.classList.remove('show'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) { overlay.classList.remove('show'); document.body.style.overflow = ''; }
    });
});

// ===== TOAST (top-center liquid glass) =====
function showToast(icon, title, message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type} `;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" onclick="removeToast(this.parentElement)"><i class="bi bi-x"></i></button>
      <div class="toast-progress" style="background:${progressColor};"></div>
    `;
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), 7000);
}

function removeToast(toast) {
    if (!toast || toast.classList.contains('removing')) return;
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
}

// ===== LOGOUT =====
function handleLogout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    populateUserData();
    createChart();
    renderMessages();
    startLiveValue();
    setTimeout(() => {
        showToast('<i class="bi bi-hand-wave"></i>', `Welcome back, ${currentUser.name.split(' ')[0]} !`, 'Your portfolio is performing well today.', 'info');
    }, 1500);
});
