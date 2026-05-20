// ─────────────────────────────────────────────
//  EXPORT.JS — Exportar como PDF
// ─────────────────────────────────────────────

const Export = (() => {

  function init() {
    document.getElementById('btnPrint').addEventListener('click', generate);
  }

  function fmtBRL(v) { return v.toLocaleString('pt-BR', {style:'currency',currency:'BRL'}); }
  function fmtMin(m) {
    if (!m) return '—';
    const h = Math.floor(m/60), min = Math.round(m%60);
    const d = Math.floor(h/8), hr = h%8;
    if (d>0) return `${d}d${hr>0?' '+hr+'h':''}${min>0?' '+min+'min':''}`.trim();
    if (h===0) return `${min}min`;
    if (min===0) return `${h}h`;
    return `${h}h ${min}min`;
  }

  function generate() {
    const cliente  = document.getElementById('fCliente')?.value || 'Cliente';
    const data     = document.getElementById('fData')?.value    || new Date().toLocaleDateString('pt-BR');
    const resp     = document.getElementById('fResponsavel')?.value || '';
    const nTechs   = parseInt(document.getElementById('nTechs')?.value || 2);
    const totals   = Calculator.getAllTotals();
    const sysData  = State.getData();

    const totalHrs  = totals._total_time / 60;
    const diasHom   = totalHrs / 8;
    const diasCorr  = nTechs > 0 ? diasHom / nTechs : diasHom;

    // Itens preenchidos
    let itemRows = '';
    Object.entries(sysData.sistemas).forEach(([sysKey, sys]) => {
      sys.items.forEach(item => {
        const q = Calculator.getQtyForItem(sysKey, item.id);
        if (q <= 0) return;
        itemRows += `
          <tr>
            <td style="color:#6b7280;font-size:11px;padding:6px 10px;border-bottom:1px solid #f0f0f0">${sys.label}</td>
            <td style="padding:6px 10px;border-bottom:1px solid #f0f0f0">${item.nome}</td>
            <td style="text-align:center;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace">${q}</td>
            <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace;color:#6b7280">${fmtBRL(item.valor)}</td>
            <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace;font-weight:600;color:#1a1a2e">${fmtBRL(q*item.valor)}</td>
            <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace;color:#d97706">${q*item.tempo>0?fmtMin(q*item.tempo):'—'}</td>
          </tr>`;
      });
    });

    const sysRows = Object.entries(totals)
      .filter(([k]) => !k.startsWith('_'))
      .map(([k,v]) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #f0f0f0">${v.label}</td>
          <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace;${v.cost>0?'font-weight:600':''}">${v.cost>0?fmtBRL(v.cost):'—'}</td>
          <td style="text-align:right;padding:6px 10px;border-bottom:1px solid #f0f0f0;font-family:monospace;color:#d97706">${v.time>0?fmtMin(v.time):'—'}</td>
        </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"/>
<title>Orçamento M.O. — ${cliente}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;font-size:13px;background:#fff;padding:2cm}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #e8171e}
.logo{height:40px;width:auto}
.logo-fallback{font-size:20px;font-weight:800;color:#e8171e}
.meta{text-align:right;font-size:12px;color:#6b7280;line-height:1.7}
.meta strong{color:#1a1a2e}
h1{font-size:20px;font-weight:700;color:#1a1a2e;margin-bottom:4px}
h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.09em;color:#e8171e;margin:22px 0 8px;padding-bottom:5px;border-bottom:1px solid #fee2e2}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
.kpi{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px}
.kpi-l{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9ca3af;margin-bottom:3px}
.kpi-v{font-size:18px;font-weight:700;font-family:monospace;color:#1a1a2e}
.kpi-brand{border-color:#fca5a5;background:#fef2f2}
.kpi-brand .kpi-v{color:#e8171e}
table{width:100%;border-collapse:collapse;font-size:12px}
th{background:#f3f4f6;padding:7px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#9ca3af;border-bottom:1px solid #e5e7eb}
th.r,td.r{text-align:right}
.total-row td{font-weight:700;background:#fef2f2;color:#e8171e;border-top:2px solid #e8171e}
.footer{margin-top:32px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:10px;color:#9ca3af;text-align:center}
@media print{body{padding:1cm}}
</style>
</head>
<body>
<div class="header">
  <div>
    <img src="https://www.hagana.com.br/wp-content/themes/hagana/assets/images/logo.png" alt="Hagana" class="logo" onerror="this.style.display='none';document.querySelector('.logo-fallback').style.display='block'"/>
    <div class="logo-fallback" style="display:none">⬡ Hagana Tecnologia</div>
    <h1 style="margin-top:8px">Calculadora de M.O. e Prazos</h1>
  </div>
  <div class="meta">
    <div><strong>Cliente:</strong> ${cliente}</div>
    <div><strong>Data:</strong> ${data}</div>
    ${resp ? `<div><strong>Responsável:</strong> ${resp}</div>` : ''}
    <div><strong>Técnicos:</strong> ${nTechs}</div>
  </div>
</div>

<div class="kpis">
  <div class="kpi kpi-brand"><div class="kpi-l">Total M.O.</div><div class="kpi-v">${fmtBRL(totals._total_cost)}</div></div>
  <div class="kpi"><div class="kpi-l">Tempo Total</div><div class="kpi-v">${fmtMin(totals._total_time)}</div></div>
  <div class="kpi"><div class="kpi-l">Prazo Estimado</div><div class="kpi-v">${diasCorr.toFixed(1)} dias</div></div>
  <div class="kpi"><div class="kpi-l">Dias-Homem</div><div class="kpi-v">${diasHom.toFixed(1)} d-h</div></div>
</div>

<h2>Resumo por Sistema</h2>
<table>
  <thead><tr><th>Sistema</th><th class="r">Custo M.O.</th><th class="r">Tempo</th></tr></thead>
  <tbody>${sysRows}</tbody>
  <tfoot><tr class="total-row"><td>Total Geral</td><td class="r">${fmtBRL(totals._total_cost)}</td><td class="r">${fmtMin(totals._total_time)}</td></tr></tfoot>
</table>

<h2>Itens Detalhados</h2>
${itemRows ? `<table>
  <thead><tr><th>Sistema</th><th>Produto</th><th style="text-align:center">Qtd</th><th class="r">Unit.</th><th class="r">Total</th><th class="r">Tempo</th></tr></thead>
  <tbody>${itemRows}</tbody>
  <tfoot><tr class="total-row"><td colspan="4">Total</td><td class="r">${fmtBRL(totals._total_cost)}</td><td class="r">${fmtMin(totals._total_time)}</td></tr></tfoot>
</table>` : '<p style="color:#9ca3af;font-size:12px">Nenhum item preenchido.</p>'}

<div class="footer">
  Hagana Tecnologia · Calculadora de Mão de Obra e Prazos de Implantação v2.0 · Gerado em ${new Date().toLocaleString('pt-BR')}
</div>
<script>window.onload=()=>window.print()<\/script>
</body></html>`;

    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
  }

  return { init };
})();
