// ==========================================
// FinanceFlow - Core Logic & Data Engine
// ==========================================

// Global state variables
let state = {};
let activeMonth = "2026-08"; // Default starting month
let activeTab = "dashboard";
let activeP2PType = "receber"; // P2P view switcher

// Chart.js instances
let flowChartInstance = null;
let categoryChartInstance = null;

// Default Mock Data based on spreadsheet screenshots
const DEFAULT_MOCK_DATA = {
    months: ["2026-08", "2026-09", "2026-10", "2026-11", "2026-12", "2027-01"],
    
    // Purchases (Credit card installments)
    purchases: [
        { id: "1", description: "AirFryer nossa casa", card: "Itaú", category: "Presentes", totalValue: 252.00, installments: 5, date: "2026-03-10" },
        { id: "2", description: "Tenis adidas", card: "Itaú", category: "Roupa", totalValue: 279.99, installments: 4, date: "2026-05-11" },
        { id: "3", description: "Tenis Nike", card: "Itaú", category: "Roupa", totalValue: 359.99, installments: 3, date: "2026-05-11" },
        { id: "4", description: "Roupa Lencois", card: "Itaú", category: "Roupa", totalValue: 489.54, installments: 3, date: "2026-05-16" },
        { id: "5", description: "Jaqueta", card: "Itaú", category: "Roupa", totalValue: 323.91, installments: 4, date: "2026-05-17" },
        { id: "6", description: "Show Bk", card: "Itaú", category: "Extras", totalValue: 226.79, installments: 3, date: "2026-06-04" },
        { id: "7", description: "Teclado", card: "Itaú", category: "Extras", totalValue: 197.48, installments: 3, date: "2026-06-15" },
        
        // Adjustments to match exact totals of spreadsheet
        { id: "adj_itau_aug", description: "Outras Compras Itaú (Ajuste)", card: "Itaú", category: "Extras", totalValue: 531.56, installments: 1, date: "2026-08-01" },
        { id: "adj_itau_sep", description: "Outras Compras Itaú (Ajuste)", card: "Itaú", category: "Extras", totalValue: 146.99, installments: 1, date: "2026-09-01" },
        { id: "adj_nubank_aug", description: "Gasto Extra Nubank", card: "Nubank", category: "Extras", totalValue: 80.00, installments: 1, date: "2026-08-01" }
    ],

    // Recurring Subscriptions
    subscriptions: [
        { id: "s1", name: "Gympass", value: 69.99, day: 13, card: "Itaú", color: "#f59e0b" },
        { id: "s2", name: "iCloud", value: 33.00, day: 3, card: "Itaú", color: "#3b82f6" },
        { id: "s3", name: "Socio Flu", value: 56.00, day: 22, card: "Itaú", color: "#8b5cf6" },
        { id: "s4", name: "ChatGPT", value: 42.45, day: 30, card: "Itaú", color: "#ec4899" }
    ],

    // Peer-to-Peer Agreements (P2P)
    p2pAgreements: [
        {
            id: "a1",
            name: "Show Laura",
            type: "receber",
            amount: 217.50,
            installments: 4,
            startMonth: "2026-06",
            statuses: { "2026-06": "paid", "2026-07": "paid", "2026-08": "pending", "2026-09": "pending" },
            affectBudget: false
        },
        {
            id: "a2",
            name: "Daniel carro",
            type: "receber",
            amount: 290.50,
            installments: 2,
            startMonth: "2026-07",
            statuses: { "2026-07": "paid", "2026-08": "pending" },
            affectBudget: false
        },
        {
            id: "a3",
            name: "Bateria Escort",
            type: "receber",
            amount: 61.99,
            installments: 10,
            startMonth: "2026-08",
            statuses: { 
                "2026-08": "pending", "2026-09": "pending", "2026-10": "pending", 
                "2026-11": "pending", "2026-12": "pending", "2027-01": "pending",
                "2027-02": "pending", "2027-03": "pending", "2027-04": "pending",
                "2027-05": "pending"
            },
            affectBudget: false
        },
        {
            id: "a4",
            name: "Seby Isa",
            type: "pagar",
            amount: 245.70,
            installments: 6,
            startMonth: "2026-05",
            statuses: { 
                "2026-05": "paid", "2026-06": "paid", "2026-07": "paid", 
                "2026-08": "pending", "2026-09": "pending", "2026-10": "pending" 
            },
            affectBudget: false
        },
        {
            id: "a5",
            name: "chale Isa",
            type: "pagar",
            amount: 192.00,
            installments: 4,
            startMonth: "2026-08",
            statuses: { "2026-08": "pending", "2026-09": "pending", "2026-10": "pending", "2026-11": "pending" },
            affectBudget: false
        },
        {
            id: "a6",
            name: "Rio Isa",
            type: "pagar",
            amount: 135.00,
            installments: 4,
            startMonth: "2026-08",
            statuses: { "2026-08": "pending", "2026-09": "pending", "2026-10": "pending", "2026-11": "pending" },
            affectBudget: false
        }
    ],

    // Monthly Planning budget (other than calculated credit cards)
    planning: {
        "2026-08": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 16.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1500.00 },
                { id: "pf5", description: "Poupança de vida", value: 1103.32 },
                { id: "pf6", description: "Poupança viagem", value: 600.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 100.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: [
                { id: "pv1", description: "Jogo (Isa)", value: 48.00 }
            ]
        },
        "2026-09": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 0.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1500.00 },
                { id: "pf5", description: "Poupança de vida", value: 1100.00 },
                { id: "pf6", description: "Poupança viagem", value: 900.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 200.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: []
        },
        "2026-10": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 0.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1500.00 },
                { id: "pf5", description: "Poupança de vida", value: 930.00 },
                { id: "pf6", description: "Poupança viagem", value: 900.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 200.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: []
        },
        "2026-11": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 0.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1500.00 },
                { id: "pf5", description: "Poupança de vida", value: 955.00 },
                { id: "pf6", description: "Poupança viagem", value: 800.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 200.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: []
        },
        "2026-12": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 0.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1300.00 },
                { id: "pf5", description: "Poupança de vida", value: 600.00 },
                { id: "pf6", description: "Poupança viagem", value: 1200.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 200.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: []
        },
        "2027-01": {
            income: [
                { id: "pi1", description: "Salário", value: 5000.00 },
                { id: "pi2", description: "Ganhos Adicionais", value: 0.00 }
            ],
            fixed: [
                { id: "pf1", description: "Transporte", value: 90.00 },
                { id: "pf2", description: "MEI", value: 86.05 },
                { id: "pf3", description: "Telefone", value: 41.89 },
                { id: "pf4", description: "Gastos livres mensais", value: 1700.00 },
                { id: "pf5", description: "Poupança de vida", value: 1000.00 },
                { id: "pf6", description: "Poupança viagem", value: 600.00 },
                { id: "pf7", description: "Inglês (Laura)", value: 200.00 },
                { id: "pf8", description: "streaming (helton)", value: 75.30 },
                { id: "pf9", description: "Internet vivo (Cris)", value: 114.98 }
            ],
            variable: []
        }
    }
};

// ==========================================
// Date Helpers
// ==========================================

// Parse "YYYY-MM" to readable "Mês/Ano" (e.g., "Ago/26")
function formatMonthYear(monthStr) {
    const parts = monthStr.split('-');
    const year = parts[0].substring(2);
    const monthsName = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const monthIndex = parseInt(parts[1], 10) - 1;
    return `${monthsName[monthIndex]}/${year}`;
}

// Convert absolute date to month string "YYYY-MM"
function getMonthStrFromDate(dateStr) {
    return dateStr.substring(0, 7);
}

// Add months to "YYYY-MM" string
function addMonths(monthStr, monthsToAdd) {
    const parts = monthStr.split('-');
    let year = parseInt(parts[0], 10);
    let month = parseInt(parts[1], 10) - 1; // 0-indexed
    
    month += monthsToAdd;
    year += Math.floor(month / 12);
    month = (month % 12 + 12) % 12;
    
    return `${year}-${String(month + 1).padStart(2, '0')}`;
}

// Check if a purchase installment falls in a target month
// Returns { active: boolean, index: number, isFirst: boolean, isLast: boolean }
function getInstallmentInfo(purchase, targetMonth) {
    const purchaseMonth = getMonthStrFromDate(purchase.date);
    for (let i = 0; i < purchase.installments; i++) {
        const installmentMonth = addMonths(purchaseMonth, i);
        if (installmentMonth === targetMonth) {
            return {
                active: true,
                index: i + 1,
                isFirst: i === 0,
                isLast: i === purchase.installments - 1
            };
        }
    }
    return { active: false };
}

// Check if a P2P month index falls in a target month
function getP2PMonthForIndex(agreement, index) {
    return addMonths(agreement.startMonth, index);
}

// ==========================================
// Data Calculation Engine
// ==========================================

// Calculate credit card bills for a month
function calculateCardBill(cardName, targetMonth) {
    let total = 0;
    
    // 1. Installments
    state.purchases.forEach(p => {
        if (p.card === cardName) {
            const instInfo = getInstallmentInfo(p, targetMonth);
            if (instInfo.active) {
                total += p.totalValue / p.installments;
            }
        }
    });
    
    // 2. Subscriptions
    state.subscriptions.forEach(s => {
        if (s.card === cardName) {
            total += s.value;
        }
    });
    
    return total;
}

// Calculate the full financial status of the active month
function calculateMonthStatus(targetMonth) {
    const itauBill = calculateCardBill("Itaú", targetMonth);
    const nubankBill = calculateCardBill("Nubank", targetMonth);
    
    // Get plan details
    const plan = state.planning[targetMonth] || { income: [], fixed: [], variable: [] };
    
    // Sum incomes
    let incomeSum = plan.income.reduce((sum, item) => sum + item.value, 0);
    
    // Sum expenses (planner fixed & variable)
    let expensesSum = 0;
    
    plan.fixed.forEach(item => {
        expensesSum += item.value;
    });
    
    plan.variable.forEach(item => {
        expensesSum += item.value;
    });
    
    // Add dynamically calculated credit cards
    expensesSum += itauBill + nubankBill;

    // P2P Contributions (if affectBudget is true)
    state.p2pAgreements.forEach(agreement => {
        if (agreement.affectBudget) {
            // Find if this agreement has an installment in active month
            for (let i = 0; i < agreement.installments; i++) {
                const installmentMonth = getP2PMonthForIndex(agreement, i);
                if (installmentMonth === targetMonth) {
                    const status = agreement.statuses[installmentMonth] || "pending";
                    if (agreement.type === "receber") {
                        if (status === "paid") {
                            incomeSum += agreement.amount;
                        }
                    } else { // pagar
                        if (status === "paid" || status === "pending") {
                            expensesSum += agreement.amount;
                        }
                    }
                }
            }
        }
    });
    
    const netBalance = incomeSum - expensesSum;
    
    return {
        incomeSum,
        expensesSum,
        itauBill,
        nubankBill,
        netBalance,
        totalCards: itauBill + nubankBill
    };
}

// ==========================================
// UI Rendering Functions
// ==========================================

// Render the top horizontal month list
function renderMonthCarousel() {
    const container = document.getElementById("month-carousel");
    container.innerHTML = "";
    
    const div = document.createElement("div");
    div.className = "month-item";
    div.innerText = formatMonthYear(activeMonth);
    container.appendChild(div);
}

// Render the top widgets and active cards
function renderKPIs() {
    const stats = calculateMonthStatus(activeMonth);
    
    document.getElementById("kpi-income").innerText = formatCurrency(stats.incomeSum);
    document.getElementById("kpi-expenses").innerText = formatCurrency(stats.expensesSum);
    document.getElementById("kpi-cards").innerText = formatCurrency(stats.totalCards);
    
    const balanceEl = document.getElementById("kpi-balance");
    balanceEl.innerText = formatCurrency(stats.netBalance);
    
    // Change styling for negative balance
    if (stats.netBalance < 0) {
        balanceEl.style.color = "var(--danger)";
    } else {
        balanceEl.style.color = "var(--success)";
    }
    
    // Update sidebar balance
    document.getElementById("sidebar-net-balance").innerText = formatCurrency(stats.netBalance);
    const progressEl = document.getElementById("sidebar-balance-progress");
    
    let percent = stats.incomeSum > 0 ? (stats.netBalance / stats.incomeSum) * 100 : 0;
    percent = Math.max(0, Math.min(100, percent));
    progressEl.style.width = `${percent}%`;

    // Render Cards page balances
    document.getElementById("itau-card-bill").innerText = formatCurrency(stats.itauBill);
    document.getElementById("nubank-card-bill").innerText = formatCurrency(stats.nubankBill);
    
    // Update Savings indicators on Dashboard
    const plan = state.planning[activeMonth] || { fixed: [] };
    const lifeSavings = plan.fixed.find(f => f.description.toLowerCase().includes("poupança de vida"))?.value || 0;
    const travelSavings = plan.fixed.find(f => f.description.toLowerCase().includes("poupança viagem"))?.value || 0;
    
    document.getElementById("savings-life-value").innerText = formatCurrency(lifeSavings);
    document.getElementById("savings-travel-value").innerText = formatCurrency(travelSavings);
    
    // Adjust visual progress bars for savings targets
    const lifeProgress = document.querySelector(".life-fill");
    const travelProgress = document.querySelector(".travel-fill");
    
    // Normalize percentages based on arbitrary high goals (e.g. Life=1200, Travel=1200)
    let lifePercent = Math.min(100, (lifeSavings / 1200) * 100);
    let travelPercent = Math.min(100, (travelSavings / 1200) * 100);
    
    lifeProgress.style.width = `${lifePercent}%`;
    travelProgress.style.width = `${travelPercent}%`;
}

// Render modern charts
function renderCharts() {
    const ctxFlow = document.getElementById("flowChart").getContext("2d");
    const ctxCat = document.getElementById("categoryChart").getContext("2d");
    
    // 1. Flow Chart: Revenues vs Expenses for all months
    const monthsData = state.months;
    const incomes = [];
    const expenses = [];
    
    monthsData.forEach(m => {
        const s = calculateMonthStatus(m);
        incomes.push(s.incomeSum);
        expenses.push(s.expensesSum);
    });
    
    const formattedLabels = monthsData.map(m => formatMonthYear(m));
    
    if (flowChartInstance) {
        flowChartInstance.destroy();
    }
    
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const labelColor = isDark ? "#9ca3af" : "#4b5563";
    const isCompactChart = window.matchMedia("(max-width: 520px)").matches;

    flowChartInstance = new Chart(ctxFlow, {
        type: 'bar',
        data: {
            labels: formattedLabels,
            datasets: [
                {
                    label: 'Receitas',
                    data: incomes,
                    backgroundColor: 'rgba(16, 185, 129, 0.75)',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Despesas',
                    data: expenses,
                    backgroundColor: 'rgba(244, 63, 94, 0.75)',
                    borderColor: '#f43f5e',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isCompactChart ? 'bottom' : 'top',
                    labels: { color: labelColor, font: { family: 'Outfit', size: isCompactChart ? 11 : 12 } }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        color: labelColor,
                        maxRotation: isCompactChart ? 35 : 0,
                        minRotation: 0,
                        font: { family: 'Outfit', size: isCompactChart ? 10 : 12 }
                    }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: labelColor, font: { family: 'Outfit', size: isCompactChart ? 10 : 12 } }
                }
            }
        }
    });
    
    // 2. Category Pie Chart for the active month
    const activePlan = state.planning[activeMonth] || { fixed: [], variable: [] };
    const categoriesMap = {};
    
    // Add planning items (except Cards because they are calculated separately and we categorize their inner contents!)
    activePlan.fixed.forEach(item => {
        if (!item.description.includes("Itaú") && !item.description.includes("Nubank")) {
            const cat = item.description;
            categoriesMap[cat] = (categoriesMap[cat] || 0) + item.value;
        }
    });
    
    activePlan.variable.forEach(item => {
        const cat = item.description;
        categoriesMap[cat] = (categoriesMap[cat] || 0) + item.value;
    });
    
    // Add Credit Card breakdown by categories
    state.purchases.forEach(p => {
        const instInfo = getInstallmentInfo(p, activeMonth);
        if (instInfo.active) {
            const val = p.totalValue / p.installments;
            categoriesMap[p.category] = (categoriesMap[p.category] || 0) + val;
        }
    });
    
    // Add Subscriptions
    state.subscriptions.forEach(s => {
        categoriesMap["Assinaturas"] = (categoriesMap["Assinaturas"] || 0) + s.value;
    });
    
    const catLabels = Object.keys(categoriesMap);
    const catValues = Object.values(categoriesMap);
    
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }
    
    if (catValues.length === 0) {
        // Draw empty indicator
        categoryChartInstance = new Chart(ctxCat, {
            type: 'doughnut',
            data: {
                labels: ["Nenhum gasto"],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(107, 114, 128, 0.2)'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }
    
    // Generate harmonious colors
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', 
        '#f59e0b', '#10b981', '#3b82f6', '#14b8a6',
        '#a855f7', '#06b6d4', '#84cc16'
    ];
    
    categoryChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: catLabels,
            datasets: [{
                data: catValues,
                backgroundColor: colors.slice(0, catLabels.length),
                borderColor: isDark ? '#121929' : '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isCompactChart ? 'bottom' : 'right',
                    labels: { color: labelColor, font: { family: 'Outfit', size: isCompactChart ? 10 : 11 } }
                }
            }
        }
    });
}

// Render active installments list
function renderInstallmentsTable() {
    const tbody = document.querySelector("#installments-table tbody");
    tbody.innerHTML = "";
    
    let activePurchases = [];
    
    state.purchases.forEach(p => {
        const instInfo = getInstallmentInfo(p, activeMonth);
        if (instInfo.active) {
            activePurchases.push({
                purchase: p,
                installmentIndex: instInfo.index,
                installmentValue: p.totalValue / p.installments
            });
        }
    });
    
    if (activePurchases.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted);">Nenhuma compra parcelada caindo neste mês.</td></tr>`;
        return;
    }
    
    // Sort by date descending
    activePurchases.sort((a, b) => new Date(b.purchase.date) - new Date(a.purchase.date));
    
    activePurchases.forEach(item => {
        const tr = document.createElement("tr");
        const p = item.purchase;
        
        // Formatting dates
        const dateParts = p.date.split('-');
        const dateFormatted = `${dateParts[2]}/${dateParts[1]}/${dateParts[0].substring(2)}`;
        
        const cardBadgeClass = p.card === "Itaú" ? "table-badge orange" : "table-badge purple";
        
        tr.innerHTML = `
            <td>${dateFormatted}</td>
            <td style="font-weight: 500;">${p.description}</td>
            <td><span class="table-badge default">${p.category}</span></td>
            <td><span class="${cardBadgeClass}">${p.card}</span></td>
            <td style="font-family: 'JetBrains Mono', monospace; font-weight: 500;">${item.installmentIndex}/${p.installments}</td>
            <td class="cell-amount">${formatCurrency(p.totalValue)}</td>
            <td class="cell-amount" style="color: var(--danger);">${formatCurrency(item.installmentValue)}</td>
            <td>
                <button class="btn-icon-danger delete-purchase-btn" data-id="${p.id}" title="Excluir Compra">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Attach deletion handlers
    document.querySelectorAll(".delete-purchase-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Deseja realmente remover esta compra parcelada de todo o histórico?")) {
                deletePurchase(id);
            }
        });
    });
}

// Render active subscriptions list
function renderRecurrentPurchases() {
    const container = document.getElementById("recurrent-purchases-container");
    container.innerHTML = "";
    
    let total = 0;
    
    state.subscriptions.forEach(s => {
        total += s.value;
        const cardClass = s.card === "Itaú" ? "table-badge orange" : (s.card === "Nubank" ? "table-badge purple" : "table-badge default");
        
        const card = document.createElement("div");
        card.className = "recurrent-card";
        card.innerHTML = `
            <div class="recurrent-card-meta">
                <div class="recurrent-icon-dot" style="background-color: ${s.color};"></div>
                <div>
                    <span class="recurrent-name">${s.name}</span>
                    <div class="recurrent-day">Dia ${s.day} • <span class="${cardClass}" style="padding: 1px 4px; font-size: 10px;">${s.card}</span></div>
                </div>
            </div>
            <div class="recurrent-card-amount">
                <span class="recurrent-amount">${formatCurrency(s.value)}</span>
                <button class="btn-icon-danger delete-sub-btn" data-id="${s.id}" title="Remover Assinatura">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
    
    document.getElementById("recurrent-total-val").innerText = formatCurrency(total);
    
    // Attach deletion handlers
    document.querySelectorAll(".delete-sub-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Remover esta assinatura mensal?")) {
                deleteSubscription(id);
            }
        });
    });
}

// Render P2P Agreements list
function renderP2PAgreements() {
    const container = document.getElementById("p2p-deck-container");
    container.innerHTML = "";
    
    const filtered = state.p2pAgreements.filter(a => a.type === activeP2PType);
    
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">Nenhum acordo cadastrado para esta aba.</div>`;
        return;
    }
    
    filtered.forEach(agreement => {
        const card = document.createElement("div");
        card.className = "p2p-agreement-card";
        
        // Calculate progress
        let paidCount = 0;
        const totalCount = agreement.installments;
        
        for (let i = 0; i < totalCount; i++) {
            const m = getP2PMonthForIndex(agreement, i);
            if (agreement.statuses[m] === "paid") {
                paidCount++;
            }
        }
        
        const percent = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
        const colorClass = agreement.type === "receber" ? "receber" : "pagar";
        const progressLabel = agreement.type === "receber" ? "recebidas" : "pagas";
        
        let p2pMonthBadges = "";
        
        // Generate matrix of pills (limit to showing the installments)
        for (let i = 0; i < totalCount; i++) {
            const monthStr = getP2PMonthForIndex(agreement, i);
            const formatted = formatMonthYear(monthStr);
            const status = agreement.statuses[monthStr] || "pending";
            
            let statusClass = "status-future";
            // Check if month is in our active dashboard scope
            if (status === "paid") {
                statusClass = "status-paid";
            } else if (status === "pending") {
                statusClass = "status-pending";
            }
            
            p2pMonthBadges += `
                <div class="p2p-month-pill ${statusClass}" data-agreement-id="${agreement.id}" data-month="${monthStr}">
                    ${formatted}
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="p2p-card-header">
                <div>
                    <h4 class="p2p-card-title">${agreement.name}</h4>
                    <span class="subtitle" style="font-size: 12px; color: var(--text-secondary);">
                        Início: ${formatMonthYear(agreement.startMonth)}
                    </span>
                </div>
                <div class="p2p-card-amount" style="color: ${agreement.type === 'receber' ? 'var(--success)' : 'var(--danger)'};">
                    ${formatCurrency(agreement.amount)}<span style="font-size: 11px; font-weight: normal; color: var(--text-secondary);">/mês</span>
                </div>
            </div>
            
            <div class="p2p-progress-container">
                <div class="p2p-progress-text">
                    <span>Quitação: ${paidCount} de ${totalCount} ${progressLabel}</span>
                    <span>${Math.round(percent)}%</span>
                </div>
                <div class="p2p-progress-bar">
                    <div class="p2p-progress-fill ${colorClass}" style="width: ${percent}%"></div>
                </div>
            </div>
            
            <div class="p2p-months-matrix">
                ${p2pMonthBadges}
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; border-top: 1px solid var(--border-color); padding-top: 12px;">
                <label style="display: inline-flex; align-items: center; gap: 8px; font-size: 12px; cursor: pointer; user-select: none;">
                    <input type="checkbox" class="p2p-budget-toggle" data-id="${agreement.id}" ${agreement.affectBudget ? 'checked' : ''}>
                    <span>Afeta orçamento</span>
                </label>
                <button class="btn-icon-danger delete-agreement-btn" data-id="${agreement.id}" title="Excluir Acordo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Attach badge click event listeners to toggle status
    document.querySelectorAll(".p2p-month-pill").forEach(pill => {
        pill.addEventListener("click", function() {
            const agreementId = this.getAttribute("data-agreement-id");
            const month = this.getAttribute("data-month");
            toggleP2PMonthStatus(agreementId, month);
        });
    });
    
    // Attach deletion event listeners
    document.querySelectorAll(".delete-agreement-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            if (confirm("Deseja realmente remover este acordo financeiro por completo?")) {
                deleteAgreement(id);
            }
        });
    });

    // Attach budget togglers
    document.querySelectorAll(".p2p-budget-toggle").forEach(chk => {
        chk.addEventListener("change", function() {
            const id = this.getAttribute("data-id");
            const checked = this.checked;
            toggleAgreementAffectBudget(id, checked);
        });
    });
}

// Render Planning detailed tables
function renderPlanningTables() {
    const plan = state.planning[activeMonth] || { income: [], fixed: [], variable: [] };
    const stats = calculateMonthStatus(activeMonth);
    
    const renderTableRows = (items, tbodyEl, showCards = false) => {
        tbodyEl.innerHTML = "";
        
        if (items.length === 0 && !showCards) {
            tbodyEl.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted); padding: 12px;">Nenhum item lançado.</td></tr>`;
            return;
        }
        
        // Render credit cards at the top of Fixed expenses if enabled
        if (showCards) {
            const itauTr = document.createElement("tr");
            itauTr.innerHTML = `
                <td style="font-weight: 500;">💳 Cartão Itaú <span style="font-size: 11px; color: var(--text-muted);">🔗 automático</span></td>
                <td class="text-right" style="color: var(--danger); font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                    ${formatCurrency(stats.itauBill)}
                </td>
                <td class="text-center" style="color: var(--text-muted); font-size: 12px;">Link</td>
            `;
            tbodyEl.appendChild(itauTr);
            
            const nubankTr = document.createElement("tr");
            nubankTr.innerHTML = `
                <td style="font-weight: 500;">💳 Cartão Nubank <span style="font-size: 11px; color: var(--text-muted);">🔗 automático</span></td>
                <td class="text-right" style="color: var(--danger); font-family: 'JetBrains Mono', monospace; font-weight: 700;">
                    ${formatCurrency(stats.nubankBill)}
                </td>
                <td class="text-center" style="color: var(--text-muted); font-size: 12px;">Link</td>
            `;
            tbodyEl.appendChild(nubankTr);
        }
        
        items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight: 500;">${item.description}</td>
                <td class="text-right">
                    <span class="editable-value" data-id="${item.id}" data-val="${item.value}">
                        ${formatCurrency(item.value)}
                    </span>
                </td>
                <td class="text-center">
                    <button class="btn-icon-danger delete-plan-row-btn" data-id="${item.id}" title="Excluir Linha">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </td>
            `;
            tbodyEl.appendChild(tr);
        });
    };
    
    // Incomes
    renderTableRows(plan.income, document.querySelector("#planning-income-table tbody"));
    
    // Fixed
    renderTableRows(plan.fixed, document.querySelector("#planning-fixed-table tbody"), true);
    
    // Variable
    renderTableRows(plan.variable, document.querySelector("#planning-variable-table tbody"));
    
    // Summaries inside planner
    document.getElementById("planner-income-sum").innerText = formatCurrency(stats.incomeSum);
    document.getElementById("planner-expense-sum").innerText = formatCurrency(stats.expensesSum);
    
    const netSumEl = document.getElementById("planner-net-sum");
    netSumEl.innerText = formatCurrency(stats.netBalance);
    if (stats.netBalance < 0) {
        netSumEl.style.color = "var(--danger)";
    } else {
        netSumEl.style.color = "var(--success)";
    }
    
    // Attach double click to inline editing
    document.querySelectorAll(".editable-value").forEach(span => {
        span.addEventListener("dblclick", function() {
            makeValueEditable(this);
        });
    });
    
    // Attach deletion row events
    document.querySelectorAll(".delete-plan-row-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            deletePlanningRow(id);
        });
    });
}

// Convert a table cell value to an editable inputs
function makeValueEditable(span) {
    const id = span.getAttribute("data-id");
    const val = parseFloat(span.getAttribute("data-val"));
    
    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.className = "inline-edit-input";
    input.value = val.toFixed(2);
    
    const saveEdit = () => {
        const newVal = parseFloat(input.value);
        if (!isNaN(newVal)) {
            updatePlanningRowValue(id, newVal);
        } else {
            // Restore span
            span.style.display = "inline-block";
            input.replaceWith(span);
        }
    };
    
    input.addEventListener("blur", saveEdit);
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            saveEdit();
        }
    });
    
    span.style.display = "none";
    span.after(input);
    input.focus();
    input.select();
}

// Update badges for sidebar and P2P counts
function updatePendingBadges() {
    let pendingCount = 0;
    
    state.p2pAgreements.forEach(agreement => {
        // Count pending items within our months data scope
        state.months.forEach(m => {
            if (agreement.statuses[m] === "pending") {
                pendingCount++;
            }
        });
    });
    
    const badge = document.getElementById("pending-p2p-badge");
    badge.innerText = pendingCount;
    badge.style.display = pendingCount > 0 ? "inline-flex" : "none";
}

// Helper to format currency values to BRL format
function formatCurrency(val) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(val);
}

// ==========================================
// Business Operations
// ==========================================

// Add a purchase parcelled
function addPurchase(desc, date, card, totalValue, installments, category) {
    const newId = "p_" + Date.now();
    state.purchases.push({
        id: newId,
        description: desc,
        date: date,
        card: card,
        totalValue: parseFloat(totalValue),
        installments: parseInt(installments, 10),
        category: category
    });
    
    saveState();
    refreshAllUI();
}

// Delete a purchase
function deletePurchase(id) {
    state.purchases = state.purchases.filter(p => p.id !== id);
    saveState();
    refreshAllUI();
}

// Add a recurring subscription
function addSubscription(name, value, day, card, color) {
    const newId = "s_" + Date.now();
    state.subscriptions.push({
        id: newId,
        name: name,
        value: parseFloat(value),
        day: parseInt(day, 10),
        card: card,
        color: color
    });
    
    saveState();
    refreshAllUI();
}

// Delete subscription
function deleteSubscription(id) {
    state.subscriptions = state.subscriptions.filter(s => s.id !== id);
    saveState();
    refreshAllUI();
}

// Add P2P Agreement
function addAgreement(name, type, amount, installments, startMonth) {
    const newId = "a_" + Date.now();
    const statuses = {};
    
    // Auto-fill all statuses as pending initially
    for (let i = 0; i < installments; i++) {
        const m = addMonths(startMonth, i);
        statuses[m] = "pending";
    }
    
    state.p2pAgreements.push({
        id: newId,
        name: name,
        type: type,
        amount: parseFloat(amount),
        installments: parseInt(installments, 10),
        startMonth: startMonth,
        statuses: statuses,
        affectBudget: false
    });
    
    saveState();
    refreshAllUI();
}

// Toggle status of a P2P month installment
function toggleP2PMonthStatus(agreementId, month) {
    const agreement = state.p2pAgreements.find(a => a.id === agreementId);
    if (agreement) {
        const current = agreement.statuses[month];
        if (current === "pending") {
            agreement.statuses[month] = "paid";
        } else if (current === "paid") {
            agreement.statuses[month] = "pending";
        }
        
        saveState();
        refreshAllUI();
    }
}

// Delete P2P Agreement
function deleteAgreement(id) {
    state.p2pAgreements = state.p2pAgreements.filter(a => a.id !== id);
    saveState();
    refreshAllUI();
}

// Toggle if P2P Agreement affects the general monthly budget
function toggleAgreementAffectBudget(id, checked) {
    const agreement = state.p2pAgreements.find(a => a.id === id);
    if (agreement) {
        agreement.affectBudget = checked;
        saveState();
        refreshAllUI();
    }
}

// Add planning row (fixed, variable, or additional earnings)
function addPlanningRow(type, description, val) {
    const newId = "pr_" + Date.now();
    const plan = state.planning[activeMonth];
    
    if (plan) {
        plan[type].push({
            id: newId,
            description: description,
            value: parseFloat(val)
        });
        
        saveState();
        refreshAllUI();
    }
}

// Edit planning row value inline
function updatePlanningRowValue(id, newVal) {
    const plan = state.planning[activeMonth];
    if (plan) {
        // Find row inside fixed, variable or income lists
        let found = false;
        
        ['fixed', 'variable', 'income'].forEach(listName => {
            if (found) return;
            const item = plan[listName].find(i => i.id === id);
            if (item) {
                item.value = newVal;
                found = true;
            }
        });
        
        if (found) {
            saveState();
            refreshAllUI();
        }
    }
}

// Delete a planning row from budget
function deletePlanningRow(id) {
    const plan = state.planning[activeMonth];
    if (plan) {
        ['fixed', 'variable', 'income'].forEach(listName => {
            plan[listName] = plan[listName].filter(item => item.id !== id);
        });
        
        saveState();
        refreshAllUI();
    }
}

// Refresh all UI elements
function refreshAllUI() {
    renderMonthCarousel();
    renderKPIs();
    renderInstallmentsTable();
    renderRecurrentPurchases();
    renderP2PAgreements();
    renderPlanningTables();
    updatePendingBadges();
    updateCommentBadges();
    
    // Draw charts after DOM is loaded and metrics are updated
    renderCharts();
}

// Save state to LocalStorage
function saveState() {
    localStorage.setItem("financeflow_state", JSON.stringify(state));
}

// Initialize Application state
function init() {
    const stored = localStorage.getItem("financeflow_state");
    if (stored) {
        try {
            state = JSON.parse(stored);
            // Ensure compatibility if new fields were added
            if (!state.months) state.months = DEFAULT_MOCK_DATA.months;
            state.comments = state.comments || {};
        } catch (e) {
            state = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
            state.comments = {};
        }
    } else {
        // Use default pre-loaded mock data
        state = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
        state.comments = {};
        saveState();
    }
    
    // Populate agreement start month selectors in HTML modal
    populateStartMonthSelectors();
    
    // Trigger initial UI rendering
    refreshAllUI();
    
    // Register tab button selectors
    setupTabListeners();
    
    // Setup modal event triggers
    setupModalListeners();
    
    // Setup carousel button triggers
    setupCarouselListeners();
    
    // Setup utility utilities buttons (backup, theme)
    setupUtilityListeners();
    
    // Setup comments listeners
    setupCommentListeners();
}

// Populate dropdown selectors with future months
function populateStartMonthSelectors() {
    const select = document.getElementById("a-start");
    select.innerHTML = "";
    
    // Offer starting months from 3 months ago to 12 months ahead
    const today = new Date();
    let currentY = today.getFullYear();
    let currentM = today.getMonth(); // 0-11
    
    // Go 3 months back
    currentM -= 3;
    if (currentM < 0) {
        currentM += 12;
        currentY -= 1;
    }
    
    for (let i = 0; i < 18; i++) {
        const targetYear = currentY + Math.floor((currentM + i) / 12);
        const targetMonth = ((currentM + i) % 12 + 12) % 12;
        const value = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
        
        const opt = document.createElement("option");
        opt.value = value;
        opt.innerText = formatMonthYear(value);
        
        if (value === activeMonth) {
            opt.selected = true;
        }
        
        select.appendChild(opt);
    }
}

// ==========================================
// Event Listeners Setup
// ==========================================

function setupTabListeners() {
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            const tabId = this.getAttribute("data-tab");
            activeTab = tabId;
            
            document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
            document.getElementById(`tab-${tabId}`).classList.add("active");
            
            // Re-render specifically for P2P matrix or planner if needed
            if (tabId === "p2p") {
                renderP2PAgreements();
            } else if (tabId === "financas") {
                renderPlanningTables();
            } else if (tabId === "dashboard") {
                renderKPIs();
                renderCharts();
            }
        });
    });
    
    // Inner P2P tabs switcher
    document.querySelectorAll(".p2p-tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".p2p-tab-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            activeP2PType = this.getAttribute("data-p2p-type");
            renderP2PAgreements();
        });
    });
}

function setupCarouselListeners() {
    document.getElementById("prev-month-btn").addEventListener("click", () => {
        const curIdx = state.months.indexOf(activeMonth);
        if (curIdx > 0) {
            activeMonth = state.months[curIdx - 1];
        } else {
            // Add a new previous month dynamically
            const newMonth = addMonths(activeMonth, -1);
            state.months.unshift(newMonth);
            // Create default planner object for it
            state.planning[newMonth] = {
                income: [{ id: "pi1_" + Date.now(), description: "Salário", value: 5000.00 }],
                fixed: [
                    { id: "pf1_" + Date.now(), description: "Transporte", value: 90.00 },
                    { id: "pf2_" + Date.now(), description: "MEI", value: 86.05 },
                    { id: "pf3_" + Date.now(), description: "Telefone", value: 41.89 },
                    { id: "pf4_" + Date.now(), description: "Gastos livres mensais", value: 1500.00 }
                ],
                variable: []
            };
            activeMonth = newMonth;
            saveState();
        }
        refreshAllUI();
    });
    
    document.getElementById("next-month-btn").addEventListener("click", () => {
        const curIdx = state.months.indexOf(activeMonth);
        if (curIdx < state.months.length - 1) {
            activeMonth = state.months[curIdx + 1];
        } else {
            // Add a new future month dynamically
            const newMonth = addMonths(activeMonth, 1);
            state.months.push(newMonth);
            // Copy default structure from last month
            state.planning[newMonth] = {
                income: [{ id: "pi1_" + Date.now(), description: "Salário", value: 5000.00 }],
                fixed: [
                    { id: "pf1_" + Date.now(), description: "Transporte", value: 90.00 },
                    { id: "pf2_" + Date.now(), description: "MEI", value: 86.05 },
                    { id: "pf3_" + Date.now(), description: "Telefone", value: 41.89 },
                    { id: "pf4_" + Date.now(), description: "Gastos livres mensais", value: 1500.00 }
                ],
                variable: []
            };
            activeMonth = newMonth;
            saveState();
        }
        refreshAllUI();
    });
}

function setupModalListeners() {
    // Open Modals
    document.getElementById("add-purchase-btn").addEventListener("click", () => openModal("modal-purchase"));
    document.getElementById("add-recurring-btn").addEventListener("click", () => openModal("modal-recurring"));
    document.getElementById("add-agreement-btn").addEventListener("click", () => openModal("modal-agreement"));
    document.getElementById("add-planning-row-btn").addEventListener("click", () => openModal("modal-planning-row"));
    
    // Close Modals
    document.querySelectorAll("[data-modal]").forEach(btn => {
        btn.addEventListener("click", function(e) {
            if (e.target === this || this.classList.contains("close-modal-btn") || this.innerText === "Cancelar") {
                const modalId = this.getAttribute("data-modal");
                closeModal(modalId);
            }
        });
    });
    
    // Form Submissions
    
    // 1. Purchase
    document.getElementById("purchase-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const desc = document.getElementById("p-description").value;
        const date = document.getElementById("p-date").value;
        const card = document.getElementById("p-card").value;
        const total = document.getElementById("p-total").value;
        const installments = document.getElementById("p-installments").value;
        const cat = document.getElementById("p-category").value;
        
        addPurchase(desc, date, card, total, installments, cat);
        closeModal("modal-purchase");
        this.reset();
    });
    
    // 2. Subscription
    document.getElementById("recurring-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("r-name").value;
        const val = document.getElementById("r-value").value;
        const day = document.getElementById("r-day").value;
        const card = document.getElementById("r-card").value;
        const color = document.getElementById("r-color").value;
        
        addSubscription(name, val, day, card, color);
        closeModal("modal-recurring");
        this.reset();
    });
    
    // 3. Agreement
    document.getElementById("agreement-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const name = document.getElementById("a-name").value;
        const type = document.getElementById("a-type").value;
        const amount = document.getElementById("a-amount").value;
        const installments = document.getElementById("a-installments").value;
        const start = document.getElementById("a-start").value;
        
        addAgreement(name, type, amount, installments, start);
        closeModal("modal-agreement");
        this.reset();
    });
    
    // 4. Planning row
    document.getElementById("planning-row-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const type = document.getElementById("pl-type").value;
        const desc = document.getElementById("pl-description").value;
        const val = document.getElementById("pl-val").value;
        
        addPlanningRow(type, desc, val);
        closeModal("modal-planning-row");
        this.reset();
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    
    // Pre-fill today's date on purchase form if empty
    if (modalId === "modal-purchase") {
        document.getElementById("p-date").value = new Date().toISOString().substring(0, 10);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove("active");
    setTimeout(() => modal.style.display = "none", 300);
}

function setupUtilityListeners() {
    // Theme Toggle
    document.getElementById("theme-toggle-btn").addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("financeflow_theme", next);
        renderCharts();
    });
    
    // Set stored theme
    const storedTheme = localStorage.getItem("financeflow_theme") || "dark";
    document.documentElement.setAttribute("data-theme", storedTheme);
    
    // Backup export JSON
    document.getElementById("export-btn").addEventListener("click", () => {
        const json = JSON.stringify(state, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = `financeflow_backup_${activeMonth}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Backup import JSON
    const fileInput = document.getElementById("file-import-input");
    document.getElementById("import-btn").addEventListener("click", () => {
        fileInput.click();
    });
    
    fileInput.addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedState = JSON.parse(e.target.result);
                    if (importedState.months && importedState.planning) {
                        state = importedState;
                        saveState();
                        refreshAllUI();
                        alert("Dados importados com sucesso!");
                    } else {
                        alert("Arquivo de backup inválido.");
                    }
                } catch (err) {
                    alert("Erro ao ler o arquivo JSON.");
                }
            };
            reader.readAsText(file);
        }
    });
    
    // Reset back to initial default spreadsheet mockup data
    document.getElementById("reset-btn").addEventListener("click", () => {
        if (confirm("Isto irá apagar todas as alterações e restaurar os dados originais contidos nas imagens das suas planilhas. Deseja prosseguir?")) {
            state = JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
            state.comments = {};
            activeMonth = "2026-08";
            saveState();
            refreshAllUI();
        }
    });
}

// Start application when window loads
window.addEventListener("DOMContentLoaded", init);

// ==========================================
// Savings Comments Engine (Google Sheets Style)
// ==========================================

// Global state setup for comments listeners
function setupCommentListeners() {
    // 1. Toggle popover when clicking the trigger button or corner indicator
    ['life', 'travel'].forEach(cardId => {
        const trigger = document.querySelector(`.comment-trigger-btn[data-savings-id="${cardId}"]`);
        const indicator = document.querySelector(`.comment-indicator[data-savings-id="${cardId}"]`);
        const closeBtn = document.querySelector(`.close-popover-btn[data-savings-id="${cardId}"]`);
        const popover = document.getElementById(`popover-savings-${cardId}`);
        const form = document.querySelector(`.comment-form[data-savings-id="${cardId}"]`);
        const editAuthorBtn = document.querySelector(`.btn-change-author[data-savings-id="${cardId}"]`);

        const togglePopover = (e) => {
            e.stopPropagation();
            // Close other popovers first
            const otherCardId = cardId === 'life' ? 'travel' : 'life';
            const otherPopover = document.getElementById(`popover-savings-${otherCardId}`);
            if (otherPopover) otherPopover.style.display = 'none';

            const isHidden = popover.style.display === 'none';
            if (isHidden) {
                popover.style.display = 'flex';
                renderComments(cardId);
            } else {
                popover.style.display = 'none';
            }
        };

        if (trigger) trigger.addEventListener('click', togglePopover);
        if (indicator) indicator.addEventListener('click', togglePopover);

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                popover.style.display = 'none';
            });
        }

        // Prevent click events on popover from closing itself via the window click listener
        if (popover) {
            popover.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // 2. Change Author Nickname
        if (editAuthorBtn) {
            editAuthorBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentAuthor = localStorage.getItem("comment_author_name") || "Você";
                const newAuthor = prompt("Como deseja se identificar nos comentários?", currentAuthor);
                if (newAuthor && newAuthor.trim()) {
                    localStorage.setItem("comment_author_name", newAuthor.trim());
                    updateCommentBadges();
                }
            });
        }

        // 3. Submit New Comment
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = form.querySelector('.comment-input');
                const text = input.value.trim();
                if (text) {
                    addComment(cardId, text);
                    input.value = '';
                }
            });
        }
    });

    // 4. Close popovers when clicking anywhere outside
    window.addEventListener('click', () => {
        ['life', 'travel'].forEach(cardId => {
            const popover = document.getElementById(`popover-savings-${cardId}`);
            if (popover) {
                popover.style.display = 'none';
            }
        });
    });
}

// Render the comments list for a given savings card
function renderComments(cardId) {
    const listEl = document.getElementById(`comments-list-${cardId}`);
    if (!listEl) return;

    listEl.innerHTML = '';
    const key = `${activeMonth}_${cardId}`;
    const comments = state.comments[key] || [];

    if (comments.length === 0) {
        listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 11px; padding: 12px 0;">Nenhum comentário neste mês.</div>`;
        return;
    }

    comments.forEach(comment => {
        const item = document.createElement('div');
        item.className = 'comment-item';

        // Format Date
        let dateStr = '';
        try {
            const date = new Date(comment.date);
            dateStr = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
                      date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            dateStr = comment.date;
        }

        // Get Initials for Avatar
        const initials = comment.author ? comment.author.substring(0, 2) : 'U';

        item.innerHTML = `
            <div class="comment-avatar" title="${comment.author}">${initials}</div>
            <div class="comment-content">
                <div class="comment-info">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date">${dateStr}</span>
                </div>
                <p class="comment-text">${comment.text}</p>
            </div>
            <button class="btn-delete-comment" data-id="${comment.id}" title="Excluir">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
        `;

        // Handle delete event
        const delBtn = item.querySelector('.btn-delete-comment');
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Deseja realmente excluir este comentário?")) {
                deleteComment(cardId, comment.id);
            }
        });

        listEl.appendChild(item);
    });

    // Scroll to bottom of comments list
    listEl.scrollTop = listEl.scrollHeight;
}

// Add a comment
function addComment(cardId, text) {
    const author = localStorage.getItem("comment_author_name") || "Você";
    const key = `${activeMonth}_${cardId}`;

    if (!state.comments[key]) {
        state.comments[key] = [];
    }

    state.comments[key].push({
        id: 'c_' + Date.now(),
        author: author,
        text: text,
        date: new Date().toISOString()
    });

    saveState();
    renderComments(cardId);
    updateCommentBadges();
}

// Delete a comment
function deleteComment(cardId, commentId) {
    const key = `${activeMonth}_${cardId}`;
    if (state.comments[key]) {
        state.comments[key] = state.comments[key].filter(c => c.id !== commentId);
        saveState();
        renderComments(cardId);
        updateCommentBadges();
    }
}

// Update Comment Badges and visual indicators
function updateCommentBadges() {
    const author = localStorage.getItem("comment_author_name") || "Você";

    ['life', 'travel'].forEach(cardId => {
        const key = `${activeMonth}_${cardId}`;
        const comments = state.comments ? (state.comments[key] || []) : [];
        const count = comments.length;

        // Update badge UI
        const badge = document.getElementById(`${cardId}-comment-count`);
        const card = document.getElementById(`savings-card-${cardId}`);
        const authorDisplay = document.getElementById(`author-name-display-${cardId}`);

        if (authorDisplay) {
            authorDisplay.innerText = author;
        }

        if (badge && card) {
            if (count > 0) {
                badge.innerText = count;
                badge.style.display = 'inline-flex';
                card.classList.add('has-comments');
            } else {
                badge.style.display = 'none';
                card.classList.remove('has-comments');
            }
        }
    });
}
