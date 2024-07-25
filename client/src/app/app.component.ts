import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { RouterOutlet } from '@angular/router';
import { FaktoringPage, MainPage } from '@pages';
import { PolymerscanPage } from './pages/polymerscan/polymerscan.page';
import { FaktoringService } from './services/faktoring/faktoring.service';
import { PolymerscanService } from './services/polymerscan/polymerscan.service';
import { WeirdPrnReaderService } from './services/weird-prn-reader/weird-prn-reader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    //pages
    MainPage,
    FaktoringPage,
    PolymerscanPage,
  ],
  providers: [
    PolymerscanService,
    FaktoringService,
    WeirdPrnReaderService,
    { provide: LOCALE_ID, useValue: 'pl-PL' },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { showDelay: 600 } },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
