import { Component, signal } from '@angular/core';
import { FileDisplayComponent, FileDropZoneComponent, SectionComponent } from '@components';

@Component({
    selector: 'app-main',
    standalone: true,
    imports: [
        SectionComponent,
        FileDropZoneComponent,
        FileDisplayComponent,
    ],
    templateUrl: './main.page.html',
    styleUrl: './main.page.scss'
})
export class MainPage {

}
