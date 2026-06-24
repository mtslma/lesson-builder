import { ScissorsLineDashed } from 'lucide-react';
import type { BlockDefinition } from '../../config/blockDefinition';
import { createEditorId } from '../../domain/ids';

export const pageBreakBlockDefinition: BlockDefinition = {
  type: 'page-break',
  label: 'Page Break',
  category: 'Layout & Theory',
  icon: ScissorsLineDashed,
  accent: 'text-slate-700',
  surface: 'from-slate-100 to-slate-50',
  create: (pageNumber) => ({
    id: createEditorId(),
    type: 'page-break',
    pageNumber,
    estimatedTime: '45 min'
  })
};
