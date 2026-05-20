# Calculadora de Mão de Obra e Prazos de Implantação
### Hagana Tecnologia

---

## 🔑 Código de Acesso Admin

```
HAGANA2025
```

> Guarde esse código em local seguro. Ele dá acesso ao painel de edição de tabelas (adicionar, editar ou remover itens).
> Para alterar o código, edite o `js/state.js` — linha `const STORED_HASH` — gerando um novo hash com a função `hashCode('NOVO_CODIGO')`.

---

## 🗂 Estrutura de Arquivos

```
hagana-calc/
├── index.html
├── README.md
├── css/
│   ├── reset.css        # Reset global
│   ├── vars.css         # Variáveis de tema (cores, fonts, raios)
│   ├── layout.css       # Sidebar, main, topbar, responsivo
│   ├── components.css   # Botões, cards, forms, tabs, KPIs
│   ├── table.css        # Tabela de referência (visual limpo)
│   └── admin.css        # Modal de login e painel admin
└── js/
    ├── data.js          # Dados padrão da planilha
    ├── state.js         # Persistência via localStorage + autenticação
    ├── calculator.js    # Renderiza abas e calcula totais
    ├── reftable.js      # Tabela de referência (somente leitura)
    ├── resumo.js        # Resumo consolidado + prazo
    ├── admin.js         # Painel admin (edição de tabelas)
    ├── ui.js            # Navegação, sidebar, mobile
    ├── export.js        # Exportar PDF via print
    └── app.js           # Entry point
```

---

## ✨ Funcionalidades

- **6 sistemas**: CFTV, Controle de Acesso, Alarme, Perimetral, Serralheria, Viagem
- **Calculadora interativa** com qtd. por produto → total M.O. + tempo em tempo real
- **Tabela de referência** limpa, sem textos encavalados, com colunas fixas
- **Resumo consolidado**: KPIs, custo por sistema, prazo com base no nº de técnicos
- **Painel Admin** protegido por código:
  - Editar nome, unidade, valor e tempo de qualquer item
  - Adicionar novos itens em qualquer sistema
  - Remover itens
  - Salva automaticamente no navegador (localStorage)
- **Exportar PDF** com relatório completo
- **Marca Hagana** com logo oficial
- **Responsivo** (mobile/tablet)

---

## 🚀 Deploy no GitHub Pages

### Via interface web

1. Crie um repositório (ex: `hagana-calc`)
2. Faça upload de todos os arquivos mantendo a estrutura
3. Vá em **Settings → Pages**
4. Source: branch `main`, pasta `/ (root)`
5. Clique **Save** → aguarde ~1 min

URL final: `https://SEU-USUARIO.github.io/hagana-calc/`

### Via Git (terminal)

```bash
git init
git add .
git commit -m "feat: calculadora hagana v2"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/hagana-calc.git
git push -u origin main
```

---

## 🔧 Personalizar

### Alterar código admin
Em `js/state.js`:
```js
// Substitua 'HAGANA2025' pelo novo código
const STORED_HASH = hashCode('SEU_NOVO_CODIGO');
```

### Adicionar sistema
Em `js/data.js`, adicione uma nova chave em `sistemas` e crie o botão em `index.html` (`.sys-tab`).

### Alterar cores
Em `css/vars.css`:
```css
--brand: #e8171e;  /* cor principal Hagana */
```
