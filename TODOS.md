Roadmap de Desenvolvimento - MyFinances (Maio 2026)
1. Arquitetura e Refatoração de Código
Objetivo: Desacoplar a lógica de negócio da camada de apresentação para facilitar a manutenção, garantir a escalabilidade e permitir correções ágeis de bugs sem a necessidade de restaurar backups antigos.

Modularização de Componentes: Extrair componentes visuais complexos (Header, ScrollView, Cards) da raiz do arquivo principal.

Isolamento de Lógica: Mover funções, cálculos e manipulação de estado (const, function) para arquivos de Controllers ou Hooks customizados.

Separação de Estilos: Centralizar toda a estilização (StyleSheet) em arquivos próprios, garantindo que os arquivos de tela foquem apenas na estrutura JSX.

Padronização de Imports: Organizar as chamadas no topo dos arquivos separando bibliotecas externas, componentes internos e estilos.

2. Automação de Lançamentos Financeiros
Objetivo: Substituir a dependência exclusiva de inserção manual por fluxos automatizados, aumentando a retenção e precisão do usuário. Devido às restrições burocráticas de conexão direta via Open Finance, o foco será em processos de leitura de dados de entrada.

Serviço de Background (Listener): Implementar captura de dados via leitura de notificações push ou caixa de SMS do dispositivo.

Integração de E-mail (Opcional/Pesquisa): Avaliar a viabilidade de construir um parser para ler comprovantes diretamente via protocolo IMAP.

Módulo de Permissões por Instituição: Desenvolver painel em "Configurações" contendo checkboxes para que o usuário defina explicitamente quais instituições o sistema está autorizado a monitorar (Nubank, Banco do Brasil, Mercado Pago, Bradesco, Caixa, Santander, Itaú). O algoritmo de captura deve ignorar as fontes não selecionadas.

3. Inteligência de Categorização de Transações
Objetivo: Resolver a inconsistência na nomenclatura de estabelecimentos gerada pelas adquirentes (ex: "Pani Duda" ou "Pandora" em vez de "Padaria"), garantindo a correta alimentação dos gráficos de gastos corretamente .

Normalização de Strings: Implementar expressões regulares (Regex) para remover CNPJs, datas ou códigos alfa-numéricos inúteis que vêm anexados ao nome do estabelecimento na notificação.

Sistema de Mapeamento (De/Para): Criar uma estrutura de dados relacional (Dicionário de Palavras-chave) que associe fragmentos de texto a categorias mapeadas.

Regra de Aprendizado Contínuo: Quando uma transação for importada com nome desconhecido, o sistema deve categorizá-la como "Pendente" ou "Outros". Ao categorizar manualmente pela primeira vez, o aplicativo deve perguntar se o usuário deseja salvar essa regra de associação para os próximos lançamentos.

18.06.26 - Zero atualização no aplicativo. 