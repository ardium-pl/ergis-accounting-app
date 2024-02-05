import { computed, signal } from "@angular/core";


export class JsonDataStore<T extends Record<string, any>> {

    constructor(public transformerFn?: (v: Record<string, any>) => T) {}

    private readonly _rawData = signal<string>('');
    private readonly _jsonData = computed<T[]>(() => {
        try {
            const json = JSON.parse(this._rawData()) as T[];
            const transformed = this.transformerFn ? json.map(this.transformerFn) : json;
            return transformed;
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