import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PolymerscanMatch } from './polymerscan.types';
import { catchError, finalize, retry, tap } from 'rxjs';

type _ResponseType = Record<string, unknown>;

@Injectable({
    providedIn: 'root',
})
export class PolymerscanService {
    constructor(private _fileStorage: FileStorageService, private http: HttpClient) {
        effect(() => {
            console.log('isPending', this.isPending(), this.progress());
        });
    }

    private readonly _isPending = signal<boolean>(false);
    public readonly isPending = computed(() => this._isPending());

    private readonly _progress = signal<number>(0);
    public readonly progress = computed(() => this._progress());

    private readonly _response = signal<string | null>(null);
    public readonly response = computed(() => this._response());
    public readonly jsonResponse = computed(() => {
        const rsp = this._response();
        if (!rsp) return null;
        try {
            const json = JSON.parse(rsp) as _ResponseType;
            console.log(json);
            return json;
        } catch (err) {
            alert('Wystąpił błąd w czasie próby odczytania danych pozyskanych od AI. Zgłoś ten błąd administratorom!');
            console.error('PS002: Cannot parse polymerscan API output', err);
            return null;
        }
    });

    callApi(): void {
        const file = this._fileStorage.file();
        if (!file) return;
        const formData = new FormData();
        formData.append('files', file);

        this._isPending.set(true);
        this.http
            .post('/api/polymerscan', formData, {
                reportProgress: true,
                observe: 'events',
                headers: {
                    // 'Content-Type': 'multipart/form-data',
                },
            })
            .subscribe(event => {
                if (event.type == HttpEventType.UploadProgress) {
                    const progress = 100 * (event.loaded / event.total!);
                    this._progress.set(progress);
                }
                if (event.type == HttpEventType.Response) {
                    console.log(event.body);
                }
            });
    }

    onEnd() {
        console.log('end');
    }
}
