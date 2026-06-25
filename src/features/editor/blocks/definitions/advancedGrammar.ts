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
    structureTitle: 'Structure table',
    structureTableHeaders: ['Form', 'Structure', 'Example'],
    structureTableRows: [
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
    ],
    examples: ['She studies English every day.'],
    commonMistakes: ['Do not forget the auxiliary verb.'],
    comparisons: [{ id: createEditorId(), label: 'Compare', detail: 'Use this form, not that form.' }],
    miniPractice: ['Write one sentence using the target structure.'],
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
    structureTitle: typeof block.structureTitle === 'string' ? block.structureTitle : 'Structure table',
    structureTableHeaders: Array.isArray(block.structureTableHeaders)
      ? block.structureTableHeaders.filter((header): header is string => typeof header === 'string')
      : Array.isArray(block.tableHeaders)
        ? block.tableHeaders.filter((header): header is string => typeof header === 'string')
        : [],
    structureTableRows: Array.isArray(block.structureTableRows)
      ? block.structureTableRows
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
              : []
          }))
      : [],
    examples: Array.isArray(block.examples)
      ? block.examples.filter((item): item is string => typeof item === 'string')
      : [],
    commonMistakes: Array.isArray(block.commonMistakes)
      ? block.commonMistakes.filter((item): item is string => typeof item === 'string')
      : [],
    comparisons: Array.isArray(block.comparisons)
      ? block.comparisons
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
          .map((item) => ({
            id: typeof item.id === 'string' ? item.id : createEditorId(),
            label: typeof item.label === 'string' ? item.label : '',
            detail: typeof item.detail === 'string' ? item.detail : ''
          }))
      : [],
    miniPractice: Array.isArray(block.miniPractice)
      ? block.miniPractice.filter((item): item is string => typeof item === 'string')
      : [],
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
