// ─────────────────────────────────────────────
//  CALCULATOR.JS — Renderiza abas de entrada
// ─────────────────────────────────────────────

const Calculator = (() => {

  let data, qty;
  let activeSys = 'cftv';

  function init() {
    data = State.getData();
    qty  = State.getQty();
    renderAllSystems();
    bindTabs();
    setDate();
  }

  function reload() {
    data = State.getData();
    qty  = State.getQty();       
    const container = document.getElementById('sysContents');
    container.innerHTML = '';
    renderAllSystems();
  }

  function setDate() {
    const el = document.getElementById('fData');
    if (el && !el.value) el.value = new Date().toISOString().split('T')[0];
  }

  function renderAllSystems() {
    const container = document.getElementById('sysContents');
    Object.keys(data.sistemas).forEach(sysKey => {
      const wrap = document.createElement('div');
      wrap.className = 'sys-content';
      wrap.id = `sys-${sysKey}`;
      wrap.style.display = sysKey === activeSys ? 'block' : 'none';
      wrap.appendChild(buildSysCard(sysKey));
      container.appendChild(wrap);
    });
    updateSysBadges();
  }

  function buildSysCard(sysKey) {
    const sys  = data.sistemas[sysKey];
    const card = document.createElement('div');
    card.className = 'card';

    const header = document.createElement('div');
    header.className = 'card-header';
    header.innerHTML = `<span>${sys.label}</span><span class="card-badge" id="badge-${sysKey}">R$ 0,00</span>`;

    const body = document.createElement('div');
    body.className = 'card-body p0';

    const wrap = document.createElement('div');
    wrap.className = 'calc-grid';

    const table = document.createElement('table');
    table.className = 'calc-table';
    table.innerHTML = `
      <thead>
        <tr>
          <th>Produto</th>
          <th>Unidade</th>
          <th class="r">Valor M.O.</th>
          <th class="r">Qtd.</th>
          <th class="r">Total M.O.</th>
          <th class="r">Tempo Unit.</th>
          <th class="r">Tempo Total</th>
        </tr>
      </thead>
      <tbody id="tbody-${sysKey}"></tbody>
      <tfoot>
        <tr class="calc-totals-row">
          <td colspan="4" style="text-align:right;padding-right:12px;font-size:12px;color:var(--muted);font-weight:600">TOTAL DO SISTEMA</td>
          <td class="td-total" id="total-cost-${sysKey}">R$ 0,00</td>
          <td></td>
          <td class="td-time" id="total-time-${sysKey}">—</td>
        </tr>
      </tfoot>
    `;

    sys.items.forEach(item => renderItemRow(sysKey, item, table.querySelector('tbody')));
    wrap.appendChild(table);
    body.appendChild(wrap);
    card.appendChild(header);
    card.appendChild(body);
    return card;
  }

  function renderItemRow(sysKey, item, tbody) {
    const tr = document.createElement('tr');
    tr.id = `row-${sysKey}-${item.id}`;
    const curQty = qty[`${sysKey}__${item.id}`] || 0;
    const total  = curQty * item.valor;
    const timeMin = curQty * item.tempo;

    tr.innerHTML = `
      <td class="td-produto">${item.nome}</td>
      <td class="td-unit">${item.unidade}</td>
      <td class="td-val">${fmtBRL(item.valor)}</td>
      <td>
        <div class="qty-wrap">
          <input type="number" class="qty-input"
            data-sys="${sysKey}" data-id="${item.id}"
            value="${curQty > 0 ? curQty : ''}"
            placeholder="0" min="0" step="1"/>
        </div>
      </td>
      <td class="td-total" id="itotal-${sysKey}-${item.id}">${curQty > 0 ? fmtBRL(total) : '—'}</td>
      <td class="td-time">${fmtMin(item.tempo)}</td>
      <td class="td-time" id="itime-${sysKey}-${item.id}">${timeMin > 0 ? fmtMin(timeMin) : '—'}</td>
    `;

    tr.querySelector('.qty-input').addEventListener('input', e => {
      const v = parseFloat(e.target.value) || 0;
      qty[`${sysKey}__${item.id}`] = v;
      State.saveQty(qty);

      document.getElementById(`itotal-${sysKey}-${item.id}`).textContent = v > 0 ? fmtBRL(v * item.valor) : '—';
      document.getElementById(`itime-${sysKey}-${item.id}`).textContent  = v * item.tempo > 0 ? fmtMin(v * item.tempo) : '—';

      updateSysTotals(sysKey);
      Resumo.update();
    });

    tbody.appendChild(tr);
  }

  function updateSysTotals(sysKey) {
    const sys = data.sistemas[sysKey];
    let cost = 0, time = 0;
    sys.items.forEach(item => {
      const q = qty[`${sysKey}__${item.id}`] || 0;
      cost += q * item.valor;
      time += q * item.tempo;
    });
    const costEl = document.getElementById(`total-cost-${sysKey}`);
    const timeEl = document.getElementById(`total-time-${sysKey}`);
    const badge  = document.getElementById(`badge-${sysKey}`);
    if (costEl) costEl.textContent = fmtBRL(cost);
    if (timeEl) timeEl.textContent = time > 0 ? fmtMin(time) : '—';
    if (badge)  badge.textContent  = fmtBRL(cost);
  }

  function updateSysBadges() {
    Object.keys(data.sistemas).forEach(k => updateSysTotals(k));
  }

  function bindTabs() {
    document.querySelectorAll('.sys-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        activeSys = btn.dataset.sys;
        document.querySelectorAll('.sys-tab').forEach(b => b.classList.toggle('active', b.dataset.sys === activeSys));
        document.querySelectorAll('.sys-content').forEach(c => c.style.display = c.id === `sys-${activeSys}` ? 'block' : 'none');
      });
    });
  }

  function getAllTotals() {
    const data = State.getData();
    const result = {};
    Object.keys(data.sistemas).forEach(sysKey => {
      let cost = 0, time = 0;
      data.sistemas[sysKey].items.forEach(item => {
        const q = qty[`${sysKey}__${item.id}`] || 0;
        cost += q * item.valor;
        time += q * item.tempo;
      });
      result[sysKey] = { cost, time, label: data.sistemas[sysKey].label };
    });
    const _subtotal = Object.values(result).reduce((s,v) => s + (v.cost||0), 0);
    result._total_cost = _subtotal * 1.0115;
    result._total_time = Object.values(result).reduce((s,v) => s + (v.time||0), 0);
    return result;
  }

  function getQtyForItem(sysKey, itemId) {
    return qty[`${sysKey}__${itemId}`] || 0;
  }

  // Formatters
  function fmtBRL(v) {
    return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
  }
  function fmtMin(m) {
    if (!m) return '0min';
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    if (h === 0) return `${min}min`;
    if (min === 0) return `${h}h`;
    return `${h}h ${min}min`;
  }

  return { init, reload, getAllTotals, getQtyForItem, fmtBRL, fmtMin };
})();
