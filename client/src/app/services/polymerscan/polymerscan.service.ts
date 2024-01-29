import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable, computed, effect, signal } from '@angular/core';
import { Subscription, catchError } from 'rxjs';
import { FileStorageService } from '../file-storage/file-storage.service';

type _ResponseType = { success: false, error: string; } | { success: true, response: string; };

@Injectable({
    providedIn: 'root',
})
export class PolymerscanService {
    constructor(private _fileStorage: FileStorageService, private http: HttpClient) {}

    private readonly _isPending = signal<boolean>(false);
    public readonly isPending = computed(() => this._isPending());

    private readonly _progress = signal<number>(0);
    public readonly progress = computed(() => this._progress());

    private readonly _response = signal<_ResponseType | null>(null);
    public readonly response = computed(() => this._response());

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
                    this._response.set(event.body as _ResponseType);
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
