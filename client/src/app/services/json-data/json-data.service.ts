import { Injectable, computed, signal } from "@angular/core";


@Injectable({
    providedIn: 'root',
})
export class JsonDataService<T extends Record<string, any>> {
    private readonly _rawData = signal<string>('');
    private readonly _jsonData = computed<T[]>(() => {
        try {
            const json = JSON.parse(this._rawData());
            return json;
        } catch (err) {
            return [];
        }
    });

    readonly data = computed(() => this._jsonData());
    readonly isDataValid = computed(() => this._jsonData()?.length > 0);

    setFromString(data: string): void {
        this._rawData.set(data);
    }
}