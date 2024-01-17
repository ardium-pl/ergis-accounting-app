import { Injectable, Renderer2 } from '@angular/core';
import { FileSaverOptions, FileSaverSaveMethod } from './file-saver.types';

const DEFAULT_OPTIONS = {
    fileName: 'download',
    method: FileSaverSaveMethod.PreferFileSystem,
};

@Injectable({
    providedIn: 'root',
})
export class FileSaverService {
    constructor(private renderer2: Renderer2) {
        try {
            this.isFileSystemAPISupported = 'showSaveFilePicker' in window;
        } catch (err) {}
    }

    readonly isFileSystemAPISupported!: boolean;

    async saveAs(
        data: string | Blob,
        options: FileSaverOptions = DEFAULT_OPTIONS
    ) {
        // coerce string to blob if needed
        if (typeof data == 'string') {
            data = new Blob([data], {
                type: 'text/plain',
            });
        }
        // use the File System Access API if supported & preferred
        if (
            this.isFileSystemAPISupported &&
            isNotIFrame() &&
            options.method == FileSaverSaveMethod.PreferFileSystem
        ) {
            // coerce the options.accept into a valid options.types object
            if (options.accept) {
                if (typeof options.accept == 'string') {
                    options.accept = options.accept.split(',');
                }
                if (!options.types) options.types = [];

                const accept = { 'application/octet-stream': options.accept };
                options.types.push({ accept: accept });
            }

            // use the File System Access API
            try {
                const handle = await (window as any).showSaveFilePicker({
                    id: options.directoryId,
                    startIn: options.startDirectory,
                    suggestedName: options.fileName,
                    types: options.types,
                });

                const writable = await handle.createWritable();
                await writable.write(data);
                await writable.close();
                return;
            } catch (err) {
                // fail silently if the user has simply canceled the dialog.
                const error = err as any;
                if (error.name !== 'AbortError') {
                    console.error(error.name, error.message);
                    return;
                }
            }
            return;
        }
        // fallback if the File System Access API is not supported
        // or the user doesn't want it
        const blobURL = URL.createObjectURL(data);
        
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = options.fileName!;
        a.style.display = 'none';
        this.renderer2.appendChild(document.body, a);
        a.click();
        
        //remove the 
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
            this.renderer2.removeChild(document.body, a);
        }, 1000);
    }
}

function isNotIFrame() {
    return (() => {
        try {
            return window.self === window.top;
        } catch {
            return false;
        }
    })();
}
