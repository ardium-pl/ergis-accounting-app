import { LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaktoringPage, MainPage } from '@pages';
import { MergerService } from './services/merger/merger.service';
import { PolymerscanService } from './services/polymerscan/polymerscan.service';
import {FaktoringService} from './services/faktoring/faktoring.service';

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
    ],
    providers: [MergerService, PolymerscanService, FaktoringService,{ provide: LOCALE_ID, useValue: 'pl-PL' }],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {}
