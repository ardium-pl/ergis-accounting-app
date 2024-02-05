import { Routes } from '@angular/router';
import { MainPage, FaktoringPage } from '@pages';
import { PolymerscanPage } from './pages/polymerscan/polymerscan.page';

export const routes: Routes = [
    { path: "", component: MainPage },
    { path: "faktoring", component: FaktoringPage },
    { path: "polymerscan", component: PolymerscanPage },
    { path: "**", redirectTo: "" }
];
