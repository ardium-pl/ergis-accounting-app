import { Routes } from '@angular/router';
import { MainPage, FaktoringPage } from '@pages';

export const routes: Routes = [
    { path: "", component: MainPage },
    { path: "faktoring", component: FaktoringPage },
    { path: "polymerscan", component: FaktoringPage },
    { path: "**", redirectTo: "" }
];
