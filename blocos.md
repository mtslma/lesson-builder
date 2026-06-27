# Blocos no editor

## Alterar o comportamento de um bloco existente

1. Edite o componente do bloco em `src/features/editor/blocks/`.
   Exemplo: `HeadingBlock.tsx` controla o formulário (`HeadingForm`) e a prévia (`HeadingPreview`).
2. Se mudar estrutura/dados padrão, ajuste também a definição em `src/features/editor/blocks/definitions/`.
   Exemplo: `heading.ts` define `create`, `normalize`, label, ícone e metadados do bloco.
3. Se o bloco exportado para o aluno precisar tratamento especial, revise `src/features/editor/config/blockFactory.ts`.

## Criar um novo bloco

1. Adicione o tipo no union `BlockType` e a interface do bloco em `src/features/editor/types/index.ts`.
2. Crie o componente em `src/features/editor/blocks/`.
   Sugestão: exporte `NomeDoBlocoForm` e `NomeDoBlocoPreview`.
3. Crie a definição em `src/features/editor/blocks/definitions/novoBloco.ts` com:
   - `type`
   - `label`
   - `category`
   - `icon`
   - `create`
   - `form`
   - `preview`
   - `normalize`
4. Registre a definição em `src/features/editor/blocks/definitions/index.ts`.

## Como ele entra no sistema

- `definitions/index.ts` alimenta o `BLOCK_DEFINITIONS`
- `config/blockRegistry.tsx` monta o mapa por `type`
- `config/blockCatalog.tsx` faz o bloco aparecer no catálogo do editor
- `config/blockFactory.ts` cria, normaliza, duplica e exporta o bloco
- Os JSONs da lição usam o `type` do bloco em `blocks[]`

Se quiser, depois eu também posso transformar isso em uma seção curta dentro do `README.md`.
