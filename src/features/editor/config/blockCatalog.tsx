import type { LucideIcon } from 'lucide-react';
import type { BlockType } from '../types/index';
import { BLOCK_DEFINITIONS } from './blockRegistry';

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

export const BLOCK_CATEGORIES: BlockCatalogCategory[] = Object.values(
  BLOCK_DEFINITIONS.reduce<Record<string, BlockCatalogCategory>>((acc, definition) => {
    if (!acc[definition.category]) {
      acc[definition.category] = {
        title: definition.category,
        blocks: []
      };
    }

    acc[definition.category].blocks.push({
      t: definition.type,
      i: definition.icon,
      l: definition.label,
      accent: definition.accent,
      surface: definition.surface
    });

    return acc;
  }, {})
);
