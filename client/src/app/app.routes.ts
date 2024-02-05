import { Routes } from '@angular/router';
import { MainPage } from './pages/main/main.page';

export const routes: Routes = [
    { path: "", component: MainPage },
    { path: "faktoring", component: MainPage },
    { path: "**", redirectTo: "" }
];
