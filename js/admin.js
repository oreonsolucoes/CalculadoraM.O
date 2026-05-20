// ─────────────────────────────────────────────
//  ADMIN.JS — Painel de edição da tabela
// ─────────────────────────────────────────────

const Admin = (() => {

  let editData  = null;
  let activeSys = 'cftv';

  function init() {
    // Open login modal
    document.getElementById('btnAdminAccess').addEventListener('click', () => openLogin());
    document.getElementById('closeLogin').addEventListener('click', closeLogin);
    document.getElementById('cancelLogin').addEventListener('click', closeLogin);
    document.getElementById('confirmLogin').addEventListener('click', tryLogin);
    document.getElementById('adminCode').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

    // Admin panel
    document.getElementById('closeAdmin').addEventListener('click', closeAdmin);
    document.getElementById('cancelAdmin').addEventListener('click', closeAdmin);
    document.getElementById('saveAdmin').addEventListener('click', saveChanges);
    document.getElementById('btnAddItem').addEventListener('click', addItem);
  }

  function openLogin() {
    document.getElementById('adminCode').value = '';
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('modalLogin').classList.add('show');
    setTimeout(() => document.getElementById('adminCode').focus(), 100);
  }

  function closeLogin() {
    document.getElementById('modalLogin').classList.remove('show');
  }

  function tryLogin() {
    const code = document.getElementById('adminCode').value.trim();
    if (State.checkCode(code)) {
      closeLogin();
      openAdmin();
    } else {
      document.getElementById('loginError').classList.add('show');
      document.getElementById('adminCode').value = '';
      document.getElementById('adminCode').focus();
    }
  }

  function openAdmin() {
    // Deep clone current data for editing
    editData = JSON.parse(JSON.stringify(State.getData()));
    activeSys = Object.keys(editData.sistemas)[0];
    renderAdminSysTabs();
    renderAdminTable();
    document.getElementById('modalAdmin').classList.add('show');
  }

  function closeAdmin() {
    document.getElementById('modalAdmin').classList.remove('show');
    editData = null;
  }

  function renderAdminSysTabs() {
    const wrap = document.getElementById('adminSysTabs');
    wrap.innerHTML = '';
    Object.entries(editData.sistemas).forEach(([key, sys]) => {
      const btn = document.createElement('button');
      btn.className = `admin-sys-tab ${key === activeSys ? 'active' : ''}`;
      btn.textContent = sys.label;
      btn.addEventListener('click', () => {
        activeSys = key;
        document.querySelectorAll('.admin-sys-tab').forEach(b => b.classList.toggle('active', b.textContent === sys.label));
        renderAdminTable();
      });
      wrap.appendChild(btn);
    });
  }

  function renderAdminTable() {
    const sys  = editData.sistemas[activeSys];
    const wrap = document.getElementById('adminTableEditor');

    wrap.innerHTML = `
      <div class="admin-edit-table">
        <table>
          <thead>
            <tr>
              <th class="col-nome">Produto</th>
              <th class="col-unid">Unidade</th>
              <th class="col-valor">Valor M.O. (R$)</th>
              <th class="col-tempo">Tempo (min)</th>
              <th class="col-del">Del.</th>
            </tr>
          </thead>
          <tbody id="adminTbody"></tbody>
        </table>
      </div>
    `;

    const tbody = document.getElementById('adminTbody');
    sys.items.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="col-nome"><input type="text" value="${item.nome}" data-field="nome" data-idx="${idx}"/></td>
        <td class="col-unid">
          <select data-field="unidade" data-idx="${idx}">
            ${['PEÇA','METRO','DIARIA','KM'].map(u => `<option ${u===item.unidade?'selected':''}>${u}</option>`).join('')}
          </select>
        </td>
        <td class="col-valor"><input type="number" value="${item.valor}" min="0" step="0.01" data-field="valor" data-idx="${idx}"/></td>
        <td class="col-tempo"><input type="number" value="${item.tempo}" min="0" step="1" data-field="tempo" data-idx="${idx}"/></td>
        <td class="col-del" style="text-align:center">
          <button class="btn-icon" data-del="${idx}" title="Remover">✕</button>
        </td>
      `;

      // Bind field changes
      tr.querySelectorAll('[data-field]').forEach(input => {
        input.addEventListener('input', e => {
          const field = e.target.dataset.field;
          const i     = parseInt(e.target.dataset.idx);
          let val     = e.target.value;
          if (field === 'valor' || field === 'tempo') val = parseFloat(val) || 0;
          editData.sistemas[activeSys].items[i][field] = val;
        });
      });

      // Delete button
      tr.querySelector('[data-del]').addEventListener('click', e => {
        const i = parseInt(e.currentTarget.dataset.del);
        editData.sistemas[activeSys].items.splice(i, 1);
        renderAdminTable();
      });

      tbody.appendChild(tr);
    });
  }

  function addItem() {
    const nome   = document.getElementById('newNome').value.trim().toUpperCase();
    const unidade= document.getElementById('newUnidade').value;
    const valor  = parseFloat(document.getElementById('newValor').value) || 0;
    const tempo  = parseFloat(document.getElementById('newTempo').value) || 0;

    if (!nome) {
      document.getElementById('newNome').focus();
      return;
    }

    const id = 'custom_' + Date.now();
    editData.sistemas[activeSys].items.push({ id, nome, unidade, valor, tempo });

    // Clear inputs
    ['newNome','newValor','newTempo'].forEach(id => document.getElementById(id).value = '');
    renderAdminTable();
  }

  function saveChanges() {
    State.saveData(editData);
    closeAdmin();

    // Re-render calculator & ref table
    Calculator.reload();
    RefTable.render();
    Resumo.update();

    // Brief feedback
    const btn = document.getElementById('btnAdminAccess');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Salvo';
    setTimeout(() => { btn.innerHTML = orig; }, 1800);
  }

  return { init };
})();
