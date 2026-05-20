// ─────────────────────────────────────────────
//  APP.JS — Entry point
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  Calculator.init();
  Resumo.update();
  Admin.init();
  UI.init();
  Export.init();
});
