# English Platform Editor

Editor de aulas em blocos para montar, visualizar, importar e exportar lessons em JSON.

## Objetivo

O projeto existe para permitir a criação de aulas reais sem depender de editar JSON manualmente o tempo todo.

A ideia central é:

- cada aula é composta por blocos
- cada bloco tem comportamento próprio
- o editor precisa ser fácil de manter
- o JSON final precisa continuar simples de entender

## Stack

- React
- TypeScript
- Vite

## Como rodar

Instalar dependências:

```bash
npm install
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Gerar build:

```bash
npm run build
```

Visualizar build:

```bash
npm run preview
```

## Abordagem do projeto

O editor trabalha com uma arquitetura baseada em blocos.

Cada bloco representa uma parte da aula, por exemplo:

- heading
- paragraph
- listening
- flashcards
- dialogue
- writing task

Hoje a manutenção foi organizada para que cada bloco tenha seu próprio arquivo.

Isso evita arquivos gigantes e facilita mexer em um bloco sem medo de quebrar outro.

## Estrutura principal

### `src/features/editor/blocks`

Aqui fica a implementação individual de cada bloco.

Cada arquivo concentra o que é específico daquele bloco, normalmente:

- `Form`: interface de edição no painel esquerdo
- `Preview`: visualização no painel direito

Exemplos:

- `ConversationBlock.tsx`
- `ListeningBlock.tsx`
- `FlashcardsBlock.tsx`

Se você quiser alterar o comportamento de um bloco específico, este é o primeiro lugar para olhar.

### `src/features/editor/config/blockRegistry.tsx`

Esse é o registro central dos blocos.

Ele conecta:

- tipo do bloco
- label
- categoria visual
- criação padrão do bloco
- formulário
- preview
- normalização opcional

Se um bloco novo for criado, ele precisa entrar aqui.

### `src/features/editor/config/blockFactory.ts`

Responsável por:

- criar aulas vazias
- criar blocos novos
- normalizar lesson importada
- sincronizar page breaks

O factory hoje usa o registry, então a lógica principal não fica espalhada.

### `src/features/editor/modules`

Esses arquivos foram mantidos por compatibilidade.

Hoje eles funcionam como reexports para os arquivos em `blocks/`.

Na prática:

- manutenção real: `blocks/`
- compatibilidade de import: `modules/`

### `src/features/editor/types/index.ts`

Define os tipos principais do editor:

- `Lesson`
- `LessonBlock`
- tipos específicos de cada bloco

Sempre que um bloco ganhar novos campos, o tipo precisa ser atualizado aqui.

### `json/l1.json`

Exemplo real de lesson usada para validar o editor.

Serve como referência prática de estrutura.

## Fluxo de manutenção

### Alterar um bloco existente

Na maioria dos casos, o fluxo é:

1. abrir o arquivo do bloco em `src/features/editor/blocks`
2. alterar o `Form` se a edição mudou
3. alterar o `Preview` se a visualização mudou
4. atualizar os tipos em `src/features/editor/types/index.ts` se houver novos campos
5. se necessário, ajustar `create` ou `normalize` no `blockRegistry.tsx`

### Criar um bloco novo

Passo a passo:

1. criar um arquivo novo em `src/features/editor/blocks`
2. implementar `Form` e `Preview`
3. adicionar o tipo em `src/features/editor/types/index.ts`
4. registrar o bloco em `src/features/editor/config/blockRegistry.tsx`
5. confirmar que ele aparece no catálogo e funciona no editor

### Ajustar defaults de um bloco

Se a mudança é no comportamento inicial de um bloco novo, mexa no `create` dentro do `blockRegistry.tsx`.

Exemplo:

- texto padrão
- quantidade inicial de itens
- valores iniciais de cor
- transcript visibility

### Ajustar importação de JSON antigo

Se o formato de um bloco mudar e você precisar continuar aceitando JSON antigo, o lugar certo é o `normalize` no `blockRegistry.tsx`.

## Como pensar a manutenção

Algumas regras simples ajudam bastante:

- não colocar lógica de vários blocos no mesmo arquivo
- não duplicar comportamento se ele é específico de um bloco
- manter o registry como ponto central de ligação
- manter o tipo atualizado sempre que um bloco ganhar campo novo
- validar com build depois de mudanças estruturais

## Observações práticas

- o editor salva estado local no navegador durante o desenvolvimento
- a lesson pode ser importada e exportada em JSON
- o preview não é o player final da plataforma; ele é uma visualização de autoria

## Comandos úteis

Build:

```bash
npm run build
```

Buscar referências de um bloco:

```bash
rg "conversation" src
```

## Resumo

Se você quer manter bem este projeto, a regra mais importante hoje é:

cada bloco vive no seu próprio arquivo, e o `blockRegistry.tsx` é o ponto central que conecta tudo.
