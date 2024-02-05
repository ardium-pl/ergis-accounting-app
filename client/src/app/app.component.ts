import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaktoringPage, MainPage } from '@pages';
import { PolymerscanService } from './services/polymerscan/polymerscan.service';
import { FaktoringService } from './services/faktoring/faktoring.service';
import { JsonDataService } from './services/json-data/json-data.service';
import { PolymerscanPage } from './pages/polymerscan/polymerscan.page';

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
    providers: [PolymerscanService, FaktoringService, JsonDataService, { provide: LOCALE_ID, useValue: 'pl-PL' }],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
