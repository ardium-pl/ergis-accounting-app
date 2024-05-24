import { Routes } from '@angular/router';
import { MainPage, FaktoringPage } from '@pages';
import { PolymerscanPage } from './pages/polymerscan/polymerscan.page';
import { JpkPage } from './pages/jpk/jpk.page';

export const routes: Routes = [
    { path: '', component: MainPage },
    { path: 'faktoring', component: FaktoringPage },
    { path: 'polymerscan', component: PolymerscanPage },
    { path: 'jpk', component: JpkPage },
    { path: '**', redirectTo: '' },
];
