import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PolymerscanMatch } from './polymerscan.types';
import { Subscription, catchError, finalize, retry, tap } from 'rxjs';

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

    private sub?: Subscription;
    callApi(): void {
        const file = this._fileStorage.file();
        if (!file) return;
        const formData = new FormData();
        formData.append('files', file);

        this._isPending.set(true);
        this.sub = this.http
            .post('/api/polymerscan', formData, {
                reportProgress: true,
                observe: 'events',
            })
            .pipe(
                catchError((err, caught) => {
                    console.error('Polymerscan API error: ', err);
                    this.sub?.unsubscribe();
                    this._resetSignals();
                    return caught;
                })
            )
            .subscribe(event => {
                if (event.type == HttpEventType.UploadProgress) {
                    const progress = 100 * (event.loaded / event.total!);
                    this._progress.set(progress);
                }
                if (event.type == HttpEventType.Response) {
                    this._resetSignals();
                    console.log(event.body);
                }
            });
    }

    private _resetSignals() {
        this._isPending.set(false);
        this._progress.set(0);
    }

    onEnd() {
        console.log('end');
    }
}
