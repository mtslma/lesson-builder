import type { ConversationBlock, ConversationHighlight, ConversationMessage } from '../types/index';
import { createEditorId } from './ids';

export const DEFAULT_HIGHLIGHT_COLOR = '#d9f99d';

export const createConversationHighlight = (): ConversationHighlight => ({
  id: createEditorId(),
  text: '',
  color: DEFAULT_HIGHLIGHT_COLOR
});

export const createConversationMessage = (
  overrides?: Partial<ConversationMessage>
): ConversationMessage => ({
  id: createEditorId(),
  speaker: '',
  text: '',
  highlights: [],
  ...overrides
});

export const normalizeConversationMessageInput = (value: unknown) => {
  if (!value || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const legacyHighlight =
    record.highlighted === true && typeof record.text === 'string' && record.text.trim().length > 0
      ? [
          {
            id:
              typeof record.id === 'string' && record.id.trim().length > 0
                ? `${record.id}-highlight`
                : createEditorId(),
            text: record.text,
            color:
              typeof record.highlightColor === 'string'
                ? record.highlightColor
                : DEFAULT_HIGHLIGHT_COLOR
          }
        ]
      : [];

  return {
    ...record,
    highlights: Array.isArray(record.highlights) ? record.highlights : legacyHighlight
  };
};

export const normalizeConversationHighlights = (message: unknown): ConversationHighlight[] => {
  const normalized = normalizeConversationMessageInput(message);

  if (!normalized || typeof normalized !== 'object') {
    return [];
  }

  const record = normalized as Record<string, unknown>;

  if (!Array.isArray(record.highlights)) {
    return [];
  }

  return record.highlights
    .filter((highlight): highlight is Record<string, unknown> => Boolean(highlight && typeof highlight === 'object'))
    .map((highlight) => ({
      id: typeof highlight.id === 'string' ? highlight.id : createEditorId(),
      text: typeof highlight.text === 'string' ? highlight.text : '',
      color: typeof highlight.color === 'string' ? highlight.color : DEFAULT_HIGHLIGHT_COLOR
    }));
};

export interface HighlightMatch {
  start: number;
  end: number;
  color: string;
  id: string;
}

export const getConversationHighlightMatches = (message: ConversationMessage): HighlightMatch[] => {
  const validHighlights = message.highlights.filter(
    (highlight) => highlight.text.trim().length > 0 && message.text.includes(highlight.text)
  );

  const matches = validHighlights
    .flatMap((highlight) => {
      const occurrences: HighlightMatch[] = [];
      let searchStart = 0;

      while (searchStart < message.text.length) {
        const start = message.text.indexOf(highlight.text, searchStart);

        if (start === -1) {
          break;
        }

        occurrences.push({
          start,
          end: start + highlight.text.length,
          color: highlight.color,
          id: `${highlight.id}-${start}`
        });

        searchStart = start + highlight.text.length;
      }

      return occurrences;
    })
    .sort((first, second) => {
      if (first.start !== second.start) {
        return first.start - second.start;
      }

      return second.end - first.end;
    });

  return matches.filter((match, index, allMatches) => {
    return !allMatches.some(
      (otherMatch, otherIndex) => otherIndex < index && match.start < otherMatch.end
    );
  });
};

export const createConversationBlockDefaults = (): Pick<
  ConversationBlock,
  'messages' | 'substitutionBox' | 'imageFit' | 'imagePositionX' | 'imagePositionY' | 'imageZoom'
> => ({
  imageFit: 'cover',
  imagePositionX: 50,
  imagePositionY: 50,
  imageZoom: 100,
  messages: [
    createConversationMessage({
      speaker: 'Speaker A',
      text: 'Hello. Welcome to the activity.'
    }),
    createConversationMessage({
      speaker: 'Speaker B',
      text: '[Thanks]. I am ready to begin.',
      highlights: [
        {
          id: createEditorId(),
          text: '[Thanks]',
          color: DEFAULT_HIGHLIGHT_COLOR
        }
      ]
    })
  ],
  substitutionBox: [{ original: 'I am ready to begin.', alternatives: ['Let us start.'] }]
});
