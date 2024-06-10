import { signal } from '@angular/core';

export const JpkFileState = {
  NoFile: 'no_file',
  Loading: 'loading',
  OK: 'ok',
  Error: 'error',
  Warning: 'warning',
} as const;
export type JpkFileState = (typeof JpkFileState)[keyof typeof JpkFileState];

export const JpkFileType = {
  PRN: 'prn',
  CSV: 'csv',
  XML: 'xml',
} as const;
export type JpkFileType = (typeof JpkFileType)[keyof typeof JpkFileType];

export class JpkFile {
  constructor(public readonly fileType: JpkFileType, public readonly fileDisplayName: string) {}

  readonly state = signal<JpkFileState>(JpkFileState.NoFile);

  readonly fileName = signal<string | null>(null);
  readonly fileSize = signal<number | null>(null);
  readonly fileContent = signal<string | null>(null);

  readonly validationData = signal<string | false | null>(null);
}
