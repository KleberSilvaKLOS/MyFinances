# 💰 MyFinance - Controle Financeiro Pessoal

![Badge Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-blue?style=for-the-badge)
![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=ESTÁVEL&color=GREEN&style=for-the-badge)
![Badge React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Badge Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Badge TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> Um aplicativo intuitivo e robusto para gestão completa de finanças pessoais, investimentos e contas fixas.

## 🚀 Sobre a Versão 1.0 (MVP)

Esta é a **primeira versão estável (v1.0)** do projeto MyFinance. O foco principal deste lançamento foi estabelecer uma base arquitetural sólida e um ambiente de desenvolvimento confiável.

**Destaques desta versão:**
* ✅ **Ambiente Estabilizado:** Configuração completa do Android NDK (v26) e Gradle, garantindo builds locais sem erros.
* ✅ **Arquitetura Limpa:** Estrutura de pastas organizada e escalável para facilitar novas features.
* ✅ **Navegação Híbrida:** Integração fluida entre `BottomTabNavigator` e `StackNavigator`.
* ✅ **Sistema de Temas:** Suporte nativo a Light/Dark Mode via Context API.
* ✅ **Repositório Otimizado:** Configuração fina de `.gitignore` para manter o projeto leve e performático.

---

## 📱 Sobre o Projeto

O **MyFinance** nasceu da necessidade de ter um controle financeiro na palma da mão, sem planilhas complexas. O objetivo é oferecer uma visão clara da saúde financeira através de uma interface moderna, segura e fácil de usar.

O projeto foi desenvolvido utilizando **React Native** com **Expo**, garantindo performance nativa e compatibilidade tanto para Android quanto para iOS.

## ✨ Funcionalidades Principais

O aplicativo conta com módulos específicos para cada área da vida financeira:

- **🔐 Autenticação e Segurança**
  - Login seguro via Firebase Auth.
  - Criação de PIN para acesso rápido.
  - **Suporte a Biometria** (Digital/FaceID) via `expo-local-authentication`.

- **💸 Lançamento de Gastos Diários**
  - Registro rápido de despesas.
  - Categorização inteligente e visualização por ícones.

- **📅 Gestão de Contas Fixas**
  - Controle de recorrências (aluguel, internet, streaming).
  - Alertas visuais de vencimento.

- **📈 Dashboard de Investimentos**
  - Acompanhamento da evolução patrimonial.
  - Gráficos de pizza e barras para análise de carteira.

- **📊 Resumo Geral (Home)**
  - Visão unificada de saldo, gastos do mês e total investido.

## 🛠️ Tecnologias e Dependências

O projeto utiliza as seguintes bibliotecas principais:

- **Core:**
  - `react-native`
  - `expo`
  - `typescript`

- **Navegação:**
  - `@react-navigation/native`
  - `@react-navigation/bottom-tabs` (Menu inferior customizado)
  - `@react-navigation/native-stack` (Navegação entre telas)

- **Backend & Dados:**
  - `firebase` (Autenticação e Firestore Database)
  - `@react-native-async-storage/async-storage` (Persistência local)

- **Componentes Visuais & Funcionais:**
  - `expo-local-authentication` (Biometria)
  - `@react-native-community/datetimepicker` (Seleção de datas)
  - `react-native-chart-kit` (Gráficos)
  - `expo-font` & `expo-google-fonts` (Tipografia personalizada)

## 📂 Estrutura do Projeto

A organização do código segue as melhores práticas de Clean Architecture adaptada para React Native:

```bash
src/
  ├── @types/          # Definições de tipos globais (TypeScript)
  ├── assets/          # Imagens, ícones e fontes
  ├── components/      # Componentes reutilizáveis (Botões, Cards, Inputs)
  ├── config/          # Configurações externas (ex: Firebase config)
  ├── context/         # Context API (Gerenciamento de estado global e Temas)
  ├── hooks/           # Custom Hooks (ex: useBiometrics, useAuth)
  ├── routes/          # Configuração de rotas (Stack e Tabs)
  ├── screens/         # Telas da aplicação
  │   ├── Auth/        # Login, Cadastro, Recuperação de Senha
  │   ├── Home/        # Tela principal
  │   ├── Expenses/    # Lançamento de gastos
  │   ├── FixedBills/  # Contas fixas
  │   └── Investments/ # Dashboard de investimentos
  ├── services/        # Lógica de conexão com APIs e Firebase
  ├── theme/           # Arquivos de estilo global (Cores, Fontes)
  └── utils/           # Funções auxiliares e formatadores de moeda/data
🚀 Como Rodar o Projeto
Pré-requisitos: Você precisa ter o Node.js instalado, uma conta no Expo e o app Expo Go no seu celular (ou um emulador Android/iOS configurado).

Clone este repositório

Bash

git clone [https://github.com/KleberSilvaKLOS/MyFinances.git](https://github.com/KleberSilvaKLOS/MyFinances.git)
cd MyFinances
Instale as dependências

Bash

npm install
# ou
yarn install
Configuração do Firebase Crie um arquivo chamado firebase.ts dentro da pasta src/config/ e adicione as credenciais do seu projeto Firebase:

TypeScript

// src/config/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export { app };
Execute o projeto

Bash

npx expo start
Acesse no celular Escaneie o QR Code que aparecerá no terminal usando o app Expo Go (Android) ou o app Câmera (iOS).

🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

Faça um Fork do projeto

Crie uma Branch para sua Feature (git checkout -b feature/MinhaFeature)

Faça o Commit (git commit -m 'Adicionando uma feature incrível')

Faça o Push (git push origin feature/MinhaFeature)

Abra um Pull Request

```

## Proposta para a porxima versão (1.0.1)

### 1. Correções de Bugs (Prioridade Alta)

- **Scroll na Aba de Lançamentos:**
    - **Problema:** O último item da lista é cortado e o scroll não desce até o final.
    - **Solução:** Ajustar o `contentContainerStyle` da `FlatList` ou `ScrollView` adicionando um `paddingBottom` extra para compensar a barra de navegação ou o final da tela.
- **Tela de Recuperação de PIN (Layout):**
    - **Problema:** Texto branco em fundo claro (falta de adaptação para modo claro/escuro nesta tela específica).
    - **Solução:** Forçar a cor do texto para escuro ou implementar a detecção do tema (`Appearance` do React Native) para ajustar as cores dinamicamente.
- **Tela de Recuperação de PIN (Lógica de Segurança):**
    - **Problema:** O App diz que enviou o e-mail e já libera a troca do PIN sem validação. O e-mail não está chegando de fato.
    - **Solução:**
        1. Implementar o envio real do e-mail (provavelmente precisará de uma API/Backend para isso, já que o app é offline hoje, ou usar um serviço como EmailJS se for manter simples).
        2. Bloquear a tela de "Novo PIN" até que o usuário insira um código de validação (OTP) recebido no e-mail.

### 2. Melhorias de Usabilidade (UI/UX)

- **Navegação por Gestos:**
    - **Requisito:** Permitir arrastar o dedo (swipe) na tela para alternar entre as abas, além de clicar nos ícones inferiores.
    - **Sugestão Técnica:** Utilizar uma biblioteca como `react-native-tab-view` ou configurar o `createMaterialTopTabNavigator` (do React Navigation) posicionado embaixo, que já possui suporte nativo a gestos de deslizar.
- **Feedback de Atualização (Release Notes):**
    - **Requisito:** Exibir um modal/popup na primeira vez que o usuário abrir o app após uma atualização, listando as novidades.
    - **Sugestão Técnica:** Salvar a versão atual do app no `AsyncStorage`. Ao abrir, comparar a versão do código com a salva. Se for diferente (maior), exibir o modal e atualizar o storage.

### 3. Funcionalidades (Features)

- **Exportação para Excel:**
    - **Requisito:** Gerar um arquivo `.xlsx` com todos os lançamentos do banco local.
    - **Lógica:** Mapear as colunas do banco SQLite (Data, Descrição, Valor, Categoria) para células e usar uma biblioteca como `xlsx` ou `react-native-fs` para gerar e compartilhar o arquivo.

### 4. Arquitetura e Futuro (Médio/Longo Prazo)

- **Sincronização em Nuvem (Cloud):**
    - **Objetivo:** Permitir acesso via Web (PC) e backup dos dados.
    - **Mudança Necessária:** Migrar da lógica "Local First" (apenas SQLite no celular) para uma arquitetura com API e Banco de Dados remoto (PostgreSQL, Firebase, etc.).
    - **Desafio:** Implementar lógica de autenticação (Login/Senha) e sincronização (enviar dados locais para a nuvem quando houver internet).
--

# Atualizando o APP My Finances

- Para realizar a atualização do aplicativo, siga os seguintes passos:
  **app.json** - Atualize a versão do aplicativo. Por exemplo, "version": 1.0.1 para 1.0.2. para sempre dar certo as atualizoes. Recomendo que deixe para atualizar por ultimo, depois de todos os testes.
  **atualizando pasta android** - Para que a build apk do android studio funcione, rode no terminal. dentro da pasta do projeto o seguinte comando "npx expo prebuild --platform android". Com esse comando ele atualiza a pasta android, consequentemente deixando tudo atualizado. Recomendavel realizar a branch depois desse comando.

  Teste de commit