import { Table2 } from 'lucide-react';
import { AdvancedGrammarForm, AdvancedGrammarPreview } from '../AdvancedGrammarBlock';
import type {
  BlockDefinition,
  BlockFormComponent,
  BlockPreviewComponent
} from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const advancedGrammarBlockDefinition: BlockDefinition = {
  type: 'advanced-grammar',
  label: 'Grammar Table',
  category: 'Layout & Theory',
  icon: Table2,
  accent: 'text-indigo-700',
  surface: 'from-indigo-100 to-white',
  create: () => ({
    id: createEditorId(),
    type: 'advanced-grammar',
    title: 'Grammar Reference',
    explanation: 'Summarize the structure or contrast in a concise way.',
    details: '',
    tableHeaders: ['Form', 'Structure', 'Example'],
    tableRows: [
      {
        cells: [
          { text: 'Affirmative', highlights: [] },
          { text: 'Subject + verb', highlights: [] },
          { text: 'Example sentence', highlights: [] }
        ]
      },
      {
        cells: [
          { text: 'Negative', highlights: [] },
          { text: 'Subject + do not + verb', highlights: [] },
          { text: 'Example sentence', highlights: [] }
        ]
      }
    ]
  }),
  form: AdvancedGrammarForm as BlockFormComponent,
  preview: AdvancedGrammarPreview as BlockPreviewComponent,
  normalize: (block) => ({
    id: typeof block.id === 'string' ? block.id : createEditorId(),
    type: 'advanced-grammar',
    title: typeof block.title === 'string' ? block.title : 'Grammar Reference',
    explanation: typeof block.explanation === 'string' ? block.explanation : '',
    details: typeof block.details === 'string' ? block.details : '',
    tableHeaders: Array.isArray(block.tableHeaders)
      ? block.tableHeaders.filter((header): header is string => typeof header === 'string')
      : [],
    tableRows: Array.isArray(block.tableRows)
      ? block.tableRows
          .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === 'object'))
          .map((row) => ({
            cells: Array.isArray(row.cells)
              ? row.cells
                  .filter((cell): cell is Record<string, unknown> => Boolean(cell && typeof cell === 'object'))
                  .map((cell) => ({
                    text: typeof cell.text === 'string' ? cell.text : '',
                    highlights: Array.isArray(cell.highlights)
                      ? cell.highlights
                          .filter((highlight): highlight is Record<string, unknown> => Boolean(highlight && typeof highlight === 'object'))
                          .map((highlight) => ({
                            id: typeof highlight.id === 'string' ? highlight.id : createEditorId(),
                            text: typeof highlight.text === 'string' ? highlight.text : '',
                            color: typeof highlight.color === 'string' ? highlight.color : '#d9f99d'
                          }))
                      : []
                  }))
              : Array.isArray(row.elements)
                ? row.elements
                    .filter((cell): cell is string => typeof cell === 'string')
                    .map((cell) => ({ text: cell, highlights: [] }))
                : []
          }))
      : []
  })
};
