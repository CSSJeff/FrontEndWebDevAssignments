'use strict';

const funds = [
  { id: 1, name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', provider: 'Vanguard', rate: 7.2, growth: 8.4, type: 'compound' },
  { id: 2, name: 'Schwab U.S. Dividend Equity ETF', ticker: 'SCHD', provider: 'Charles Schwab', rate: 6.8, growth: 7.5, type: 'compound' },
  { id: 3, name: 'Fidelity 500 Index Fund', ticker: 'FXAIX', provider: 'Fidelity', rate: 7.0, growth: 8.1, type: 'compound' },
  { id: 4, name: 'NEOS S&P 500 High Income ETF', ticker: 'SPYI', provider: 'NEOS', rate: 9.5, growth: 5.8, type: 'simple' },
  { id: 5, name: 'Vanguard High Dividend Yield ETF', ticker: 'VYM', provider: 'Vanguard', rate: 6.1, growth: 6.9, type: 'compound' },
  { id: 6, name: 'Schwab U.S. Broad Market ETF', ticker: 'SCHB', provider: 'Charles Schwab', rate: 7.1, growth: 8.0, type: 'compound' }
];

const STORAGE_KEYS = {
  history: 'ficCalculationHistory',
  comparison: 'ficComparison',
  requests: 'ficFundRequests'
};

const state = {
  history: loadStoredArray(STORAGE_KEYS.history),
  comparison: loadStoredArray(STORAGE_KEYS.comparison),
  requests: loadStoredArray(STORAGE_KEYS.requests),
  currentResult: null
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveState(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function showView(viewId) {
  $$('.view').forEach((view) => view.classList.toggle('active-view', view.id === viewId));
  $$('.nav-link').forEach((button) => button.classList.toggle('active', button.dataset.view === viewId));
  $('#mainNav').classList.remove('open');
  $('#menuButton').setAttribute('aria-expanded', 'false');
  history.replaceState(null, '', `#${viewId}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (viewId === 'compare') renderComparison();
}

function bindNavigation() {
  $$('[data-view]').forEach((control) => {
    control.addEventListener('click', (event) => {
      event.preventDefault();
      showView(control.dataset.view);
    });
  });

  $('#menuButton').addEventListener('click', () => {
    const nav = $('#mainNav');
    const isOpen = nav.classList.toggle('open');
    $('#menuButton').setAttribute('aria-expanded', String(isOpen));
  });
}

function getFilteredFunds() {
  const query = $('#fundSearch').value.trim().toLowerCase();
  const type = $('#typeFilter').value;
  const sort = $('#sortFunds').value;

  const filtered = funds.filter((fund) => {
    const matchesQuery = [fund.name, fund.ticker, fund.provider].some((value) => value.toLowerCase().includes(query));
    const matchesType = type === 'all' || fund.type === type;
    return matchesQuery && matchesType;
  });

  return filtered.sort((a, b) => {
    switch (sort) {
      case 'rate-desc': return b.rate - a.rate;
      case 'rate-asc': return a.rate - b.rate;
      case 'growth-desc': return b.growth - a.growth;
      default: return a.name.localeCompare(b.name);
    }
  });
}

function renderFunds() {
  const tableBody = $('#fundTableBody');
  const matchingFunds = getFilteredFunds();
  tableBody.innerHTML = '';

  matchingFunds.forEach((fund) => {
    const selected = state.comparison.includes(fund.id);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><div class="fund-name">${fund.name}</div><div class="ticker">${fund.ticker}</div></td>
      <td>${fund.provider}</td>
      <td>${fund.type[0].toUpperCase() + fund.type.slice(1)}</td>
      <td>${fund.rate.toFixed(2)}%</td>
      <td>${fund.growth.toFixed(2)}%</td>
      <td class="action-cell">
        <button class="small-button primary" data-select-fund="${fund.id}">Select</button>
        <button class="small-button ${selected ? 'selected' : ''}" data-compare-fund="${fund.id}">${selected ? 'Added' : 'Compare'}</button>
      </td>`;
    tableBody.appendChild(row);
  });

  $('#noFundsMessage').classList.toggle('hidden', matchingFunds.length > 0);
  bindFundActions();
}

function bindFundActions() {
  $$('[data-select-fund]').forEach((button) => button.addEventListener('click', () => selectFund(Number(button.dataset.selectFund))));
  $$('[data-compare-fund]').forEach((button) => button.addEventListener('click', () => toggleComparison(Number(button.dataset.compareFund))));
}

function selectFund(fundId) {
  const fund = funds.find((item) => item.id === fundId);
  if (!fund) return;
  $('#calcName').value = `${fund.ticker} estimate`;
  $('#rate').value = fund.rate;
  $('#interestType').value = fund.type;
  updateCompoundVisibility();
  calculateAndRender();
  showView('calculator');
}

function toggleComparison(fundId) {
  const index = state.comparison.indexOf(fundId);
  if (index >= 0) {
    state.comparison.splice(index, 1);
  } else if (state.comparison.length < 4) {
    state.comparison.push(fundId);
  } else {
    alert('You can compare up to four funds at a time.');
    return;
  }
  saveState(STORAGE_KEYS.comparison, state.comparison);
  renderFunds();
  renderComparison();
  updateStats();
}

function readCalculatorInputs() {
  return {
    name: $('#calcName').value.trim() || 'Untitled calculation',
    principal: Number($('#principal').value),
    annualRate: Number($('#rate').value),
    years: Number($('#years').value),
    interestType: $('#interestType').value,
    recurringDeposit: Number($('#recurringDeposit').value),
    depositFrequency: $('#depositFrequency').value,
    compoundsPerYear: Number($('#compoundFrequency').value)
  };
}

function validateCalculation(input) {
  const errors = [];
  if (!Number.isFinite(input.principal) || input.principal < 0) errors.push('Initial deposit must be zero or greater.');
  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 100) errors.push('Annual rate must be between 0% and 100%.');
  if (!Number.isInteger(input.years) || input.years < 1 || input.years > 100) errors.push('Time period must be a whole number from 1 to 100 years.');
  if (!Number.isFinite(input.recurringDeposit) || input.recurringDeposit < 0) errors.push('Recurring deposit must be zero or greater.');
  return errors;
}

function calculateInvestment(input) {
  const rate = input.annualRate / 100;
  const depositPeriods = input.depositFrequency === 'monthly' ? 12 : 1;
  const totalDeposits = input.recurringDeposit * depositPeriods * input.years;
  const totalContributions = input.principal + totalDeposits;
  let balance = input.principal;

  if (input.interestType === 'simple') {
    for (let year = 1; year <= input.years; year += 1) {
      balance += input.principal * rate;
      balance += input.recurringDeposit * depositPeriods;
    }
  } else {
    const monthsPerCompound = 12 / input.compoundsPerYear;
    const periodicRate = rate / input.compoundsPerYear;
    const totalMonths = input.years * 12;

    for (let month = 1; month <= totalMonths; month += 1) {
      if (month % monthsPerCompound === 0) balance *= (1 + periodicRate);
      if (input.depositFrequency === 'monthly') balance += input.recurringDeposit;
      if (input.depositFrequency === 'yearly' && month % 12 === 0) balance += input.recurringDeposit;
    }
  }

  return {
    ...input,
    futureValue: balance,
    totalContributions,
    estimatedEarnings: balance - totalContributions
  };
}

function calculateAndRender() {
  const input = readCalculatorInputs();
  const errors = validateCalculation(input);
  const errorBox = $('#calculatorErrors');

  if (errors.length) {
    errorBox.innerHTML = errors.map((error) => `<div>${error}</div>`).join('');
    errorBox.classList.remove('hidden');
    state.currentResult = null;
    renderResult(null);
    return;
  }

  errorBox.classList.add('hidden');
  state.currentResult = calculateInvestment(input);
  renderResult(state.currentResult);
}

function renderResult(result) {
  const safe = result || { futureValue: 0, totalContributions: 0, estimatedEarnings: 0 };
  $('#futureValue').textContent = formatCurrency(safe.futureValue);
  $('#totalContributions').textContent = formatCurrency(safe.totalContributions);
  $('#estimatedEarnings').textContent = formatCurrency(safe.estimatedEarnings);

  const total = Math.max(safe.futureValue, 1);
  const contributionPercent = Math.max(0, Math.min(100, (safe.totalContributions / total) * 100));
  $('#contributionBar').style.width = `${contributionPercent}%`;
  $('#earningsBar').style.width = `${100 - contributionPercent}%`;
}

function updateCompoundVisibility() {
  $('#compoundFrequencyLabel').classList.toggle('hidden', $('#interestType').value !== 'compound');
}

function saveCurrentCalculation() {
  calculateAndRender();
  if (!state.currentResult) return;
  state.history.unshift({ ...state.currentResult, id: Date.now(), savedAt: new Date().toISOString() });
  state.history = state.history.slice(0, 12);
  saveState(STORAGE_KEYS.history, state.history);
  renderHistory();
  updateStats();
}

function renderHistory() {
  const container = $('#historyList');
  container.innerHTML = '';
  if (!state.history.length) {
    container.innerHTML = '<p class="empty-state card">No saved calculations yet.</p>';
    return;
  }

  state.history.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'history-card card';
    card.innerHTML = `
      <h4>${escapeHtml(item.name)}</h4>
      <div class="history-value">${formatCurrency(item.futureValue)}</div>
      <p>${item.annualRate}% · ${item.years} years · ${item.interestType}</p>
      <p>Saved ${new Date(item.savedAt).toLocaleDateString()}</p>
      <div class="history-actions">
        <button class="small-button primary" data-load-history="${item.id}">Load</button>
        <button class="small-button" data-delete-history="${item.id}">Delete</button>
      </div>`;
    container.appendChild(card);
  });

  $$('[data-load-history]').forEach((button) => button.addEventListener('click', () => loadHistory(Number(button.dataset.loadHistory))));
  $$('[data-delete-history]').forEach((button) => button.addEventListener('click', () => deleteHistory(Number(button.dataset.deleteHistory))));
}

function loadHistory(id) {
  const item = state.history.find((entry) => entry.id === id);
  if (!item) return;
  $('#calcName').value = item.name;
  $('#principal').value = item.principal;
  $('#rate').value = item.annualRate;
  $('#years').value = item.years;
  $('#interestType').value = item.interestType;
  $('#recurringDeposit').value = item.recurringDeposit;
  $('#depositFrequency').value = item.depositFrequency;
  $('#compoundFrequency').value = item.compoundsPerYear;
  updateCompoundVisibility();
  calculateAndRender();
  showView('calculator');
}

function deleteHistory(id) {
  state.history = state.history.filter((entry) => entry.id !== id);
  saveState(STORAGE_KEYS.history, state.history);
  renderHistory();
  updateStats();
}

function renderComparison() {
  const container = $('#comparisonList');
  const selectedFunds = state.comparison.map((id) => funds.find((fund) => fund.id === id)).filter(Boolean);
  container.innerHTML = '';

  if (!selectedFunds.length) {
    $('#comparisonSummary').textContent = 'Select up to four funds from the fund library to begin.';
    return;
  }

  const baseInput = readCalculatorInputs();
  const errors = validateCalculation(baseInput);
  if (errors.length) {
    $('#comparisonSummary').textContent = 'Enter valid calculator assumptions before comparing funds.';
    return;
  }

  const results = selectedFunds.map((fund) => calculateInvestment({
    ...baseInput,
    name: fund.name,
    annualRate: fund.rate,
    interestType: fund.type
  }));
  const average = results.reduce((sum, item) => sum + item.futureValue, 0) / results.length;
  const currentValue = state.currentResult?.futureValue;
  let message = `Average estimated future value: ${formatCurrency(average)}.`;
  if (currentValue) {
    const difference = ((currentValue - average) / average) * 100;
    const relation = Math.abs(difference) < 3 ? 'about average' : difference > 0 ? 'above average' : 'below average';
    message += ` Your current calculator result is ${relation} (${Math.abs(difference).toFixed(1)}% difference).`;
  }
  $('#comparisonSummary').textContent = message;

  const maxValue = Math.max(...results.map((item) => item.futureValue));
  results.forEach((result) => {
    const fund = selectedFunds.find((item) => item.name === result.name);
    const card = document.createElement('article');
    card.className = 'comparison-card card';
    card.innerHTML = `
      <div><h3>${fund.ticker}</h3><p>${fund.name}</p><p>${fund.rate}% estimated annual rate · ${fund.type}</p></div>
      <div class="comparison-bar-track" aria-label="Relative future value"><div class="comparison-bar" style="width:${(result.futureValue / maxValue) * 100}%"></div></div>
      <div class="compare-value">${formatCurrency(result.futureValue)}</div>`;
    container.appendChild(card);
  });
}

function handleRequestSubmit(event) {
  event.preventDefault();
  const name = $('#requestFundName').value.trim();
  const reason = $('#requestReason').value.trim();
  const email = $('#requestEmail').value.trim();
  const message = $('#requestMessage');
  const errors = [];

  if (name.length < 2) errors.push('Enter a fund name or ticker symbol.');
  if (reason.length < 20) errors.push('Please provide at least 20 characters explaining the request.');
  if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push('Enter a valid email address or leave the field blank.');

  if (errors.length) {
    message.className = 'message error';
    message.innerHTML = errors.map((error) => `<div>${error}</div>`).join('');
    return;
  }

  const duplicate = state.requests.some((item) => item.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    message.className = 'message error';
    message.textContent = 'That fund is already in your locally saved request list.';
    return;
  }

  state.requests.unshift({ id: Date.now(), name, reason, email, createdAt: new Date().toISOString() });
  saveState(STORAGE_KEYS.requests, state.requests);
  event.target.reset();
  $('#reasonCount').textContent = '0';
  message.className = 'message success';
  message.textContent = 'Request saved locally. It has not been sent to an administrator.';
  renderRequests();
}

function renderRequests() {
  const container = $('#requestList');
  container.innerHTML = '';
  if (!state.requests.length) {
    container.innerHTML = '<p class="empty-state">No locally saved requests.</p>';
    return;
  }
  state.requests.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'request-item';
    row.innerHTML = `
      <div><h4>${escapeHtml(item.name)}</h4><p>${escapeHtml(item.reason)}</p><p>${new Date(item.createdAt).toLocaleDateString()}</p></div>
      <button class="small-button" data-delete-request="${item.id}">Delete</button>`;
    container.appendChild(row);
  });
  $$('[data-delete-request]').forEach((button) => button.addEventListener('click', () => {
    state.requests = state.requests.filter((item) => item.id !== Number(button.dataset.deleteRequest));
    saveState(STORAGE_KEYS.requests, state.requests);
    renderRequests();
  }));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));
}

function updateStats() {
  $('#fundCount').textContent = funds.length;
  $('#savedCount').textContent = state.history.length;
  $('#compareCount').textContent = state.comparison.length;
}

function initializeEvents() {
  ['fundSearch', 'typeFilter', 'sortFunds'].forEach((id) => $(`#${id}`).addEventListener('input', renderFunds));
  $$('#calculatorForm input, #calculatorForm select').forEach((control) => control.addEventListener('input', calculateAndRender));
  $('#interestType').addEventListener('change', updateCompoundVisibility);
  $('#calculatorForm').addEventListener('reset', () => setTimeout(() => { updateCompoundVisibility(); calculateAndRender(); }, 0));
  $('#saveCalculation').addEventListener('click', saveCurrentCalculation);
  $('#clearHistory').addEventListener('click', () => {
    if (state.history.length && confirm('Delete all saved calculations?')) {
      state.history = [];
      saveState(STORAGE_KEYS.history, state.history);
      renderHistory();
      updateStats();
    }
  });
  $('#clearComparison').addEventListener('click', () => {
    state.comparison = [];
    saveState(STORAGE_KEYS.comparison, state.comparison);
    renderComparison();
    renderFunds();
    updateStats();
  });
  $('#requestReason').addEventListener('input', (event) => { $('#reasonCount').textContent = event.target.value.length; });
  $('#requestForm').addEventListener('submit', handleRequestSubmit);
  $('#clearRequests').addEventListener('click', () => {
    if (state.requests.length && confirm('Delete all locally saved requests?')) {
      state.requests = [];
      saveState(STORAGE_KEYS.requests, state.requests);
      renderRequests();
    }
  });
}

function init() {
  bindNavigation();
  initializeEvents();
  renderFunds();
  renderHistory();
  renderRequests();
  updateCompoundVisibility();
  calculateAndRender();
  updateStats();
  const initialView = location.hash.slice(1);
  if (['home', 'funds', 'calculator', 'compare', 'request'].includes(initialView)) showView(initialView);
}

document.addEventListener('DOMContentLoaded', init);
