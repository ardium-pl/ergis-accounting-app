type _FileSaverOptionsBase = {
    fileName?: string;
};

export const FileSaverSaveMethod = {
    PreferFileSystem: 'preferFileSystem',
    CrossBrowser: 'crossBrowser',
} as const;
export type FileSaverSaveMethod =
    (typeof FileSaverSaveMethod)[keyof typeof FileSaverSaveMethod];

export const FileSaverStartDirectory = {
    Desktop: 'desktop',
    Documents: 'documents',
    Downloads: 'downloads',
    Music: 'music',
    Pictures: 'pictures',
    Videos: 'videos',
} as const;
export type FileSaverStartDirectory =
    (typeof FileSaverStartDirectory)[keyof typeof FileSaverStartDirectory];

export type FileSaverOptions = _FileSaverOptionsBase &
    (
        | {
              method: 'preferFileSystem';
              directoryId?: string;
              startDirectory?: FileSaverStartDirectory;
              types?: {
                  description?: string;
                  accept: Record<string, string[]>;
              }[];
              accept?: string | string[];
          }
        | {
              method?: 'crossBrowser';
          }
    );

const test: FileSaverOptions = {
    fileName: 'snfsld',
    method: 'preferFileSystem',
    directoryId: 'bvsv',
    startDirectory: 'desktop',
    types: [
        {
            description: 'dndsf',
            accept: { 'text/plain': ['.txt'] },
        },
    ],
    accept: '.pdf',
};
