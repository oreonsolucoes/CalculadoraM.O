// ─────────────────────────────────────────────
//  REFTABLE.JS — Tabela de referência limpa
// ─────────────────────────────────────────────

const RefTable = (() => {

  function render() {
    const wrap = document.getElementById('refTableWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    const data = State.getData();

    Object.entries(data.sistemas).forEach(([key, sys]) => {
      const section = document.createElement('div');
      section.className = 'ref-section';

      const title = document.createElement('div');
      title.className = 'ref-section-title';
      title.textContent = sys.label;
      section.appendChild(title);

      const tableWrap = document.createElement('div');
      tableWrap.className = 'ref-table-wrap';

      const totalValor = sys.items.reduce((s,i) => s + i.valor, 0);
      const totalTempo = sys.items.reduce((s,i) => s + i.tempo, 0);

      tableWrap.innerHTML = `
        <table class="ref-table">
          <colgroup>
            <col class="col-produto"/>
            <col class="col-unid"/>
            <col class="col-valor"/>
            <col class="col-tempo"/>
            <col class="col-horas"/>
          </colgroup>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Unidade</th>
              <th class="th-r">Valor M.O. (R$)</th>
              <th class="th-r">Tempo Unit.</th>
              <th class="th-r">Horas</th>
            </tr>
          </thead>
          <tbody>
            ${sys.items.map(item => `
              <tr>
                <td class="td-produto">${item.nome}</td>
                <td class="td-r td-unid">${item.unidade}</td>
                <td class="td-r td-valor ${item.valor === 0 ? 'td-zero' : ''}">${
                  item.valor > 0
                    ? item.valor.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})
                    : '—'
                }</td>
                <td class="td-r td-tempo ${item.tempo === 0 ? 'td-zero' : ''}">${fmtMin(item.tempo)}</td>
                <td class="td-r td-horas ${item.tempo === 0 ? 'td-zero' : ''}">${item.tempo > 0 ? (item.tempo/60).toFixed(2)+'h' : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:9px 14px;font-size:12px;font-weight:700;color:var(--muted)">Total / Somatório</td>
              <td class="td-r td-valor" style="font-weight:700">${totalValor.toLocaleString('pt-BR', {style:'currency',currency:'BRL'})}</td>
              <td class="td-r td-tempo" style="font-weight:700">${fmtMin(totalTempo)}</td>
              <td class="td-r td-horas" style="font-weight:700">${(totalTempo/60).toFixed(2)}h</td>
            </tr>
          </tfoot>
        </table>
      `;
      section.appendChild(tableWrap);
      wrap.appendChild(section);
    });
  }

  function fmtMin(m) {
    if (!m) return '—';
    const h = Math.floor(m / 60);
    const min = Math.round(m % 60);
    if (h === 0) return `${min}min`;
    if (min === 0) return `${h}h`;
    return `${h}h ${min}min`;
  }

  return { render };
})();
