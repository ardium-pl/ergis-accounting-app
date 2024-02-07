import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaktoringPage, MainPage } from '@pages';
import { PolymerscanPage } from './pages/polymerscan/polymerscan.page';
import { FaktoringService } from './services/faktoring/faktoring.service';
import { PolymerscanService } from './services/polymerscan/polymerscan.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        HttpClientModule,
        //pages
        MainPage,
        FaktoringPage,
        PolymerscanPage,
    ],
    providers: [PolymerscanService, FaktoringService, { provide: LOCALE_ID, useValue: 'pl-PL' }],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
