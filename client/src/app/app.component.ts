import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './pages/main/main.page';
import { GptService } from './services/gpt/gpt.service';
import { MergerService } from './services/merger/merger.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HttpClientModule,
        //pages
        MainPage,
    ],
    providers: [
        GptService,
        MergerService,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    
}
