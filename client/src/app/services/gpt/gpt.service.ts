import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { GptResponse } from './gpt.types';
import { MergerObject } from '../merger/merger.types';

@Injectable({
    providedIn: 'root',
})
export class GptService {

    private readonly _response = signal<string | null>(null);
    public readonly response = computed(() => this._response());
    public readonly jsonResponse = computed(() => {
        const rsp = this._response();
        if (!rsp) return null;
        try {
            const json = JSON.parse(rsp) as MergerObject[];
            return json;
        } catch (err) {
            alert('Wystąpił błąd w czasie próby odczytania danych pozyskanych od AI. Zgłoś ten błąd administratorom!');
            console.error(err);
            return null;
        }
    })

    // constructor(private http: HttpClient) { }

    fetchGptData(rawData: string): void {
        console.log('%cfetching gpt data', "color:lime");
        // this.http.post<GptResponse>(
        //     "/send-mfg-data-for-faktoring",
        //     rawData
        // ).subscribe({
        //     next: v => {
        //         this._response.set(v.data);
        //     },
        //     error: err => {
        //         alert('Wystąpił błąd w czasie próby skontaktowania się z serwerem AI. Zgłoś ten błąd administratorom!');
        //         console.error(err);
        //     },
        // });
    }
}
