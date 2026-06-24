# English Platform Editor

Editor de lições em blocos para criação, validação, revisão e exportação de conteúdo em JSON.

## Visão Geral

O projeto foi estruturado para permitir a produção de aulas reais dentro do editor, sem depender de edição manual de JSON como fluxo principal.

Cada lição é composta por blocos independentes, com:

- schema de validação;
- formulário de edição;
- preview no editor;
- regras de exportação.

O objetivo é manter um fluxo de autoria estável, simples de operar e sustentável para expansão do acervo.

## Stack

- React
- TypeScript
- Vite
- Zod
- Tailwind CSS

## Instalação

```bash
npm install
```

## Execução

Ambiente de desenvolvimento:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build de produção:

```bash
npm run build
```

Preview local da build:

```bash
npm run preview
```

## Estrutura do Projeto

### `src/features/editor/blocks`

Implementação individual de cada bloco.

Cada bloco deve concentrar sua própria lógica de edição e preview, evitando comportamento espalhado pelo restante do projeto.

### `src/features/editor/config/blockRegistry.tsx`

Registro central dos blocos disponíveis no editor.

É o ponto de ligação entre:

- tipo do bloco;
- metadados do catálogo;
- criação padrão;
- formulário;
- preview;
- normalização de dados importados.

### `src/features/editor/config/blockFactory.ts`

Responsável pela criação e transformação de lições e blocos.

Concentra operações como:

- criação de lição vazia;
- criação de bloco novo;
- duplicação segura;
- normalização de JSON importado;
- sincronização de page breaks;
- geração do JSON público.

### `src/features/editor/config/lessonSchema.ts`

Define os schemas Zod que validam o formato da lição.

Toda alteração estrutural em blocos deve ser refletida aqui.

### `src/features/editor/types/index.ts`

Centraliza os tipos principais do editor:

- `Lesson`
- `LessonBlock`
- tipos específicos de cada bloco
- props genéricas de formulário e preview

### `src/features/editor/hooks/useLessonEditor.ts`

Responsável pelo estado principal do editor e pelas operações de autoria, como histórico, importação, exportação e proteção contra perda de alterações.

### `src/features/editor/components`

Componentes estruturais do editor, como wrappers, renderização do preview e organização visual da tela.

### `src/features/editor/modules`

Camada de reexportação e compatibilidade, útil para manter a estrutura mais previsível conforme o projeto cresce.

### `json/l1.json`

Exemplo real de lição utilizado como referência de estrutura e validação.

## Fluxo de Uso

### 1. Criar uma nova lição

1. Abra o editor.
2. Inicie uma nova lição.
3. Adicione os blocos necessários.
4. Edite o conteúdo no painel lateral.
5. Revise o resultado no preview.

### 2. Importar uma lição existente

1. Cole ou carregue o JSON da lição.
2. Execute a importação.
3. Se houver erro, revise o caminho informado pela validação.

### 3. Exportar a lição

O editor trabalha com dois formatos:

- `Authoring`: mantém respostas, notas internas e demais dados de autoria;
- `Public`: remove conteúdo que não deve ser entregue ao aluno.

## Fluxo de Manutenção

### Alterar um bloco existente

1. Ajuste o arquivo do bloco em `src/features/editor/blocks`.
2. Atualize os tipos em `src/features/editor/types/index.ts`, se necessário.
3. Atualize o schema correspondente em `src/features/editor/config/lessonSchema.ts`.
4. Ajuste o registro do bloco em `src/features/editor/config/blockRegistry.tsx` se houver impacto em criação, catálogo ou compatibilidade.
5. Execute `npm run lint` e `npm run build`.

### Criar um novo bloco

1. Crie o arquivo do bloco em `src/features/editor/blocks`.
2. Implemente edição e preview.
3. Adicione o tipo do bloco em `src/features/editor/types/index.ts`.
4. Adicione o schema no `lessonSchema.ts`.
5. Registre o bloco no `blockRegistry.tsx`.
6. Valide a criação, edição, preview e exportação.
7. Execute `npm run lint` e `npm run build`.

### Manter compatibilidade com JSON antigo

Quando a estrutura de um bloco mudar, a compatibilidade com formatos anteriores deve ser tratada na etapa de normalização do `blockRegistry.tsx`.

## Regras de Manutenção

- Cada bloco deve permanecer isolado em seu próprio arquivo.
- O `blockRegistry.tsx` deve continuar sendo o ponto central de integração entre blocos e editor.
- Mudanças estruturais devem atualizar tipos e schemas em conjunto.
- O JSON público não deve incluir respostas corretas, critérios internos ou conteúdo exclusivo do professor.
- Alterações estruturais devem sempre ser finalizadas com `npm run lint` e `npm run build`.

## Observações Operacionais

- O editor mantém a lição atual no `localStorage` durante o desenvolvimento.
- Há proteção contra fechamento acidental da aba quando existem alterações não salvas.
- O preview do editor é uma visualização de autoria, não o player final da plataforma.

## Comandos Úteis

Buscar referências de um bloco:

```bash
rg "conversation" src
```

Buscar campos estruturais:

```bash
rg "correctOptionIds|acceptedAnswers|audience" src
```

## Resumo

O projeto segue uma organização objetiva:

- cada bloco possui responsabilidade própria;
- o registry conecta o sistema;
- os schemas garantem consistência;
- o editor sustenta um fluxo de autoria escalável.
