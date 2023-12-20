import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GptService {

    response = signal<any>(null);

    constructor(private http: HttpClient) { }

    fetchGptData(rawData: string): void {
        const url = process.env['GPT_URL'];
        if (!url) {
            throw new Error("Cannot find the GPT url in .env");
        }
        this.http.post(
            url,
            rawData
        ).subscribe({
            next: v => {
                this.response.set(v);
            },
            error: err => {
                alert('Wystąpił błąd w czasie próby skontaktowania się z serwerem AI.');
                console.error(err);
            },
        });
    }
}
