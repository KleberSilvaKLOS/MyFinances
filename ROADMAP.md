# Roadmap (Próximos Passos)
> Lista de tarefas planejadas e backlog de desenvolvimento.

---

### ⚙️ Refatoração & Arquitetura Base
- [ ] **Padronização:** Refatorar as telas para seguir um padrão fixo de layout e código *(Em andamento)*.
- [ ] **Organização Modular:** Padronizar arquivos de telas separando a estrutura interna (`import`, `const`, `function`, estrutura/render e `style`).
- [ ] **Scroll Global:** Atualizar o scroll para a tela toda, em todas as telas necessárias.
- [X] **Correção (Bug):** Corrigir o ScrollView na listagem, que atualmente impede a visualização do último item.

---

### 🎨 Interface & Experiência (UI/UX)
- [ ] **Temas:** Implementar suporte a **Modo Claro** e **Modo Escuro** (com toggle manual e persistência da preferência).
- [ ] *(Sugestão)* **Modo Privacidade:** Botão para ocultar/exibir saldo na tela inicial com um toque.

---

### 💼 Módulos Financeiros
- [X] **Renda Fixa:** Implementar desconto automático do saldo total e registro na tabela de gastos ao confirmar pagamento.
- [X] **Lançamentos:** 
  - Adicionar campo de "Categoria".
  - Implementar filtro por categorias na listagem.
- [ ] **Investimentos:** Iniciar desenvolvimento e definição de requisitos da tela de investimentos.
- [ ] *(Sugestão)* **Metas & Caixinhas:** Definição de objetivos com barra de progresso visual (ex: reserva de emergência, viagem).

---

### 🤖 Inteligência Artificial (IA)
- [ ] **Integração de IA:** Configurar conexão com provedor de LLM para assistência e insights financeiros.
- [ ] **Gestão de Custos & Cotas:** Implementar limite de tokens por requisição e cota diária/mensal por usuário.
- [ ] **Bateria de Testes de IA:** Testar cenários de fallback (API indisponível), latência, precisão dos prompts e respostas inesperadas.
- [ ] *(Sugestão)* **Autocat:** IA sugerir automaticamente a categoria da despesa pelo texto/estabelecimento digitado.

---

### 🔔 Notificações & Canais de Envio
- [ ] **Notificações Push / Locais:** Enviar mensagem na tela de bloqueio com lembrete diário (*"Vamos cuidar do seu dinheiro hoje?"*).
- [ ] **Disparo de E-mails:** Configurar e testar fluxo transacional (confirmação de conta, recuperação de senha e resumo semanal).
- [ ] **Disparo de SMS:** Configurar e testar envio de SMS (ex: códigos de verificação OTP / 2FA).

---

### 🧩 Gamificação & Puzzles Financeiros
> Mini-desafios interativos para engajamento diário e educação financeira.

- [ ] **Puzzle 1: "Qual Cortar Primeiro?"**
  - O usuário recebe 3 despesas fictícias e precisa escolher a prioridade correta de corte para fechar o mês no azul.
- [ ] **Puzzle 2: "Quiz Rápido do Dia"**
  - Desafio diário com 1 pergunta prática sobre finanças pessoais e investimentos para manter o streak ativo.
- [ ] **Puzzle 3: "Organizador de Orçamento (Regra 50/30/20)"**
  - Mini-game de arrastar e soltar despesas nas categorias corretas (Necessidades, Desejos, Investimentos).
- [ ] **Puzzle 4: "Desafio dos 30 Dias"**
  - Trilhas progressivas de pequenas economias diárias com conquistas e medalhas no perfil.