import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  CheckCheck,
  ClipboardList,
  Headphones,
  Image as ImageIcon,
  Languages,
  MessageCircleMore,
  MicVocal,
  NotepadText,
  PenLine,
  ScanText,
  ScissorsLineDashed,
  Sparkles,
  SquarePen,
  Table2
} from 'lucide-react';
import type { BlockType } from '../types/index';

export interface BlockCatalogItem {
  t: BlockType;
  i: LucideIcon;
  l: string;
  accent: string;
  surface: string;
}

export interface BlockCatalogCategory {
  title: string;
  blocks: BlockCatalogItem[];
}

export const BLOCK_CATEGORIES: BlockCatalogCategory[] = [
  {
    title: 'Layout & Theory',
    blocks: [
      {
        t: 'page-break',
        i: ScissorsLineDashed,
        l: 'Page Break',
        accent: 'text-slate-700',
        surface: 'from-slate-100 to-slate-50'
      },
      {
        t: 'heading',
        i: NotepadText,
        l: 'Heading',
        accent: 'text-sky-700',
        surface: 'from-sky-100 to-white'
      },
      {
        t: 'paragraph',
        i: PenLine,
        l: 'Paragraph',
        accent: 'text-cyan-700',
        surface: 'from-cyan-100 to-white'
      },
      {
        t: 'teacher-note',
        i: NotepadText,
        l: 'Teacher Note',
        accent: 'text-amber-700',
        surface: 'from-amber-100 to-white'
      },
      {
        t: 'grammar-note',
        i: Sparkles,
        l: 'Simple Grammar',
        accent: 'text-blue-700',
        surface: 'from-blue-100 to-white'
      },
      {
        t: 'advanced-grammar',
        i: Table2,
        l: 'Grammar Table',
        accent: 'text-indigo-700',
        surface: 'from-indigo-100 to-white'
      }
    ]
  },
  {
    title: 'Reading & Media',
    blocks: [
      {
        t: 'media-block',
        i: ImageIcon,
        l: 'Image/Media',
        accent: 'text-amber-700',
        surface: 'from-amber-100 to-white'
      },
      {
        t: 'listening',
        i: Headphones,
        l: 'Listen & Answer',
        accent: 'text-rose-700',
        surface: 'from-rose-100 to-white'
      },
      {
        t: 'reading-comprehension',
        i: BookOpen,
        l: 'Read & Answer',
        accent: 'text-emerald-700',
        surface: 'from-emerald-100 to-white'
      }
    ]
  },
  {
    title: 'Interactive & Vocab',
    blocks: [
      {
        t: 'vocabulary-match',
        i: Languages,
        l: 'Match Pairs',
        accent: 'text-fuchsia-700',
        surface: 'from-fuchsia-100 to-white'
      },
      {
        t: 'selection-grid',
        i: CheckCheck,
        l: 'Click & Check',
        accent: 'text-lime-700',
        surface: 'from-lime-100 to-white'
      },
      {
        t: 'phrasal-verb-focus',
        i: Sparkles,
        l: 'Phrasal Verbs',
        accent: 'text-violet-700',
        surface: 'from-violet-100 to-white'
      },
      {
        t: 'repetition-drill',
        i: MicVocal,
        l: 'Pronunciation',
        accent: 'text-orange-700',
        surface: 'from-orange-100 to-white'
      }
    ]
  },
  {
    title: 'Practice & Quizzes',
    blocks: [
      {
        t: 'fill-blank',
        i: SquarePen,
        l: 'Inline Gaps',
        accent: 'text-teal-700',
        surface: 'from-teal-100 to-white'
      },
      {
        t: 'multiple-choice',
        i: CheckCheck,
        l: 'Multiple Choice',
        accent: 'text-green-700',
        surface: 'from-green-100 to-white'
      },
      {
        t: 'rewrite-question',
        i: ScanText,
        l: 'Transform Text',
        accent: 'text-slate-700',
        surface: 'from-slate-100 to-white'
      },
      {
        t: 'image-choice',
        i: ImageIcon,
        l: 'Image Choice',
        accent: 'text-yellow-700',
        surface: 'from-yellow-100 to-white'
      }
    ]
  },
  {
    title: 'Production & Speaking',
    blocks: [
      {
        t: 'conversation',
        i: MessageCircleMore,
        l: 'Dialogue',
        accent: 'text-cyan-700',
        surface: 'from-cyan-100 to-white'
      },
      {
        t: 'conversation-prompts',
        i: MessageCircleMore,
        l: 'Discussion Prompts',
        accent: 'text-sky-700',
        surface: 'from-sky-100 to-white'
      },
      {
        t: 'roleplay',
        i: ClipboardList,
        l: 'Roleplay Cards',
        accent: 'text-red-700',
        surface: 'from-red-100 to-white'
      },
      {
        t: 'writing-task',
        i: PenLine,
        l: 'Writing Task',
        accent: 'text-stone-700',
        surface: 'from-stone-100 to-white'
      },
      {
        t: 'final-task',
        i: ClipboardList,
        l: 'Final Profile Task',
        accent: 'text-neutral-700',
        surface: 'from-neutral-100 to-white'
      }
    ]
  }
];
