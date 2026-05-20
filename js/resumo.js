// ─────────────────────────────────────────────
//  RESUMO.JS — Resumo de custo e prazo
// ─────────────────────────────────────────────

const Resumo = (() => {

  function update() {
    const totals = Calculator.getAllTotals();
    const nTechs = parseInt(document.getElementById('nTechs')?.value || 2);

    renderKPIs(totals, nTechs);
    renderCustos(totals);
    renderPrazo(totals, nTechs);
    renderDetalhes(totals);
  }

  function renderKPIs(totals, nTechs) {
    const el = document.getElementById('kpiRow');
    if (!el) return;

    const totalMin  = totals._total_time;
    const totalHrs  = totalMin / 60;
    const diasHom   = totalHrs / 8;
    const diasCorr  = nTechs > 0 ? diasHom / nTechs : diasHom;

    el.innerHTML = `
      <div class="kpi kpi-brand">
        <div class="kpi-label">Total M.O. (R$)</div>
        <div class="kpi-value">${fmtBRL(totals._total_cost)}</div>
        <div class="kpi-sub">Custo total de mão de obra</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Tempo Total</div>
        <div class="kpi-value">${fmtMin(totalMin)}</div>
        <div class="kpi-sub">${diasHom.toFixed(1)} dias-homem</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Prazo Estimado</div>
        <div class="kpi-value">${diasCorr.toFixed(1)} <span style="font-size:14px;font-weight:400">dias</span></div>
        <div class="kpi-sub">Com ${nTechs} técnico${nTechs > 1 ? 's' : ''}</div>
      </div>
      <div class="kpi">
        <div class="kpi-label">Sistemas Ativos</div>
        <div class="kpi-value">${Object.entries(totals).filter(([k,v]) => !k.startsWith('_') && v.cost > 0).length}</div>
        <div class="kpi-sub">Sistemas com itens preenchidos</div>
      </div>
    `;

    document.getElementById('nTechs')?.addEventListener('input', () => update());
  }

  function renderCustos(totals) {
    const el = document.getElementById('resumoCustos');
    if (!el) return;

    const rows = Object.entries(totals).filter(([k]) => !k.startsWith('_'));
    const tableRows = rows.map(([key, v]) => `
      <tr class="${v.cost === 0 ? '' : ''}">
        <td class="label">${v.label}</td>
        <td class="r ${v.cost === 0 ? 'zero' : ''}">${fmtBRL(v.cost)}</td>
      </tr>
    `).join('');

    el.innerHTML = `
      <table class="res-table">
        <tbody>${tableRows}</tbody>
        <tfoot>
          <tr class="total-row">
            <td>Total Geral</td>
            <td class="r">${fmtBRL(totals._total_cost)}</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  function renderPrazo(totals, nTechs) {
    const el = document.getElementById('resumoPrazo');
    if (!el) return;

    const rows = Object.entries(totals).filter(([k]) => !k.startsWith('_'));
    const tableRows = rows.map(([key, v]) => {
      const horas   = v.time / 60;
      const diasH   = horas / 8;
      return `
        <tr>
          <td class="label">${v.label}</td>
          <td class="r ${v.time === 0 ? 'zero' : ''}">${fmtMin(v.time)}</td>
          <td class="r ${diasH === 0 ? 'zero' : ''}" style="color:var(--amber);font-family:var(--mono);font-size:12px">${diasH > 0 ? diasH.toFixed(2)+' d-h' : '—'}</td>
        </tr>
      `;
    }).join('');

    const totalHrs  = totals._total_time / 60;
    const diasHom   = totalHrs / 8;
    const diasCorr  = nTechs > 0 ? diasHom / nTechs : diasHom;

    el.innerHTML = `
      <table class="res-table">
        <thead>
          <tr>
            <td class="label" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;padding-bottom:4px">Sistema</td>
            <td class="r label" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em">Tempo</td>
            <td class="r label" style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em">Dias-H</td>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
        <tfoot>
          <tr class="total-row">
            <td>Total (${nTechs} téc.)</td>
            <td class="r">${fmtMin(totals._total_time)}</td>
            <td class="r">${diasCorr.toFixed(2)} dias</td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  function renderDetalhes(totals) {
    const el = document.getElementById('resumoDetalhes');
    if (!el) return;
    const data = State.getData();

    let rows = '';
    Object.entries(data.sistemas).forEach(([sysKey, sys]) => {
      sys.items.forEach(item => {
        const q = Calculator.getQtyForItem(sysKey, item.id);
        if (q <= 0) return;
        const cost = q * item.valor;
        const time = q * item.tempo;
        rows += `
          <tr>
            <td style="color:var(--muted);font-size:11px">${sys.label}</td>
            <td>${item.nome}</td>
            <td class="r" style="font-family:var(--mono);font-size:12px;color:var(--muted)">${q}</td>
            <td class="r" style="font-family:var(--mono);font-size:12px;color:var(--muted)">${fmtBRL(item.valor)}</td>
            <td class="r" style="font-family:var(--mono);font-size:12.5px;color:var(--brand);font-weight:600">${fmtBRL(cost)}</td>
            <td class="r" style="font-family:var(--mono);font-size:12px;color:var(--amber)">${time > 0 ? fmtMin(time) : '—'}</td>
          </tr>
        `;
      });
    });

    if (!rows) {
      el.innerHTML = `<div style="padding:24px;text-align:center;color:var(--dim);font-size:13px">Nenhum item preenchido ainda.</div>`;
      return;
    }

    el.innerHTML = `
      <div style="overflow-x:auto">
        <table style="width:100%;min-width:600px;border-collapse:collapse">
          <thead>
            <tr style="background:var(--bg-elevated)">
              <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint);width:110px">Sistema</th>
              <th style="padding:8px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint)">Produto</th>
              <th style="padding:8px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint);width:60px">Qtd</th>
              <th style="padding:8px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint);width:100px">Unit.</th>
              <th style="padding:8px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint);width:110px">Total M.O.</th>
              <th style="padding:8px 12px;text-align:right;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--dim);border-bottom:1px solid var(--border-faint);width:100px">Tempo</th>
            </tr>
          </thead>
          <tbody style="font-size:13px">
            ${rows}
          </tbody>
          <tfoot>
            <tr style="background:var(--bg-elevated);border-top:1px solid var(--border)">
              <td colspan="4" style="padding:9px 12px;font-size:12px;font-weight:700;color:var(--muted);text-align:right">TOTAL GERAL</td>
              <td style="padding:9px 12px;text-align:right;font-family:var(--mono);font-size:13.5px;font-weight:700;color:var(--brand)">${fmtBRL(totals._total_cost)}</td>
              <td style="padding:9px 12px;text-align:right;font-family:var(--mono);font-size:13px;font-weight:700;color:var(--amber)">${fmtMin(totals._total_time)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }

  function fmtBRL(v) { return v.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}); }
  function fmtMin(m) {
    if (!m) return '—';
    const h   = Math.floor(m / 60);
    const min = Math.round(m % 60);
    const d   = Math.floor(h / 8);
    const hr  = h % 8;
    if (d > 0) return `${d}d ${hr > 0 ? hr+'h' : ''}${min > 0 ? ' '+min+'min' : ''}`.trim();
    if (h === 0) return `${min}min`;
    if (min === 0) return `${h}h`;
    return `${h}h ${min}min`;
  }

  return { update };
})();
