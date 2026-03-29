/**
 * Professional Lease Proposal Builder Logic
 */

const elements = {
    sqyd: document.getElementById('inp-sqyd'),
    sqft: document.getElementById('inp-sqft'),
    psfBase: document.getElementById('inp-psf-base'),
    psfCam: document.getElementById('inp-psf-cam'),
    term: document.getElementById('inp-term'),
    esc: document.getElementById('inp-esc'),
    resMonthly: document.getElementById('res-monthly'),
    resTotal: document.getElementById('res-total'),
    resAvgPsf: document.getElementById('res-avg-psf'),
    tableBody: document.querySelector('#proposal-table tbody'),
    canvasCumulative: document.getElementById('proposalChart').getContext('2d'),
    canvasAnnual: document.getElementById('annualChart').getContext('2d'),
    canvasComposition: document.getElementById('compositionChart').getContext('2d'),
    
    // Branding & Settings
    brandNameInput: document.getElementById('inp-brand-name'),
    brandLogoInput: document.getElementById('inp-brand-logo'),
    brandNameText: document.getElementById('brand-name-text'),
    brandLogoContainer: document.getElementById('brand-logo-container'),
    logoPreview: document.getElementById('logo-preview'),
    toggleAdvanced: document.getElementById('toggle-advanced'),
    togglePrintDuo: document.getElementById('toggle-print-duo'),
    btnReset: document.getElementById('btn-reset-branding')
};

let charts = {
    cumulative: null,
    annual: null,
    composition: null
};

let chartUpdateTimeout = null;
let state = {
    brandName: 'Smart Pitch',
    brandLogo: null,
    isAdvanced: false,
    isPrintDuo: false,
    overrides: {} 
};

const STORAGE_KEY = 'lease_pro_v1';

function init() {
    loadAppState();
    setupEventListeners();
    refreshAll();
    updateBrandUI();
}

function saveAppState() {
    const data = {
        brandName: elements.brandNameInput.value,
        brandLogo: state.brandLogo,
        isAdvanced: elements.toggleAdvanced.checked,
        isPrintDuo: elements.togglePrintDuo.checked,
        overrides: state.overrides,
        sqyd: elements.sqyd.value,
        psfBase: elements.psfBase.value,
        psfCam: elements.psfCam.value,
        term: elements.term.value,
        esc: elements.esc.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadAppState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        state = { ...state, ...data };
        
        elements.brandNameInput.value = data.brandName || '';
        elements.toggleAdvanced.checked = !!data.isAdvanced;
        elements.togglePrintDuo.checked = !!data.isPrintDuo;
        elements.sqyd.value = data.sqyd || elements.sqyd.value;
        elements.sqft.value = (elements.sqyd.value * 9).toFixed(2);
        elements.psfBase.value = data.psfBase || elements.psfBase.value;
        elements.psfCam.value = data.psfCam || elements.psfCam.value;
        elements.term.value = data.term || elements.term.value;
        elements.esc.value = data.esc || elements.esc.value;
        state.overrides = data.overrides || {};
        
        updatePrintClass();
    }
}

function updateBrandUI() {
    elements.brandNameText.innerText = elements.brandNameInput.value || 'Smart Pitch';
    if (state.brandLogo) {
        elements.brandLogoContainer.innerHTML = `<img src="${state.brandLogo}" style="height: 50px; width: 50px; object-fit: contain;">`;
        elements.logoPreview.innerHTML = `<img src="${state.brandLogo}">`;
    } else {
        elements.brandLogoContainer.innerHTML = `<i data-lucide="building-2"></i>`;
        elements.logoPreview.innerHTML = `<i data-lucide="image"></i>`;
        lucide.createIcons();
    }
}

function setupEventListeners() {
    [elements.term, elements.toggleAdvanced].forEach(el => {
        el.addEventListener('change', () => refreshAll());
    });

    [elements.sqyd, elements.psfBase, elements.psfCam, elements.esc].forEach(el => {
        el.addEventListener('input', () => {
            if (el === elements.sqyd) elements.sqft.value = (elements.sqyd.value * 9).toFixed(2);
            calculateAndRefreshUI();
            saveAppState();
        });
    });

    elements.sqft.addEventListener('input', () => {
        elements.sqyd.value = (elements.sqft.value / 9).toFixed(2);
        calculateAndRefreshUI();
        saveAppState();
    });

    elements.brandNameInput.addEventListener('input', () => {
        updateBrandUI();
        saveAppState();
    });

    elements.brandLogoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                state.brandLogo = event.target.result;
                updateBrandUI();
                saveAppState();
            };
            reader.readAsDataURL(file);
        }
    });

    elements.togglePrintDuo.addEventListener('change', () => {
        state.isPrintDuo = elements.togglePrintDuo.checked;
        updatePrintClass();
        saveAppState();
    });

    elements.btnReset.addEventListener('click', () => {
        if (confirm('Reset all branding and settings?')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    });

    window.onbeforeprint = () => {
        if (state.isPrintDuo) {
            const app = document.querySelector('.proposal-app');
            let printDiv = document.getElementById('print-duplicate-container');
            if (!printDiv) {
                printDiv = document.createElement('div');
                printDiv.id = 'print-duplicate-container';
                printDiv.className = 'print-only';
                document.body.appendChild(printDiv);
            }
            
            const clone = app.cloneNode(true);
            const originalCanvases = app.querySelectorAll('canvas');
            const cloneCanvases = clone.querySelectorAll('canvas');
            
            originalCanvases.forEach((orig, idx) => {
                const img = document.createElement('img');
                img.src = orig.toDataURL();
                img.style.width = '100%';
                cloneCanvases[idx].parentNode.replaceChild(img, cloneCanvases[idx]);
            });
            
            printDiv.innerHTML = clone.innerHTML;
            document.body.classList.add('print-two-copies');
        }
    };

    window.onafterprint = () => {
        const printDiv = document.getElementById('print-duplicate-container');
        if (printDiv) printDiv.remove();
        document.body.classList.remove('print-two-copies');
    };
}

function updatePrintClass() {
    document.body.classList.toggle('print-two-copies', state.isPrintDuo);
}

function refreshAll() {
    state.isAdvanced = elements.toggleAdvanced.checked;
    renderTableStructure();
    calculateAndRefreshUI();
    saveAppState();
    lucide.createIcons();
}

function renderTableStructure() {
    const termYears = parseInt(elements.term.value) || 1;
    let tableHtml = '';
    for (let year = 1; year <= termYears; year++) {
        tableHtml += `
            <tr id="row-year-${year}">
                <td><strong>Year ${year}</strong></td>
                <td id="cell-year-${year}-psf"></td>
                <td id="cell-year-${year}-monthly"></td>
                <td id="cell-year-${year}-annual"></td>
                <td id="cell-year-${year}-cumulative"></td>
            </tr>
        `;
    }
    elements.tableBody.innerHTML = tableHtml;
}

function calculateAndRefreshUI() {
    const sqft = parseFloat(elements.sqft.value) || 0;
    const psfBase = parseFloat(elements.psfBase.value) || 0;
    const psfCam = parseFloat(elements.psfCam.value) || 0;
    const termYears = parseInt(elements.term.value) || 1;
    const escPct = parseFloat(elements.esc.value) || 0;
    const isAdvanced = state.isAdvanced;

    let totalCommitment = 0;
    let totalBaseRent = 0;
    let totalCamRent = 0;
    let totalPsfYears = 0;
    
    let labels = [];
    let cumulativeData = [];
    let annualData = [];
    
    let currentPsf = psfBase;

    for (let year = 1; year <= termYears; year++) {
        const overrideBase = state.overrides[`base_${year}`];
        const overrideCam = state.overrides[`cam_${year}`];
        
        const effectiveBase = (isAdvanced && overrideBase !== undefined) ? parseFloat(overrideBase) : currentPsf;
        const effectiveCam = (isAdvanced && overrideCam !== undefined) ? parseFloat(overrideCam) : psfCam;

        const monthlyBase = effectiveBase * sqft;
        const monthlyCam = effectiveCam * sqft;
        const monthlyTotal = monthlyBase + monthlyCam;
        const annualTotal = monthlyTotal * 12;
        
        totalCommitment += annualTotal;
        totalBaseRent += (effectiveBase * sqft * 12);
        totalCamRent += (effectiveCam * sqft * 12);
        totalPsfYears += (effectiveBase + effectiveCam);

        labels.push(`Year ${year}`);
        cumulativeData.push(totalCommitment);
        annualData.push(annualTotal);

        const psfCell = document.getElementById(`cell-year-${year}-psf`);
        if (psfCell) {
            if (isAdvanced) {
                let baseInput = psfCell.querySelector(`.over-base-${year}`);
                let camInput = psfCell.querySelector(`.over-cam-${year}`);
                if (!baseInput) {
                    psfCell.innerHTML = `
                        <div class="override-cell">
                            <div style="display:flex; gap:0.5rem; align-items:center;">
                                <div class="override-cell"><span class="override-label">Base</span><input type="number" step="0.1" class="year-override-input over-base-${year}" value="${effectiveBase.toFixed(2)}" oninput="setOverride(${year}, 'base', this.value)"></div>
                                <div class="override-cell"><span class="override-label">CAM</span><input type="number" step="0.1" class="year-override-input over-cam-${year}" value="${effectiveCam.toFixed(2)}" oninput="setOverride(${year}, 'cam', this.value)"></div>
                            </div>
                        </div>`;
                } else {
                    if (document.activeElement !== baseInput) baseInput.value = effectiveBase.toFixed(2);
                    if (document.activeElement !== camInput) camInput.value = effectiveCam.toFixed(2);
                }
            } else {
                psfCell.innerHTML = `${formatCurrency(effectiveBase)} + ${formatCurrency(effectiveCam)}`;
            }
        }

        const mCell = document.getElementById(`cell-year-${year}-monthly`);
        if (mCell) mCell.innerText = formatCurrency(monthlyTotal);
        const aCell = document.getElementById(`cell-year-${year}-annual`);
        if (aCell) aCell.innerText = formatCurrency(annualTotal);
        const cCell = document.getElementById(`cell-year-${year}-cumulative`);
        if (cCell) cCell.innerText = formatCurrency(totalCommitment);

        currentPsf = effectiveBase * (1 + (escPct / 100));
    }

    const y1Base = (isAdvanced && state.overrides['base_1'] !== undefined) ? parseFloat(state.overrides['base_1']) : psfBase;
    const y1Cam = (isAdvanced && state.overrides['cam_1'] !== undefined) ? parseFloat(state.overrides['cam_1']) : psfCam;
    const initialMonthly = (y1Base + y1Cam) * sqft;
    const avgPsf = totalPsfYears / termYears;

    elements.resMonthly.innerText = formatCurrency(initialMonthly);
    elements.resTotal.innerText = formatCurrency(totalCommitment);
    elements.resAvgPsf.innerText = formatCurrency(avgPsf);

    clearTimeout(chartUpdateTimeout);
    chartUpdateTimeout = setTimeout(() => {
        renderCumulativeChart(labels, cumulativeData);
        renderAnnualChart(labels, annualData);
        renderCompositionChart(totalBaseRent, totalCamRent);
    }, 200);
}

window.setOverride = (year, type, val) => {
    state.overrides[`${type}_${year}`] = val;
    calculateAndRefreshUI();
    saveAppState();
};

function formatCurrency(val) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
}

function renderCumulativeChart(labels, data) {
    if (charts.cumulative) charts.cumulative.destroy();
    charts.cumulative = new Chart(elements.canvasCumulative, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Outflow',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderAnnualChart(labels, data) {
    if (charts.annual) charts.annual.destroy();
    charts.annual = new Chart(elements.canvasAnnual, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Annual Cost',
                data: data,
                backgroundColor: '#2563eb',
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function renderCompositionChart(base, cam) {
    if (charts.composition) charts.composition.destroy();
    charts.composition = new Chart(elements.canvasComposition, {
        type: 'doughnut',
        data: {
            labels: ['Base Rent', 'CAM Charges'],
            datasets: [{
                data: [base, cam],
                backgroundColor: ['#2563eb', '#10b981'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'bottom' } 
            },
            cutout: '70%'
        }
    });
}

init();
