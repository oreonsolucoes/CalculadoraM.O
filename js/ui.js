// ─────────────────────────────────────────────
//  UI.JS — Navegação e sidebar
// ─────────────────────────────────────────────

const UI = (() => {

  const pageMap = {
    calculadora: { id: 'page-calculadora', title: 'Calculadora de Mão de Obra' },
    tabela:      { id: 'page-tabela',      title: 'Tabela de Referência'        },
    resumo:      { id: 'page-resumo',      title: 'Resumo & Prazo de Implantação' },
  };

  function init() {
    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigate(link.dataset.page);
        closeSidebar();
      });
    });

    // Mobile burger
    document.getElementById('burger').addEventListener('click', toggleSidebar);
    document.getElementById('overlay').addEventListener('click', closeSidebar);

    // Clear
    document.getElementById('btnClear').addEventListener('click', () => {
      if (confirm('Limpar todas as quantidades?')) {
        State.clearQty();
        Calculator.reload();
        Resumo.update();
      }
    });
  }

  function navigate(key) {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === key));
    Object.entries(pageMap).forEach(([k, p]) => {
      document.getElementById(p.id)?.classList.toggle('active', k === key);
    });
    document.getElementById('topbarTitle').textContent = pageMap[key]?.title || '';

    // Lazy render tabela
    if (key === 'tabela') RefTable.render();
    if (key === 'resumo') Resumo.update();
  }

  function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
  }

  function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
  }

  return { init };
})();
