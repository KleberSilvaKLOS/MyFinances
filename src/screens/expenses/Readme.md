## 💸 ExpensesScreen (Gerenciamento de Finanças)

Este componente é o coração do aplicativo, responsável por gerenciar o fluxo de caixa do usuário. Ele oferece uma interface intuitiva para registro de entradas e saídas, com persistência de dados local e adaptação visual baseada em tema.

### ✨ Funcionalidades Principais

* **Gestão de Transações:** Adição, edição e listagem de receitas (`income`) e despesas (`expense`).
* **Persistência Local:** Utiliza `AsyncStorage` para salvar transações e preferências do usuário, garantindo que os dados permaneçam disponíveis offline.
* **Theming Dinâmico:** Integração com `ThemeContext` para alternar automaticamente entre **Light Mode** e **Dark Mode**.
* **UX Aprimorada:**
    * **Autocomplete Inteligente:** Sugere categorias comuns (ex: Mercado, Uber, Salário) enquanto o usuário digita.
    * **Modo Privacidade:** Botão "Olho" para ocultar/exibir valores monetários na tela.
    * **Cálculo em Tempo Real:** Atualização instantânea do Saldo, Total de Entradas e Total de Saídas.
* **Modal de Configurações:** Interface lateral para adicionar categorias personalizadas ou resetar os dados do app.

### 🛠️ Detalhes Técnicos

**Bibliotecas Utilizadas:**
* `react-native`: Componentes core (FlatList, Modal, SafeAreaView, etc).
* `@react-native-async-storage/async-storage`: Para armazenamento local de dados.
* `@expo/vector-icons`: Ícones (MaterialIcons, Ionicons).
* `@react-navigation/native`: Hook `useFocusEffect` para recarregar dados ao focar na tela.

**Chaves de Armazenamento (AsyncStorage):**
* `@myfinance:transactions`: Array JSON contendo o histórico de transações.
* `@myfinance:visibility`: Booleano para persistir o estado do "Modo Privacidade".
* `@myfinance:categories`: Array de strings para categorias personalizadas criadas pelo usuário.

### 🧩 Estrutura do Componente

O componente gerencia múltiplos estados complexos:
1.  **List State:** Mantém o array de transações.
2.  **Editing State:** Controla se o usuário está criando um novo item ou editando um existente (`editingId`).
3.  **Suggestion Engine:** Filtra o array `DEFAULT_SUGGESTIONS` baseado no input do usuário para agilizar o preenchimento.

---