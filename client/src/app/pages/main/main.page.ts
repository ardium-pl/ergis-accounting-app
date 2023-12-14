import { Component } from '@angular/core';
import { SectionModule } from '../../components';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        SectionModule
    ],
    templateUrl: './main.page.html',
    styleUrl: './main.page.scss'
})
export class MainPage {

}
