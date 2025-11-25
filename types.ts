export interface InvisibleEntity {
  title: string;
  description: string;
  visualStyle: string;
  meaning: string;
  estimatedAge: string;
  rarity: 'Común' | 'Raro' | 'Legendario' | 'Artefacto';
}

export type AppMode = 'intro' | 'scanner' | 'gallery';

export interface ScanResult {
  image: string; // Original Camera Snapshot
  entity: InvisibleEntity | null;
  generatedVisualizations?: string[]; // Array of AI Generated Images (x4)
  timestamp: number;
}