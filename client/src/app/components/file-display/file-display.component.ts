import { Component, input } from '@angular/core';
import { ArdiumFilesizePipeModule } from '@ardium-ui/devkit';

@Component({
    selector: 'app-file-display',
    standalone: true,
    imports: [ArdiumFilesizePipeModule],
    templateUrl: './file-display.component.html',
    styleUrl: './file-display.component.scss',
})
export class FileDisplayComponent {
    readonly file = input<File | undefined>();
}
